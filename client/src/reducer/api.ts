import * as _ from 'lodash';
import * as rp from 'request-promise';


export async function getMyTracks(accessToken): Promise<SpotifyApi.TrackObjectFull[]> {
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
    const offsets = _.range(limit, total, limit);
    const requests = offsets.map((offset) => rp({ ...options, qs: { limit, offset } }));
    // Await all requests and map to tracks
    const responses = await Promise.all(requests);
    return [...items, ..._.flatMap(responses, (r) => r.items)].map(i => i.track);
}
