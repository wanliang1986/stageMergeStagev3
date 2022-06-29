import * as ActionTypes from '../../constants/actionTypes';
import Immutable from 'immutable';

export default function (state = Immutable.Map(), action = {}) {
  let newState;
  switch (action.type) {
    case ActionTypes.LOGOUT:
      return state.clear();

    case ActionTypes.REQUEST_TALENT:
      return state.remove(String(action.talentId));

    case ActionTypes.RECEIVE_JOB_APPLICATIONS:
    case ActionTypes.RECEIVE_APPLICATION_BY_APPLICATIONID:
      newState = state.merge(
        Immutable.fromJS(action.normalizedData.entities.talents)
      );
      return newState.equals(state) ? state : newState;

    case ActionTypes.ADD_TALENTS_TO_LIST:
      if (action.normalizedData) {
        newState = state.mergeDeep(
          Immutable.fromJS(action.normalizedData.entities.talents)
        );
        return newState.equals(state) ? state : newState;
      } else return state;

    case ActionTypes.RECEIVE_TALENT:
      newState = state.mergeDeep(
        Immutable.fromJS(action.normalizedData.entities.talents)
      );
      return newState.equals(state) ? state : newState;
    // newState = Immutable.fromJS(action.normalizedData.entities.talents);
    // return newState.equals(state) ? state : newState;
    case ActionTypes.EDIT_TALENT:
    case ActionTypes.RECEIVE_TALENT_LIST:
    case ActionTypes.GET_HOT_LIST_TALENTS2:
      newState = state.mergeDeep(
        Immutable.fromJS(action.normalizedData.entities.talents)
      );
      return newState.equals(state) ? state : newState;

    case ActionTypes.RECEIVE_RECOMMENDATION_JOB_LIST:
      newState = state.setIn(
        [action.talentId, 'jobIds'],
        Immutable.List(action.normalizedData.result)
      );
      return newState.equals(state) ? state : newState;

    default:
      return state;
  }
}
