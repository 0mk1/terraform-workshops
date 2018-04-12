import React from 'react';
import PropTypes from 'prop-types';
import { AppBar as MaterialAppBar } from 'material-ui';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import { Link } from 'react-router-dom';

import './appbar.css';


const AppBar = ({ isLogged }) => {
  return (
    <div className="root">
      <MaterialAppBar position="static">
        <Toolbar>
          <Typography variant="title" color="inherit" className="flex">
            <Link to="/" className="link">Gifz</Link>
          </Typography>
          {
            isLogged ? (
              <Link to="/logout" className="link"><Button variant="raised" color="inherit">Logout</Button></Link>
            ) : (
              <Link to="/login" className="link"><Button variant="raised" color="inherit">Login</Button></Link>
            )
          }
        </Toolbar>
      </MaterialAppBar>
    </div>
  );
}

AppBar.propTypes = {};

export default AppBar;
