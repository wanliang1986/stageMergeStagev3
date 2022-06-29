/**
 * Created by chenghui on 5/23/17.
 */
import * as ActionTypes from '../../constants/actionTypes';
import Immutable from 'immutable';

export default function (state = Immutable.Map(), action = {}) {
  let newState;
  switch (action.type) {
    case ActionTypes.GET_CURRENT_USER:
      let id = action.normalizedData.result;
      newState = state.merge(
        Immutable.fromJS(action.normalizedData.entities.users[id])
      );
      return newState.equals(state) ? state : newState;

    case ActionTypes.ADD_MY_JOBS:
      newState = state.update('myJobs', (myJobs = Immutable.Set()) =>
        myJobs.union(action.ids)
      );
      return newState.equals(state) ? state : newState;

    case ActionTypes.LOGOUT:
      return state.clear();
    default:
      return state;
  }
}
