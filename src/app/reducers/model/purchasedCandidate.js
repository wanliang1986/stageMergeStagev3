import * as ActionTypes from '../../constants/actionTypes';
import Immutable from 'immutable';

export default function (state = Immutable.List(), action = {}) {
  let newState;
  switch (action.type) {
    case ActionTypes.PURCHASE_ONE_CANDIDATE:
      console.log('in reducer', action);
      newState = state.push(action.esId);

      return newState;

    default:
      return state;
  }
}
