import * as DataLoader from 'dataloader';
import * as _ from 'lodash';
import * as qs from 'qs';
import * as rp from 'request-promise';
import * as errors from 'request-promise/errors'; // tslint:disable-line no-submodule-imports
import * as url from 'url';
import { Artist, Track } from '../types';

const CLIENT_ID = 'f736b78a9d9e4acfa110711839cad337';
const CALLBACK_ROUTE = '#/login';
const SCOPES = ['user-library-read', 'user-modify-playback-state'];

interface IApiLoaders {
    artists: DataLoader<string, Artist>;
}

/* tslint:disable member-ordering */
export default class Api {
    public loaders: IApiLoaders;
    private accessToken: string;

    /**
     * Create a new Api object.
     * @param accessToken Valid Spotify access token.
     */
    constructor(accessToken?: string) {
        this.accessToken = accessToken;
        this.loaders = this.createLoaders(accessToken);
    }

    /** Create url for user to authenticate (implicit grant flow). */
    public static authorizeUrl(baseUrl: string): string {
        const queryString = qs.stringify({
            client_id: CLIENT_ID,
            response_type: 'token',
            redirect_uri: url.resolve(baseUrl, CALLBACK_ROUTE),
            scope: SCOPES.join(' '),
        });

        return `https://accounts.spotify.com/authorize?${queryString}`;
    }

    /**
     * Set access token.
     * @param accessToken Valid Spotify access token.
     */
    public setToken(accessToken: string): Api {
        this.accessToken = accessToken;
        this.loaders = this.createLoaders(accessToken);
        return this;
    }

    /** Load all tracks saved in user library. */
    public async getSavedTracks(): Promise<SpotifyApi.TrackObjectFull[]> {
        const limit = 50;
        const options = {
            uri: 'https://api.spotify.com/v1/me/tracks',
            headers: { Authorization: `Bearer ${this.accessToken}` },
            json: true,
            qs: { limit },
        };

        const items = await this.paginate<SpotifyApi.SavedTrackObject>(options);
        return items.map(i => i.track);
    }

    /**
     * Load artists for a list of ids.
     * @param ids List of artist ids.
     */
    public async getArtists(ids: string[]): Promise<Artist[]> {
        return this.loaders.artists.loadMany(ids);
    }

    /**
     * Load full artists for tracks.
     * @param tracks List of artist ids.
     */
    public async getArtistsFromTracks(
        tracks: Track[] | SpotifyApi.TrackObjectSimplified[],
    ): Promise<Artist[]> {
        const artistIds = _(tracks)
            .flatMap(t => _.map(t.artists, 'id'))
            .uniq()
            .value();
        return this.loaders.artists.loadMany(artistIds);
    }

    /**
     * Play a track.
     * @param trackUri Spotify uri of form 'spotify:track:abc123'
     */
    public async playTrack(trackUri: string): Promise<void> {
        const response = await rp.put({
            uri: 'https://api.spotify.com/v1/me/player/play',
            headers: { Authorization: `Bearer ${this.accessToken}` },
            json: true,
            body: { uris: [trackUri] },
            resolveWithFullResponse: true,
        });

        if (response.statusCode !== 204) throw new PlayError(response.statusCode);
    }

    /**
     * Pause playback.
     * @param trackUri Spotify uri of form 'spotify:track:abc123'
     */
    public async pause(): Promise<void> {
        const response = await rp.put({
            uri: 'https://api.spotify.com/v1/me/player/pause',
            headers: { Authorization: `Bearer ${this.accessToken}` },
            resolveWithFullResponse: true,
        });

        if (response.statusCode !== 204) throw new PlayError(response.statusCode);
    }

    /**
     * Get tracks of a playlist.
     * @param playlistId Id of user's playlist
     */
    public async getPlaylistTracks(playlistId: string): Promise<Track[]> {
        const limit = 100;
        const options = {
            uri: `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
            headers: { Authorization: `Bearer ${this.accessToken}` },
            json: true,
            qs: { limit },
        };

        const items = await this.paginate<SpotifyApi.PlaylistTrackObject>(options);
        return items.map(i => i.track);
    }

    /**
     * Offset-iterate paging objects returned by a base request.
     * @param options Options object passed to request-promise. qs.offfset is set inside to paginate.
     */
    public async paginate<T>(options: IPageableOptions): Promise<T[]> {
        const { limit } = options.qs;
        // Get first `limit` items
        const { total, items } = (await rp(options)) as SpotifyApi.PagingObject<T>;
        // Build offsets for remaining items
        const offsets = _.range(limit, total, limit);
        // Build requets from offsets
        const requests = offsets.map(offset => rp({ ...options, qs: { limit, offset } }));
        // Await requests
        const responses = (await Promise.all(requests)) as Array<SpotifyApi.PagingObject<T>>;
        // Merge first items with reponse items
        return [...items, ..._.flatMap(responses, r => r.items)];
    }

    /** Initiliaze data loaders. */
    protected createLoaders(accessToken: string): IApiLoaders {
        return {
            artists: new DataLoader((ids) => this.fetchArtists(accessToken, ids), { maxBatchSize: 50 }),
        };
    }

    /** Load artists for a list of ids. */
    protected async fetchArtists(accessToken: string, ids: string[]): Promise<Artist[]> {
        const options = {
            uri: 'https://api.spotify.com/v1/artists',
            headers: { Authorization: `Bearer ${accessToken}` },
            json: true,
            qs: { ids: ids.join(',') },
        };
        const response = await rp(options);
        return response.artists;
    }
}

/* tslint:disable max-classes-per-file */
class PlayError extends Error {
    public statusCode: number;
    constructor(statusCode: number) {
        const message = (statusCode === 202)
            ? 'No device available (202)'
            : `${statusCode}`;
        super(message);
        this.name = 'PlayError';
        this.statusCode = statusCode;
    }
}

type IPageableOptions = rp.Options & { qs: { limit: number, offset?: number } };
