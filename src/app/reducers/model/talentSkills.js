/**
 * Created by chenghui on 6/9/17.
 */
import * as ActionTypes from '../../constants/actionTypes';
import Immutable from 'immutable';

export default function (state = Immutable.OrderedMap(), action = {}) {
    let newState;
    switch (action.type) {

        case ActionTypes.RECEIVE_TALENT:
            newState = state.merge(Immutable.fromJS(action.normalizedData.entities.talentSkills));
            return newState.equals(state) ? state : newState;

        case ActionTypes.DELETE_TALENT_SKILL:
            return state.remove(action.talentSkillId.toString());

        case ActionTypes.ADD_TALENT_SKILL:
        case ActionTypes.EDIT_TALENT_SKILL:
            return state.set(action.talentSkill.id.toString(), Immutable.fromJS(action.talentSkill));
        default:
            return state;
    }
}
