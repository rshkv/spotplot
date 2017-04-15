import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchSongs } from '../reducer/actions';
import Network from './Network';
import Player from './Player';
import Progress from './Progress';

class Songs extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedTrack: null,
      playing: false,
    };
  }

  componentWillMount() {
    const { dispatch, accessToken } = this.props;
    dispatch(fetchSongs(accessToken));
  }

  render() {
    const { network, fetchingSongs } = this.props;
    const { playing, selectedTrack } = this.state;

    const onSelect = (d) => {
      if (d.type === 'track') {
        this.setState({ selectedTrack: d });
      }
    };

    const togglePlaying = () => {
      this.setState({ playing: !this.state.playing });
    };

    return (
      <div className="container">
        <div className="network">
          <Network network={network} onSelect={onSelect} onClick={togglePlaying} />
        </div>
        {selectedTrack &&
          <Player track={selectedTrack} playing={playing} togglePlaying={togglePlaying} />
        }
        <div className="songs">
          {fetchingSongs && <p className="subtitle">Loading songs...</p>}
          {fetchingSongs && <Progress />}
        </div>
      </div>
    );
  }
}

export default connect(({ fetchingSongs, network, accessToken }) => (
  { fetchingSongs, network, accessToken }
))(Songs);
