import * as ActionTypes from '../../constants/actionTypes';

export default function (state = {}, action = {}) {
  let newState;
  switch (action.type) {
    case ActionTypes.RECEIVE_FILTERS:
      newState = action.filters;
      return newState;
    case ActionTypes.CLEAR_FILTERS:
    case ActionTypes.LOGOUT:
      return (state = {});
    default:
      return state;
  }
}
