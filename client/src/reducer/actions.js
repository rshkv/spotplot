import Spotify from 'spotify-web-api-js';
const spotifyApi = new Spotify();

export const SET_TOKEN = 'SET_TOKEN';
export const FETCH_USER = 'FETCH_USER';
export const RECEIVE_USER = 'RECEIVE_USER';

export function setToken(accessToken) {
  console.log('setToken()');
  spotifyApi.setAccessToken(accessToken);
  return { type: SET_TOKEN, accessToken };
}

export function fetchUser() {
  return (dispatch) => {
    dispatch({ type: FETCH_USER });
    spotifyApi.getMe()
      .then(data => {
        dispatch({ type: RECEIVE_USER, user: data });
      })
      .catch(e => {
        console.error('Error fetching user');
        console.log(e);
      });
  };
}
