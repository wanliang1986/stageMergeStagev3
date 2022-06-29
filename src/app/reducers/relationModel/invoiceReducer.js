import Immutable from 'immutable';
import * as ActionTypes from '../../constants/actionTypes';

export default function(state = Immutable.OrderedMap(), action = {}) {
  let newState;
  switch (action.type) {
    case ActionTypes.RECEIVE_INVOICE_LIST:
    case ActionTypes.ADD_INVOICE_TO_LIST:
    case ActionTypes.GET_INVOICE_DETAIL_LIST:
    case ActionTypes.UPDATE_INVOICE:
    case ActionTypes.ADD_SUB_INVOICE_LIST:
      newState = state.merge(
        Immutable.fromJS(action.normalizedData.entities.invoices)
      );
      return newState.equals(state) ? state : newState;

    case ActionTypes.PAID_INVOICE:
      return state.updateIn(
        [String(action.invoiceActivity.invoiceId)],
        (invoice = Immutable.Map()) => {
          const invoiceType = invoice.get('invoiceType');
          const newStatus =
            invoiceType === 'STARTUP_FEE' ? 'STARTUP_FEE_PAID_UNUSED' : 'PAID';
          return invoice.set('status', newStatus);
        }
      );
    case ActionTypes.VOID_INVOICE:
      return state.updateIn(
        [String(action.invoiceActivity.invoiceId)],
        (invoice = Immutable.Map()) => invoice.set('status', 'VOID')
      );
    case ActionTypes.LOGOUT:
      return state.clear();

    default:
      return state;
  }
}
