/* tslint:disable no-shadowed-variable */
import { uniqBy } from 'lodash';
import { combineReducers, Action } from 'redux';
import { INetwork, Track } from '../types';
import Actions from './actions';
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
const accessToken = createReducer<string, { type: Actions, accessToken: string }>(null, {
  [Actions.SET_TOKEN]: (_, action) => action.accessToken,
});

/**
 * Reducer accepting tracks and artists to display in the network.
 */
const network = createReducer<INetwork, { type: Actions, tracks: Track[], artists: any }>(
  { tracks: [], artists: [], links: [] }, {
    /**
     * Override tracks with combined set of current and new tracks.
     */
    [Actions.RECEIVE_TRACKS](network, action): INetwork {
      return {
        ...network,
        tracks: uniqBy([...network.tracks, ...action.tracks], t => t.id),
      };
    },
    /**
     * Override artists with combined set of current and new tracks.
     * Create links from current tracks.
     */
    [Actions.RECEIVE_ARTISTS](network, action): INetwork {
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
const isFetchingSongs = createReducer<boolean, Action>(false, {
  [Actions.FETCH_TRACKS]: () => true,
  [Actions.END_FETCH_TRACKS]: () => false,
});

/**
 * Reducer toggling accept state.
 * @todo Why do we need 'isPlaying' and 'playingTrack'?
 */
const isPlaying = createReducer<boolean, Action>(false, {
  [Actions.SET_PLAY]: () => true,
  [Actions.UNSET_PLAY]: () => false,
});

/**
 * Reducer accepting a track to play.
 */
const playingTrack = createReducer<Track, { type: Actions, track: Track }>(null, {
  [Actions.SET_PLAY]: (_, action) => action.track,
  [Actions.UNSET_PLAY]: () => null,
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
