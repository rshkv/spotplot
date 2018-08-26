import { flatMap, map } from 'lodash';
import { Action } from 'redux';
import { ILink, Track } from '../types';
import Actions from './actions';

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
export function createReducer<T, A extends Action>(
  initialState: T,
  handlers: { [a in Actions]?: (state: T, action: A) => T})
  : ((T, Action) => T) {
  return (state = initialState, action: A) => (
    (action.type in handlers) ?
      handlers[action.type](state, action) :
      state
  );
}
