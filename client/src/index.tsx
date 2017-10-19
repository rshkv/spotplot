import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import App from './components/App';
import Error from './components/Error';
import Login from './components/Login';
import Songs from './components/Songs';
import './main.scss';
import SpotifyData from './reducer/reducer';

const store = createStore(SpotifyData, applyMiddleware(thunkMiddleware));

class Root extends React.Component {
  public render() {
    return (
      <Provider store={store}>
        <Router history={hashHistory}>
          <Route path="/" component={App}>
            <IndexRoute component={Login} />
            <Route path="/login/:accessToken" component={Login} />
            <Route path="/error/:error" component={Error} />
            <Route path="/songs" component={Songs} />
          </Route>
        </Router>
      </Provider>
    );
  }
}

render(<Root />, document.getElementById('root'));
