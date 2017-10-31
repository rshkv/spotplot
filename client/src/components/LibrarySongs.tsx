import * as React from 'react';
import { connect } from 'react-redux';
import { fetchSongs } from '../reducer/actions';
import { IStoreState } from '../types';
import Songs, { ISongsProps } from './Songs';

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
