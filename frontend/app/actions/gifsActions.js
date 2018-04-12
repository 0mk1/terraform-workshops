import axios from 'axios';

import {
  GIFS_FETCH_BEGINS,
  GIFS_FETCH_FINISHED,
  GIFS_CLEAR,
  GIFS_ADD_PENDING,
  GIFS_ADD_SUCCESS,
  GIFS_ADD_FAILURE,
} from '../constants/gifsActionTypes';


export const fetchGifsBegins = () => ({
  type: GIFS_FETCH_BEGINS,
});

export const addGifPending = () => ({
  type: GIFS_ADD_PENDING,
});

export const addGifSuccess = data => ({
  type: GIFS_ADD_SUCCESS,
  data,
});

export const addGifFailure = data => ({
  type: GIFS_ADD_FAILURE,
  data
});

export const clearGifs = () => ({
  type: GIFS_CLEAR,
});

export const fetchGifsFinished = data => ({
  type: GIFS_FETCH_FINISHED,
  data,
});

export const fetchGifs = params => (dispatch) => {
  dispatch(fetchGifsBegins());

  return axios
    .get('gifs/', { params })
    .then((response) => {
      dispatch(fetchGifsFinished(response.data));
      return response;
    });
};

export const addGif = data => (dispatch) => {
  dispatch(addGifPending());

  const form = new FormData();
  form.append('title', data.file.name);
  form.append('gif_file', data.file);
  form.append('author', 1);
  form.append('tags', '["dogs", "funny"]');

  return axios.post('gifs/', form);
};
