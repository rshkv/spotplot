import React, { Component } from 'react';
import Sound from 'react-sound';
import '../player.scss';

export class Player extends Component {

  render() {
    const { track, playing, togglePlaying } = this.props;

    const size = { width: 250, height: 330, };
    const trackName = track.name;
    const trackArtists = track.artists.map(a => a.name).join(', ');
    const imgUrl = track.album.images[1].url;

    const onLoading = (bytesLoaded, bytesTotal, duration) => {
      console.log('loading...');
      console.log({ ...bytesLoaded });
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
          playStatus={playing ? Sound.status.PLAYING : Sound.status.STOPPED}
          onFinishedPlaying={togglePlaying}
          volume={80}
          onLoading={onLoading}
        />
      </div>
    );
  }

}
