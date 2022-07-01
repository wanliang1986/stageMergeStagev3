import * as ActionTypes from '../../constants/actionTypes';
import Immutable from 'immutable';

export default function (state = Immutable.Map(), action = {}) {
  let newState;
  switch (action.type) {
    case ActionTypes.LOGOUT:
      return state.clear();

    case ActionTypes.DELETE_APPLICATION:
      return state.remove(action.applicationId.toString());
    // case ActionTypes.DELETE_TALENT_RESUME:
    //     return state.filter(application => application.get('resumeId') !== action.talentResumeId);

    case ActionTypes.RECEIVE_JOB_APPLICATIONS:
    case ActionTypes.RECEIVE_TALENT_LIST:
    case ActionTypes.RECEIVE_APPLICATION_LIST:
      newState = state.merge(
        Immutable.fromJS(action.normalizedData.entities.applications)
      );
      return newState.equals(state) ? state : newState;

    case ActionTypes.EDIT_APPLICATION:
    case ActionTypes.ADD_APPLICATION:
    case ActionTypes.RECEIVE_APPLICATION_BY_APPLICATIONID:
      return state.merge(
        Immutable.fromJS(action.normalizedData.entities.applications)
      );

    default:
      return state;
  }
}
