/**
 * Created by chenghui on 6/22/17.
 */
import * as ActionTypes from '../../constants/actionTypes';
import Immutable from 'immutable';

export default function (state = Immutable.OrderedMap(), action = {}) {
  let newState;
  switch (action.type) {
    case ActionTypes.RECEIVE_JOB:
      newState = state.merge(
        Immutable.fromJS(action.normalizedData.entities.jobQuestions)
      );
      return newState.equals(state) ? state : newState;

    case ActionTypes.ADD_JOB_INTERVIEW_QUESTION:
    case ActionTypes.EDIT_JOB_INTERVIEW_QUESTION:
      return state.set(
        action.jobQuestion.id.toString(),
        Immutable.Map(action.jobQuestion)
      );

    case ActionTypes.DELETE_JOB_INTERVIEW_QUESTION:
      return state.remove(action.jobQuestionId);

    case ActionTypes.LOGOUT:
      return state.clear();
    default:
      return state;
  }
}
