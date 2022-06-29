import Immutable from 'immutable';
import * as ActionTypes from '../../constants/actionTypes';

export default function (state = Immutable.OrderedMap(), action = {}) {
  let newState;
  switch (action.type) {
    case ActionTypes.RECEIVE_COMMISSION_LIST:
    case ActionTypes.ADD_COMMISSION_TO_LIST:
      // case ActionTypes.GET_COMMISSION:
      // case ActionTypes.UPDATE_COMMISSION:
      newState = state.merge(
        Immutable.fromJS(action.normalizedData.entities.commissions)
      );
      return newState.equals(state) ? state : newState;

    case ActionTypes.ADD_COMMISSION:
      return state.set(
        String(action.commission.id),
        Immutable.fromJS(action.commission)
      );

    case ActionTypes.LOGOUT:
      return state.clear();

    default:
      return state;
  }
}
