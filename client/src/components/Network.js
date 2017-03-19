import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import * as d3 from 'd3';

export default class Network extends Component {

  constructor() {
    super();
    this.artistRadius = () => 1;
    this.trackRadius = (d) => Math.sqrt(d.popularity);
  }

  render() {
    return (
      <svg width="100%" height="100%">
        <g ref="network" />
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

    const linkForce = d3.forceLink()
      .id(d => d.id)
      .distance(l => 1 + this.trackRadius(l.source) + this.artistRadius(l.target));

    const collideForce = d3.forceCollide()
      .radius(d => ((d.type === 'track') ? this.trackRadius(d) : this.artistRadius(d)) + 1)
      .iterations(2)

    const xForce = d3.forceX().strength(0.05)

    const yForce = d3.forceY().strength(0.05)

    const chargeForce = d3.forceManyBody()
      .strength(d => (d.type === 'artist') ? -30 : 0)

    const tick = () => {
      this.g.selectAll('.node')
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);
    }

    this.simulation = d3.forceSimulation()
      .force('link', linkForce)
      .force('collide', collideForce)
      .force('x', xForce)
      .force('y', yForce)
      .force('charge', chargeForce)
      .on('tick', tick);
  }

  shouldComponentUpdate(nextProps) {
    const { network, onHover, onClick } = nextProps;
    const { tracks, artists, links } = network;

    const combinedNodes = [...artists, ...tracks];


    this.g.selectAll('.node')
      .data(combinedNodes)
      .enter().append('circle')
      .attr('class', d => `node ${d.type}`)
      .style('fill-opacity', 0)
      .transition()
      .duration((d, i) => (i % 50) * 10)
      .style('fill-opacity', 1)

    this.g.selectAll('.track.node')
      .attr('r', this.trackRadius)
      .on('mouseover', onHover)
      .on('click', onClick);

    this.g.selectAll('.artist.node')
      .attr('r', this.artistRadius)
      .on('mouseover', d => { console.log(d.name); });

    this.simulation
      .nodes(combinedNodes)

    this.simulation
      .force('link')
      .links(links)

    this.simulation
      .alpha(1).restart();

    return false;
  }
}
