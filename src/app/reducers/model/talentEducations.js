/**
 * Created by chenghui on 6/3/17.
 */
import * as ActionTypes from '../../constants/actionTypes';
import Immutable from 'immutable';

export default function (state = Immutable.OrderedMap(), action = {}) {
  let newState;
  switch (action.type) {
    case ActionTypes.RECEIVE_TALENT:
    case ActionTypes.GET_HOT_LIST_TALENTS2:
      newState = state.merge(
        Immutable.fromJS(action.normalizedData.entities.talentEducations)
      );
      return newState.equals(state) ? state : newState;

    case ActionTypes.DELETE_TALENT_EDUCATION:
      return state.remove(action.educationId.toString());

    case ActionTypes.ADD_TALENT_EDUCATION:
    case ActionTypes.EDIT_TALENT_EDUCATION:
      return state.set(
        action.education.id.toString(),
        Immutable.fromJS(action.education)
      );
    default:
      return state;
  }
}
