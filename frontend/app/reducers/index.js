import { combineReducers } from 'redux';
import { reducer as reduxFormReducer } from 'redux-form';

import auth from './auth';
import gifs from './gifs';


const rootReducer = combineReducers({
  auth,
  gifs,
  form: reduxFormReducer,
});


export default rootReducer;
