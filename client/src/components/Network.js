import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import * as d3 from 'd3';

export default class Network extends Component {

  render() {
    return (
      <svg width="100%" height="100%">
        <g ref="network"/>
      </svg>
    );
  }

  componentDidMount() {
    const g = ReactDOM.findDOMNode(this.refs.network);
    const svg = d3.select(g.parentNode);
    const width = parseInt(svg.style('width'), 10);
    const height = parseInt(svg.style('height'), 10);

    this.g = d3.select(g)
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    this.simulation = d3.forceSimulation()
      .alphaDecay(0.01)
      .force('collide', d3.forceCollide()
        .radius(d => Math.sqrt(d.popularity) + 1)
        .iterations(2))
      .force('x', d3.forceX().strength(0.001))
      .force('y', d3.forceY().strength(0.001))
      .force('charge', d3.forceManyBody()
        .strength(d => 0.3)
        .distanceMin(20)
        .distanceMax(200))
      .on('tick', () => {
        this.g.selectAll('.node')
          .attr('cx', d => d.x)
          .attr('cy', d => d.y);
      });
  }

  shouldComponentUpdate(nextProps) {
    const { songs, onHover } = nextProps;

    const nodes = this.g.selectAll('.node')
      .data(songs, s => s.id);

    nodes.enter().append('circle')
      .classed('node', true)
      .attr('r', d => Math.sqrt(d.popularity))
      .on('mouseover', onHover)
      .style('fill-opacity', 0)
      .transition()
      .duration((d, i) => (i % 50) * 10)
      .style('fill-opacity', 1);

    this.simulation
      .nodes(songs)
      .alpha(1).restart();

    return false;
  }
}

