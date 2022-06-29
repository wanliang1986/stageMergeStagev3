import { combineReducers } from 'redux';
import model from './model';
import controller from './controller';
import relationModel from './relationModel';
import preference from './preference';
import { connectRouter } from 'connected-react-router';

export default (history) =>
  combineReducers({
    router: connectRouter(history),
    relationModel,
    model,
    controller,
    preference,
    mobile: (state = false) => state,
  });
