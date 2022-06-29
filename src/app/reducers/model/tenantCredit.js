import * as ActionTypes from '../../constants/actionTypes';
import Immutable from 'immutable';

export default function (state = Immutable.Map(), action = {}) {
  let newState;
  switch (action.type) {
    case ActionTypes.SET_TENANT_MONTHLY_CREDIT:
      newState = state.set('availableMonthlyCredit', action.monthlyCredit);
      return newState;
    case ActionTypes.SET_TENANT_BULK_CREDIT:
      newState = state.set('availableBulkCredit', action.bulkCredit);
      return newState;
    case ActionTypes.SET_TOTALMONTHLY_CREDIT:
      newState = state.set('totalMonthlyCredit', action.totalMonthlyCredit);
      return newState;
    case ActionTypes.SET_NEXT_MONTHLY_CREDIT:
      newState = state.set(
        'nextMonthAvailableCredit',
        action.nextMonthAvailableCredit
      );
      return newState;
    case ActionTypes.LOGOUT:
      return Immutable.Map();
    default:
      return state;
  }
}
