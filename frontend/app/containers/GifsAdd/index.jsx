import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';

import './gifsadd.css';

import {
  GifAddForm
} from '../../forms';

import { addGif, addGifSuccess, addGifFailure } from '../../actions/gifsActions';


class GifsAdd extends Component {
  onFormSubmit(data) {
    this.props.addGif(data)
      .then((response) => {
        this.props.addGifSuccess(response);
        this.props.history.replace('/');

        return response;
      })
      .catch((error) => {
        this.props.addGifFailure(error);
        return error;
      });
  }

  render() {
    return (
      <div className="form-container">
        <GifAddForm
          submitting={this.props.isGifsAddPending}
          onSubmit={this.onFormSubmit.bind(this)} />
      </div>
    );
  }
}

GifsAdd.propTypes = {
  addGif: PropTypes.func.isRequired,
  addGifSuccess: PropTypes.func.isRequired,
  addGifFailure: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
  }).isRequired,
  location: PropTypes.shape({
    state: PropTypes.shape({
      goTo: PropTypes.string,
    }),
  }).isRequired,
  destroyForm: PropTypes.func.isRequired,
  initializeForm: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => bindActionCreators({
  addGif,
  addGifSuccess,
  addGifFailure,
  destroyForm: formName => destroy(formName),
  initializeForm: (formName, formValue) => initialize(formName, formValue),
}, dispatch);

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(GifsAdd)
);
