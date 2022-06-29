import * as ActionTypes from '../../constants/actionTypes';
import Immutable from 'immutable';

export default function (state = Immutable.List(), action = {}) {
  console.log(action);
  let newState;
  switch (action.type) {
    case ActionTypes.NO_CONTRACT_CLIENT:
      newState = Immutable.fromJS(action.normalizedNoContarctData);
      return newState;
    case ActionTypes.LOGOUT:
      return state.clear();
    default:
      return state;
  }
}
