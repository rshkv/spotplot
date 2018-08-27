/**
 * This file contains the actions. The actions here are defined as functions.
 * A single action function will make API calls and return the created action.
 * Returned actions here are objects or functions that are dispatched with the Thunk middleware.
 */
import * as _ from 'lodash';
import { AnyAction, Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { Track, IStoreState, Artist } from '../types';
import Api from './api';

const API = new Api();
export const enum Actions {
  SET_TOKEN = 'SET_TOKEN',
  SET_PLAY = 'SET_PLAYING',
  UNSET_PLAY = 'UNSET_PLAYING',
  FETCH_TRACKS = 'FETCH_TRACKS',
  END_FETCH_TRACKS = 'END_FETCH_TRACKS',
  RECEIVE_TRACKS = 'RECEIVE_TRACKS',
  RECEIVE_ARTISTS = 'RECEIVE_ARTISTS',
}
// tslint:disable no-empty-interface
export interface ITokenAction extends Action<string> { accessToken: string; }
export interface IPlayingAction extends Action<string> { track?: Track; }
export interface IFetchTracksAction extends Action<string> { }
export interface IReceiveAction extends Action<string> { tracks?: Track[]; artists?: Artist[]; }
export default Actions;

/**
 * Sets the token in the API and store.
 * @param accessToken Token
 */
export function setToken(accessToken: string): ITokenAction {
  API.setToken(accessToken);
  return { type: Actions.SET_TOKEN, accessToken };
}

/**
 * Plays a track using the api and sets the id in the store.
 * Stop playing if argument is not set, or the track is already playing.
 * @param track Track to play. If undefined, stop playing.
 */
export function togglePlay(track?: Track):
  ThunkAction<void, IStoreState, void, IPlayingAction> {
  return async (dispatch, getState) => {
    const { isPlaying, playingTrack } = getState();
    // Only play if track is set and different from the currently playing track
    if (track && (!playingTrack || track.uri !== playingTrack.uri)) {
      await API.playTrack(track.uri);
      dispatch({ type: Actions.SET_PLAY, track });
    } else if (isPlaying) {
      await API.pause();
      dispatch({ type: Actions.UNSET_PLAY });
    }
  };
}

export function fetchSongs():
  ThunkAction<void, IStoreState, void, IFetchTracksAction | IReceiveAction> {
  return async (dispatch) => {
    dispatch({ type: Actions.FETCH_TRACKS });
    const tracks = await API.getSavedTracks();
    dispatch({ type: Actions.RECEIVE_TRACKS, tracks });
    const artists = await API.getArtistsFromTracks(tracks);
    dispatch({ type: Actions.RECEIVE_ARTISTS, artists });
    dispatch({ type: Actions.END_FETCH_TRACKS });
  };
}

export function fetchPlaylist(userId: string, playlistId: string):
  ThunkAction<void, IStoreState, void, IFetchTracksAction | IReceiveAction> {
  return async (dispatch) => {
    dispatch({ type: Actions.FETCH_TRACKS });
    const tracks = await API.getPlaylistTracks(userId, playlistId);
    dispatch({ type: Actions.RECEIVE_TRACKS, tracks });
    const artists = await API.getArtistsFromTracks(tracks);
    dispatch({ type: Actions.RECEIVE_ARTISTS, artists });
    dispatch({ type: Actions.END_FETCH_TRACKS });
  };
}
