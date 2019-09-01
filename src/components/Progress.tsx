import * as NProgress from 'nprogress';
import 'nprogress/nprogress.css';  // tslint:disable-line no-submodule-imports
import * as React from 'react';

export interface IProgressProps {
  parent?: string;
  progress?: number;
}

export default class Progress extends React.Component<IProgressProps, {}> {

  public componentWillReceiveProps(nextProps: IProgressProps): void {
    const { progress } = nextProps;
    if (progress) NProgress.set(progress);
  }

  public render(): React.ReactNode {
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
