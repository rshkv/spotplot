/*
 References:
 http://jkaufman.io/spotify-auth-react-router/
 https://github.com/kauffecup/spotify-react-router-auth/
 https://developer.spotify.com/web-api/authorization-guide/
 */
import { Router } from 'express';
import * as Spotify from 'spotify-web-api-node';
import { credentials, scopes } from './config';

const router = Router();
const spotifyApi = new Spotify(credentials);

// Redirect client to authorization
router.get('/login', (request, response) => {
  const authorizeUrl = spotifyApi.createAuthorizeURL(scopes);
  response.redirect(authorizeUrl);
});

// Spotify redirects user here after authorization
router.get('/callback', (request, response) => {
  const { code } = request.query;
  spotifyApi.authorizationCodeGrant(code)
    .then((data) => {
      /* eslint-disable camelcase */
      const { access_token, refresh_token } = data.body;
      spotifyApi.setAccessToken(access_token);
      spotifyApi.setRefreshToken(refresh_token);
      response.redirect(`/#/login/${access_token}`);
    })
    .catch((e) => {
      // tslint:disable-next-line no-console
      console.error(e);
      response.redirect(`/#/error/${e.message}`);
    });
});

export default router;
