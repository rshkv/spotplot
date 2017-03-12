import React, { Component } from 'react';
import Sound from 'react-sound';
import '../player.scss';

export class OldPlayer extends Component {

  render() {
    const { uri } = this.props;
    return (
      <iframe
        ref="iframe"
        src={`https://embed.spotify.com/?uri=${uri}`}
        width="250" height="330"
        frameBorder="0"
        allowTransparency="true"
      />
    );
  }

}

export class Player extends Component {
  constructor(props) {
    super(props);
    this.state = { playing: false, };
  }

  render() {
    const { track } = this.props;
    const { playing } = this.state;

    const size = { width: 250, height: 330, };
    const trackName = track.name;
    const trackArtists = track.artists.map(a => a.name).join(', ');
    const imgUrl = track.album.images[1].url;

    const togglePlaying = () => { this.setState({ playing: !playing }); }
    const onLoading = (bytesLoaded, bytesTotal, duration) => {
      console.log(`loaded: ${bytesLoaded}, total: ${bytesTotal}, duration: ${duration}`);
    }

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
          onFinishedPlaying={() => { console.log('Yop, done'); }}
          volume={80}
          onLoading={onLoading}
        />
      </div>
    );
  }

}
