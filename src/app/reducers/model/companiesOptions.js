import * as ActionTypes from '../../constants/actionTypes';
import Immutable from 'immutable';

export default function (state = Immutable.List(), action = {}) {
  let newState;
  switch (action.type) {
    case ActionTypes.REVEIVE_COMPANIES_OPTIONS:
      newState = Immutable.List(action.companiesOptions);
      return newState;
    default:
      return state;
  }
}
