/* tslint:disable no-shadowed-variable */
import { uniqBy } from 'lodash';
import { combineReducers } from 'redux';
import { INetwork, Track } from '../types';
import {
  END_FETCH_TRACKS,
  FETCH_TRACKS,
  RECEIVE_TRACKS,
  RECEIVE_ARTISTS,
  SET_PLAY,
  UNSET_PLAY,
  SET_TOKEN,
} from './actions';
import { linkArtists, createReducer } from './helpers';

/**
 * This application's store interface.
 * Reducers for each property are below.
 */
export interface IStoreState {
  accessToken: string;
  isFetchingSongs: boolean;
  isPlaying: boolean;
  network: INetwork;
  playingTrack: Track;
}

/**
 * Reducer accepting a token.
 */
const accessToken = createReducer(null, {
  [SET_TOKEN]: (_, action) => action.accessToken,
});

/**
 * Reducer accepting tracks and artists to display in the network.
 */
const network = createReducer({ tracks: [], artists: [], links: [] }, {
  /**
   * Override tracks with combined set of current and new tracks.
   */
  [RECEIVE_TRACKS](network: INetwork, action): INetwork {
    return {
      ...network,
      tracks: uniqBy([...network.tracks, ...action.tracks], t => t.id),
    };
  },
  /**
   * Override artists with combined set of current and new tracks.
   * Create links from current tracks.
   */
  [RECEIVE_ARTISTS](network: INetwork, action): INetwork {
    return {
      tracks: network.tracks,
      artists: uniqBy([...network.artists, ...action.artists], a => a.id),
      links: linkArtists(network.tracks),
    };
  },

});

/**
 * Reducer toggling track loading to show progress bar.
 */
const isFetchingSongs = createReducer(false, {
  [FETCH_TRACKS]: () => true,
  [END_FETCH_TRACKS]: () => false,
});

/**
 * Reducer toggling accept state.
 * @todo Why do we need 'isPlaying' and 'playingTrack'?
 */
const isPlaying = createReducer(false, {
  [SET_PLAY]: () => true,
  [UNSET_PLAY]: () => false,
});

/**
 * Reducer accepting a track to play.
 */
const playingTrack = createReducer(null, {
  [SET_PLAY]: (_, action) => action.track,
  [UNSET_PLAY]: () => null,
});

/**
 * Combined reducer for the store.
 */
export default combineReducers<IStoreState>({
  accessToken,
  network,
  isFetchingSongs,
  isPlaying,
  playingTrack,
});
