import * as React from 'react';
import * as d3 from 'd3';
// tslint:disable-next-line no-var-requires no-submodule-imports
const colors = require('!!sass-variable-loader!../main.scss');

export interface INetworkProps {
  network: any;  // TODO
  onSelect: (d: any) => void;
  onClick: (d: any) => void;
}

export default class Network extends React.Component<INetworkProps, {}> {
  private artistRadius: (d: any) => number;
  private trackRadius: (d: any) => number;
  private radius: (d: any) => number;
  private transform: d3.ZoomTransform;
  private network: HTMLCanvasElement;
  private simulation;
  private selectedTrack;

  constructor() {
    super();
    this.state = { selectedTrack: null };
    this.artistRadius = () => 3;
    this.trackRadius = d => Math.max(Math.sqrt(d.popularity), 3);
    this.radius = d => (
      (d.type === 'track') ? this.trackRadius(d) : this.artistRadius(d)
    );
    this.transform = d3.zoomIdentity;
  }

  public componentDidMount() {
    const { onSelect, onClick } = this.props;
    const canvas = this.network;
    const { width, height } = canvas;

    const linkForce = d3.forceLink<any, any>()
      .id(d => d.id)
      .distance(l => 1 + this.trackRadius(l.source) + this.artistRadius(l.target));

    const collideForce = d3.forceCollide()
      .radius(d => this.radius(d) + 1);

    const xForce = d3.forceX().strength(0.06);

    const yForce = d3.forceY().strength(0.06);

    const chargeForce = d3.forceManyBody<any>()
      .strength(d => ((d.type === 'artist') ? -35 : -10));

    this.simulation = d3.forceSimulation()
      .alphaDecay(0.006)
      .force('link', linkForce)
      .force('collide', collideForce)
      .force('x', xForce)
      .force('y', yForce)
      .force('charge', chargeForce);

    const nodeUnderMouse = () => {
      const x = this.transform.invertX(d3.event.x) - (width / 2);
      const y = this.transform.invertY(d3.event.y) - (height / 2);
      const closestNode = this.simulation.find(x, y);

      const isUnderMouse = (node) => {
        const sqNodeRadius = this.radius(node) ** 2;
        const sqDiffX = (x - node.x) ** 2;
        const sqDiffY = (y - node.y) ** 2;
        return (sqDiffX + sqDiffY) <= sqNodeRadius;
      };

      return (!!closestNode && isUnderMouse(closestNode) && closestNode);
    };

    d3.select(canvas)
      .on('mousemove', () => {
        const node = nodeUnderMouse();
        if (node && node !== this.selectedTrack) {
          if (node.type === 'track') this.setState({ selectedTrack: node });
          onSelect(node);
        }
      })
      .on('click', () => {
        const node = nodeUnderMouse();
        if (node) onClick(this.selectedTrack);
      });
  }

  public shouldComponentUpdate(nextProps, nextState) {
    const { network } = nextProps;
    const { selectedTrack } = nextState;
    const { tracks, artists, links } = network;
    const nodes = [...tracks, ...artists];
    const canvas = this.network;
    const ctx = canvas.getContext('2d');
    const { width, height } = ctx.canvas;

    const drawNode = (d) => {
      ctx.moveTo(d.x, d.y);
      ctx.arc(d.x, d.y, this.radius(d), 0, 2 * Math.PI);
    };

    const drawLine = (d) => {
      ctx.moveTo(d.source.x, d.source.y);
      ctx.lineTo(d.target.x, d.target.y);
    };

    const drawNetwork = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.save();
      ctx.translate(this.transform.x, this.transform.y);
      ctx.scale(this.transform.k, this.transform.k);
      ctx.translate(width / 2, height / 2);

      ctx.strokeStyle = colors.blue;
      ctx.beginPath();
      links.forEach(drawLine);
      ctx.stroke();

      ctx.fillStyle = colors.green;
      ctx.beginPath();
      tracks.forEach(drawNode);
      ctx.fill();

      ctx.fillStyle = colors.blue;
      ctx.beginPath();
      artists.forEach(drawNode);
      ctx.fill();

      if (selectedTrack) {
        ctx.fillStyle = colors.lightGreen;
        ctx.shadowColor = colors.green;
        ctx.shadowBlur = 20;
        ctx.beginPath();
        drawNode(selectedTrack);
        ctx.fill();
      }

      ctx.restore();
    };

    this.simulation
      .nodes(nodes)
      .on('tick', drawNetwork);

    this.simulation
      .force('link')
      .links(links);

    const zoomed = () => {
      this.transform = d3.event.transform;
      drawNetwork();
    };

    d3.select(canvas)
      .call(d3.zoom()
        .scaleExtent([0.5, 2])
        .on('zoom', zoomed));

    // this causes lag on rerendering
    drawNetwork();
    return false;
  }

  public render() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    return <canvas ref={(c) => { this.network = c; }} width={width} height={height} />;
  }
}
