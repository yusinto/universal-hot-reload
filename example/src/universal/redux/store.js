
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducers from './reducer';

export default function (initialState) {
  const store = createStore(reducers, initialState, applyMiddleware(thunk));
  return store;
};