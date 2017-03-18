import { combineReducers } from 'redux';
import { linkArtist } from './helpers';
import {
  SET_TOKEN,
  FETCH_TRACKS,
  RECEIVE_TRACKS,
} from './actions';

const accessToken = createReducer(null, {
  [SET_TOKEN]: (_, action) => action.accessToken,
});

const network = createReducer({ tracks: [], artists: [], links: [] }, {
  [RECEIVE_TRACKS](network, action) {
    const tracks = [...network.tracks, ...action.tracks];
    const { artists, links } = linkArtist(tracks);
    return { tracks, artists, links }
  },
});

const fetchingSongs = createReducer(false, {
  [FETCH_TRACKS]: () => true,
  [RECEIVE_TRACKS]: () => false,
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
