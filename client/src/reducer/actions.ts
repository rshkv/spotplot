/* tslint:disable no-console */
import { SpotifyGraphQLClient } from 'spotify-graphql';
import { flatten, uniq, chunk } from 'lodash';
import { handleResult } from './helpers';
import { tracksQuery, artistsQueryBuilder } from './queries';
import { credentials } from '../../../server/config';

export const SET_TOKEN = 'SET_TOKEN';
export const FETCH_TRACKS = 'FETCH_TRACKS';
export const RECEIVE_TRACKS = 'RECEIVE_TRACKS';
export const RECEIVE_ARTISTS = 'RECEIVE_ARTISTS';
export const END_FETCH_TRACKS = 'END_FETCH_TRACKS';

const spotify = SpotifyGraphQLClient;

function fetchTracks(accessToken) {
  return spotify({ accessToken, ...credentials })
    .query(tracksQuery)
    .catch(e => console.log(e))
    .then(handleResult)
    .then(result => result.data.me.tracks.map(t => t.track));
}

function fetchArtistsFromTracks(tracks, accessToken) {
  const chunkSize = 50;
  const artistIds = flatten(tracks.map(t => t.artists.map(a => a.id)));
  const idChunks = chunk(uniq(artistIds), chunkSize);
  const artistRequests = idChunks.map(c => (
    spotify({ accessToken, ...credentials })
      .query(artistsQueryBuilder(c))
      .then(handleResult)
  ));

  return Promise.all(artistRequests)
    .catch(e => console.log(e))
    .then((results) => {
      const artistChunks = (results as any[]).map(r => r.data.artists);
      const artists = flatten(artistChunks);
      return artists;
    });
}

export function setToken(accessToken) {
  return { type: SET_TOKEN, accessToken };
}

export function fetchSongs(accessToken) {
  return (dispatch) => {
    dispatch({ type: FETCH_TRACKS });

    fetchTracks(accessToken)
      .then((tracks) => {
        dispatch({ type: RECEIVE_TRACKS, tracks });
        return tracks;
      })
      .then((tracks) => {
        fetchArtistsFromTracks(tracks, accessToken)
          .then((artists) => {
            dispatch({ type: RECEIVE_ARTISTS, artists });
            dispatch({ type: END_FETCH_TRACKS });
          });
      });
  };
}
