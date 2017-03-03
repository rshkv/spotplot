import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchSongs } from '../reducer/actions';
import * as d3 from 'd3';

class Songs extends Component {

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(fetchSongs());
  }

  render() {
    const { songs, fetchingSongs } = this.props;
    // console.log(`Songs.render() with ${songs.length} songs`);
    // {
    //   songs
    //     .sort((a, b) => b.popularity - a.popularity)
    //     .map((s, i) => (<p key={i}>{s.name}: {s.popularity}</p>))
    // }
    return (
      <div className="songs">
        <div className="container">
          <h1 className="title">Songs</h1>
          {fetchingSongs && <p className="subtitle">Loading songs...</p>}
        </div>
        <svg className="network"></svg>
      </div>
    );
  }

  componentDidUpdate() {
    const { songs, fetchingSongs } = this.props;
    // console.log('Songs.componentDidUpdate()');

    // if (fetchingSongs) return;

    // D3 Code goes here
    // const svg = d3.select('.network').selectAll('svg')
    //   .data([songs]);

    const svg = d3.select('.network');

    const nodes = svg.selectAll('circle')
      .data(songs);

    nodes.enter()
      .append('circle')
      .attr('r', 2)
      .attr('cx', (d, i) => i * 5)
      .attr('cy', (d, i) => i * 5)
      .attr('fill', 'white');

  }
}

export default connect(({ fetchingSongs, songs }) => ({ fetchingSongs, songs }))(Songs);
