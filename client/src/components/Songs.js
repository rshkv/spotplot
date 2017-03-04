import React, { Component } from 'react';
import { connect } from 'react-redux';
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
      <div>
        <div className="container songs">
          {fetchingSongs && <p className="subtitle">Loading songs...</p>}
        </div>
        <div className="network">
          <Network songs={songs}/>
        </div>
      </div>
    );
  }
}

export default connect(({ fetchingSongs, songs }) => ({ fetchingSongs, songs }))(Songs);
