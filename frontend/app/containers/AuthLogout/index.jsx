import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import {
  logout,
} from '../../actions/authActions';


class AuthLogout extends Component {
  componentDidMount() {
    this.props.logout();
    this.props.history.replace('/');
  }
  render() {
    return null;
  }
}

AuthLogout.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
  }).isRequired,
  location: PropTypes.shape({
    state: PropTypes.shape({
      goTo: PropTypes.string,
    }),
  }).isRequired,
};

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => bindActionCreators({
  logout,
}, dispatch);

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(AuthLogout)
);
