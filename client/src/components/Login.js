import React, { Component } from 'react';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router';
import { setToken, fetchUser } from '../reducer/actions';

class Login extends Component {

  render() {
    const { fetchingUser } = this.props;
    return (
      <div className="login">
        <h1>Spotplot</h1>
        { fetchingUser ?
          <p>Loading user data...</p> :
          <p>Welcome, please <a href='/login'>login</a></p> }
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
