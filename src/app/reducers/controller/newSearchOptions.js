import * as ActionTypes from './../../constants/actionTypes';
import Immutable, { fromJS, toJS } from 'immutable';

const defaultState = fromJS({
  companyOptions: [],
  allUserOptions: [],
  userOptions: [],
  degreeOptions: [],
  languagesOptions: [],
  functionOptions: [],
});

export default function (state = defaultState, action = {}) {
  switch (action.type) {
    case ActionTypes.NEW_SEARCH_OPTIONS:
      return state.set(action.payload[0], action.payload[1]);
    case ActionTypes.NEW_SEARCH_JOB_UPDATE:
      return state;
    default:
      return state;
  }
}
