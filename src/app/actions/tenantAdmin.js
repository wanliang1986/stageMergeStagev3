import * as apnSDK from './../../apn-sdk/';
import * as ActionTypes from '../constants/actionTypes';
import { showErrorMessage } from './index';

export const createTenant = (obj) => (dispatch, getState) => {
  return apnSDK.createTenant(obj).then(({ response }) => {
    console.log('createTenant', response);
    return response;
  });
};

export const getTenantAdminList = () => (dispatch, getState) => {
  return apnSDK
    .getTenantAdminList()
    .then(({ response }) => {
      return response;
    })
    .catch((err) => dispatch(showErrorMessage(err)));
};

export const getTenantAdminDetails = (id) => (dispatch, getState) => {
  return apnSDK
    .getTenantAdminDetails(id)
    .then(({ response }) => {
      return response;
    })
    .catch((err) => dispatch(showErrorMessage(err)));
};

export const putTenantAdmin = (obj) => (dispatch, getState) => {
  return apnSDK.putTenantAdmin(obj).then(({ response }) => {
    return response;
  });
};

export const getTenant = () => (dispatch, getState) => {
  return apnSDK.getTenant().then(({ response }) => {
    return response;
  });
};
