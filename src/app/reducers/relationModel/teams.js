import * as ActionTypes from '../../constants/actionTypes';
import Immutable from 'immutable';

export default function (state = Immutable.Map(), action = {}) {
  let newState;
  switch (action.type) {
    case ActionTypes.LOGOUT:
      return state.clear();

    // case ActionTypes.ADD_JOB_ASSOCIATED_USERS:
    //     return state.set(action.userRelation.id.toString(), Immutable.fromJS(action.userRelation));

    // case ActionTypes.DELETE_JOB_ASSOCIATED_USERS:
    //     return state.remove(action.userRelationId.toString());

    case ActionTypes.GET_TEAM_LIST:
      newState = state.merge(
        Immutable.fromJS(action.normalizedData.entities.teams)
      );
      return newState.equals(state) ? state : newState;

    case ActionTypes.UPSERT_TEAM:
      newState = state.set(
        action.team.id.toString(),
        Immutable.fromJS(action.team)
      );
      return newState.equals(state) ? state : newState;

    case ActionTypes.DELETE_TEAM:
      return state.remove(action.teamId);

    default:
      return state;
  }
}
