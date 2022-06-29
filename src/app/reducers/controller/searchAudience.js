import Immutable from 'immutable';
import * as ActionTypes from '../../constants/actionTypes';

const filters = {
  locations: [],
  collegeLeague: [],
  studiedInTopColleges: null,
  collegeName: [],
  degrees: [],
  title: [],
  jobFunctions: [],
  industry: [],
  companyScope: [],
  company: {
    names: [],
  },
  salary: { gte: null, lte: null },
  skills: [],
  age: { gte: null, lte: null },
  languages: [],
  jobLevel: { gte: null, lte: null },
  experience: { gte: null, lte: null },
  hasPrivateEmail: null,
  applyAtc: false,
  useValidatedAudience: false,
};

export default function (state = Immutable.fromJS({ filters }), action) {
  let newState = Immutable.fromJS({ filters });
  switch (action.type) {
    case ActionTypes.UPDATE_TOTAL:
      newState = state.set('total', action.total);
      return newState.equals(state) ? state : newState;

    case ActionTypes.REQUEST_SEARCH_DATA:
      return state.set('loading', true);
    case ActionTypes.CEASE_SEARCH_DATA:
      return state.set('loading', false);
    case ActionTypes.FAILURE_SEARCH_DATA:
      return state.set('loading', false);

    case ActionTypes.RECEIVE_SEARCH_DATA:
      newState = state
        .set('audience', Immutable.List(action.result))
        .set('loading', false);
      return newState;

    case ActionTypes.UPDATE_FILTERS:
      const [key, val] = Object.entries(action.filter)[0];
      newState = state.setIn(['filters', key], Immutable.fromJS(val));
      // syncSearchRecords(newState);
      return newState;

    case ActionTypes.CLEARALL:
      return Immutable.fromJS({
        filters,
        clearRange: ['age', 'salary', 'experience'],
      });

    default:
      return state;
  }
}

function syncSearchRecords(newState) {
  try {
    localStorage.setItem('searchRecords', JSON.stringify(newState));
  } catch (e) {
    console.error('failed to save searchRecords', e);
  }
}
