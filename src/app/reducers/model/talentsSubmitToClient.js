import {
    TALENTS_SUBMIT_TO_CLIENT_REQUEST,
    TALENTS_SUBMIT_TO_CLIENT_FAILURE,
    TALENTS_SUBMIT_TO_CLIENT_SUCCESS,
    TALENTS_SUBMIT_TO_CLIENT_CLEAR,
    LOGOUT
} from "../../constants/actionTypes";
import immutable from 'immutable';
import { combineReducers } from 'redux';

const tstcReducer = (state = immutable.Map(), action = {}) => {
    switch (action.type) {
        case LOGOUT:
        case TALENTS_SUBMIT_TO_CLIENT_CLEAR:
            return state.clear();
        case TALENTS_SUBMIT_TO_CLIENT_REQUEST:
            return state;
        case TALENTS_SUBMIT_TO_CLIENT_FAILURE:
            return state;
        case TALENTS_SUBMIT_TO_CLIENT_SUCCESS:
            if (action.data) {
                let newState = state.mergeDeep(immutable.fromJS(action.data.entities));
                return newState.equals(state) ? state : newState;
            } else
                return state;
        default:
            return state;
    }
};

const tsctIdReducer = (state = immutable.List(), action = {}) => {
    switch (action.type) {
        case LOGOUT:
        case TALENTS_SUBMIT_TO_CLIENT_CLEAR:
            return state;
        case TALENTS_SUBMIT_TO_CLIENT_REQUEST:
            return state;
        case TALENTS_SUBMIT_TO_CLIENT_FAILURE:
            return state;
        case TALENTS_SUBMIT_TO_CLIENT_SUCCESS:

            if (action.data) {
                let newState = immutable.fromJS(action.data.result);
                return newState.equals(state) ? state : newState;
            } else
                return immutable.List();
        default:
            return state;
    }
};

export default combineReducers({
    tstcActivity: tstcReducer,
    tstcIds: tsctIdReducer
});
