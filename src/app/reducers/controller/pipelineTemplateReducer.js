import * as ActionTypes from '../../constants/actionTypes';
let data = [];

export default function (state = data, action = {}) {
  switch (action.type) {
    case ActionTypes.RECEIVE_PIPELINE_TEMPLATE:
      data = action.template;
      return [...data];
    case ActionTypes.CLEAR_PIPELINE_TEMPLATE:
    case ActionTypes.LOGOUT:
      return (state = {});
    default:
      return state;
  }
}
