import * as ActionTypes from '../../constants/actionTypes';
import Immutable from 'immutable';

export default function(state = Immutable.Map(), action = {}) {
  let newState;
  switch (action.type) {
    case ActionTypes.LOGOUT:
      return state.clear();

    // case ActionTypes.ADD_JOB_ASSOCIATED_USERS:
    //     return state.set(action.userRelation.id.toString(), Immutable.fromJS(action.userRelation));

    // case ActionTypes.DELETE_JOB_ASSOCIATED_USERS:
    //     return state.remove(action.userRelationId.toString());

    case ActionTypes.GET_EMAILBLAST_DRAFT_LIST:
      newState = state.merge(
        Immutable.fromJS(action.normalizedData.entities.drafts)
      );
      return newState.equals(state) ? state : newState;

    case ActionTypes.UPSERT_DRAFT:
      newState = state.set(
        action.draft.id.toString(),
        Immutable.fromJS(action.draft)
      );
      return newState.equals(state) ? state : newState;

    case ActionTypes.DELETE_DRAFT:
      return state.remove(action.draftId);

    default:
      return state;
  }
}
