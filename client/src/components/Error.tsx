import * as React from 'react';

const Error = (props) => {
  const { error } = props.params;
  return (
    <div className="container">
      <h1>Error</h1>
      <p>{error}</p>
    </div>
  );
};

export default Error;
