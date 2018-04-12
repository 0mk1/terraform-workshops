import React from 'react';
import PropTypes from 'prop-types';
import { CircularProgress } from 'material-ui/Progress';


import './loader.css';


const Loader = () => {
  return (
    <div className="loader">
      <CircularProgress thickness={5} size={60} />
    </div>
  );
}

Loader.propTypes = {};

export default Loader;
