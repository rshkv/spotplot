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

const songs = createReducer([], {
  [RECEIVE_SONGS]: (songs, action) => [...songs, ...action.songs],
});

const fetchingSongs = createReducer(false, {
  [FETCH_SONGS]: () => true,
  [END_FETCH_SONGS]: () => false,
});

export default combineReducers({
  fetchingUser,
  accessToken,
  user,
  songs,
  fetchingSongs,
});

function createReducer(initialState, handlers) {
  return (state = initialState, action) => (
    handlers.hasOwnProperty(action.type) ?
      handlers[action.type](state, action) :
      state
  );
}
