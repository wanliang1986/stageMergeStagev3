/**
 * Created by chenghui on 6/3/17.
 */
import * as ActionTypes from '../../constants/actionTypes';
import Immutable from 'immutable';

export default function (state = Immutable.OrderedMap(), action = {}) {
  let newState;
  switch (action.type) {
    case ActionTypes.RECEIVE_TALENT:
      newState = state.merge(
        Immutable.fromJS(action.normalizedData.entities.talentCertificates)
      );
      return newState.equals(state) ? state : newState;

    case ActionTypes.EDIT_TALENT_CERTIFICATE:
    case ActionTypes.ADD_TALENT_CERTIFICATE:
      return state.set(
        action.certificate.id.toString(),
        Immutable.fromJS(action.certificate)
      );

    case ActionTypes.DELETE_TALENT_CERTIFICATE:
      return state.remove(action.certificateId.toString());

    default:
      return state;
  }
}
