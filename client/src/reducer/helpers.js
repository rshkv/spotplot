export function linkArtists(tracks) {
  const accumulator = ({ artists, links }, track) => {
    links.push(...track.artists.map(a => ({ source: track.id, target: a.id })));
    artists.push(...track.artists);
    return { artists, links };
  };

  return tracks.reduce(
    accumulator,
    { artists: [], links: [] },
  );
}

// spotify-graphql doesn't throw errors by itself
export function handleResult(r) {
  if (r.errors) throw r.errors[r.errors.length - 1];
  return r;
}

export function createReducer(initialState, handlers) {
  return (state = initialState, action) => (
    handlers.hasOwnProperty(action.type) ?
      handlers[action.type](state, action) :
      state
  );
}
