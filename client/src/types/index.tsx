export { IStoreState } from '../reducer/reducer';

export interface INetwork {
    artists: Artist[];
    links: ILink[];
    tracks: Track[];
}
export interface ILink {
    source: string;
    target: string;
}

export type Track = SpotifyApi.TrackObjectFull;
export type Artist = SpotifyApi.ArtistObjectFull;
export const isTrack = (d: Track | Artist) => d.type === 'track';
