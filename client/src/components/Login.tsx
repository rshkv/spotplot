import * as React from 'react';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router';
import { setToken } from '../reducer/actions';


class Login extends React.Component {

  public componentDidMount() {
    const { dispatch, params } = this.props;
    const { accessToken } = params;
    if (accessToken) {
      dispatch(setToken(accessToken));
    }
  }

  public componentDidUpdate() {
    const { accessToken } = this.props;
    if (accessToken) {
      hashHistory.push('/songs');
    }
  }

  public render() {
    return (
      <div className="container">
        <div className="login">
          <h1 className="title">Spotplot</h1>
          <p className="subtitle">Welcome, please <a href="/login">login</a></p>
        </div>
      </div>
    );
  }
}

export default connect(({ accessToken }) => ({ accessToken }))(Login);
