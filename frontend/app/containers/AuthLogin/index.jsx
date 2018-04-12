import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';

import './authlogin.css';

import { LoginForm } from '../../forms';

import {
  Loader,
} from '../../components';

import {
  clearAuthToken,
  setAuthToken,
} from '../../requests';

import { login, loginSuccess, loginFailure } from '../../actions/authActions';


class AuthLogin extends Component {
  onFormSubmit(data) {
    this.props.login(data)
      .then((response) => {
        clearAuthToken();
        setAuthToken(response.data.auth_token);

        this.props.loginSuccess(response);
        this.props.history.replace('/');

        return response;
      })
      .catch((error) => {
        this.props.loginFailure(error);

        return error;
      });
  }

  render() {
    return (
      <div className="form-container">
        <LoginForm
          submitting={this.props.isLoginPending}
          onSubmit={this.onFormSubmit.bind(this)} />
      </div>
    );
  }
}

AuthLogin.propTypes = {
  isLoginPending: PropTypes.bool.isRequired,
  login: PropTypes.func.isRequired,
  loginSuccess: PropTypes.func.isRequired,
  loginFailure: PropTypes.func.isRequired,
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
  isLoginPending: state.auth.get('isLoginPending'),
});

const mapDispatchToProps = dispatch => bindActionCreators({
  login,
  loginSuccess,
  loginFailure,
}, dispatch);

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(AuthLogin)
);
