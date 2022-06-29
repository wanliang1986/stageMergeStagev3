/**
 * Created by chenghui on 5/23/17.
 */
import * as ActionTypes from '../../constants/actionTypes';
import Immutable from 'immutable';

export default function (state = Immutable.OrderedMap(), action = {}) {
  let newState;
  switch (action.type) {
    // case ActionTypes.GET_CURRENT_USER:
    case ActionTypes.RECEIVE_JOB_APPLICATIONS:
    case ActionTypes.RECEIVE_APPLICATION_BY_APPLICATIONID:
    case ActionTypes.RECEIVE_TALENT_LIST:
    case ActionTypes.RECEIVE_BRIEF_USERS:
    case ActionTypes.GET_HOT_LIST_LIST:
    case ActionTypes.GET_ACTIVITIES_BY_APPLICATION:
    case ActionTypes.RECEIVE_APPLICATION_LIST:
      newState = state.mergeDeep(
        Immutable.fromJS(action.normalizedData.entities.users)
      );
      return newState.equals(state) ? state : newState;

    case ActionTypes.RECEIVE_JOB_USER_RELATIONS:
    case ActionTypes.GET_CURRENT_USER:
      newState = state.merge(
        Immutable.fromJS(action.normalizedData.entities.users)
      );
      return newState.equals(state) ? state : newState;

    case ActionTypes.RECEIVE_USERS:
      newState = Immutable.OrderedMap().merge(
        Immutable.fromJS(action.normalizedData.entities.users)
      );
      return newState.equals(state) ? state : newState;

    case ActionTypes.UPDATE_USER:
      return state.update(
        action.payload.id.toString(),
        (user = Immutable.Map()) => user.merge(Immutable.fromJS(action.payload))
      );
    case ActionTypes.LOGOUT:
      return state.clear();
    default:
      return state;
  }
}
