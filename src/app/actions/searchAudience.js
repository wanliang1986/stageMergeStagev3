import * as ActionTypes from '../constants/actionTypes';
import Immutable from 'immutable';
import { showErrorMessage } from './index';
import { searchAudience } from '../../apn-sdk/client';

const filters = {
  locations: [],
  collegeLeague: [],
  studiedInTopColleges: '',
  collegeName: [],
  degrees: [],
  title: [],
  jobFunctions: [],
  industry: [],
  companyScope: [],
  hasPrivateEmail: null,
  company: {
    names: [],
  },
  salary: { gte: null, lte: null },
  skills: [],
  age: { gte: null, lte: null },
  languages: [],
  jobLevel: { gte: null, lte: null },
  experience: { gte: null, lte: null },
  applyAtc: false,
  useValidatedAudience: false,
};

function companySort(data) {
  let flag = false;
  let html = null;

  for (let i = 0; i < data.length; i++) {
    let item = data[i];
    if (item.priorityDisplay) {
      flag = true;
      return (html = `${item.company ? item.company : 'Unknown'} --  -- ${
        item.title ? item.title : 'Unknown'
      }`);
    }
  }
  if (!flag) {
    return (html = `${data[0].company ? data[0].company : 'Unknown'} --  -- ${
      data[0].title ? data[0].title : 'Unknown'
    }`);
  }
}

function educationsSort(data) {
  let flag = false;
  let html = null;

  for (let i = 0; i < data.length; i++) {
    let item = data[i];
    if (item.priorityDisplay) {
      flag = true;
      return (html = `${item.collegeName ? item.collegeName : 'Unknown'}`);
    }
  }
  if (!flag) {
    return (html = `${data[0].collegeName ? data[0].collegeName : 'Unknown'}`);
  }
}

export const getFilterData = (filter) => (dispatch, getState) => {
  dispatch({
    type: ActionTypes.REQUEST_SEARCH_DATA,
  });

  dispatch({
    type: ActionTypes.UPDATE_FILTERS,
    filter,
  });

  let curFilters = getState().controller.searchAudience.get('filters').toJS();
  if (Immutable.fromJS(filters).equals(Immutable.fromJS(curFilters))) {
    console.log('same');
    dispatch({ type: ActionTypes.CLEARALL });
    return;
  } else {
    searchAudience(curFilters)
      .then(({ response, headers }) => {
        dispatch({
          type: ActionTypes.UPDATE_TOTAL,
          total: headers.get('Pagination-Count'),
        });
        dispatch({
          type: ActionTypes.RECEIVE_SEARCH_DATA,
          result: response.map((ele) => {
            ele.locationToShow = ele.currentLocation
              ? Object.values(ele.currentLocation).join(', ')
              : 'Unknown';

            ele.experienceToShow = ele.experiences
              ? companySort(ele.experiences)
              : '';

            ele.educationToShow = ele.educations
              ? educationsSort(ele.educations)
              : '';
            ele.industry = ele.industries ? ele.industries.join(', ') : '';
            console.log(ele);
            let email = ele.contacts ? ele.contacts[0].contact : 'No Email';

            ele.email = email;
            return ele;
          }),
        });
      })
      .catch((err) => dispatch(showErrorMessage(err)));
  }
};

export const clearALLFilters = (filter, clear) => (dispatch, getState) => {
  dispatch({
    type: ActionTypes.CLEARALL,
  });
};
