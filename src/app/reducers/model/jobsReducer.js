/**
 * Created by chenghui on 6/12/17.
 */
import * as ActionTypes from '../../constants/actionTypes';
import Immutable from 'immutable';

export default function (state = Immutable.Map(), action = {}) {
  let newState;
  switch (action.type) {
    case ActionTypes.ADD_JOBS_TO_LIST:
      if (action.normalizedData) {
        newState = state.mergeDeep(
          Immutable.fromJS(action.normalizedData.entities.jobs)
        );
        return newState.equals(state) ? state : newState;
      } else return state;

    case ActionTypes.EDIT_JOB:
    case ActionTypes.RECEIVE_JOB:
    case ActionTypes.ADD_JOB:
    case ActionTypes.RECEIVE_JOB_LIST:
      newState = state.merge(
        Immutable.fromJS(action.normalizedData.entities.jobs)
      );
      console.log(
        '=============================================================>'
      );
      console.log(newState.toJS());
      return newState;

    case ActionTypes.RECEIVE_RECOMMENDATION_JOB_LIST:
    case ActionTypes.RECEIVE_APPLICATION_LIST:
    case ActionTypes.RECEIVE_OPENJOBSBYCOMPANY:
    case ActionTypes.RECEIVE_APPLICATION_BY_APPLICATIONID:
      newState = state.mergeDeep(
        Immutable.fromJS(action.normalizedData.entities.jobs)
      );
      return newState.equals(state) ? state : newState;
    case ActionTypes.LOGOUT:
      return state.clear();

    default:
      return state;
  }
}
