export interface IStoreState {
    accessToken: string;
    fetchingSongs: boolean;
    network: {
        artists: IArtist[];
        links: ILink[];
        tracks: ITrack[];
    };
}

/* tslint:disable no-empty-interface */
export interface IArtist {}
export interface ILink {}
export interface ITrack {}
