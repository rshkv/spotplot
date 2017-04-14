import { uniqBy } from 'lodash';

// Links tracks to their artists
export function linkArtists(tracks) {
  const accumulator = ({ artists, links }, track) => {
    links.push(...track.artists.map(a => ({ source: track.id, target: a.id })));
    artists.push(...track.artists);
    return { artists, links };
  };

  return tracks.reduce(
    accumulator,
    { artists: [], links: [] }
  );
}

// spotify-graphql doesn't throw errors by itself
export function handleResult(r) {
  if (r.errors) throw r.errors[r.errors.length - 1];
  return r;
};
