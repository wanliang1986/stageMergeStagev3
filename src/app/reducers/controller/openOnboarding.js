import * as ActionTypes from '../../constants/actionTypes';

export default function (state = null, action = {}) {
  let newState;
  switch (action.type) {
    case ActionTypes.OPEN_ON_BOARDING:
      newState = action;
      return newState;
    default:
      return state;
  }
}
