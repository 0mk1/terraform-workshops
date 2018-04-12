import {
  Map,
  List,
  fromJS,
} from 'immutable';

import {
  renameKeys
} from '../utils';

import {
  GIFS_FETCH_BEGINS,
  GIFS_FETCH_FINISHED,
  GIFS_CLEAR,
  GIFS_ADD_SUCCESS,
  GIFS_ADD_FAILURE,
  GIFS_ADD_PENDING,
} from '../constants/gifsActionTypes';

const initialState = Map({
  isGifsAddPending: true,
  isGifsFetching: true,
  gifs: Map({
    results: List(),
    next: null,
    previous: null,
  }),
});

export default (state = initialState, action) => {
  switch (action.type) {
    case GIFS_CLEAR: {
      return state.set('gifs', initialState.get('gifs'));
    }
    case GIFS_ADD_PENDING: {
      return state.set('isGifsAddPending', true);
    }
    case GIFS_ADD_SUCCESS: {
      console.log(action.data);
      return state.set('isGifsAddPending', false);
    }
    case GIFS_ADD_FAILURE: {
      console.log(action.data);
      return state.set('isGifsAddPending', false);
    }
    case GIFS_FETCH_BEGINS: {
      return state.set('isGifsFetching', true);
    }
    case GIFS_FETCH_FINISHED: {
      const results = action.data.results.map(
        item => {
          return renameKeys(item, {'gif_file': 'src'})
        }
      );

      const obj = Map({
        isGifsFetching: false,
        gifs: fromJS(action.data).merge(
          Map({
            results: state.get('gifs').get('results').concat(fromJS(results)),
          })
        )
      });

      return state.merge(obj);
    }
    default:
      return state;
  }
};

