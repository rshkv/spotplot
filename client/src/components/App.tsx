import * as React from 'react';

const App = (props) => {
  const { children } = props;
  return (
    <div className="app">
      {children}
    </div>
  );
};

export default App;
