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
    if (tab === 'es') {
      switch (action.type) {
        case ActionTypes.RECEIVE_JOB_LIST:
          newState = Immutable.List(action.normalizedData.result);
          // console.log(ActionTypes.RECEIVE_JOB_LIST, newState.equals(state));
          return newState.equals(state) ? state : newState;

        case ActionTypes.ADD_JOBS_TO_LIST:
          newState = state.concat(action.ids);
          return newState.equals(state) ? state : newState;

        case ActionTypes.FAILURE_JOB_LIST:
          return Immutable.List();

        default:
          return state;
      }
    } else {
      switch (action.type) {
        case ActionTypes.RECEIVE_JOB_LIST:
        case ActionTypes.RECEIVE_OPENJOBSBYCOMPANY:
          newState = Immutable.Set(action.normalizedData.result);
          // console.log('????', ActionTypes.RECEIVE_OPENJOBSBYCOMPANY, newState.equals(state));
          // console.log('????', action.type);
          return newState.equals(state) ? state : newState;

        case ActionTypes.DELETE_JOBS_FROM_LIST:
          newState = state.subtract(action.ids);
          return newState.equals(state) ? state : newState;

        case ActionTypes.ADD_JOBS_TO_LIST:
          newState = state.union(action.ids);
          return newState.equals(state) ? state : newState;

        case ActionTypes.FAILURE_JOB_LIST:
          return Immutable.Set();

        default:
          return state;
      }
    }
  };
  const isFetching = (state = false, action) => {
    if (action.tab !== tab) {
      return state;
    }
    switch (action.type) {
      case ActionTypes.REQUEST_JOB_LIST:
        return true;
      case ActionTypes.RECEIVE_JOB_LIST:
      case ActionTypes.FAILURE_JOB_LIST:
      case ActionTypes.ADD_JOBS_TO_LIST:
      case ActionTypes.RECEIVE_OPENJOBSBYCOMPANY:
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
      case ActionTypes.RECEIVE_JOB_LIST:
      case ActionTypes.RECEIVE_OPENJOBSBYCOMPANY:
        return action.total || 0;
      case ActionTypes.ADD_JOBS_TO_LIST:
        return action.total || state;
      case ActionTypes.FAILURE_JOB_LIST:
        return 0;

      default:
        return state;
    }
  };

  return combineReducers({
    ids,
    isFetching,
    total
    // errorMessage
  });
};
export default createList;
