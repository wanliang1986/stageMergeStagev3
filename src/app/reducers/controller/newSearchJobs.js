import * as ActionTypes from './../../constants/actionTypes';
import Immutable, { fromJS, toJS } from 'immutable';

const defaultState = fromJS({
  basicSearch: {
    title: null,
    code: null,
    companyId: null,
    requiredLanguages: null,
    assignedUsers: null,
    requiredSkill: null,
    preferredSkill: null,
    postingTime: null,
    jobFunctions: null,
    status: null,
    type: null,
    locations: null,
    currency: null,
    minimumDegreeLevel: null,
    experienceYearRange: null,
    'Rate/Salary': null,
  },
  advancedFilter: {},
  loading: true,
  tableData: [],
  page: 1,
  size: 10,
  count: 0,
  searchLevel: 'BASE',
  sort: {},
  general: '',
  isFavorite: false,
  allOrMy: false, // false： all job, true: my job
  stopFlag: false,
  pageModel: '',
});

export default function (state = defaultState, action = {}) {
  switch (action.type) {
    case ActionTypes.NEW_SEARCH_JOB:
      return state.setIn(
        ['basicSearch', action.payload.type],
        action.payload.value
      );
    case ActionTypes.NEW_SEARCH_JOB_DELETE:
      return state.setIn(['basicSearch', action.payload.type], null);

    case ActionTypes.NEW_SEARCH_JOB_RESET_BASE:
      return state.set('basicSearch', defaultState.toJS().basicSearch);

    case ActionTypes.NEW_SEARCH_JOB_PAGEMODEL:
      return state.set('pageModel', action.payload);

    case ActionTypes.NEW_SEARCH_JOB_RESET_ADVANCED:
      return state.set('advancedFilter', defaultState.toJS().advancedFilter);

    case ActionTypes.NEW_SEARCH_JOB_SETIN:
      return state.set('basicSearch', action.payload);

    case ActionTypes.NEW_SEARCH_JOB_GETDATA:
      return state.set('tableData', action.payload);

    case ActionTypes.NEW_SEARCH_JOB_DATARESET:
      return state.set('tableData', []);

    case ActionTypes.NEW_SEARCH_JOB_LOADING:
      return state.set('loading', action.payload);

    case ActionTypes.NEW_SEARCH_JOB_ADVANCED:
      return state.set('advancedFilter', action.payload);

    case ActionTypes.NEW_SEARCH_JOB_ADVINCED_RESET:
      return state.set('advancedFilter', {});

    case ActionTypes.NEW_SEARCH_JOB_SORT:
      return state.setIn(['sort', action.payload.name], action.payload.value);
    case ActionTypes.NEW_SEARCH_JOB_LEVEL:
      return state.set('searchLevel', action.payload);
    case ActionTypes.NEW_SEARCH_JOB_PAGESIZE:
      let newstate = state.set('page', action.payload.page);
      newstate = newstate.set('size', action.payload.size);
      return newstate;
    case ActionTypes.NEW_SEARCH_JOB_DATACOUNT:
      return state.set('count', action.payload);
    case ActionTypes.NEW_SEARCH_JOB_GENERAL:
      return state.set('general', action.payload);
    case ActionTypes.NEW_SEARCH_JOB_RESET_GENERAL:
      return state.set('general', '');
    case ActionTypes.NEW_SEARCH_JOB_SORT_RESET:
      return state.set('sort', {});
    case ActionTypes.NEW_SEARCH_JOB_FAVORITE:
      return state.set('isFavorite', action.payload);
    case ActionTypes.NEW_SEARCH_JOB_MYORALL:
      return state.set('allOrMy', action.payload);
    case ActionTypes.NEW_SEARCH_JOB_STOPFLAG:
      return state.set('stopFlag', action.payload);
    default:
      return state;
  }
}
