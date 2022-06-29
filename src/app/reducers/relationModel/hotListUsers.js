import * as ActionTypes from '../../constants/actionTypes';
import Immutable from 'immutable';

export default function (state = Immutable.OrderedMap(), action = {}) {
  let newState;
  switch (action.type) {
    case ActionTypes.RECEIVE_HOT_LIST_USERS:
      newState = Immutable.fromJS(action.normalizedData.entities.hotListUsers);
      return newState.equals(state) ? state : newState;

    case ActionTypes.LOGOUT:
      return state.clear();

    default:
      return state;
  }
}
