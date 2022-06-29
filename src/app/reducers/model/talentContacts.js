/**
 * Created by chenghui on 6/9/17.
 */
import * as ActionTypes from '../../constants/actionTypes';
import Immutable from 'immutable';

export default function (state = Immutable.OrderedMap(), action = {}) {
    let newState;
    switch (action.type) {

        case ActionTypes.RECEIVE_TALENT:
            newState = state.merge(Immutable.fromJS(action.normalizedData.entities.talentContacts));
            return newState.equals(state) ? state : newState;

        case ActionTypes.DELETE_TALENT_CONTACT:
            return state.remove(action.contactId.toString());

        case ActionTypes.ADD_TALENT_CONTACT:
        case ActionTypes.EDIT_TALENT_CONTACT:
            return state.set(action.contact.id.toString(), Immutable.fromJS(action.contact));
        default:
            return state;
    }
}
