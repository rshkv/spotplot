import * as React from 'react';

export default class App extends React.Component<{ children: React.ReactNode }> {
  render() {
    const { children } = this.props;
    return (
      <div className="app">
        {children}
      </div>
    );
  }
}
