import React, { Component } from 'react';
import { connect } from 'react-redux';

class Songs extends Component {

  render() {
    // const { dispatch, params } = this.props;
    console.log('Songs.render()');
    return (
      <div>
        <h1>Songs</h1>
        <p>Amazing network animations go here</p>
        <div className="network">
        </div>
      </div>
    );
  }

  componentDidMount() {
    // d3 Code goes here
    console.log('Songs.componentDidMount()');
  }
}

export default connect(state => state)(Songs);
