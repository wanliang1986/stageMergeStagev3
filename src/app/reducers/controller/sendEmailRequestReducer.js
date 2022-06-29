import * as ActionTypes from './../../constants/actionTypes';
import Immutable from 'immutable';

export default function (state = Immutable.List(), action) {
  switch (action.type) {
    case ActionTypes.ADD_SEND_EMAIL_REQUEST:
      return state.push(Immutable.Map(action.request));
    case ActionTypes.REMOVE_SEND_EMAIL_REQUEST:
      return state.shift();
    default:
      return state;
  }
}
