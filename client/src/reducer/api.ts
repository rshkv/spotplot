import * as DataLoader from 'dataloader';
import * as _ from 'lodash';
import * as rp from 'request-promise';
import * as errors from 'request-promise/errors'; // tslint:disable-line no-submodule-imports
import { Artist, Track } from '../types';

interface ISpotifyApiLoaders {
    artists: DataLoader<string, Artist>;
}

export default class SpotifyApi {
    public loaders: ISpotifyApiLoaders;
    private accessToken: string;

    /**
     * Create a new Api object.
     * @param accessToken Valid Spotify access token.
     */
    constructor(accessToken?: string) {
        this.accessToken = accessToken;
        this.loaders = this.createLoaders(accessToken);
    }

    /**
     * Set access token.
     * @param accessToken Valid Spotify access token.
     */
    public setToken(accessToken: string): SpotifyApi {
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

        // Get first 50 items
        const { total, items } = await rp(options);
        // Build requests for remaining (total - 50) items
        const requests = _.range(limit, total, limit)
            .map(offset => rp({ ...options, qs: { limit, offset } }));
        // Await all requests and map to tracks
        const responses = (await Promise.all(requests)) as SpotifyApi.UsersSavedTracksResponse[];
        return [...items, ..._.flatMap(responses, 'items')]
            .map(i => i.track);
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
        return await this.loaders.artists.loadMany(artistIds);
    }

    /**
     * Play a track.
     * @param trackUri Spotify uri of form 'spotify:track:abc123'
     */
    public async playTrack(trackUri: string) {
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
    public async pause() {
        const response = await rp.put({
            uri: 'https://api.spotify.com/v1/me/player/pause',
            headers: { Authorization: `Bearer ${this.accessToken}` },
            resolveWithFullResponse: true,
        });

        if (response.statusCode !== 204) throw new PlayError(response.statusCode);
    }

    /** Initiliaze data loaders. */
    protected createLoaders(accessToken: string): ISpotifyApiLoaders {
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
