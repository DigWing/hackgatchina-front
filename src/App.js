import React, { Component } from 'react';
import { Switch, Route, Router } from 'react-router';
import createHistory from 'history/createBrowserHistory';
import * as screens from './screens';
import './App.css';
import ClCamera from './components/ClCamera';

const history = createHistory();

class App extends Component {
  constructor() {
    super();
    this.state = {
      offline: false
    }
  }
  componentDidMount() {
    window.addEventListener('online', () => {
      this.setState({ offline: false });
    });

    window.addEventListener('offline', () => {
      this.setState({ offline: true });
    });
  }

  componentDidUpdate() {
    let offlineStatus = !navigator.onLine;
    if (this.state.offline !== offlineStatus) {
      this.setState({ offline: offlineStatus });
    }
  }

  render() {
    return (
      <Router history={history}>
        <Switch>
          <Route path="/send" component={screens.DownloadScreen} />
          <Route path="/" component={screens.HomeScreen} />
        </Switch>
      </Router>
    );
  }
}

export default App;
