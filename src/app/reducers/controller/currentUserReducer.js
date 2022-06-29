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
      let firstName = action.normalizedData.entities.users[id].firstName;
      let lastName = action.normalizedData.entities.users[id].lastName;
      let username = action.normalizedData.entities.users[id].username;
      // let id = action.normalizedData;
      newState = state.merge(
        Immutable.fromJS(action.normalizedData.entities.users[id])
      );
      newState = newState.merge(
        Immutable.fromJS(action.normalizedData.entities.users[firstName])
      );
      newState = newState.merge(
        Immutable.fromJS(action.normalizedData.entities.users[lastName])
      );
      newState = newState.merge(
        Immutable.fromJS(action.normalizedData.entities.users[username])
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
