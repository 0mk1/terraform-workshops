import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';

import './gifslist.css';

import {
  InfiniteScrollImageGrid,
  Loader,
} from '../../components';

import { fetchGifs, clearGifs } from '../../actions/gifsActions';


class GifsList extends Component {
  componentDidMount() {
      this.props.fetchGifs();
  }

  componentWillUnmount() {
      this.props.clearGifs();
  }

  loadMore() {
    if (this.props.gifs.get('next') !== null) {
      const cursorRegExp = new RegExp('cursor=(.+)&?');
      const cursor = cursorRegExp.exec(this.props.gifs.get('next'))[1];
      this.props.fetchGifs({ cursor });
    }
  }

  render() {
    let loader = null;
    if (this.props.isGifsFetching) {
      loader = <Loader />;
    }

    return (
      <div>
        <InfiniteScrollImageGrid
          items={this.props.gifs.get('results')}
          onScrollEnd={this.loadMore.bind(this)}
          isLoading={this.props.isGifsFetching}
        />
        {loader}
        {
          this.props.isLogged ? (
            <div className="add-button">
              <Link to="/add" className="link">
                <Button variant="fab" color="primary" aria-label="add" className="add-button">
                  <AddIcon />
                </Button>
              </Link>
            </div>
          ) : null
        }
      </div>
    );
  }
}

GifsList.propTypes = {
  isLogged: PropTypes.bool.isRequired,
  isGifsFetching: PropTypes.bool.isRequired,
  gifs: PropTypes.shape({
    get: PropTypes.func,
  }).isRequired,
  fetchGifs: PropTypes.func.isRequired,
  clearGifs: PropTypes.func.isRequired,
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
  isGifsFetching: state.gifs.get('isGifsFetching'),
  gifs: state.gifs.get('gifs'),
  isLogged: state.auth.get('isLogged'),
});

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchGifs,
  clearGifs,
}, dispatch);

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(GifsList)
);
