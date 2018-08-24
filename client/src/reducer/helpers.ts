import { flatMap, map } from 'lodash';
import { ILink, Track } from '../types';

export function linkArtists(tracks: Track[]): ILink[] {
  return flatMap(tracks, t => (
    map(t.artists, a => ({ source: t.id, target: a.id }))
  ));
}

// spotify-graphql doesn't throw errors by itself
export function handleResult(r) {
  if (r.errors) throw r.errors[r.errors.length - 1];
  return r;
}

/**
 * Utility to create a reducer with initial state and multiple handlers.
 * @param initialState Initial state of store value.
 * @param handlers Mapping from action type to handler function.
 */
export function createReducer(initialState, handlers) {
  return (state = initialState, action) => (
    (action.type in handlers) ?
      handlers[action.type](state, action) :
      state
  );
}
