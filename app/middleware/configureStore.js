import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer from '@reducers';
import { /* logger, */ /* router, */ reduxRouterMiddleware } from './index';

const devMode = process.env.NODE_ENV !== 'production';
// console.log(devMode, process.env.NODE_ENV);
const nextReducer = require('@reducers');

export default function configure(initialState) {
  const create =
    window.devToolsExtension && devMode
      ? window.devToolsExtension()(createStore)
      : createStore;
  // const create = createStore;

  const createStoreWithMiddleware = applyMiddleware(
    reduxRouterMiddleware,
    thunkMiddleware,
    // logger
    // router,
  )(create);

  const store = createStoreWithMiddleware(rootReducer, initialState);

  if (module.hot) {
    module.hot.accept('@reducers', () => {
      store.replaceReducer(nextReducer);
    });
  }

  return store;
}
