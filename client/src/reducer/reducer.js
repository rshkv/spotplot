import { combineReducers } from 'redux';
import {
  SET_TOKEN,
  FETCH_SONGS,
  RECEIVE_SONGS,
  END_FETCH_SONGS
} from './actions';

const accessToken = createReducer(null, {
  [SET_TOKEN]: (_, action) => action.accessToken,
});

const network = createReducer({ nodes: [], links: [] }, {
  [RECEIVE_SONGS](network, action) {
    return {
      nodes: [...network.nodes, ...action.songs],
      links: [],
    };
  },
});

const fetchingSongs = createReducer(false, {
  [FETCH_SONGS]: () => true,
  [END_FETCH_SONGS]: () => false,
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
