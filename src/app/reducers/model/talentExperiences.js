/**
 * Created by chenghui on 6/3/17.
 */
import * as ActionTypes from '../../constants/actionTypes';
import Immutable from 'immutable';

export default function (state = Immutable.OrderedMap(), action = {}) {
  let newState;
  switch (action.type) {
    case ActionTypes.RECEIVE_TALENT:
      newState = state.merge(
        Immutable.fromJS(action.normalizedData.entities.talentExperiences)
      );
      return newState.equals(state) ? state : newState;

    case ActionTypes.DELETE_TALENT_EXPERIENCE:
      return state.remove(action.experienceId.toString());

    case ActionTypes.ADD_TALENT_EXPERIENCE:
    case ActionTypes.EDIT_TALENT_EXPERIENCE:
      return state.set(
        action.experience.id.toString(),
        Immutable.fromJS(action.experience)
      );

    default:
      return state;
  }
}
