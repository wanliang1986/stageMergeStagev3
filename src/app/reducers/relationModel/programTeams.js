import * as ActionTypes from '../../constants/actionTypes';
import Immutable from 'immutable';

export default function (state = Immutable.Map(), action = {}) {
  let newState;
  switch (action.type) {
    case ActionTypes.LOGOUT:
      return state.clear();

    case ActionTypes.GET_PROGRAM_TEAM_LIST:
      newState = state.merge(
        Immutable.fromJS(action.normalizedData.entities.programTeams)
      );
      return newState.equals(state) ? state : newState;

    case ActionTypes.UPSERT_PROGRAM_TEAM:
      newState = state.set(
        String(action.programTeam.id),
        Immutable.fromJS(action.programTeam)
      );
      return newState.equals(state) ? state : newState;

    case ActionTypes.DELETE_PROGRAM_TEAM:
      return state.remove(action.programTeamId);

    default:
      return state;
  }
}
