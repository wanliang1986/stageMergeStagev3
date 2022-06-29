import Immutable from 'immutable';
import * as ActionTypes from './../constants/actionTypes';

export default function (
  state = Immutable.fromJS({
    candidate: {},
    job: {},
    jobPickCandidate: {},
  }),
  action
) {
  switch (action.type) {
    case ActionTypes.SET_PREFERENCE:
      return state.set(action.module, Immutable.fromJS(action.preference));
    case ActionTypes.UPDATE_PREFERENCE:
      return state.update(action.module, (preference = Immutable.Map()) =>
        preference.merge(Immutable.fromJS(action.preference))
      );

    default:
      return state;
  }
}
