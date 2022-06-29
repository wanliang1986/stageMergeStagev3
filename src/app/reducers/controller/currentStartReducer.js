/**
 * Created by chenghui on 02/09/21.
 */
import * as ActionTypes from '../../constants/actionTypes';
import Immutable from 'immutable';

export default function (state = Immutable.Map(), action = {}) {
  let newState;
  switch (action.type) {
    case ActionTypes.SELECT_START:
      newState = state.set('start', action.start);
      const newState_1 = newState.set('isShowStart', action.isShowStart);
      return newState.equals(state) ? state : newState_1;

    case ActionTypes.SELECT_EXTENSION:
      newState = state.set('extension', action.extension);
      return newState.equals(state) ? state : newState;
    case ActionTypes.SELECT_CONVERSION_START:
      newState = state.set('conversionStart', action.conversionStart);
      return newState.equals(state) ? state : newState;

    case ActionTypes.LOGOUT:
      return state.clear();
    default:
      return state;
  }
}
