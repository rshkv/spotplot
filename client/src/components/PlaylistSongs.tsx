import * as React from 'react';
import { connect } from 'react-redux';
import { match as Match } from 'react-router-dom';
import { fetchPlaylist } from '../reducer/actions';
import {  IStoreState } from '../types';
import Songs, { ISongsProps } from './Songs';

interface IPlaylistSongsProps extends ISongsProps {
  match: Match<{ user: string, playlist: string }>;
}

class PlaylistSongs extends Songs<IPlaylistSongsProps> {
  protected fetch: () => any;

  constructor(props: IPlaylistSongsProps) {
    super(props);
    this.fetch = () => {
      const { user, playlist } = this.props.match.params;
      return fetchPlaylist(user, playlist);
    };
  }
}

const mapStateToProps = ({ isFetchingSongs, network, isPlaying }: IStoreState): Partial<ISongsProps> => ({
  isFetchingSongs,
  network,
  isPlaying,
});

export default connect(mapStateToProps)(PlaylistSongs);
