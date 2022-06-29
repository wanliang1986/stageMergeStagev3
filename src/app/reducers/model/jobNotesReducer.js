/**
 * Created by chenghui on 6/22/17.
 */
import * as ActionTypes from '../../constants/actionTypes';
import Immutable from 'immutable';

export default function (state = Immutable.OrderedMap(), action = {}) {
  let newState;
  switch (action.type) {
    case ActionTypes.RECEIVE_JOB:
      newState = state.merge(
        Immutable.fromJS(action.normalizedData.entities.jobNotes)
      );
      return newState.equals(state) ? state : newState;

    case ActionTypes.ADD_JOB_NOTE:
      return state.merge(
        Immutable.fromJS(action.normalizedData.entities.jobNotes)
      );
    case ActionTypes.LOGOUT:
      return state.clear();
    default:
      return state;
  }
}
