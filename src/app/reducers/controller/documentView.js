import * as ActionTypes from './../../constants/actionTypes';
import Immutable, { fromJS, toJS } from 'immutable';

const defaultState = fromJS({
  loading: false,
  documentViewFromData: [],
  packageViewFromData: [],
  tabaValue: '',
  componentStatus: false,
});

export default function (state = defaultState, action = {}) {
  let newState;
  switch (action.type) {
    case ActionTypes.DOCUMENT_REGULAR_SEARCH:
      return state.set('searchDataList', action.payload);

    case ActionTypes.DOCUMENT_PACKAGE_REGULAR_SEARCH:
      return state.set('packSearchDataList', action.payload);
    case ActionTypes.DOCUMENT_DELETE_SEARCH:
      return state.set('searchDataList', action.payload);
    case ActionTypes.PACKAGE_DELETE_SEARCH:
      return state.set('packSearchDataList', action.payload);
    case ActionTypes.DOCUMENT_CLEAR_ALL:
      return state.set('searchDataList', []);
    case ActionTypes.PACKAGE_CLEAR_ALL:
      return state.set('packSearchDataList', []);
    case ActionTypes.DOCUMENT_INTERFACE_CLEAR_ALL:
      return state.set('interfaceDataList', action.payload);
    case ActionTypes.PACKAGE_INTERFACE_CLEAR_ALL:
      return state.set('packInterfaceDataList', action.payload);
    case ActionTypes.DOCUMENT_SAVE_FILTERS_NAME:
      return state.set('saveFiltersObj', action.payload);
    case ActionTypes.PACKAGE_SAVE_FILTERS_NAME:
      return state.set('savePackageFiltersObj', action.payload);
    case ActionTypes.DOCUMENT_INTERFACE:
      return state.set('interfaceDataList', action.payload);
    case ActionTypes.PACKAGE_INTERFACE:
      return state.set('packInterfaceDataList', action.payload);
    case ActionTypes.DOCUMENT_INTERFACE_DELETE_SEARCH:
      return state.set('interfaceDataList', action.payload);
    case ActionTypes.PACKAGE_INTERFACE_DELETE_SEARCH:
      return state.set('packInterfaceDataList', action.payload);
    case ActionTypes.PACKAGE_FROM_DATA:
      return state.set('packageViewFromData', action.payload);
    case ActionTypes.DOCUMENT_FROM_DATA:
      return state.set('documentViewFromData', action.payload);
    case ActionTypes.DOCUMENT_LODING:
      newState = state.set('loading', action.payload);
      return newState;
    case ActionTypes.DOCUMENT_LODING_FALSE:
      return state.set('loading', action.payload);
    case ActionTypes.DOCUMENT_COUNT:
      return state.set('count', action.payload);
    case ActionTypes.PACKAGE_COUNT:
      return state.set('count', action.payload);
    case ActionTypes.DOCUMENT_SORT:
      return state.set('sort', action.payload);
    case ActionTypes.TABS_VALUE:
      return state.set('tabaValue', action.payload);
    case ActionTypes.COMPONENT_STATUS:
      return state.set('componentStatus', action.payload);
    default:
      return state;
  }
}
