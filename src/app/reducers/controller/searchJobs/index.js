import { combineReducers } from 'redux';
import createList from './createList';

const searchJobs = combineReducers({
  all: createList('all'),
  my: createList('my'),
  favor: createList('favor'),
  new: createList('new'),
  es: createList('es'),
  byCompany: createList('byCompany'),
  myOpen: createList('myOpen'),
});

export default searchJobs;
