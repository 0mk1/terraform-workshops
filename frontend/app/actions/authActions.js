import axios from 'axios';

import {
  LOGIN_REQUESTED,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
} from '../constants/authActionTypes';

import {
  clearAuthToken
} from '../requests';


export const loginPending = () => ({
  type: LOGIN_REQUESTED,
});

export const loginSuccess = data => ({
  type: LOGIN_SUCCESS,
  data,
});

export const loginFailure = data => ({
  type: LOGIN_FAILURE,
  data,
});

export const login = data => (dispatch) => {
  dispatch(loginPending());
  return axios.post('auth/token/create/', data);
};

export const logout = data => (dispatch) => {
  clearAuthToken();
  dispatch({ type: LOGOUT });
};

