/* eslint-disable no-shadow */
import * as _ from 'lodash';
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
    const tracks = [...network.tracks, ...action.tracks];
    const { artists, links } = linkArtists(tracks);
    return {
      tracks,
      links,
      artists: _.uniqBy(artists, a => a.id),
    };
  },

  [RECEIVE_ARTISTS](network, action) {
    const oldArtists = _.keyBy(network.artists, a => a.id);
    const newArtists = _.keyBy(action.artists, a => a.id);
    const mergedArtists = _.merge(oldArtists, newArtists);
    return { ...network, artists: _.values(mergedArtists) };
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
