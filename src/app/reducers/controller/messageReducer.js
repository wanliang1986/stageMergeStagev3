/**
 * Created by chenghuijin on 3/7/2017.
 */
import * as ActionTypes from './../../constants/actionTypes';
import Immutable from 'immutable';

export default function (state = Immutable.List(), action) {
    switch (action.type) {
        case ActionTypes.ADD_MESSAGE:
            return state.push(Immutable.Map(action.message));
        case ActionTypes.REMOVE_MESSAGE:
            return state.shift();
        default:
            return state;
    }
};