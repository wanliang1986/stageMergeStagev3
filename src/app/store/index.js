/**
 * Created by leonardli on 3/25/17.
 */
import { createStore, applyMiddleware, compose } from 'redux';
import createRootReducer from '../reducers';
import thunk from 'redux-thunk';
import { createBrowserHistory as createHistory } from 'history';
import { routerMiddleware } from 'connected-react-router';
import { pageViewLogger } from './../gtag';

export const history = createHistory();

const router = routerMiddleware(history);

let composeEnhancer = compose;
if (process.env.NODE_ENV !== 'production') {
  composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
}
const store = createStore(
  createRootReducer(history),
  {
    mobile:
      /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
        navigator.userAgent.toLowerCase()
      ),
  },
  composeEnhancer(applyMiddleware(thunk, pageViewLogger, router))
);

export default store;
