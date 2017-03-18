import * as _ from 'lodash';


export function linkArtist(tracks) {
    const accumulator = ({ nodes, links }, track) => {
        links.push(...track.artists.map(a => ({ source: track.id, target: a.id })));
        nodes.push(...track.artists);
        return { nodes, links };
    };
    const { nodes, links } = tracks.reduce(accumulator, { nodes: [], links: [] });
    return {
        nodes: _.uniqBy(nodes, n => n.id),
        links: _.uniqBy(links, l => l.source + l.target),
    }
}
