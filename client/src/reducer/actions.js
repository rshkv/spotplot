import { SpotifyGraphQLClient } from 'spotify-graphql';

export const SET_TOKEN = 'SET_TOKEN';
export const FETCH_SONGS = 'FETCH_SONGS';
export const RECEIVE_SONGS = 'RECEIVE_SONGS';

const spotify = SpotifyGraphQLClient;

export function setToken(accessToken) {
  return { type: SET_TOKEN, accessToken };
}

export function fetchSongs(accessToken) {
  return (dispatch) => {
    dispatch({ type: FETCH_SONGS });

    spotify({ accessToken })
      .query(fetchSongsQuery)
      .then(result => {
        if (result.errors) {
          result.errors.forEach(e => {
            console.error(e.message);
          });
        } else {
          const songs = result.data.me.tracks.map(t => t.track);
          dispatch({ type: RECEIVE_SONGS, songs });
        }
      });
  };
}

const fetchSongsQuery = `
{
  me {
    tracks {
      track {
        id
        uri
        name
        preview_url
        popularity
        artists {
          id
          uri
          name
        }
        album {
          images {
            url
          }
        }
      }
    }
  }
}`;