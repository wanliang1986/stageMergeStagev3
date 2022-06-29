import * as ActionTypes from '../../constants/actionTypes';
import Immutable from 'immutable';

export default function (state = Immutable.List(), action = {}) {
  let newState;
  switch (action.type) {
    case ActionTypes.SET_INTERNAL_REPORT_JOBDATA:
      newState = Immutable.List(action.jobData);
      return newState.equals(state) ? state : newState;
    case ActionTypes.CLEAR_INTERNAL_REPORT_JOBDATA:
      return state.clear();
    default:
      return state;
  }
}
