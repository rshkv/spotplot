import * as React from 'react';
import { connect } from 'react-redux';
import { fetchSongs } from '../reducer/actions';
import { INetwork } from '../types';
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
  shouldPlay: boolean;
  selectedNode?: SpotifyApi.TrackObjectFull;
}

/* tslint:disable no-console */

class Songs extends React.Component<ISongsProps, ISongsState> {

  constructor(props) {
    super(props);
    this.state = {
      selectedNode: null,
      shouldPlay: false,
    };
  }

  public componentWillMount() {
    const { dispatch, accessToken } = this.props;
    dispatch(fetchSongs(accessToken));
  }

  /** Update selected node and reset playing status if the node changed.
   *  Safari and Chrome do not allow autoply.
   */
  public onSelect(d) {
    const { shouldPlay, selectedNode } = this.state;
    console.log(this.state);
    this.setState({
      selectedNode: d,
      shouldPlay: shouldPlay && (d.id === selectedNode.id),
    });
    if (selectedNode) console.log(shouldPlay && (d.id === selectedNode.id));
    console.log('on select');
    console.log(this.state);
  }

  public togglePlaying() {
    const {shouldPlay} = this.state;
    console.log(this.state);
    this.setState({ shouldPlay: !shouldPlay });
    console.log('toggle');
    console.log(this.state);
  }

  public render() {
    const { network, fetchingSongs } = this.props;
    const { shouldPlay, selectedNode } = this.state;

    return (
      <div className="container">
        <div className="network">
          <Network network={network} onSelect={this.onSelect.bind(this)} onClick={this.togglePlaying.bind(this)} />
        </div>
        {selectedNode &&
          <Player node={selectedNode} shouldPlay={shouldPlay} togglePlaying={this.togglePlaying.bind(this)} />
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
