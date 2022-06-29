import * as ActionTypes from '../../constants/actionTypes';
import Immutable from 'immutable';

export default function (state = Immutable.OrderedMap(), action = {}) {
  let newState;
  switch (action.type) {
    case ActionTypes.GET_SKIP_SUBMIT_TO_AM_COMPANIES:
      newState = state.merge(
        Immutable.fromJS(action.normalizedData.entities.skimSubmitToAMCompanies)
      );
      return newState.equals(state) ? state : newState;

    case ActionTypes.LOGOUT:
      return state.clear();

    default:
      return state;
  }
}
