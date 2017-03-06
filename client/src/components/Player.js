import React, { Component } from 'react';
// import Sound from 'react-sound';
import '../player.less';


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

  render() {
    const { track } = this.props;
    const size = { width: 250, height: 330, };
    const trackName = track.name;
    const trackArtists = track.artists.map(a => a.name).join(', ');
    const imgUrl = track.album.images[1].url;

    return (
      <div className="player">
        <div className="main">
          <button className="play-button"></button>
          <div className="info">
            <div className="track-name">{trackName}</div>
            <div className="track-artists">{trackArtists}</div>
          </div>
        </div>
        <img src={imgUrl} width={size.width} height={size.width}/>
      </div>
    );
  }

}
