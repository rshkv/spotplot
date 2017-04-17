/* eslint-disable no-shadow */
import { uniqBy } from 'lodash';
import { combineReducers } from 'redux';
import { linkArtists, createReducer } from './helpers';
import {
  SET_TOKEN,
  FETCH_TRACKS,
  END_FETCH_TRACKS,
  RECEIVE_TRACKS,
  RECEIVE_ARTISTS,
} from './actions';

const accessToken = createReducer(null, {
  [SET_TOKEN]: (_, action) => action.accessToken,
});

const network = createReducer({ tracks: [], artists: [], links: [] }, {
  [RECEIVE_TRACKS](network, action) {
    return {
      ...network,
      tracks: uniqBy([...network.tracks, ...action.tracks], t => t.id),
    };
  },

  [RECEIVE_ARTISTS](network, action) {
    return {
      tracks: network.tracks,
      artists: uniqBy([...network.artists, ...action.artists], a => a.id),
      links: linkArtists(network.tracks),
    };
  },

});

const fetchingSongs = createReducer(false, {
  [FETCH_TRACKS]: () => true,
  [END_FETCH_TRACKS]: () => false,
});

export default combineReducers({
  accessToken,
  network,
  fetchingSongs,
});
