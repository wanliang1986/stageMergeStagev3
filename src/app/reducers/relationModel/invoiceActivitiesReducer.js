import Immutable from 'immutable';
import * as ActionTypes from '../../constants/actionTypes';

export default function (state = Immutable.OrderedMap(), action = {}) {
  let newState;
  switch (action.type) {
    case ActionTypes.GET_INVOICE_DETAIL_LIST:
      newState = state.merge(
        Immutable.fromJS(action.normalizedData.entities.invoiceActivities)
      );
      return newState.equals(state) ? state : newState;

    case ActionTypes.PAID_INVOICE:
    case ActionTypes.APPLY_CREDIT_INVOICE:
    case ActionTypes.VOID_INVOICE:
      return state.set(
        String(action.invoiceActivity.id),
        Immutable.Map(action.invoiceActivity)
      );
    case ActionTypes.LOGOUT:
      return state.clear();

    default:
      return state;
  }
}
