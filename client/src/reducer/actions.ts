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

export const enum Actions {
  SET_TOKEN = 'SET_TOKEN',
  SET_PLAY = 'SET_PLAYING',
  UNSET_PLAY = 'UNSET_PLAYING',
  FETCH_TRACKS = 'FETCH_TRACKS',
  RECEIVE_TRACKS = 'RECEIVE_TRACKS',
  RECEIVE_ARTISTS = 'RECEIVE_ARTISTS',
  END_FETCH_TRACKS = 'END_FETCH_TRACKS',
}

export default Actions;

const api = new Api();

/**
 * Sets the token in the API and store.
 * @param accessToken Token
 */
export function setToken(accessToken: string) {
  api.setToken(accessToken);
  return { type: Actions.SET_TOKEN, accessToken };
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
      dispatch({ type: Actions.SET_PLAY, track });
    } else if (isPlaying) {
      await api.pause();
      dispatch({ type: Actions.UNSET_PLAY });
    }
  };
}

export function fetchSongs() {
  return async (dispatch: Dispatch<IStoreState>, getState: () => IStoreState) => {
    dispatch({ type: Actions.FETCH_TRACKS });
    const tracks = await api.getSavedTracks();
    dispatch({ type: Actions.RECEIVE_TRACKS, tracks });
    const artists = await api.getArtistsFromTracks(tracks);
    dispatch({ type: Actions.RECEIVE_ARTISTS, artists });
    dispatch({ type: Actions.END_FETCH_TRACKS });
  };
}

export function fetchPlaylist(userId, playlistId) {
  return async (dispatch: Dispatch<IStoreState>) => {
    dispatch({ type: Actions.FETCH_TRACKS });
    const tracks = await api.getPlaylistTracks(userId, playlistId);
    dispatch({ type: Actions.RECEIVE_TRACKS, tracks });
    const artists = await api.getArtistsFromTracks(tracks);
    dispatch({ type: Actions.RECEIVE_ARTISTS, artists });
    dispatch({ type: Actions.END_FETCH_TRACKS });
  };
}
