import React, { Component } from 'react';
import Sound from 'react-sound';
import './Player.scss';

export default class Player extends Component {

  constructor() {
    super();
    this.state = { loaded: false };
  }

  // Unset `laoded` if a new track is loaded
  componentWillReceiveProps(nextProps) {
    const { loaded } = this.state;
    const { track } = this.props;
    const nextTrack = nextProps.track;
    this.setState({ loaded: loaded && track.id === nextTrack.id });
  }

  render() {
    const { track, playing, togglePlaying } = this.props;
    const { loading, loaded } = this.state;

    const size = { width: 250, height: 330, };
    const trackName = track.name;
    const trackArtists = track.artists.map(a => a.name).join(', ');
    const imgUrl = track.album.images[1].url;

    const onLoading = ({ loaded }) => {
      this.setState({ loaded });
    };

    if (track.preview_url === null) {
      console.error('Encountered null track url');
      console.error(track);
    }

    // TODO: Show loading progress
    // https://github.com/leoasis/react-sound/issues/20
    return (
      <div className="player">
        <div className="main">
          <div>
            <button
              className={`play-button ${playing ? 'playing' : 'paused'}`}
              onClick={togglePlaying}
            />
          </div>
          <div className="info">
            <div className="track-name">{trackName}</div>
            <div className="track-artists">{trackArtists}</div>
          </div>
        </div>
        <img src={imgUrl} />
        <Sound
          url={track.preview_url}
          playStatus={!loaded || (playing && loaded) ? Sound.status.PLAYING : Sound.status.STOPPED}
          onFinishedPlaying={togglePlaying}
          volume={80}
          onLoading={onLoading}
        />
      </div>
    );
  }

}
