import * as ActionTypes from './../../constants/actionTypes';
import Immutable, { fromJS, toJS } from 'immutable';

const defaultState = fromJS({
  jobFounctionList: [],
  languageList: [],
  degreeList: [],
  workAuthList: [],
  industryList: [],
  companyOptions: [],
  allUserOptions: [],
  jobFounctionListZh: [],
  industryListZh: [],
});

export default function (state = defaultState, action = {}) {
  switch (action.type) {
    case ActionTypes.CANDIDATE_OPTIONS:
      return state.set(action.payload[0], action.payload[1]);
    default:
      return state;
  }
}
