import * as React from 'react';
import { connect } from 'react-redux';
import { fetchSongs, togglePlay } from '../reducer/actions';
import { Artist, INetwork, Track, IStoreState, isTrack } from '../types';
import Network from './Network';
import Player from './Player';
import Progress from './Progress';
import Songs, { ISongsProps, ISongsState } from './Songs';

class LibrarySongs extends Songs<ISongsProps> {
  protected fetch: () => any;

  constructor(props) {
    super(props);
    this.fetch = fetchSongs;
  }
}

const mapStateToProps = ({ isFetchingSongs, network, isPlaying }: IStoreState): Partial<ISongsProps> => ({
  isFetchingSongs,
  network,
  isPlaying,
});

export default connect(mapStateToProps)(LibrarySongs);
