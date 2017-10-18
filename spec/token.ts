import * as Spotify from 'spotify-web-api-node';
import { credentials, scopes } from '../server/config';

const spotifyApi = new Spotify(credentials);

function authorizeUrl(): string {
    return spotifyApi.createAuthorizeURL(scopes);
}

// tslint:disable-next-line max-line-length
export const accessToken = 'ENTER_HERE';
