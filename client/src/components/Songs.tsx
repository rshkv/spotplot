import * as React from 'react';
import { connect } from 'react-redux';
import { fetchSongs } from '../reducer/actions';
import Network from './Network';
import Player from './Player';
import Progress from './Progress';

export interface ISongsProps {
  dispatch: any;
  accessToken: string;
  network: any;
  fetchingSongs: boolean;
}

export interface ISongsState {
  playing: boolean;
  selectedNode: any;  // TODO
}

class Songs extends React.Component<ISongsProps, ISongsState> {

  constructor(props) {
    super(props);
    this.state = {
      selectedNode: null,
      playing: false,
    };
  }

  public componentWillMount() {
    const { dispatch, accessToken } = this.props;
    dispatch(fetchSongs(accessToken));
  }

  public render() {
    const { network, fetchingSongs } = this.props;
    const { playing, selectedNode } = this.state;

    const onSelect = (d) => {
      this.setState({ selectedNode: d });
    };

    const togglePlaying = () => {
      this.setState({ playing: !this.state.playing });
    };

    return (
      <div className="container">
        <div className="network">
          <Network network={network} onSelect={onSelect} onClick={togglePlaying} />
        </div>
        {selectedNode &&
          <Player node={selectedNode} playing={playing} togglePlaying={togglePlaying} />
        }
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
