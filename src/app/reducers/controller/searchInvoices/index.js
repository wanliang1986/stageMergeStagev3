import { combineReducers } from 'redux';
import createList from './createList';

const searchInvoices = combineReducers({
  all: createList('all')
});

export default searchInvoices;
