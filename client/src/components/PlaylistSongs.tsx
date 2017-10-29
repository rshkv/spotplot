import * as React from 'react';
import { connect } from 'react-redux';
import { match as Match } from 'react-router-dom';
import { fetchSongs, togglePlay } from '../reducer/actions';
import { Artist, INetwork, Track, IStoreState, isTrack } from '../types';
import Network from './Network';
import Player from './Player';
import Progress from './Progress';
import Songs, { ISongsProps, ISongsState } from './Songs';

interface IPlaylistSongsProps extends ISongsProps {
  dispatch: any;
  network: INetwork;
  isFetchingSongs: boolean;
  isPlaying: boolean;
  match: Match<{ uri: string }>;
}

class PlaylistSongs extends Songs<IPlaylistSongsProps> {
  protected fetch: () => any;

  constructor(props) {
    super(props);
    this.fetch = () => {
      const { uri } = this.props.match.params;
      console.log(uri);
      return fetchSongs();
    };
  }
}

const mapStateToProps = ({ isFetchingSongs, network, isPlaying }: IStoreState): Partial<ISongsProps> => ({
  isFetchingSongs,
  network,
  isPlaying,
});

export default connect(mapStateToProps)(PlaylistSongs);
