import * as ActionTypes from '../../constants/actionTypes';
import Immutable from 'immutable';

export default function (state = Immutable.OrderedMap(), action = {}) {
  let newState;
  switch (action.type) {
    case ActionTypes.GET_HOT_LIST_TALENTS2:
      if (action.normalizedData.entities.hotListTalents) {
        newState = Immutable.fromJS(
          action.normalizedData.entities.hotListTalents
        );
      } else {
        newState = Immutable.OrderedMap();
      }
      // state.merge(
      //   Immutable.fromJS(action.normalizedData.entities.hotListTalents)
      // );
      return newState.equals(state) ? state : newState;

    case ActionTypes.LOGOUT:
      return state.clear();

    default:
      return state;
  }
}
