import { combineReducers } from 'redux';
import {
  SET_TOKEN,
  FETCH_USER,
  RECEIVE_USER,
  FETCH_SONGS,
  RECEIVE_SONGS,
  END_FETCH_SONGS
} from './actions';

const fetchingUser = createReducer(false, {
  [FETCH_USER]: () => true,
  [RECEIVE_USER]: () => false,
});

const user = createReducer(null, {
  [RECEIVE_USER]: (_, action) => action.user,
});

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
  fetchingUser,
  accessToken,
  user,
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
