import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import App from './components/app';
import reducers from './reducers';
import ReduxThunk from 'redux-thunk';
import ReduxPromise from 'redux-promise';
import { browserHistory, BrowserRouter, IndexRoute, Switch, Route } from 'react-router-dom';

import { AUTH_USER } from './actions/types';

// this.context.history.push('/path')
//  👍 8  

let middleware = [ReduxThunk, ReduxPromise]

const createStoreWithMiddleware = applyMiddleware(...middleware)(createStore);
const store = createStoreWithMiddleware(reducers);
const token = localStorage.getItem('token');
// If we have a token, consider the user to be signed in
if (token) {
  // we need to update application state
  store.dispatch({ type: AUTH_USER, payload: token.split('-')[2] });
} 



ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter >
      <App/>
    </BrowserRouter>
  </Provider>
  , document.querySelector('.container'));
