/**
 * Created by chenghui on 6/5/17.
 */
import * as ActionTypes from '../../constants/actionTypes';
import Immutable from 'immutable';

export default function (state = Immutable.OrderedMap(), action = {}) {
    let newState;
    switch (action.type) {
        case ActionTypes.GET_USER_NOTIFICATION:
            // case ActionTypes.ADD_JOB:
            // case ActionTypes.EDIT_JOB:
            newState = Immutable.fromJS(action.normalizedData.entities.notifications);
            return (!newState || newState.equals(state)) ? state : newState;

        case ActionTypes.DELETE_NOTIFICATION:
            return state.remove(action.notificationId.toString());

        default:
            return state;
    }
}