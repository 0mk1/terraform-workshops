import React, { Component } from 'react';
import Immutable from 'immutable';
import PropTypes from 'prop-types';
import GridList, { GridListTile } from 'material-ui/GridList';

import './infinitescrollimagegrid.css';


class InfiniteScrollImageGrid extends Component {
  detachScrollListener() {
    window.removeEventListener('scroll', this.onScroll.bind(this), false);
  }

  attachScrollListener() {
    window.addEventListener('scroll', this.onScroll.bind(this), false);
  }

  componentDidMount() {
    this.attachScrollListener();
  }

  componentDidUpdate () {
    this.attachScrollListener();
  }

  componentWillUnmount() {
    this.detachScrollListener();
  }

  onScroll() {
    if (
      (window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 200) &&
      this.props.items.size &&
      !this.props.isLoading
    ) {
      this.detachScrollListener();
      this.props.onScrollEnd();
    }
  }

  render() {
    return (
      <GridList cellHeight={350} cols={5} spacing={0}>
        {
          this.props.items.map(
            item => (
              <GridListTile key={item.get('src')} cols={1}>
                <img src={item.get('src')} alt={item.get('title')} />
              </GridListTile>
            )
          )
        }
      </GridList>
    );
  }
}

InfiniteScrollImageGrid.propTypes = {
  items: PropTypes.oneOfType([
    PropTypes.instanceOf(Immutable.List)
  ]).isRequired,
  onScrollEnd: PropTypes.func,
  isLoading: PropTypes.bool,
};

export default InfiniteScrollImageGrid;
