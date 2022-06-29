import * as ActionTypes from '../../constants/actionTypes';

export default function (state = {}, action = {}) {
  let newState;
  switch (action.type) {
    case ActionTypes.RECEIVE_PIPELINE_MAIN_FILTER:
      newState = action.filters;
      return newState;
    case ActionTypes.CLEAR_PIPELINE_MAIN_FILTER:
    case ActionTypes.LOGOUT:
      return (state = {});
    default:
      return state;
  }
}
