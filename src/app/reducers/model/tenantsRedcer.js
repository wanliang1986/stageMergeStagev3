/**
 * Created by chenghui on 6/20/17.
 */
import * as ActionTypes from '../../constants/actionTypes';
import Immutable from 'immutable';

export default function (state = Immutable.Map(), action = {}) {
    switch (action.type) {
        case ActionTypes.GET_CURRENT_USER:
            return Immutable.fromJS(action.normalizedData.entities.tenants);
        case ActionTypes.LOGOUT:
            return state.clear();
        case ActionTypes.UPDATE_COMPANY:
            return state.setIn([action.tenantId.toString(), 'company'], Immutable.fromJS(action.payload));

        default:
            return state;
    }
}
