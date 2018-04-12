import React, { Component } from "react";
import {
  Field,
  reduxForm,
} from 'redux-form';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import TextField from 'material-ui/TextField';

import {
  Loader,
} from '../../components';

import './loginform.css';

const renderTextField = (
  { input, label, meta: { touched, error }, ...custom },
) => (
  <TextField
    label={label}
    {...input}
    {...custom}
  />
);


const LoginForm = ({
  handleSubmit,
  submitting
}) => {
  if (submitting) {
    return <Loader />;
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-fields-container">
        <div>
          <Field
            name="username"
            label="Username"
            margin="normal"
            component={renderTextField}
          />
        </div>
        <div>
          <Field
            name="password"
            label="Password"
            type="password"
            autoComplete="current-password"
            margin="normal"
            component={renderTextField}
          />
        </div>
      </div>
      <div className="save-button">
        <Button color="primary" variant="raised" type="submit">
          Login
        </Button>
      </div>
    </form>
  );
};

LoginForm.propTypes = {
  submitting: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default reduxForm({
  form: 'login',
})(LoginForm);
