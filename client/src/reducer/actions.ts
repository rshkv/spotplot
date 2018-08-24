/**
 * This file contains the actions. The actions here are defined as functions.
 * A single action function will make API calls and return the created action.
 * Returned actions here are objects or functions that are dispatched with the Thunk middleware.
 */
import * as _ from 'lodash';
import { Dispatch } from 'redux';
import { Track, IStoreState } from '../types';
import Api from './api';
import { handleResult } from './helpers';
import { tracksQuery, artistsQueryBuilder } from './queries';

export const SET_TOKEN = 'SET_TOKEN';
export const SET_PLAY = 'SET_PLAYING';
export const UNSET_PLAY = 'UNSET_PLAYING';
export const FETCH_TRACKS = 'FETCH_TRACKS';
export const RECEIVE_TRACKS = 'RECEIVE_TRACKS';
export const RECEIVE_ARTISTS = 'RECEIVE_ARTISTS';
export const END_FETCH_TRACKS = 'END_FETCH_TRACKS';

const api = new Api();

/**
 * Sets the token in the API and store.
 * @param accessToken Token
 */
export function setToken(accessToken: string) {
  api.setToken(accessToken);
  return { type: SET_TOKEN, accessToken };
}

/**
 * Plays a track using the api and sets the id in the store.
 * Stop playing if argument is not set, or the track is already playing.
 * @param track Track to play. If undefined, stop playing.
 */
export function togglePlay(track?: Track) {
  return async (dispatch: Dispatch<IStoreState>, getState: () => IStoreState) => {
    const { isPlaying, playingTrack } = getState();
    // Only play if track is set and different from the currently playing track
    if (track && (!playingTrack || track.uri !== playingTrack.uri)) {
      await api.playTrack(track.uri);
      dispatch({ type: SET_PLAY, track });
    } else if (isPlaying) {
      await api.pause();
      dispatch({ type: UNSET_PLAY });
    }
  };
}

export function fetchSongs() {
  return async (dispatch: Dispatch<IStoreState>, getState: () => IStoreState) => {
    dispatch({ type: FETCH_TRACKS });
    const tracks = await api.getSavedTracks();
    dispatch({ type: RECEIVE_TRACKS, tracks });
    const artists = await api.getArtistsFromTracks(tracks);
    dispatch({ type: RECEIVE_ARTISTS, artists });
    dispatch({ type: END_FETCH_TRACKS });
  };
}

export function fetchPlaylist(userId, playlistId) {
  return async (dispatch: Dispatch<IStoreState>) => {
    dispatch({ type: FETCH_TRACKS });
    const tracks = await api.getPlaylistTracks(userId, playlistId);
    dispatch({ type: RECEIVE_TRACKS, tracks });
    const artists = await api.getArtistsFromTracks(tracks);
    dispatch({ type: RECEIVE_ARTISTS, artists });
    dispatch({ type: END_FETCH_TRACKS });
  };
}
