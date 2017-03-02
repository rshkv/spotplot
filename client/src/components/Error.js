import React, { Component } from 'react';

export default class Error extends Component {
  render() {
    const { error } = this.props.params;
    return (
      <div>
        <h1>Error</h1>
        <p>{error}</p>
      </div>
    );
  }
}
