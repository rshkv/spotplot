import * as React from 'react';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

export default class Progress extends React.Component {

  public componentWillReceiveProps(nextProps) {
    const { progress } = nextProps;
    if (progress) NProgress.set(progress);
  }

  public render() {
    return null;
  }

  public componentDidMount() {
    const { parent, progress } = this.props;

    NProgress.configure({
      showSpinner: false,
      parent: parent || 'body',
      minimum: (progress === undefined) ? 0.08 : 0,  // Trickle seems to break with minimum: 0
      trickle: (progress === undefined) ? true : false,
    });
    NProgress.start();
    if (progress) NProgress.set(progress);
  }

  public componentWillUnmount() {
    NProgress.done();
  }

}
