import React, { Component } from 'react';
import { connect } from 'react-redux';
import Login from './Login';
import Songs from './Songs';

class App extends Component {

  render() {
    const { children } = this.props;

    return (
      <div className="app">
        { children }
      </div>
    );
  }

}

export default connect(state => state)(App);
