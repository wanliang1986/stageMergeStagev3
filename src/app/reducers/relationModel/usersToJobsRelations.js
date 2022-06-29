import * as ActionTypes from '../../constants/actionTypes';
import Immutable from 'immutable';

export default function (state = Immutable.Map(), action = {}) {
  let newState;
  switch (action.type) {
    case ActionTypes.LOGOUT:
      return state.clear();

    // case ActionTypes.ADD_JOB_ASSOCIATED_USERS:
    //     return state.set(action.userRelation.id.toString(), Immutable.fromJS(action.userRelation));

    case ActionTypes.DELETE_JOB_ASSOCIATED_USERS:
      return state.remove(action.userRelationId.toString());

    case ActionTypes.RECEIVE_JOB_USER_RELATIONS:
    case ActionTypes.ADD_JOB_ASSOCIATED_USERS:
    case ActionTypes.UPDATE_JOB_ASSOCIATED_USERS:
      newState = Immutable.fromJS(
        action.normalizedData.entities.usersToJobsRelations || {}
      );
      return newState.equals(state) ? state : newState;

    default:
      return state;
  }
}
