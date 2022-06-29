import * as ActionTypes from '../../constants/actionTypes';
import Immutable from 'immutable';

export default function (state = Immutable.OrderedMap(), action = {}) {
  let newState;
  switch (action.type) {
    case ActionTypes.RECEIVE_COMPANIES:
    case ActionTypes.ADD_COMPANY:
    case ActionTypes.EDIT_COMPANY:
    case ActionTypes.RECEIVE_COMPANY:
      newState = state.merge(
        Immutable.fromJS(action.normalizedData.entities.companies)
      );
      return newState.equals(state) ? state : newState;
    // 筛选清空数据
    case ActionTypes.REMOVE_COMPANIES:
      return state.clear();
    case ActionTypes.LOGOUT:
      return state.clear();

    default:
      return state;
  }
}
