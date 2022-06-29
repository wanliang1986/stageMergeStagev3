import * as ActionTypes from '../../constants/actionTypes';
import Immutable from 'immutable';

export default function (state = Immutable.OrderedMap(), action = {}) {
  let newState;
  switch (action.type) {
    case ActionTypes.LOGOUT:
      return state.clear();
    case ActionTypes.RECEIVE_APPLICATION_COMMISSIONS:
      newState = state
        .filter((c) => c.get('applicationId') !== action.applicationId)
        .merge(
          Immutable.fromJS(
            action.normalizedData.entities.applicationCommissions
          )
        );
      return newState.equals(state) ? state : newState;

    default:
      return state;
  }
}
