import { expect } from 'chai';
import 'mocha';
import * as sinon from 'sinon';
import { getSavedTracks, getArtists } from '../client/src/reducer/api';
import { accessToken } from './token';

(global as any).XMLHttpRequest = sinon.useFakeXMLHttpRequest();

function log(obj) {
    /* tslint:disable no-console */
    console.log(JSON.stringify(obj, null, 2));
}

/* tslint:disable max-line-length */
const expectedLastSavedTrack = '3Nlq1iM31vOPARfaS43CUc';

describe('Api', () => {

    it('should return saved tracks', async () => {
        const tracks = await getSavedTracks(accessToken);
        const lastTrack = tracks[tracks.length - 1];
        expect(tracks.length).to.be.greaterThan(0);
        expect(lastTrack.id).to.equal(expectedLastSavedTrack);
        expect(lastTrack).to.have.property('popularity');
    }).timeout(10000);

    it('should return artists', async () => {
        const ids = ['0oSGxfWSnnOXhD2fKuz2Gy', '3dBVyJ7JuOMt4GE9607Qin'];
        const artists = await getArtists(ids, accessToken);
        expect(artists.map(a => a.id)).to.have.ordered.members(ids);
        expect(artists[0]).to.have.property('popularity');
    });

});
