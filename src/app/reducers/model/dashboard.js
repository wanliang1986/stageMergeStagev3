import * as ActionTypes from '../../constants/actionTypes';
import Immutable from 'immutable';

export default function (state = Immutable.OrderedMap(), action = {}) {
  let newState;
  switch (action.type) {
    case ActionTypes.RECEIVE_DASHBOARD_MYCANDIDATES:
      newState = action.normalizedData.entities.myCandidates;
      newState = Immutable.fromJS(newState ? newState : {});

      return newState.equals(state) ? state : newState;

    case ActionTypes.UPDATE_DASHBOARD_APPL_STATUS:
      newState = state.updateIn(
        [action.applId + '', 'status'],
        () => action.status
      );
      return newState.equals(state) ? state : newState;
    default:
      return state;
  }
}
