import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { HashRouter as Router, Route } from 'react-router-dom';
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
  localStorage.setItem('accessToken', accessToken);
});

loadToken();

class Root extends React.Component {
  public render() {
    return (
      <Provider store={store}>
        <Router>
          <App>
            <Route exact={true} path="/" component={Login} />
            <Route path="/login/:accessToken" component={Login} />
            <Route path="/error/:error" component={Error} />
            <Route path="/selection" component={Selection} />
            <Route path="/songs" component={LibrarySongs} />
            <Route path="/playlist/:user/:playlist" component={PlaylistSongs} />
          </App>
        </Router>
      </Provider>
    );
  }
}

render(<Root />, document.getElementById('root'));

function loadToken() {
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken) {
    store.dispatch(setToken(accessToken));
  }
}
