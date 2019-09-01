/**
 * A few tests of the client-side Api calls.
 * These are integration tests and 'ACCESS_TOKEN' below must be set to run them.
 * You can pull the token from local storage when running the app.
 */
import { expect } from 'chai';
import 'mocha';
import * as sinon from 'sinon';
import Api from '../client/src/reducer/api';

// tslint:disable-next-line max-line-length
const ACCESS_TOKEN = 'BQCphCq4bazTtA1krYmur5oDr12RPWyKvYbWyMUfIe6xb1Ke6wgEkFBoDf-gJ8To1J-f-5y0BmbPHoJiuFbQFxQQBge8-PdpMKlhSJaJ_YiYytHiOeBbnYIRG-2UlhughVnWTtiXT-H79iJrKzLvnVmEPM9vy5uGOm9d06N5UEP26fm-OqfDWIQX';
// To run browser-like http requests in Node
(global as any).XMLHttpRequest = sinon.useFakeXMLHttpRequest();
// Utility to pretty-print request results
function log(obj: any) {
    /* tslint:disable no-console */
    console.log(JSON.stringify(obj, null, 2));
}

const api = new Api(ACCESS_TOKEN);

describe('Api', () => {

    it('should return saved tracks', async () => {
        const expectedLastSavedTrack = '3Nlq1iM31vOPARfaS43CUc';

        const tracks = await api.getSavedTracks();
        const lastTrack = tracks[tracks.length - 1];
        expect(tracks.length).to.be.greaterThan(0);
        expect(lastTrack.id).to.equal(expectedLastSavedTrack);
        expect(lastTrack).to.have.property('popularity');
    }).timeout(20000);

    it('should return artists', async () => {
        const ids = ['0oSGxfWSnnOXhD2fKuz2Gy', '3dBVyJ7JuOMt4GE9607Qin', '3dBVyJ7JuOMt4GE9607Qin'];

        const artists = await api.getArtists(ids);
        expect(artists.map(a => a.id)).to.have.ordered.members(ids);
        expect(artists[0]).to.have.property('popularity');
    });

    it('should return playlist tracks', async () => {
        // Designated playlist I created
        const user = '1121825855';
        const playlist = '3hCbSqdbKmCPlrwI6LdrxZ';

        const tracks = await api.getPlaylistTracks(user, playlist);
        expect(tracks.length).to.be.equal(200);
        expect(tracks[0].id).to.be.equal('48RvhoZ9cVHyEUaVGSi20C');
    }).timeout(5000);

});
