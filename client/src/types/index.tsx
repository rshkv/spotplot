export interface IStoreState {
    accessToken: string;
    fetchingSongs: boolean;
    network: INetwork;
}

/* tslint:disable no-empty-interface */
export interface INetwork {
    artists: IArtist[];
    links: ILink[];
    tracks: ITrack[];
}
export interface IArtist { }
export interface ILink { }
export interface ITrack { }

export type Track = SpotifyApi.TrackObjectFull;
export type Artist = SpotifyApi.ArtistObjectFull;
