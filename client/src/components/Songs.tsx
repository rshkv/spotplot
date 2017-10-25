import * as React from 'react';
import { connect } from 'react-redux';
import { fetchSongs, togglePlay } from '../reducer/actions';
import { Artist, INetwork, Track, IStoreState } from '../types';
import Network from './Network';
import Player from './Player';
import Progress from './Progress';

export interface ISongsProps {
  dispatch: any;
  network: INetwork;
  isFetchingSongs: boolean;
}

export interface ISongsState {
  selectedNode?: Track | Artist;
}

class Songs extends React.Component<ISongsProps, ISongsState> {

  constructor(props) {
    super(props);
    this.state = {
      selectedNode: null,
    };
  }

  public componentWillMount() {
    const { dispatch } = this.props;
    dispatch(fetchSongs());
  }

  public render() {
    const { dispatch, network, isFetchingSongs } = this.props;
    const { selectedNode } = this.state;
    const onSelect = (d: Artist | Track) => { this.setState({ selectedNode: d }); };
    const togglePlaying = () => {
      if (this.state.selectedNode.type === 'track') dispatch(togglePlay(this.state.selectedNode));
    };

    return (
      <div className="container">
        <div className="network">
          <Network network={network} onSelect={onSelect} onClick={togglePlaying} />
        </div>
        {selectedNode &&
          <Player node={selectedNode} togglePlaying={togglePlaying} />
        }
        <div className="songs">
          {isFetchingSongs && <p className="subtitle">Loading songs...</p>}
          {isFetchingSongs && <Progress />}
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ isFetchingSongs, network }: IStoreState): Partial<ISongsProps> => ({
  isFetchingSongs,
  network,
});

export default connect(mapStateToProps)(Songs);
