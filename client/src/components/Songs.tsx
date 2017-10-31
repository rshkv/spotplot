import * as React from 'react';
import { togglePlay } from '../reducer/actions';
import { Artist, INetwork, Track, isTrack } from '../types';
import Network from './Network';
import Player from './Player';
import Progress from './Progress';

export interface ISongsProps {
  dispatch: any;
  network: INetwork;
  isFetchingSongs: boolean;
  isPlaying: boolean;
}

export interface ISongsState {
  selectedNode?: Track | Artist;
  displayNode?: Track | Artist;
}

class Songs<T extends ISongsProps> extends React.Component<T, ISongsState> {
  protected fetch: () => any;

  constructor(props) {
    super(props);
    this.state = { selectedNode: null };
  }

  public componentWillMount() {
    const { dispatch } = this.props;
    dispatch(this.fetch());
  }

  public render() {
    const { dispatch, network, isFetchingSongs, isPlaying } = this.props;
    const { selectedNode } = this.state;
    const onSelect = (d: Artist | Track) => { this.setState({ selectedNode: d }); };
    const onUnselect = () => { this.setState({ selectedNode: null }); };
    const togglePlaying = () => {
      const node = this.state.selectedNode;
      if (node && isTrack(node)) dispatch(togglePlay(node as Track));
      else dispatch(togglePlay());
    };

    return (
      <div className="container">
        <div className="network">
          <Network network={network} onSelect={onSelect} onUnselect={onUnselect} onClick={togglePlaying} />
        </div>
        {(selectedNode || isPlaying) && <Player selectedNode={selectedNode} togglePlaying={togglePlaying} />}
        <div className="songs">
          {isFetchingSongs && <p className="subtitle">Loading songs...</p>}
          {isFetchingSongs && <Progress />}
        </div>
      </div>
    );
  }
}

export default Songs;
