import * as apnSDK from './../../apn-sdk/';
import * as ActionTypes from '../constants/actionTypes';
import { showErrorMessage } from './index';
// import {normalize, schema} from 'normalizr';

// const tenant = new schema.Entity('tenants');

export const getAllTenants = () => (dispatch, getState) => {
  return apnSDK.getTenantList();
};

export const updateUser = (userInfo, userId) => (dispatch, getState) => {
  return apnSDK.updateUser(userInfo, userId).then(({ response }) => {
    console.log('current user', response);
    dispatch({
      type: ActionTypes.UPDATE_USER,
      payload: response,
    });
    return response;
  });
  // .catch((err) => {
  //   dispatch(showErrorMessage(err));
  // });
};

export const updateUserProps = (oldProps, newProps, userId) => (dispatch) => {
  dispatch({
    type: ActionTypes.UPDATE_USER,
    payload: newProps,
  });
  return apnSDK
    .updateUser(newProps, userId)
    .then(({ response }) => {
      console.log('current user', response);
      dispatch({
        type: ActionTypes.UPDATE_USER,
        payload: response,
      });
      return response;
    })
    .catch((err) => {
      dispatch({
        type: ActionTypes.UPDATE_USER,
        payload: oldProps,
      });
      dispatch(showErrorMessage(err));
    });
  return response;
};
// .catch((err) => {
//   dispatch(showErrorMessage(err));
// });

export const updateCompany =
  (companyInfo, companyId, tenantId) => (dispatch) => {
    return apnSDK.updateCompany(companyInfo, companyId).then(({ response }) => {
      console.log('update company', response);
      dispatch({
        type: ActionTypes.UPDATE_COMPANY,
        payload: response,
        tenantId,
      });
    });
  };

export const getTenantCredit = (tenantId) => (dispatch) => {
  return apnSDK
    .getTenantCredit(tenantId)
    .then(({ response }) => {
      if (response) {
        dispatch({
          type: ActionTypes.SET_TENANT_MONTHLY_CREDIT,
          monthlyCredit: response.availableMonthlyCredit,
        });
        dispatch({
          type: ActionTypes.SET_TENANT_BULK_CREDIT,
          bulkCredit: response.availableBulkCredit,
        });
        dispatch({
          type: ActionTypes.SET_TOTALMONTHLY_CREDIT,
          totalMonthlyCredit: response.totalMonthlyCredit,
        });
        dispatch({
          type: ActionTypes.SET_NEXT_MONTHLY_CREDIT,
          nextMonthAvailableCredit: response.nextMonthAvailableCredit,
        });
      }
    })
    .catch((err) => dispatch(showErrorMessage(err)));
};
