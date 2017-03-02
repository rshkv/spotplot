import { SET_TOKEN, FETCH_USER, RECEIVE_USER } from './actions';

const initialState = {
  accessToken: null,
  fetchingUser: false,
  user: null,
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

    default:
      return state;

  }
}
