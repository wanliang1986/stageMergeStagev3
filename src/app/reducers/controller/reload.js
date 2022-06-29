import * as ActionTypes from '../../constants/actionTypes';

export default function (state='', action = {}) {
    switch (action.type) {
        case ActionTypes.RELOAD:
            return action.key || state;
        default:
            return state;
    }
}