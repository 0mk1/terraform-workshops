import {
  Map,
  List,
  fromJS,
} from 'immutable';

import {
  LOGIN_REQUESTED,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
} from '../constants/authActionTypes';

import {
  hasToken
} from '../requests';

const initialState = Map({
  isLoginPending: false,
  isLogged: hasToken(),
});

export default (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_REQUESTED: {
      return state.set('isLoginPending', true);
    }
    case LOGIN_SUCCESS: {
      console.log(action.data);
      return state.set('isLoginPending', false).set('isLogged', true);
    }
    case LOGIN_FAILURE: {
      console.log(action.data);
      return state.set('isLoginPending', false).set('isLogged', false);
    }
    case LOGOUT: {
      return state.set('isLogged', false);
    }
    default:
      return state;
  }
};

