import { combineReducers } from 'redux';
import { linkArtists } from './helpers';
import { uniqBy, merge, keyBy } from 'lodash';
import {
  SET_TOKEN,
  FETCH_TRACKS,
  END_FETCH_TRACKS,
  RECEIVE_TRACKS,
} from './actions';

const accessToken = createReducer(null, {
  [SET_TOKEN]: (_, action) => action.accessToken,
});

const network = createReducer({ tracks: [], artists: [], links: [] }, {
  [RECEIVE_TRACKS](network, action) {
    const tracks = [...network.tracks, ...actions.tracks];
    const { artists, links } = linkArtists(tracks);
    return {
      tracks: uniqBy(tracks),
      artists: uniqBy(artists),
      links: uniqBy(links),
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

function createReducer(initialState, handlers) {
  return (state = initialState, action) => (
    handlers.hasOwnProperty(action.type) ?
      handlers[action.type](state, action) :
      state
  );
}
