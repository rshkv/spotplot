import { flatMap, map } from 'lodash';
import { Action } from 'redux';
import { ILink, Track } from '../types';
import Actions from './actions';

export function linkArtists(tracks: Track[]): ILink[] {
  return flatMap(tracks, t => (
    map(t.artists, a => ({ source: t.id, target: a.id }))
  ));
}

/**
 * Utility to create a reducer with initial state and multiple handlers.
 * @param initialState Initial state of store value.
 * @param handlers Mapping from action type to handler function.
 */
export function createReducer<S, A extends Action<Actions>>(
  initialState: S,
  handlers: { [a in Actions]?: (state: S, action: A) => S }
): ((state: S, action: A) => S) {
  return (state = initialState, action: A) => (
    (action.type in handlers) ?
      handlers[action.type](state, action) :
      state
  );
}
