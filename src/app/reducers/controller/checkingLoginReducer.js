/**
 * Created by chenghui on 5/23/17.
 */
import * as ActionTypes from '../../constants/actionTypes';

export default function (state = false, action = {}) {
  switch (action.type) {
    case ActionTypes.LOGIN_CHECKED:
      return true;
    default:
      return state;
  }
}
