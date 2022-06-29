import * as ActionTypes from '../../constants/actionTypes';
import Immutable from 'immutable';
export default function (state = Immutable.OrderedMap(), action = {}) {
  switch (action.type) {
    // case ActionTypes.UUID:
    //   return state.set('uuid', action.uuid);
    case ActionTypes.RECEIVE_PARSE_RECORD_BY_UUID:
      console.log(action);
      return state.set(String(action.parseOutput.uuid), action.parseOutput);
    default:
      return state;
  }
}
