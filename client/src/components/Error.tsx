import * as React from 'react';
import { RouteComponentProps } from 'react-router';

interface MatchParams {
  error: string;
}

export default class Error extends React.Component<RouteComponentProps<MatchParams>> {
  render() {
    const { error } = this.props.match.params;
    return (
      <div className="container">
        <h1>Error</h1>
        <p>{error}</p>
      </div>
    );
  }
}
