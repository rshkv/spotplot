import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';

interface ISelectionState {
    enteredPlaylist?: string;
}

export default class Selection extends React.Component<RouteComponentProps, ISelectionState> {

    public constructor(props: RouteComponentProps) {
        super(props);
        this.state = { enteredPlaylist: 'https://open.spotify.com/user/spotify/playlist/37i9dQZF1DX8CopunbDxgW' };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    public render() {
        return (
            <div className="d-flex justify-content-center h-100">
                <div className="d-flex w-50 flex-column justify-content-center">
                    <p className="text-justify">
                        Spotplot will load all tracks and artists for a playlist you select.
                        You can select a playlist by either link or by clicking one of your playlists below.
                        You can also load all your library tracks.
                    </p>
                    <div className="mt-3">
                        <h4>Library</h4>
                        <p>View songs saved to your library.</p>
                        <div className="text-center">
                            {<Link to="/songs" className="button">Show</Link>}
                        </div>
                    </div>

                    <div className="mt-3">
                        <h4>Playlist by URL</h4>
                        <form onSubmit={this.handleSubmit}>
                            <div className="form-group">
                                <label>View songs from playlist url:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={this.state.enteredPlaylist}
                                    onChange={this.handleChange}
                                />
                            </div>
                            <div className="text-center">
                                <input
                                    type="submit"
                                    value="Submit"
                                    className="button"
                                />
                            </div>
                        </form>
                    </div>
                </div>
            </div >
        );
    }

    /**
     * Parses the playlist id from a Spotify url or identifier.
     * @param uri Spotify link or uri
     */
    public static parsePlaylistId(uri: string): string | null {
        const regex = /playlist(?:\/|:)(?<playlistId>[^\?]+)/;
        try {
            const { groups: { playlistId } } = regex.exec(uri);
            return playlistId;
        } catch (e) {
            return null;
        }
    }

    protected handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ enteredPlaylist: event.target.value });
    }

    protected handleSubmit(event: React.FormEvent) {
        const { enteredPlaylist } = this.state;
        const playlistId: string | null = Selection.parsePlaylistId(enteredPlaylist);
        console.log(playlistId);
        if (playlistId) {
            this.props.history.push(`/playlist/${playlistId}`);
        } else {
            window.alert(
                `Failed to parse playlist link: '${enteredPlaylist}'\n\n` +
                "Try an URI like 'spotify:playlist:37i...'\nor 'https://open.spotify.com/playlist/37i...'");
        }
        event.preventDefault();
    }

}
