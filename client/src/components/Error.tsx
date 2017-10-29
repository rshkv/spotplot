import * as React from 'react';

const Error = ({ match }) => {
  const { error } = match.params;
  return (
    <div className="container">
      <h1>Error</h1>
      <p>{error}</p>
    </div>
  );
};

export default Error;
