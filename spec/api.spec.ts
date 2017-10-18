import { expect } from 'chai';
import 'mocha';
import * as sinon from 'sinon';
import { getMyTracks } from '../client/src/reducer/api';
import { accessToken } from './token';

(global as any).XMLHttpRequest = sinon.useFakeXMLHttpRequest();

describe('Api', () => {

    it('should return my tracks', async () => {
        const tracks = await getMyTracks(accessToken);
        console.log(tracks.slice(0, 5));
        // expect(tracks.length).to.be.greaterThan(0);
    }).timeout(5000);

});
