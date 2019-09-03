import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Switch, HashRouter as Router, Route, Redirect } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import App from './components/App';
import Error from './components/Error';
import LibrarySongs from './components/LibrarySongs';
import Login from './components/Login';
import PlaylistSongs from './components/PlaylistSongs';
import Selection from './components/Selection';
import './main.scss';
import { setToken } from './reducer/actions';
import SpotifyData from './reducer/reducer';

const store = createStore(
  SpotifyData,
  applyMiddleware(thunkMiddleware));

store.subscribe(() => {
  const { accessToken } = store.getState();
  const validUntil = (new Date()).getTime() + 3600000;
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('accessTokenValidUntil', validUntil.toString());
});

loadToken();

class Root extends React.Component {
  public render() {
    return (
      <Provider store={store}>
        <Router>
          <App>
            <Switch>
              <Route exact={true} path="/login" component={Login} />
              <Route path="/login/:callbackHash" component={Login} />
              <Route path="/error/:error" component={Error} />
              <Route path="/selection" component={Selection} />
              <Route path="/songs" component={LibrarySongs} />
              <Route path="/playlist/:playlistId" component={PlaylistSongs} />
              <Redirect exact={true} from="/" to="/login" />
              {/* tslint:disable jsx-no-lambda */}
              <Route
                path="/:callbackHash"
                render={({ match }) => {
                  return (<Redirect to={`/login/${match.params.callbackHash}`} />);
                }}
              />
            </Switch>
          </App>
        </Router>
      </Provider>
    );
  }
}

render(<Root />, document.getElementById('root'));

function loadToken() {
  const accessToken = localStorage.getItem('accessToken');
  const validUntil = localStorage.getItem('accessTokenValidUntil');

  const isValid = new Date(validUntil) > new Date();
  if (accessToken && isValid) {
    store.dispatch(setToken(accessToken));
  }
}
