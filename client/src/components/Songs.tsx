import * as React from 'react';
import { connect } from 'react-redux';
import { fetchSongs, togglePlay } from '../reducer/actions';
import { Artist, INetwork, Track } from '../types';
import Network from './Network';
import Player from './Player';
import Progress from './Progress';

export interface ISongsProps {
  dispatch: any;
  accessToken: string;
  network: INetwork;
  fetchingSongs: boolean;
}

export interface ISongsState {
  selectedNode?: Track | Artist;
}

/* tslint:disable no-console */

class Songs extends React.Component<ISongsProps, ISongsState> {

  constructor(props) {
    super(props);
    this.state = {
      selectedNode: null,
    };
  }

  public componentWillMount() {
    const { dispatch, accessToken } = this.props;
    dispatch(fetchSongs(accessToken));
  }

  public render() {
    const { dispatch, accessToken, network, fetchingSongs } = this.props;
    const { selectedNode } = this.state;
    const onSelect = (d: Artist | Track) => { this.setState({ selectedNode: d }); };
    const togglePlaying = (d: Artist | Track) => {
      if (d.type === 'track') dispatch(togglePlay(accessToken, d));
    };

    return (
      <div className="container">
        <div className="network">
          <Network network={network} onSelect={onSelect} onClick={togglePlaying} />
        </div>
        {/* {selectedNode &&
          <Player node={selectedNode} shouldPlay={shouldPlay} togglePlaying={this.togglePlaying.bind(this)} />
        } */}
        <div className="songs">
          {fetchingSongs && <p className="subtitle">Loading songs...</p>}
          {fetchingSongs && <Progress />}
        </div>
      </div>
    );
  }
}

export default connect(({ fetchingSongs, network, accessToken }) => (
  { fetchingSongs, network, accessToken }
))(Songs);
