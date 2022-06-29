import * as ActionTypes from '../../constants/actionTypes';
import Immutable from 'immutable';

export default function (state = Immutable.OrderedMap(), action = {}) {
  let newState;
  switch (action.type) {
    case ActionTypes.RECEIVE_CONTRACTSBYCOMPANY:
      newState = state.merge(
        Immutable.fromJS(action.normalizedData.entities.contracts)
      );
      return newState.equals(state) ? state : newState;
    case ActionTypes.DELETE_CONTRACT:
      return state.remove(action.contractId.toString());
    case ActionTypes.ADD_CONTRACT:
    case ActionTypes.EDIT_CONTRACT:
      console.log('contract reducer');
      return state.set(
        action.contract.id.toString(),
        Immutable.fromJS(action.contract)
      );
    default:
      return state;
  }
}
