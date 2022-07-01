import * as ActionTypes from '../../constants/actionTypes';
import Immutable from 'immutable';

export default function (state = false, action = {}) {
  switch (action.type) {
    case ActionTypes.UPDATE_DB_DATA:
      return true;

    case ActionTypes.FINISH_UPDATE_DB_DATA:
      return false;
    default:
      return false;
  }
}
