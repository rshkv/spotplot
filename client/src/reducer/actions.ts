import * as _ from 'lodash';
import { Track } from '../types';
import SpotifyApi from './api';
import { handleResult } from './helpers';
import { tracksQuery, artistsQueryBuilder } from './queries';

export const SET_TOKEN = 'SET_TOKEN';
export const SET_PLAY = 'SET_PLAYING';
export const UNSET_PLAY = 'UNSET_PLAYING';
export const FETCH_TRACKS = 'FETCH_TRACKS';
export const RECEIVE_TRACKS = 'RECEIVE_TRACKS';
export const RECEIVE_ARTISTS = 'RECEIVE_ARTISTS';
export const END_FETCH_TRACKS = 'END_FETCH_TRACKS';

const api = new SpotifyApi();

export function setToken(accessToken: string) {
  api.setToken(accessToken);
  return { type: SET_TOKEN, accessToken };
}

export function fetchSongs() {
  // TODO: Use getState to retrieve access token
  return async (dispatch, getState) => {
    const { accessToken } = getState();
    dispatch({ type: FETCH_TRACKS });
    const tracks = await api.getSavedTracks();
    dispatch({ type: RECEIVE_TRACKS, tracks });
    const artists = await api.getArtistsFromTracks(tracks);
    dispatch({ type: RECEIVE_ARTISTS, artists });
    dispatch({ type: END_FETCH_TRACKS });
  };
}

export function togglePlay(track?: Track) {
  return async (dispatch, getState) => {
    const { isPlaying, playingTrack, accessToken } = getState();
    if (track && (!playingTrack || track.uri !== playingTrack.uri)) {
      await api.playTrack(track.uri);
      dispatch({ type: SET_PLAY, track });
    } else if (isPlaying) {
      await api.pause();
      dispatch({ type: UNSET_PLAY });
    }
  };
}
