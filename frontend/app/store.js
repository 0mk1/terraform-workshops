import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import reducers from './reducers';

export default function configureStore(initialState) {
  const middlewares = [thunk];
  let enhancer;

  if (process.env.NODE_ENV !== 'production' && window.devToolsExtension) {
    enhancer = compose(
      applyMiddleware(...middlewares),
      window.devToolsExtension(),
    );
  } else {
    enhancer = compose(applyMiddleware(...middlewares));
  }

  const store = createStore(reducers, initialState, enhancer);

  return store;
}
