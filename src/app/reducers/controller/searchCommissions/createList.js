import { combineReducers } from 'redux';
import Immutable from 'immutable';
import * as ActionTypes from './../../../constants/actionTypes';

const createList = tab => {
  const ids = (state = null, action) => {
    let newState;
    if (action.type === ActionTypes.LOGOUT) {
      return null;
    }
    if (action.tab !== tab) {
      return state;
    }
    switch (action.type) {
      case ActionTypes.RECEIVE_COMMISSION_LIST:
        newState = Immutable.Set(action.normalizedData.result);
        return newState.equals(state) ? state : newState;

      case ActionTypes.ADD_COMMISSION_TO_LIST:
        newState = state.union(action.normalizedData.result);
        return newState.equals(state) ? state : newState;

      case ActionTypes.FAILURE_COMMISSION_LIST:
        return Immutable.Set();

      default:
        return state;
    }
  };
  const isFetching = (state = false, action) => {
    if (action.type === ActionTypes.LOGOUT) {
      return false;
    }
    if (action.tab !== tab) {
      return state;
    }

    switch (action.type) {
      case ActionTypes.REQUEST_COMMISSION_LIST:
        return true;
      case ActionTypes.RECEIVE_COMMISSION_LIST:
      case ActionTypes.FAILURE_COMMISSION_LIST:
      case ActionTypes.ADD_COMMISSION_TO_LIST:
        return false;
      default:
        return state;
    }
  };
  const total = (state = 0, action) => {
    if (action.type === ActionTypes.LOGOUT) {
      return 0;
    }
    if (action.tab !== tab) {
      return state;
    }

    switch (action.type) {
      case ActionTypes.RECEIVE_COMMISSION_LIST:
        return action.total || 0;
      case ActionTypes.ADD_COMMISSION_TO_LIST:
        return action.total || state;
      case ActionTypes.FAILURE_COMMISSION_LIST:
        return 0;

      default:
        return state;
    }
  };

  return combineReducers({
    ids,
    isFetching,
    total
  });
};
export default createList;
