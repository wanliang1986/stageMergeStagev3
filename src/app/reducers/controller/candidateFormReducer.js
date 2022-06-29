/**
 * Created by chenghui on 5/24/17.
 */
import * as ActionTypes from '../../constants/actionTypes';
import Immutable from 'immutable';

export default function (state = Immutable.OrderedMap(), action = {}) {
    switch (action.type) {
        case ActionTypes.ADD_CANDIDATE:
            return Immutable.fromJS(action.candidate);
        case ActionTypes.LOGOUT:
            return state.clear();
        default:
            return state;
    }
}