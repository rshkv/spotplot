import React, { Component } from 'react';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router';
import { setToken, fetchUser } from '../reducer/actions';

class Login extends Component {

  render() {
    const { fetchingUser, user } = this.props;
    return (
      <div className="container">
        <div className="login">
          <h1 className="title">Spotplot</h1>
          { fetchingUser || user ?
            <p className="subtitle">Loading user data...</p> :
            <p className="subtitle">Welcome, please <a href='/login'>login</a></p> }
        </div>
      </div>
    );
  }

  componentDidMount() {
    const { dispatch, params } = this.props;
    const { accessToken } = params;
    if (accessToken) {
      dispatch(setToken(accessToken));
      dispatch(fetchUser());
    }
  }

  componentDidUpdate() {
    const { user } = this.props;
    if (user) {
      hashHistory.push('/songs');
    }
  }
}

export default connect(({ fetchingUser, user }) => ({ fetchingUser, user }))(Login);
