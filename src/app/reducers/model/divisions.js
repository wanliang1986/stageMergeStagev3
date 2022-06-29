import * as ActionTypes from '../../constants/actionTypes';
import Immutable from 'immutable';

export default function (state = Immutable.OrderedMap(), action = {}) {
    let newState;
    switch (action.type) {
        case ActionTypes.GET_DIVISIONS:
            newState = state.merge(Immutable.fromJS(action.normalizedData.entities.divisions));
            return newState.equals(state) ? state : newState;

        case ActionTypes.DELETE_DIVISION:
            return state.remove(action.divisionId.toString());

        case ActionTypes.ADD_DIVISION:
        case ActionTypes.EDIT_DIVISION:
        case ActionTypes.RECEIVE_DIVISION:
            return state.set(action.division.id.toString(), Immutable.fromJS(action.division));

        case ActionTypes.LOGOUT:
            return state.clear();

        default:
            return state;
    }
}