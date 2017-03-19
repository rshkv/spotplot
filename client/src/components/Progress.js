import React, { Component } from 'react';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

export default class Progress extends Component {

  render() {
    const { parent } = this.props;
    NProgress.configure({
      showSpinner: false,
      parent: parent || 'body',
    });
    NProgress.start();
    return null;
  }

  componentWillUnmount() {
    NProgress.done();
  }

}
