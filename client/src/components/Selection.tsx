import * as React from 'react';
import { Link } from 'react-router';

export default class Selection extends React.Component<{}, {}> {

    public render() {
        return (
            <div className="container jumbo selection">
                <div className="text">
                    Spotplot will load all tracks and artists for a playlist you select.<br />
                    You can select a playlist by either link or by clicking one of your playlists below.<br />
                    You can also load all your library tracks.<br />
                </div >
                <div className="item">
                    <div className="subtitle">Library songs</div>
                    <Link to="/songs" className="button">Show</Link>
                </div>
                <div className="item">
                    Playlist by link
                </div>
                <div className="item">
                    Your playlists
                </div>
            </div >
        );
    }
}
