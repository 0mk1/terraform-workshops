import axios from 'axios';
import history from './history';


export function setToken(token) {
  window.localStorage.setItem('token', token);
}

export function clearToken() {
  window.localStorage.removeItem('token');
}

export function hasToken() {
  return !!window.localStorage.getItem('token');
}

export function clearAuthToken() {
  clearToken();
  axios.defaults.headers.common.Authorization = '';
}

export function setAuthToken(token) {
  setToken(token);
  axios.defaults.headers.common.Authorization = `Token ${token}`;
}

export default function configureRequests() {
  const token = window.localStorage.getItem('token');
  if (hasToken()) {
    axios.defaults.headers.common.Authorization = `Token ${token}`;
  }

  const baseURL = process.env.BACKEND_URL;
  axios.defaults.baseURL = baseURL;

}

axios.interceptors.response.use(response => ({
  ...response,
  data: response.data,
}), (error) => {
  if (error.response.data.error) {
    console.log(error.response.data.error);
  }

  if (error.response.status === 401) {
    clearAuthToken();
    history.push('/login');
    history.go();
  }
  if (error.response.status === 403) {
    clearAuthToken();
    history.push('/login');
    history.go();
  }

  throw error;
});

