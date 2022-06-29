import { combineReducers } from 'redux';
import createList from './createList';

const searchStarts = combineReducers({
  all: createList('all')
});

export default searchStarts;
