export const tracksQuery = `
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
          name
          type
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

export function artistsQueryBuilder(artistIds) {
  return `
    {
      artists(ids: "${artistIds.join(',')}") {
        id
        popularity
        genres
        images {
          url
        }
      }
    }
`;
}
