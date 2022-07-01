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

    case ActionTypes.GET_TENANT_TEMPLATE_LIST:
      newState = state.merge(
        Immutable.fromJS(action.normalizedData.entities.templates)
      );
      return newState.equals(state) ? state : newState;

    case ActionTypes.UPSERT_TEMPLATE:
      newState = state.set(
        action.template.id.toString(),
        Immutable.fromJS(action.template)
      );
      return newState.equals(state) ? state : newState;

    case ActionTypes.DELETE_TEMPLATE:
      return state.remove(action.templateId);

    default:
      return state;
  }
}
