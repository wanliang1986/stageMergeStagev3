import * as ActionTypes from '../../constants/actionTypes';
import Immutable from 'immutable';

export default function (state = Immutable.OrderedMap(), action = {}) {
  let newState;
  switch (action.type) {
    case ActionTypes.GET_HOT_LIST_LIST:
    case ActionTypes.UPSERT_HOT_LIST:
      newState = state.mergeDeep(
        Immutable.fromJS(action.normalizedData.entities.hotLists)
      );
      return newState.equals(state) ? state : newState;

    case ActionTypes.DELETE_HOT_LIST:
      return state.remove(action.hotListId);

    case ActionTypes.LOGOUT:
      return state.clear();

    default:
      return state;
  }
}
