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
      <div className="container jumbo">
        <div>
          <div className="title">Spotplot</div>
          <div className="text">
            Spotplot is a new way to sift through your music on Spotify.<br />
            Spot the musicians and collaborations behind the music you love.<br />
            <br />
            Spotplot can display playlists or your library songs.<br />
            To get started, please login:<br />
          </div>
        </div>
        <div>
          <a href="/login" className="button">login</a>
        </div>
      </div >
    );
  }
}

export default connect(({ accessToken }) => ({ accessToken }))(Login);
