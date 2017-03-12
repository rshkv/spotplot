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
      playing: false,
    };
  }

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(fetchSongs());
  }

  render() {
    const { network, fetchingSongs } = this.props;
    const { playing, selectedTrack } = this.state;

    const onHover = (d) => {
      this.setState({ selectedTrack: d });
    };

    const togglePlaying = () => {
      this.setState({ playing: !this.state.playing, });
    };

    return (
      <div className="container">
        <div className="network">
          <Network network={network} onHover={onHover} onClick={togglePlaying} />
        </div>
        {selectedTrack && <Player track={selectedTrack} playing={playing} togglePlaying={togglePlaying} />}
        <div className="songs">
          {fetchingSongs && <p className="subtitle">Loading songs...</p>}
        </div>
      </div>
    );
  }
}

export default connect(({ fetchingSongs, network }) => ({ fetchingSongs, network }))(Songs);
