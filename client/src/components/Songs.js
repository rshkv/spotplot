import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchSongs } from '../reducer/actions';
import Network from './Network';
import { Player, OldPlayer } from './Player';

class Songs extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedTrack: null,
    };
  }

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(fetchSongs());
  }

  render() {
    const { songs, fetchingSongs } = this.props;
    const { selectedTrack } = this.state;

    const onHover = (d) => {
      this.setState({ selectedTrack: d });
    };

    return (
      <div className="container">
        <div className="network">
          <Network songs={songs} onHover={onHover} />
        </div>
        {selectedTrack && <Player track={selectedTrack} />}
        {selectedTrack &&
          <div className="old-player">
            <OldPlayer uri={selectedTrack.uri} />
          </div>
        }
        <div className="songs">
          {fetchingSongs && <p className="subtitle">Loading songs...</p>}
        </div>
      </div>
    );
  }
}

export default connect(({ fetchingSongs, songs }) => ({ fetchingSongs, songs }))(Songs);
