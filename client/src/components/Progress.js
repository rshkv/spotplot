import React, { Component } from 'react';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

export default class Progress extends Component {

  componentWillReceiveProps(nextProps) {
    const { progress } = nextProps;
    if (progress) NProgress.set(progress);
  };

  render() {
    return null;
  }

  componentDidMount() {
    const { parent, progress } = this.props;
    console.log(`Progress ${progress}`);
    NProgress.configure({
      showSpinner: false,
      parent: parent || 'body',
      minimum: (progress === undefined) ? 0.08 : 0,  // Trickle seems to break with minimum: 0
      trickle: (progress === undefined) ? true : false,
    });
    NProgress.start();

    if (progress) NProgress.set(progress);
  }

  componentWillUnmount() {
    NProgress.done();
  }

}
