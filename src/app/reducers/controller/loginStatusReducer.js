import * as ActionTypes from './../../constants/actionTypes';

export default function (state = false, action) {
    switch (action.type) {
        case ActionTypes.LOGIN:
            return true;
        case ActionTypes.LOGOUT:
            return false;
        case ActionTypes.LOGIN_CHECKED:
            return action.logged;

        default:
            return state;
    }
};