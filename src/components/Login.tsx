import * as qs from 'qs';
import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect, match as Match, RouteProps } from 'react-router-dom';
import * as Redux from 'redux';
import { setToken, ITokenAction } from '../reducer/actions';
import Api from '../reducer/api';
import { IStoreState } from '../types';

export interface ILoginProps extends RouteProps {
  dispatch: Redux.Dispatch<ITokenAction>;
  match: Match<{ callbackHash?: string }>;
  accessToken: string;
}

class Login extends React.Component<ILoginProps, {}> {

  /**
   * If this component mounts after authorization callback, the URL will contain
   * the returned access token. If it does, dispatch the token to the store.
   */
  public componentDidMount(): void {
    const { dispatch, match } = this.props;
    const { callbackHash } = match.params;
    const { access_token } = qs.parse(callbackHash) as { access_token?: string };

    if (access_token) {
      dispatch(setToken(access_token));
    }
  }

  public render(): React.ReactNode {
    const { accessToken } = this.props;

    if (accessToken) {
      return (<Redirect to="/selection" />);
    } else {
      const loginUri = Api.authorizeUrl(Login.urlWithoutRoute());

      return (
        <div className="d-flex justify-content-center align-items-center h-100">
          <div className="display-3 m-3 w-25 text-center">
            Spotplot
        </div>
          <div className="d-flex flex-column align-items-center w-25 m-3">
            <p className="text-justify">
              Spotplot is a new way to listen to your Spotify library. Explore with your eyes, enjoy with your ears. Login to get started:
            </p>
            <div>
              <a href={loginUri} className="button">LOGIN</a>
            </div>
          </div>
        </div>
      );
    }
  }

  private static urlWithoutRoute(): string {
    const fullUrl: string = window.location.href;
    return fullUrl.substring(0, fullUrl.indexOf('#'));
  }
}

export default connect(
  ({ accessToken }: IStoreState): Partial<ILoginProps> => ({ accessToken }),
)(Login);
