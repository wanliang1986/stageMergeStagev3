import * as ActionTypes from '../../constants/actionTypes';
import Immutable from 'immutable';

export default function (state = Immutable.OrderedMap(), action = {}) {
  let newState;
  switch (action.type) {
    case ActionTypes.GET_EMAIL_BLAST_LIST:
    case ActionTypes.UPSERT_EMAIL_BLAST:
      newState = state.mergeDeep(
        Immutable.fromJS(action.normalizedData.entities.emailBlasts)
      );
      return newState.equals(state) ? state : newState;

    case ActionTypes.DELETE_EMAIL_BLAST:
      return state.remove(String(action.listId));
    //
    case ActionTypes.GET_EMAIL_BLAST_RECIPIENTS:
      newState = state.setIn(
        [action.listId, 'recipientIds'],
        Immutable.fromJS(action.normalizedData.result)
      );
      return newState.equals(state) ? state : newState;

    case ActionTypes.ADD_EMAIL_BLAST_RECIPIENT:
      newState = state.updateIn(
        [action.listId, 'recipientIds'],
        (recipientIds = Immutable.List()) =>
          Immutable.fromJS(action.normalizedData.result).concat(recipientIds)
      );
      return newState.equals(state) ? state : newState;

    case ActionTypes.DELETE_EMAIL_BLAST_RECIPIENT:
      return state.updateIn(
        [action.listId, 'recipientIds'],
        (recipientIds = Immutable.List()) =>
          recipientIds.filter((id) => id !== action.recipientId)
      );

    case ActionTypes.LOGOUT:
      return state.clear();

    default:
      return state;
  }
}
