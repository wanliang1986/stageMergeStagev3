import * as ActionTypes from '../../constants/actionTypes';
import Immutable from 'immutable';

export default function (state = Immutable.OrderedMap(), action = {}) {
    let newState;
    switch (action.type) {
        case ActionTypes.RECEIVE_TALENT_RESUME:
        case ActionTypes.ADD_TALENT_RESUME:
            newState = state.mergeDeep(Immutable.fromJS(action.normalizedData.entities.talentResumes));
            return newState.equals(state) ? state : newState;

        case ActionTypes.DELETE_TALENT_RESUME:
            return state.remove(action.talentResumeId.toString());

        default:
            return state;
    }
}