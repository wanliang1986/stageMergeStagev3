import { combineReducers } from 'redux';
import createList from './createList';

const searchCommissions = combineReducers({
  all: createList('all')
});

export default searchCommissions;
