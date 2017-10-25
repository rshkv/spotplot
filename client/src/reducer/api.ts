import * as _ from 'lodash';
import * as rp from 'request-promise';
import * as errors from 'request-promise/errors'; // tslint:disable-line no-submodule-imports

/**
 * Load all tracks saved in user library.
 * @param accessToken Valid Spotify access token associated with user.
 */
export async function getSavedTracks(accessToken: string): Promise<SpotifyApi.TrackObjectFull[]> {
    const limit = 50;
    const options = {
        uri: 'https://api.spotify.com/v1/me/tracks',
        headers: { Authorization: `Bearer ${accessToken}` },
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
 * @param accessToken Valid Spotify access token.
 */
export async function getArtists(ids: string[], accessToken: string): Promise<SpotifyApi.ArtistObjectFull[]> {
    const limit = 50;
    const options = {
        uri: 'https://api.spotify.com/v1/artists',
        headers: { Authorization: `Bearer ${accessToken}` },
        json: true,
    };

    // Chunk ids to fit the limit and build request per chunk
    const requests = _(ids)
        .chunk(limit)
        .map(chunk => rp({ ...options, qs: { ids: chunk.join(',') } }))
        .value();

    const responses = (await Promise.all(requests)) as SpotifyApi.MultipleArtistsResponse[];
    return _.flatMap(responses, 'artists');
}

/**
 * Load full artists for tracks.
 * @param tracks List of artist ids.
 * @param accessToken Valid Spotify access token.
 */
export async function getArtistsFromTracks(
    tracks: SpotifyApi.TrackObjectFull[] | SpotifyApi.TrackObjectSimplified[],
    accessToken: string,
): Promise<SpotifyApi.ArtistObjectFull[]> {
    // Get a all unique artist ids
    const artistIds = _(tracks)
        .flatMap(t => _.map(t.artists, 'id'))
        .uniq()
        .value();

    return await getArtists(artistIds, accessToken);
}

/**
 * Play a track.
 * @param trackUri Spotify uri of form 'spotify:track:abc123'
 * @param accessToken Spotify token with premium and 'user-modify-playback-state' permissions.
 */
export async function playTrack(trackUri: string, accessToken: string) {
    const response = await rp.put({
        uri: 'https://api.spotify.com/v1/me/player/play',
        headers: { Authorization: `Bearer ${accessToken}` },
        json: true,
        body: { uris: [trackUri] },
        resolveWithFullResponse: true,
    });

    if (response.statusCode !== 204) throw new PlayError(response.statusCode);
}

/**
 * Pause playback.
 * @param trackUri Spotify uri of form 'spotify:track:abc123'
 * @param accessToken Spotify token with premium and 'user-modify-playback-state' permissions.
 */
export async function pause(accessToken: string) {
    const response = await rp.put({
        uri: 'https://api.spotify.com/v1/me/player/pause',
        headers: { Authorization: `Bearer ${accessToken}` },
        resolveWithFullResponse: true,
    });

    if (response.statusCode !== 204) throw new PlayError(response.statusCode);
}

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
