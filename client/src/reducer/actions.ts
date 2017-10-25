/* tslint:disable no-console */
import * as _ from 'lodash';
import { Track } from '../types';
import * as api from './api';
import { handleResult } from './helpers';
import { tracksQuery, artistsQueryBuilder } from './queries';

export const SET_TOKEN = 'SET_TOKEN';
export const SET_PLAY = 'SET_PLAYING';
export const UNSET_PLAY = 'UNSET_PLAYING';
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
    const tracks = await api.getSavedTracks(accessToken);
    dispatch({ type: RECEIVE_TRACKS, tracks });
    const artists = await api.getArtistsFromTracks(tracks, accessToken);
    dispatch({ type: RECEIVE_ARTISTS, artists });
    dispatch({ type: END_FETCH_TRACKS });
  };
}

export function togglePlay(accessToken: string, track?: Track) {
  return async (dispatch, getState) => {
    const { isPlaying } = getState();
    if (isPlaying) {
      await api.pause(accessToken);
      dispatch({ type: UNSET_PLAY });
    } else if (track) {
      await api.playTrack(track.uri, accessToken);
      dispatch({ type: SET_PLAY });
    }
  };
}
