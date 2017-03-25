import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import * as d3 from 'd3';
import colors from '!!sass-variable-loader!../main.scss';

export default class Network extends Component {

  constructor() {
    super();
    this.state = { selectedNode: null };
    this.artistRadius = () => 1;
    this.trackRadius = (d) => Math.sqrt(d.popularity);
    this.radius = (d) => (
      (d.type === 'track') ? this.trackRadius(d) : this.artistRadius(d)
    );
  }

  render() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    return <canvas ref="network" width={width} height={height} />;
  }

  componentDidMount() {
    const { onSelect, onClick } = this.props;
    const canvas = ReactDOM.findDOMNode(this.refs.network);
    const { width, height } = canvas;

    const linkForce = d3.forceLink()
      .id(d => d.id)
      .distance(l => 1 + this.trackRadius(l.source) + this.artistRadius(l.target));

    const collideForce = d3.forceCollide()
      .radius(d => this.radius(d) + 1)
      .iterations(2);

    const xForce = d3.forceX().strength(0.05);

    const yForce = d3.forceY().strength(0.05);

    const chargeForce = d3.forceManyBody()
      .strength(d => (d.type === 'artist') ? -30 : 0);

    const ticked = () => {
      this.g.selectAll('.node')
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);
    };

    this.simulation = d3.forceSimulation()
      .alphaDecay(0.006)
      .force('link', linkForce)
      .force('collide', collideForce)
      .force('x', xForce)
      .force('y', yForce)
      .force('charge', chargeForce);

    const nodeUnderMouse = (event) => {
      const x = event.x - width / 2;
      const y = event.y - height / 2;
      const closestNode = this.simulation.find(x, y);

      const isUnderMouse = (node) => {
        const sqNodeRadius = Math.pow(this.radius(node), 2);
        const sqDiffX = Math.pow(x - node.x, 2);
        const sqDiffY = Math.pow(y - node.y, 2);
        return (sqDiffX + sqDiffY) <= sqNodeRadius;
      };

      return (isUnderMouse(closestNode) && closestNode);
    };

    d3.select(canvas)
      .on('mousemove', () => {
        const node = nodeUnderMouse(d3.event);
        if (node && node !== this.selectedNode) {
          this.setState({ selectedNode: node });
          onSelect(node);
        }
      })
      .on('click', () => {
        const node = nodeUnderMouse(d3.event);
        if (node) onClick(this.selectedNode);
      });

  }

  shouldComponentUpdate(nextProps, nextState) {
    const { network, onClick } = nextProps;
    const { selectedNode } = nextState;
    const { tracks, artists, links } = network;
    const nodes = [...tracks, ...artists];
    const ctx = ReactDOM.findDOMNode(this.refs.network)
      .getContext('2d');
    const { width, height } = ctx.canvas;

    const drawNode = (d) => {
      ctx.moveTo(d.x, d.y);
      ctx.arc(d.x, d.y, this.radius(d), 0, 2 * Math.PI);
    };

    const drawNetwork = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.save();
      ctx.translate(width / 2, height / 2);

      ctx.fillStyle = colors.green;
      ctx.beginPath();
      tracks.forEach(drawNode);
      ctx.fill();

      ctx.fillStyle = colors.blue;
      ctx.beginPath();
      artists.forEach(drawNode);
      ctx.fill();

      if (selectedNode) {
        ctx.fillStyle = colors.lightGreen;
        ctx.beginPath();
        drawNode(selectedNode);
        ctx.fill();
      };

      ctx.restore();
    };

    this.simulation
      .nodes(nodes)
      .on('tick', drawNetwork);

    this.simulation
      .force('link')
      .links(links);

    drawNetwork();
    return false;
  }
}
