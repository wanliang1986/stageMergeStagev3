import * as ActionTypes from '../../constants/actionTypes';
import Immutable from 'immutable';

export default function (state = Immutable.List(), action = {}) {
  let newState;
  switch (action.type) {
    case ActionTypes.RECEIVE_PIPELINE_LIST:
      newState = Immutable.List(action.list);
      return newState.equals(state) ? state : newState;
    case ActionTypes.CLEAR_PIPELINE_LIST:
    case ActionTypes.LOGOUT:
      return state.clear();
    default:
      return state;
  }
}
