/*
 References:
 http://jkaufman.io/spotify-auth-react-router/
 https://github.com/kauffecup/spotify-react-router-auth/
 https://developer.spotify.com/web-api/authorization-guide/
 */
const Spotify = require('spotify-web-api-node');
const config = require('./config.js');
const express = require('express');
const router = new express.Router();

const spotifyApi = new Spotify(config.credentials);

// Redirect client to authorization
router.get('/login', (request, response) => {
  const authorizeUrl = spotifyApi.createAuthorizeURL(config.scopes);
  response.redirect(authorizeUrl);
});

// Spotify redirects user here after authorization
router.get('/callback', (request, response) => {
  const { code } = request.query;
  spotifyApi.authorizationCodeGrant(code)
    .then(data => {
        const { access_token, refresh_token } = data.body;
        spotifyApi.setAccessToken(access_token);
        spotifyApi.setRefreshToken(refresh_token);
        response.redirect(`/#/login/${access_token}`);
      }
    )
    .catch(e => {
      console.log(e);
      response.redirect(`/#/error/${e.message}`);
    });

});

module.exports = router;
