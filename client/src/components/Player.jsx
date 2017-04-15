import React, { Component } from 'react';
import Sound from 'react-sound';
import Progress from './Progress';
import './Player.scss';

export default class Player extends Component {

  constructor() {
    super();
    this.state = {
      loaded: false,
      progress: 0.0,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { loaded } = this.state;
    const { track } = this.props;
    const nextTrack = nextProps.track;

    // Unset `loaded` if a new track is loaded
    if (track.id !== nextTrack.id) {
      this.setState({
        loaded: loaded && track.id === nextTrack.id,
        progress: 0.0,
      });
    }

    // Check if track has `preview_url`
    if (track.preview_url === null) {
      console.error('Encountered null track url', track);
    }
  }

  render() {
    const { track, playing, togglePlaying } = this.props;
    const { loaded, progress } = this.state;

    const size = { width: 250, height: 330, };
    const trackName = track.name;
    const trackArtists = track.artists.map(a => a.name).join(', ');
    const imgUrl = track.album.images[1].url;

    const onLoading = ({ loaded, bytesLoaded }) => {
      this.setState({ loaded, progress: bytesLoaded });
    };

    return (
      <div className="player">
        <div className="main">
          <div>
            {track.preview_url &&
              <button
                className={`play-button ${playing ? 'playing' : 'paused'}`}
                onClick={togglePlaying}
              />
            }
          </div>
          <div className="info">
            <div className="track-name">{trackName}</div>
            <div className="track-artists">{trackArtists}</div>
          </div>
        </div>
        <img src={imgUrl} />
        {!loaded && track.preview_url &&
          <Progress parent={'.player'} progress={progress} />
        }
        {track.preview_url &&
          <Sound
            url={track.preview_url}
            playStatus={!loaded || (playing && loaded) ? Sound.status.PLAYING : Sound.status.STOPPED}
            onFinishedPlaying={togglePlaying}
            volume={80}
            onLoading={onLoading}
          />
        }
      </div>
    );
  }
}
