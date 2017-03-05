import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchSongs } from '../reducer/actions';
import Network from './Network';
import Player from './Player';

class Songs extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedTrack: "spotify:track:6XkFBiUmmY355VTd8Bi63s",
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
      this.setState({ selectedTrack: d.uri });
    };

    return (
      <div className="container">
        <div className="network">
          <Network songs={songs} onHover={onHover}/>
        </div>
        <div className="player">
          <Player uri={selectedTrack}/>
        </div>
        <div className="songs">
          {fetchingSongs && <p className="subtitle">Loading songs...</p>}
        </div>
      </div>
    );
  }
}

export default connect(({ fetchingSongs, songs }) => ({ fetchingSongs, songs }))(Songs);
