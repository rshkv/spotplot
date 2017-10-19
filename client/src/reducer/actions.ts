/* tslint:disable no-console */
import * as _ from 'lodash';
import { getSavedTracks, getArtists, getArtistsFromTracks } from './api';
import { handleResult } from './helpers';
import { tracksQuery, artistsQueryBuilder } from './queries';

export const SET_TOKEN = 'SET_TOKEN';
export const FETCH_TRACKS = 'FETCH_TRACKS';
export const RECEIVE_TRACKS = 'RECEIVE_TRACKS';
export const RECEIVE_ARTISTS = 'RECEIVE_ARTISTS';
export const END_FETCH_TRACKS = 'END_FETCH_TRACKS';

export function setToken(accessToken: string) {
  return { type: SET_TOKEN, accessToken };
}

export function fetchSongs(accessToken: string) {
  // TODO: Use getState to retrieve access token
  return async (dispatch) => {
    dispatch({ type: FETCH_TRACKS });
    const tracks = await getSavedTracks(accessToken);
    dispatch({ type: RECEIVE_TRACKS, tracks });
    const artists = await getArtistsFromTracks(tracks, accessToken);
    dispatch({ type: RECEIVE_ARTISTS, artists });
    dispatch({ type: END_FETCH_TRACKS });
  };
}
