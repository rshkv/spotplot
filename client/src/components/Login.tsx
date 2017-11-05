import * as qs from 'query-string';
import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect, match as Match, RouteProps } from 'react-router-dom';
import * as Redux from 'redux';
import { setToken } from '../reducer/actions';
import Api from '../reducer/Api';
import { IStoreState } from '../types';

export interface ILoginProps extends RouteProps {
  dispatch: Redux.Dispatch<IStoreState>;
  match: Match<{ callbackHash?: string }>;
  accessToken: string;
}

class Login extends React.Component<ILoginProps, {}> {

  public componentDidMount() {
    const { dispatch, match } = this.props;
    const { callbackHash } = match.params;
    const { access_token } = qs.parse(callbackHash);

    if (access_token) {
      dispatch(setToken(access_token));
    }
  }

  public render() {
    const { accessToken } = this.props;

    if (accessToken) {
      return (<Redirect to="/selection" />);
    } else {
      const loginUri = Api.authorizeUrl();

      return (
        <div className="d-flex justify-content-center align-items-center h-100">
          <div className="display-3 m-3 w-25 text-center">
            Spotplot
        </div>
          <div className="d-flex flex-column align-items-center w-25 m-3">
            <p className="text-justify">
              Spotplot is a new way to sift through your music on Spotify.
            Spot the musicians and collaborations behind the music you love.
            Spotplot can display playlists or your library songs.
            To get started, please login:
          </p>
            <div>
              <a href={loginUri} className="button">LOGIN</a>
            </div>
          </div>
        </div>
      );
    }
  }
}

export default connect(({ accessToken }) => ({ accessToken }))(Login);
