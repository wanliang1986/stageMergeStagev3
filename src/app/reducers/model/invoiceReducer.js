import * as ActionTypes from '../../constants/actionTypes';
import Immutable from 'immutable';

export default function (state = Immutable.OrderedMap(), action = {}) {
  let newState;
  switch (action.type) {
    case ActionTypes.GET_ALL_INVOICE_LIST:
      newState = state.merge(
        Immutable.OrderedMap(action.normalizedData.entities.invoices)
      );
      // console.log('&&&&&[invoice data]',newState.keySeq().toList().toJS());
      // console.log('&&&&&[invoice data]',newState.toList());
      console.log('in reducer', newState);
      return newState;
    case ActionTypes.CLEAR_INVOICE_LIST:
      return Immutable.OrderedMap();

    default:
      return state;
  }
}
