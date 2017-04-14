import { SpotifyGraphQLClient } from 'spotify-graphql';
import { tracks } from './data';
import { handleResult } from './helpers';
import { tracksQuery, artistsQueryBuilder } from './queries';
import { flatten, uniq, chunk } from 'lodash';

export const SET_TOKEN = 'SET_TOKEN';
export const FETCH_TRACKS = 'FETCH_TRACKS';
export const RECEIVE_TRACKS = 'RECEIVE_TRACKS';
export const END_FETCH_TRACKS = 'END_FETCH_TRACKS';

const spotify = SpotifyGraphQLClient;

export function setToken(accessToken) {
  return { type: SET_TOKEN, accessToken };
}

export function fetchSongs(accessToken) {
  const t0 = performance.now();
  return (dispatch) => {
    dispatch({ type: FETCH_TRACKS });

    fetchTracks(accessToken)
      .then(tracks => {
        dispatch({ type: RECEIVE_TRACKS, tracks });
        return tracks;
      })
      .then(tracks => {
        fetchArtistsFromTracks(tracks, accessToken)
          .then(artists => {
            console.log(artists);
            console.log(`Loaded artists, took ${(performance.now() - t0) / 1000} seconds`)
            dispatch({ type: END_FETCH_TRACKS });
          });
      });
  };
}

function fetchTracks(accessToken) {
  return spotify({ accessToken })
    .query(tracksQuery)
    .catch(e => console.log(e))
    .then(handleResult)
    .then(result => result.data.me.tracks.map(t => t.track));
}

function fetchArtistsFromTracks(tracks, accessToken) {
  const chunkSize = 50;
  const artistIds = flatten(tracks.map(t => t.artists.map(a => a.id)));
  const idChunks = chunk(uniq(artistIds), chunkSize);
  const artistRequests = idChunks.map(chunk => (
    spotify({ accessToken })
      .query(artistsQueryBuilder(chunk))
      .then(handleResult)
  ));

  return Promise.all(artistRequests)
    .catch(e => console.log(e))
    .then(results => {
      const artistChunks = results.map(r => r.data.artists);
      const artists = flatten(artistChunks);
      return artists;
    });
}
