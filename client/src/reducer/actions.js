import { SpotifyGraphQLClient } from 'spotify-graphql';
import { tracks } from './data';

export const SET_TOKEN = 'SET_TOKEN';
export const FETCH_TRACKS = 'FETCH_SONGS';
export const RECEIVE_TRACKS = 'RECEIVE_SONGS';

const spotify = SpotifyGraphQLClient;

export function setToken(accessToken) {
  return { type: SET_TOKEN, accessToken };
}

export function fetchSongs(accessToken) {
  return (dispatch) => {
    dispatch({ type: FETCH_TRACKS });

    spotify({ accessToken })
      .query(fetchSongsQuery)
      .then(result => {
        if (result.errors) {
          result.errors.forEach(e => {
            console.error(e.message);
          });
        } else {
          const tracks = result.data.me.tracks.map(t => t.track);
          dispatch({ type: RECEIVE_TRACKS, tracks });
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
        type
        preview_url
        popularity
        artists {
          id
          uri
          name
          type
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
