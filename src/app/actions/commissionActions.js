import * as apnSDK from '../../apn-sdk';
import { normalize } from 'normalizr';
import * as ActionTypes from '../constants/actionTypes';
import { commission } from './schemas';
import { showErrorMessage } from './index';

export const searchAllCommissionList =
  (page, size, sort, advancedSearch) => (dispatch, getState) => {
    if (getState().controller.searchCommissions.all.isFetching) {
      return Promise.resolve('loading...');
    }
    dispatch({
      type: ActionTypes.REQUEST_COMMISSION_LIST,
      tab: 'all',
    });
    return apnSDK
      .searchAllCommissionList(page, size, sort, advancedSearch)
      .then(({ response, headers }) => {
        console.log('all commissions', response);
        // headers.forEach(value=>console.log(value))
        const normalizedData = normalize(response, [commission]);
        dispatch({
          type: ActionTypes.RECEIVE_COMMISSION_LIST,
          tab: 'all',
          normalizedData,
          total: parseInt(headers.get('pagination-count'), 10),
        });
      })
      .catch((err) => {
        dispatch({
          type: ActionTypes.FAILURE_COMMISSION_LIST,
          tab: 'all',
        });
        dispatch(showErrorMessage(err));
      });
  };
export const loadMoreAllCommissionList =
  (page, size, sort, advancedSearch) => (dispatch, getState) => {
    if (getState().controller.searchCommissions.all.isFetching) {
      return Promise.resolve('loading...');
    }
    dispatch({
      type: ActionTypes.REQUEST_COMMISSION_LIST,
      tab: 'all',
    });
    return apnSDK
      .searchAllCommissionList(page, size, sort, advancedSearch)
      .then(({ response, headers }) => {
        console.log('more all commissions', response);
        const normalizedData = normalize(response, [commission]);
        dispatch({
          type: ActionTypes.ADD_COMMISSION_TO_LIST,
          tab: 'all',
          normalizedData,
        });
      })
      .catch((err) => {
        dispatch({
          type: ActionTypes.FAILURE_COMMISSION_LIST,
          tab: 'all',
        });
        dispatch(showErrorMessage(err));
      });
  };

export const createCommission = (commissionData) => (dispatch) => {
  return apnSDK
    .createCommission(commissionData)
    .then(({ response }) => {
      console.log('create commission: ', response);
      // const normalizedData = normalize(response, [invoice]);

      dispatch({
        type: ActionTypes.ADD_COMMISSION,
        commission: response,
      });

      return response;
    })
    .catch((err) => dispatch(showErrorMessage(err)));
};
