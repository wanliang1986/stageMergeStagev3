import * as ActionTypes from '../../constants/actionTypes';
import Immutable from 'immutable';

export default function (state = Immutable.List(), action = {}) {
  let newState;
  switch (action.type) {
    case ActionTypes.RECEIVE_JOB_TALENT_POOL:
      newState = action.talentList;
      return newState.equals(state) ? state : newState;
    case ActionTypes.LOGOUT:
      return state.clear();
    default:
      return state;
  }
}
