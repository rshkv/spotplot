/* tslint:disable no-shadowed-variable */
import { uniqBy } from 'lodash';
import { combineReducers } from 'redux';
import { INetwork } from '../types';
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

const accessToken = createReducer(null, {
  [SET_TOKEN]: (_, action) => action.accessToken,
});

const network = createReducer({ tracks: [], artists: [], links: [] }, {
  [RECEIVE_TRACKS](network: INetwork, action): INetwork {
    return {
      ...network,
      tracks: uniqBy([...network.tracks, ...action.tracks], t => t.id),
    };
  },

  [RECEIVE_ARTISTS](network: INetwork, action): INetwork {
    return {
      tracks: network.tracks,
      artists: uniqBy([...network.artists, ...action.artists], a => a.id),
      links: linkArtists(network.tracks),
    };
  },

});

const isFetchingSongs = createReducer(false, {
  [FETCH_TRACKS]: () => true,
  [END_FETCH_TRACKS]: () => false,
});

const isPlaying = createReducer(false, {
  [SET_PLAY]: () => true,
  [UNSET_PLAY]: () => false,
});

export default combineReducers({
  accessToken,
  network,
  isFetchingSongs,
  isPlaying,
});
