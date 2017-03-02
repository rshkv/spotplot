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
          <div><h3>Loading user data...</h3></div> :
          <div><h3>Welcome, please <a href='/login'>login</a></h3></div> }
      </div>
    );
  }

  componentDidMount() {
    console.log('Login.componentDidMount()');
    console.log(this.props);
    const { dispatch, params } = this.props;
    const { accessToken } = params;
    if (accessToken) {
      dispatch(setToken(accessToken));

      // CONTINUE HERE...
      // http://redux.js.org/docs/advanced/AsyncActions.html
      dispatch(fetchUser());
    }
  }

  componentDidUpdate() {
    console.log('Login.componentDidUpdate()');
    const { user } = this.props;
    if (user) {
      console.log('Houston, we have a user');
      console.log(user);
      hashHistory.push('/songs');
    }
  }
}

export default connect(({ fetchingUser, user }) => ({ fetchingUser, user }))(Login);
