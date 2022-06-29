import * as ActionTypes from '../../constants/actionTypes';
import Immutable from 'immutable';

export default function (state = Immutable.OrderedMap(), action = {}) {
  let newState;
  switch (action.type) {
    case ActionTypes.RECEIVE_PARSE_RECORDS:
      newState = state.merge(
        Immutable.fromJS(action.normalizedData.entities.parseRecords)
      );
      return newState.equals(state) ? state : newState;

    case ActionTypes.DELETE_PARSE_RECORD:
      return state.remove(action.recordId.toString());

    case ActionTypes.RECEIVE_PARSE_RECORD:
      return state.set(
        action.parseRecord.id.toString(),
        Immutable.fromJS(action.parseRecord)
      );

    case ActionTypes.LOGOUT:
      return state.clear();

    default:
      return state;
  }
}
