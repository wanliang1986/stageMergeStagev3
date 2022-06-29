/**
 * Created by chenghui on 5/31/17.
 */
import * as ActionTypes from '../../constants/actionTypes';
import Immutable from 'immutable';

export default function (state = Immutable.OrderedMap(), action = {}) {
  let newState;
  switch (action.type) {
    case ActionTypes.GET_ACTIVITIES_BY_APPLICATION:
      newState = state.merge(
        Immutable.fromJS(action.normalizedData.entities.activities)
      );
      return newState.equals(state) ? state : newState;

    case ActionTypes.EDIT_APPLICATION:
      return state.set(
        String(action.currentActivity.id),
        Immutable.Map(action.currentActivity)
      );

    case ActionTypes.LOGOUT:
      return state.clear();
    default:
      return state;
  }
}
