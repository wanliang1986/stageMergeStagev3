import * as ActionTypes from '../../constants/actionTypes';
import Immutable from 'immutable';

export default function (state = Immutable.OrderedMap(), action = {}) {
  let newState;
  switch (action.type) {
    case ActionTypes.RECEIVE_TALENT_OWNERSHIPS:
      newState = state
        .filter((o) => o.get('talentId') !== Number(action.talentId))
        .mergeDeep(
          Immutable.fromJS(action.normalizedData.entities.talentOwnerships)
        );
      return newState.equals(state) ? state : newState;

    default:
      return state;
  }
}
