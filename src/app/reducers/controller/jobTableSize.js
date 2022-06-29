import * as ActionTypes from '../../constants/actionTypes';

export default function (state = false, action = {}) {
  switch (action.type) {
    case ActionTypes.BIG_TABLE:
      return (state = false);

    case ActionTypes.NONE_TABLE:
      return (state = true);

    default:
      return state;
  }
}
