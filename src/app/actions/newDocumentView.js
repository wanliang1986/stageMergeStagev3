import * as ActionTypes from '../constants/actionTypes';
import * as apnSDK from './../../apn-sdk/documentDashboard';
import { showErrorMessage } from '../actions';

import {
  candidateFilterSearch,
  candidateRequestFilter,
  candidateRequestAdvincedFilter,
  commonPoolFilterSearch,
} from '../../utils/search';
import Immutable from 'immutable';

import { normalize } from 'normalizr';
import { jobBasic, talentBasic } from './schemas';

export const newRegularSearch = (type, value) => (dispatch, getState) => {
  // 组装好的数据存入redux
  dispatch({
    type: ActionTypes.DOCUMENT_REGULAR_SEARCH,
    payload: value,
  });
};
export const newPackSearch = (type, value) => (dispatch, getState) => {
  // 组装好的数据存入redux
  dispatch({
    type: ActionTypes.DOCUMENT_PACKAGE_REGULAR_SEARCH,
    payload: value,
  });
};

export const newDeleteSearch = (value) => (dispatch, getState) => {
  dispatch({
    type: ActionTypes.DOCUMENT_DELETE_SEARCH,
    payload: value,
  });
};
export const newPackDeleteSearch = (value) => (dispatch, getState) => {
  dispatch({
    type: ActionTypes.PACKAGE_DELETE_SEARCH,
    payload: value,
  });
};
export const newInterfaceDeleteSearch = (value) => (dispatch, getState) => {
  dispatch({
    type: ActionTypes.DOCUMENT_INTERFACE_DELETE_SEARCH,
    payload: value,
  });
};
export const newInterfacePackageDeleteSearch =
  (value) => (dispatch, getState) => {
    dispatch({
      type: ActionTypes.PACKAGE_INTERFACE_DELETE_SEARCH,
      payload: value,
    });
  };
export const newSaveFiltersName = (value) => (dispatch, getState) => {
  dispatch({
    type: ActionTypes.DOCUMENT_SAVE_FILTERS_NAME,
    payload: value,
  });
};
export const newPackSaveFiltersName = (value) => (dispatch, getState) => {
  dispatch({
    type: ActionTypes.PACKAGE_SAVE_FILTERS_NAME,
    payload: value,
  });
};
// DocumentSearch查询
export const newDocumentSearch = (params) => (dispatch, getState) => {
  return apnSDK
    .searchDocument(params)
    .then((res) => {
      let count = res.headers.get('Pagination-Count');
      dispatch({
        type: ActionTypes.DOCUMENT_LODING_FALSE,
        payload: false,
      });
      dispatch({
        type: ActionTypes.DOCUMENT_FROM_DATA,
        payload: res.response,
      });
      dispatch({
        type: ActionTypes.DOCUMENT_COUNT,
        payload: count,
      });
    })
    .catch((err) => {
      dispatch(showErrorMessage(err));
      dispatch({
        type: ActionTypes.DOCUMENT_LODING_FALSE,
        payload: false,
      });
    });
};

// packageSearch查询
export const newPackageSearch = (params) => (dispatch, getState) => {
  return apnSDK
    .searchPackage(params)
    .then((res) => {
      let count = res.headers.get('Pagination-Count');
      dispatch({
        type: ActionTypes.DOCUMENT_LODING_FALSE,
        payload: false,
      });
      dispatch({
        type: ActionTypes.PACKAGE_FROM_DATA,
        payload: res.response,
      });
      dispatch({
        type: ActionTypes.PACKAGE_COUNT,
        payload: count,
      });
    })
    .catch((err) => {
      dispatch(showErrorMessage(err));
      dispatch({
        type: ActionTypes.DOCUMENT_LODING_FALSE,
        payload: false,
      });
    });
};
