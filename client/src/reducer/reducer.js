import {
  SET_TOKEN,
  FETCH_USER,
  RECEIVE_USER,
  FETCH_SONGS,
  RECEIVE_SONGS,
  END_FETCH_SONGS
} from './actions';

const initialState = {
  accessToken: null,
  fetchingUser: false,
  fetchingSongs: false,
  user: null,
  songs: [],
};

export default function reduce(state = initialState, action) {
  switch (action.type) {

    case SET_TOKEN:
      const { accessToken } = action;
      return {
        ...state,
        accessToken,
      };

    case FETCH_USER:
      return {
        ...state,
        fetchingUser: true,
      };

    case RECEIVE_USER:
      const { user } = action;
      return {
        ...state,
        fetchingUser: false,
        user,
      };

    case FETCH_SONGS:
      return {
        ...state,
        fetchingSongs: true,
      };

    case RECEIVE_SONGS:
      const { songs } = action;
      return {
        ...state,
        songs: [...state.songs, ...songs],
      };

    case END_FETCH_SONGS:
      return {
        ...state,
        fetchingSongs: false,
      };

    default:
      return state;

  }
}
