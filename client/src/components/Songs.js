import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchSongs } from '../reducer/actions';
import * as d3 from 'd3';

class Songs extends Component {

  componentWillMount() {
    console.log('Songs.componentWillMount()');

    const { dispatch } = this.props;
    dispatch(fetchSongs());
  }

  render() {
    console.log('Songs.render()');

    const { songs } = this.props;
    return (
      <div className="songs">
        <h1>Songs</h1>
        <p>Amazing network animations go here</p>
        <div className="network">
          {songs
            .sort((a, b) => b.popularity - a.popularity)
            .map((s, i) => (<p key={i}>{s.name}: {s.popularity}</p>))
          }
        </div>
      </div>
    );
  }

  componentDidMount() {
    console.log('Songs.componentDidMount()');

    // D3 Code goes here
    console.log(d3);
  }
}

export default connect(({ user, fetchingSongs, songs }) => ({ user, fetchingSongs, songs }))(Songs);
