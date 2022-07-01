import { combineReducers } from 'redux';
import createList from './createList';

const searchJobs = combineReducers({
  all: createList('all'),
  my: createList('my'),
  favor: createList('favor'),
  watch: createList('watch'),
  hired: createList('hired'),
  review: createList('review'),
  es: createList('es'),
});

export default searchJobs;
