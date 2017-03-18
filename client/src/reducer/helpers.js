import * as _ from 'lodash';


export function linkArtist(tracks) {
    const accumulator = ({ artists, links }, track) => {
        links.push(...track.artists.map(a => ({ source: track.id, target: a.id })));
        artists.push(...track.artists);
        return { artists, links };
    };
    const { artists, links } = tracks.reduce(
        accumulator,
        { artists: [], links: [] }
    );
    return {
        artists: _.uniqBy(artists, n => n.id),
        links: _.uniqBy(links, l => l.source + l.target),
    }
}
