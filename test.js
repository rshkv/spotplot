const spotify = require('spotify-graphql').SpotifyGraphQLClient;
const _ = require('lodash');
const fs = require('fs');

const accessToken = 'BQAXBHdWIRkrd5UEdgoCLsuMgHKPKne_PPYEgj4nWiXsrrvKUwOGMagyRR5s9hkqgkvmlZvmsCuTlere1PCdIHHgVkanz5JMwAB9KCewRQh2_Zloa2WDemaJ9wL8chOgLvE3iwu2yZcWdIs4Snh7QBkyB1gHnpIRt6yAy5D6Sdkp7vvhPcLTs3YDOn0';

const _trackProperties = `
  id
  uri
  name
  type
  preview_url
  popularity
  artists {
    id
  }
  album {
    images {
      url
    }
  }
`;

const _artistProperties = `
  id
  uri
  name
  type
  popularity
  genres
  images {
    url
  }
`;

const idsQuery = `
{
  me {
    tracks(limit: -1) {
      track { id }
    }
  }
}
`;

const tracksQuery = `
{
  me {
    tracks(limit: -1) {
      track { 
        id
        uri
        name
        type
        preview_url
        popularity
        artists {
          id
        }
        album {
          images {
            url
          }
        }
      }
    }
  }
}
`;

const artistsQueryBuilder = (artistIds) => `
{
  artists(ids: "${artistIds.join(',')}") {
    id
    uri
    name
    type
    popularity
    genres
    images {
      url
    }
  }
}
`;

const tracksQueryBuilder = (trackIds) => `
{
  tracks(ids: "${trackIds.join(',')}") ${_trackProperties}
}
`;

function handleResult(r) {
  if (r.errors) throw r.errors[0];
  return r;
};

function getTracks(tracks) {
  const chunkSize = 20;
  const chunks = _.chunks(tracks, chunkSize);
  chunks.forEach(chunk => {
    const query = tracksQueryBuilder(chunk);
    console.log(query);
    spotify({ accessToken })
      .query(query)
      .then(handleResult(r => {
        console.log(JSON.stringify(r.data, null, '  '));
      }));
  });
};

const chunkSize = 50;

async function fetchTracks() {
  const result = await spotify({ accessToken })
    .query(idsQuery)
    .then(handleResult)
    .catch(e => console.log(e));
  const ids = result.data.me.tracks.map(t => t.track.id);
  const chunks = _.chunk(ids, chunkSize);

  const trackRequests = chunks.map(chunk => {
    const query = tracksQueryBuilder(chunk);
    return spotify({ accessToken })
      .query(query)
      .then(handleResult);
  });

  const trackChunks = await Promise.all(trackRequests)
    .then(results => results.map(r => r.data.tracks))
    .catch(e => console.error(e));

  const tracks = _.flatten(trackChunks);
  console.log(tracks);
}

async function fetchTracksWithArtists() {
  const result = await spotify({ accessToken })
    .query(tracksQuery)
    .then(handleResult)
    .catch(e => console.log(e));
  const tracks = result.data.me.tracks.map(t => t.track);
  const artistIds = tracks.map(t => t.artists.map(a => a.id));
  const chunks = _.chunk(_.uniq(_.flatten(artistIds)), chunkSize);

  const artistRequests = chunks.map(chunk => {
    const query = artistsQueryBuilder(chunk);
    return spotify({ accessToken })
      .query(query)
      .then(handleResult);
  });

  const artistChunks = await Promise.all(artistRequests)
    .then(results => results.map(r => r.data.artists))
    .catch(e => console.error(e));

  const artists = _.flatten(artistChunks);
  console.log(artists);
}

fetchTracksWithArtists();
// spotify({ accessToken })
//   .query(idsQuery)
//   .then(r => {
//     return _.chunk(ids, 50);
//   })
//   .then(chunks => {

//   })

// getIds(accessToken);

let l1 = [
  { key: 1, list: [1, 2], prop: 1 },
  { key: 2, list: [], prop: 2 },
]

let l2 = [
  { key: 1, list: [2, 3], prop: 4 },
  { key: 3, list: [], prop: 5 }
]