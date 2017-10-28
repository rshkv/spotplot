import * as React from 'react';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router';
import * as Redux from 'redux';
import { setToken } from '../reducer/actions';
import { IStoreState } from '../types';

export interface ILoginProps {
  dispatch: Redux.Dispatch<IStoreState>;
  params: { accessToken: string };
  accessToken: string;
}

class Login extends React.Component<ILoginProps, {}> {

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
      hashHistory.push('/selection');
    }
  }

  public render() {
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
            <a href="/login" className="button">login</a>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(({ accessToken }) => ({ accessToken }))(Login);
