import { flatten } from 'lodash';

export function linkArtists(tracks) {
  return flatten(tracks.map(t => (
    t.artists.map(a => ({ source: t.id, target: a.id }))
  )));
}

// spotify-graphql doesn't throw errors by itself
export function handleResult(r) {
  if (r.errors) throw r.errors[r.errors.length - 1];
  return r;
}

export function createReducer(initialState, handlers) {
  return (state = initialState, action) => (
    (action.type in handlers) ?
      handlers[action.type](state, action) :
      state
  );
}
