/**
 * Created by chenghui on 6/12/17.
 */
import * as ActionTypes from '../../constants/actionTypes';
import Immutable from 'immutable';

export default function (state = Immutable.OrderedMap(), action = {}) {
  // let newState;
  switch (action.type) {
    case ActionTypes.RECEIVE_TALENT:
      return state.merge(
        Immutable.fromJS(action.normalizedData.entities.talentNotes)
      );

    case ActionTypes.ADD_TALENT_NOTE:
      return state.set(
        action.talentNote.id.toString(),
        Immutable.Map(action.talentNote)
      );

    case ActionTypes.LOGOUT:
      return state.clear();
    default:
      return state;
  }
}
