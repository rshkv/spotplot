import React, { Component } from 'react';
import { connect } from 'react-redux';
import SpotifyPlayer from 'react-spotify-player';
import { fetchSongs } from '../reducer/actions';
import Network from './Network';

class Songs extends Component {

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(fetchSongs());
  }

  render() {
    const { songs, fetchingSongs } = this.props;
    return (
      <div className="container">
        <div className="network">
          <Network songs={songs}/>
        </div>
        <div className="player">
          <SpotifyPlayer
            uri="spotify:album:1TIUsv8qmYLpBEhvmBmyBk"
            size={{ width: '100%', height: '100%' }}
            view='list'
            theme='black'
          />
        </div>
        <div className="songs">
          {fetchingSongs && <p className="subtitle">Loading songs...</p>}
        </div>
      </div>
    );
  }
}

export default connect(({ fetchingSongs, songs }) => ({ fetchingSongs, songs }))(Songs);
