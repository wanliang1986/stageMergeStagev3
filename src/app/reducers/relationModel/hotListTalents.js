import * as ActionTypes from '../../constants/actionTypes';
import Immutable from 'immutable';

export default function (state = Immutable.OrderedMap(), action = {}) {
  let newState;
  switch (action.type) {
    case ActionTypes.GET_HOT_LIST_TALENTS2:
      newState = state
        .filter((e) => e.get('hotListId') !== action.hotListId)
        .merge(Immutable.fromJS(action.normalizedData.entities.hotListTalents));

      return newState.equals(state) ? state : newState;

    case ActionTypes.DELETE_HOT_LIST_TALENT:
      return (newState = state.filter(
        (e) =>
          !(
            e.get('talentId') === action.talentId &&
            e.get('hotListId') === action.hotListId
          )
      ));

    case ActionTypes.LOGOUT:
      return state.clear();

    default:
      return state;
  }
}
