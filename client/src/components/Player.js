import React, { Component } from 'react';

export default class Player extends Component {

  render() {
    const { uri } = this.props;
    return (
      <iframe
        src={`https://embed.spotify.com/?uri=${uri}`}
        width="250" height="330"
        frameBorder="0"
        allowTransparency="true"
      />
    );
  }

}
