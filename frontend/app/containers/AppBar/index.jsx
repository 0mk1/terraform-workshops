import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';

import { AppBar as AppBarComponent } from '../../components';


class AppBar extends Component {
  render() {
    return (
      <AppBarComponent isLogged={this.props.isLogged} />
    );
  }
}

AppBar.propTypes = {
  isLogged: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  isLogged: state.auth.get('isLogged'),
});

const mapDispatchToProps = dispatch => bindActionCreators({
}, dispatch);

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(AppBar)
);
