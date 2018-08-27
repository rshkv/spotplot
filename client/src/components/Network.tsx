import * as d3 from 'd3';
import * as React from 'react';
// tslint:disable-next-line no-var-requires no-submodule-imports no-implicit-dependencies
const colors = require('!!sass-variable-loader!../main.scss');
import { INetwork, Track, Artist, isTrack, ILink } from '../types';

export interface INetworkProps {
  network: INetwork;
  onSelect: (d: Track | Artist) => void;
  onUnselect: () => void;
  onClick: (d: any) => void;
}

export interface INetworkState {
  selectedNode: Track | Artist;
}

type NodeDatum = d3.SimulationNodeDatum & (Track | Artist);
type LinkDatum = d3.SimulationLinkDatum<NodeDatum>;

export default class Network extends React.Component<INetworkProps, INetworkState> {

  private maxRadius: number = 3;
  private transform: d3.ZoomTransform;
  private network: HTMLCanvasElement;
  private simulation: d3.Simulation<NodeDatum, LinkDatum>;

  constructor(props: Readonly<INetworkProps>) {
    super(props);
    this.state = { selectedNode: null };
    this.transform = d3.zoomIdentity;
  }

  /**
   * Called once the network is added to the DOM. Initializes the node forces
   * (link, collide, charge, and x/y forces to center nodes) and assembles the
   * simulation.
   */
  public componentDidMount(): void {
    // Fix nodes to each other using links
    const linkForce = d3.forceLink<NodeDatum, LinkDatum>()
      .id(d => d.id)
      .distance(l => 1 + this.radius(l.source as NodeDatum) + this.radius(l.target as NodeDatum));
    // Prevent nodes from overlapping
    const collideForce = d3.forceCollide<NodeDatum>()
      .radius(d => this.radius(d) + 1);
    // Position nodes in the center
    const xForce = d3.forceX().strength(0.06);
    const yForce = d3.forceY().strength(0.06);
    // Make nodes repel each other
    const chargeForce = d3.forceManyBody<any>()
      .strength(d => (!isTrack(d) ? -35 : -10));

    // Assemble simulation
    this.simulation = d3.forceSimulation<NodeDatum>()
      .alphaDecay(0.006)
      .force('link', linkForce)
      .force('collide', collideForce)
      .force('x', xForce)
      .force('y', yForce)
      .force('charge', chargeForce);

    this.handleCanvasEvents();
  }

  public shouldComponentUpdate(nextProps: Readonly<INetworkProps>, nextState: Readonly<INetworkState>): boolean {
    const { network } = nextProps;
    const { selectedNode } = nextState;
    const { tracks, artists, links } = network;
    const nodes = [...tracks, ...artists];
    const canvas = this.network;
    const ctx = canvas.getContext('2d');
    const { width, height } = ctx.canvas;

    const drawNode = (d: NodeDatum) => {
      ctx.moveTo(d.x, d.y);
      ctx.arc(d.x, d.y, this.radius(d), 0, 2 * Math.PI);
    };

    const drawLine = (d: LinkDatum) => {
      ctx.moveTo((d.source as NodeDatum).x, (d.source as NodeDatum).y);
      ctx.lineTo((d.target as NodeDatum).x, (d.target as NodeDatum).y);
    };

    const drawNetwork = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.save();
      ctx.translate(this.transform.x, this.transform.y);
      ctx.scale(this.transform.k, this.transform.k);
      ctx.translate(width / 2, height / 2);

      ctx.strokeStyle = colors.green;
      ctx.beginPath();
      links.forEach(drawLine);
      ctx.stroke();

      ctx.fillStyle = colors.blue;
      ctx.beginPath();
      tracks.forEach(drawNode);
      ctx.fill();

      ctx.fillStyle = colors.green;
      ctx.beginPath();
      artists.forEach(drawNode);
      ctx.fill();

      if (selectedNode && isTrack(selectedNode)) {
        ctx.fillStyle = colors.green;
        ctx.shadowColor = colors.green;
        ctx.shadowBlur = 20;
        ctx.beginPath();
        drawNode(selectedNode);
        ctx.fill();
      }

      ctx.restore();
    };

    this.simulation
      .nodes(nodes)
      .on('tick', drawNetwork);

    (this.simulation.force('link') as d3.ForceLink<NodeDatum, LinkDatum>)
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

  public render(): React.ReactNode {
    const width = window.innerWidth;
    const height = window.innerHeight;

    return <canvas ref={(c) => { this.network = c; }} width={width} height={height} />;
  }

  public handleCanvasEvents(): void {
    const { onSelect, onUnselect, onClick } = this.props;
    const canvas = this.network;
    const { width, height } = canvas;

    const nodeUnderMouse = () => {
      const x = this.transform.invertX(d3.event.x) - (width / 2);
      const y = this.transform.invertY(d3.event.y) - (height / 2);
      const closestNode = this.simulation.find(x, y);

      const isUnderMouse = (node: NodeDatum) => {
        const sqNodeRadius = this.radius(node) ** 2;
        const sqDiffX = (x - node.x) ** 2;
        const sqDiffY = (y - node.y) ** 2;
        return (sqDiffX + sqDiffY) <= sqNodeRadius;
      };

      return (!!closestNode && isUnderMouse(closestNode) && closestNode);
    };

    d3.select(canvas)
      .on('mousemove', () => {
        const { selectedNode } = this.state;
        const node = nodeUnderMouse();
        if (node && (!selectedNode || node.uri !== selectedNode.uri)) {
          this.setState({ selectedNode: node });
          onSelect(node);
        } else if (!node && selectedNode) {
          this.setState({ selectedNode: null });
          onUnselect();
        }
      })
      .on('click', () => {
        const node = nodeUnderMouse();
        if (node) onClick(node);
      });
  }

  private radius(d: Artist | Track): number {
    return isTrack(d)
      ? this.maxRadius
      : Math.max(
          Math.sqrt((d as Artist).popularity),
          this.maxRadius);
  }
}
