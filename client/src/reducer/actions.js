import Spotify from 'spotify-web-api-js';
const spotifyApi = new Spotify();

export const SET_TOKEN = 'SET_TOKEN';
export const FETCH_SONGS = 'FETCH_SONGS';
export const RECEIVE_SONGS = 'RECEIVE_SONGS';
export const END_FETCH_SONGS = 'END_FETCH_SONGS';

export function setToken(accessToken) {
  return { type: SET_TOKEN, accessToken };
}

export function fetchSongs(accessToken) {
  spotifyApi.setAccessToken(accessToken);

  return (dispatch) => {
    const fetch = (next) => {
      ((next) ? spotifyApi.getGeneric(next) : spotifyApi.getMySavedTracks({ limit: 50 }))
        .then(data => {
          dispatch({ type: RECEIVE_SONGS, songs: data.items.map(s => s.track), });
          if (data.next) {
            fetch(data.next);
          } else {
            dispatch({ type: END_FETCH_SONGS });
          }
        })
        .catch(e => { console.error(e); });
    };

    dispatch({ type: FETCH_SONGS });
    fetch();
  };
}
