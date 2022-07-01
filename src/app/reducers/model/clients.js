import * as ActionTypes from '../../constants/actionTypes';
import Immutable from 'immutable';

export default function (state = Immutable.OrderedMap(), action = {}) {
  let newState;
  switch (action.type) {
    case ActionTypes.RECEIVE_CLIENT_CONTACTS:
    case ActionTypes.RECEIVE_CLIENTSBYCOMPANY:
    case ActionTypes.RECEIVE_OPENJOBSBYCOMPANY:
    case ActionTypes.RECEIVE_CONTRACTSBYCOMPANY:
    case ActionTypes.RECEIVE_JOB_LIST:
      newState = state.mergeDeep(
        Immutable.fromJS(action.normalizedData.entities.clients)
      );
      return newState.equals(state) ? state : newState;

    case ActionTypes.DELETE_CLIENT_CONTACT:
      return state.remove(action.clientId.toString());

    case ActionTypes.GET_CLIENT_CONTACT:
    case ActionTypes.ADD_CLIENT_CONTACT:
    case ActionTypes.EDIT_CLIENT_CONTACT:
      return state.set(
        action.client.id.toString(),
        Immutable.fromJS(action.client)
      );
    case ActionTypes.REQUEST_CLIENTSBYCOMPANY:
    case ActionTypes.LOGOUT:
      return state.clear();

    default:
      return state;
  }
}
