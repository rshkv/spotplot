import * as React from 'react';
import { connect } from 'react-redux';
import { match as Match } from 'react-router-dom';
import { fetchPlaylist } from '../reducer/actions';
import {  IStoreState } from '../types';
import Songs, { ISongsProps } from './Songs';

interface IPlaylistSongsProps extends ISongsProps {
  match: Match<{ playlistId: string }>;
}

class PlaylistSongs extends Songs<IPlaylistSongsProps> {
  protected fetch: () => any;

  constructor(props: IPlaylistSongsProps) {
    super(props);
    this.fetch = () => {
      const { playlistId } = this.props.match.params;
      return fetchPlaylist(playlistId);
    };
  }
}

const mapStateToProps = ({ isFetchingSongs, network, isPlaying }: IStoreState): Partial<ISongsProps> => ({
  isFetchingSongs,
  network,
  isPlaying,
});

export default connect(mapStateToProps)(PlaylistSongs);
