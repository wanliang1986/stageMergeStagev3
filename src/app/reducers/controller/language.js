import * as ActionTypes from '../../constants/actionTypes';

export default function (state = false, action = {}) {
  switch (action.type) {
    case ActionTypes.LANGUAGE_ZH:
      return (state = false);

    case ActionTypes.LANGUAGE_EN:
      return (state = true);

    default:
      return state;
  }
}
