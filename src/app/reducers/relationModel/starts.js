import * as ActionTypes from '../../constants/actionTypes';
import Immutable from 'immutable';

export default function (state = Immutable.Map(), action = {}) {
  let newState;
  switch (action.type) {
    case ActionTypes.LOGOUT:
      return state.clear();

    case ActionTypes.ADD_START:
    case ActionTypes.RECEIVE_START:
    case ActionTypes.RECEIVE_START_LIST:
    case ActionTypes.ADD_START_TO_LIST:
      newState = state.merge(
        Immutable.fromJS(action.normalizedData.entities.starts)
      );
      return newState.equals(state) ? state : newState;

    case ActionTypes.TERMINATE_START:
      newState = state
        .merge(Immutable.fromJS(action.normalizedData.entities.starts))
        .filter((start) => start.get('id') <= Number(action.startId));
      return newState.equals(state) ? state : newState;

    case ActionTypes.EDIT_START:
      newState = state.mergeDeep(
        Immutable.fromJS(action.normalizedData.entities.starts)
      );
      return newState.equals(state) ? state : newState;

    case ActionTypes.EDIT_START_ADDRESS:
      newState = state.setIn(
        [String(action.startId), 'startAddress'],
        Immutable.fromJS(action.response)
      );
      return newState.equals(state) ? state : newState;

    case ActionTypes.EDIT_START_CONTRACT_RATE:
      newState = state.setIn(
        [String(action.startId), 'startContractRates'],
        Immutable.fromJS(action.response)
      );
      return newState.equals(state) ? state : newState;

    case ActionTypes.DELETE_START_CONTRACT_RATE:
      newState = state.updateIn(
        [String(action.startId), 'startContractRates'],
        (startContractRates = Immutable.List()) =>
          startContractRates.filter(
            (cr) => cr.get('id') !== action.startContractRateId
          )
      );
      return newState.equals(state) ? state : newState;
    case ActionTypes.CLRAE_START:
      newState = Immutable.Map();
      return newState;
    default:
      return state;
  }
}
//======== start status: ACTIVE, TERMINATED, CLOSED, CANCELED, =========
