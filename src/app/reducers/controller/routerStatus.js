import * as ActionTypes from './../../constants/actionTypes';

export default function (state = null, action) {
  if (action.type === ActionTypes.SET_ROUTER) {
    return action.router;
  } else {
    return state;
  }
}
