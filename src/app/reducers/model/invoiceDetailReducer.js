import * as ActionTypes from '../../constants/actionTypes';
import Immutable from 'immutable';

export default function (state = Immutable.OrderedMap(), action = {}) {
  let newState;
  switch (action.type) {
    case ActionTypes.GET_INVOICE_DETAIL_LIST:
      newState = Immutable.OrderedMap().merge(
        Immutable.OrderedMap(
          Immutable.fromJS(action.normalizedData.entities.invoices)
        )
      );
      console.log(
        '^^^^^[invoice detail]^^^^^',
        newState.keySeq().toList().toJS()
      );
      return newState;
    case ActionTypes.CLEAR_INVOICE_DETAIL_LIST:
      return Immutable.OrderedMap();
    case ActionTypes.EDIT_INVOICE_DETAIL_STATUS:
      return state.updateIn(
        [action.invoice.id.toString(), 'status'],
        (val) => action.invoice.status
      );
    default:
      return state;
  }
}
