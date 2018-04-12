import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';
import { Provider } from 'react-redux';
import CssBaseline from 'material-ui/CssBaseline';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import { blue } from 'material-ui/colors';

import configureStore from './store';
import configureRequests from './requests';

const theme = createMuiTheme({
  palette: {
    primary: blue,
  },
});

import {
  GifsList,
  GifsAdd,
  AuthLogin,
  AuthLogout,
  AppBarContainer,
} from './containers';

import './styles/base.css';


const store = configureStore();
configureRequests();

const App = () => (
  <Provider store={store}>
    <MuiThemeProvider theme={theme}>
      <Router>
        <div className="app-container">
          <CssBaseline />
          <AppBarContainer />
          <Switch>
            <Route exact path="/" component={GifsList} />
            <Route exact path="/add" component={GifsAdd} />
            <Route exact path="/login" component={AuthLogin} />
            <Route exact path="/logout" component={AuthLogout} />
          </Switch>
        </div>
      </Router>
    </MuiThemeProvider>
  </Provider>
);

ReactDOM.render(<App />, document.getElementById('app'));
