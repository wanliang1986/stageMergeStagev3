/**
 * Created by chenghui on 5/23/17.
 */
import gtag from './../gtag';
import * as ActionTypes from '../constants/actionTypes';
import authRequest from './../../apn-sdk/request';

// console.log(gtag);

export const checkLogin = () => (dispatch, getState) => {
  return authRequest.checkLogin().then((logged) => {
    dispatch({
      type: ActionTypes.LOGIN_CHECKED,
      logged,
    });
    if (logged) {
      gtag('event', 'login', { method: 'token' });
    }
  });
};

export const login = (username, password) => (dispatch) => {
  return authRequest.login(username, password).then(() => {
    gtag('event', 'login', { method: 'password' });
    dispatch({
      type: ActionTypes.LOGIN,
    });

    return true;
  });
};

export const logout = () => (dispatch) => {
  return authRequest.logout().then((success) => {
    if (success) {
      dispatch({
        type: ActionTypes.LOGOUT,
      });
    }
    return success;
  });
};

export const resetPasswordInit = (email) => (dispatch) => {
  return authRequest.resetPasswordInit(email);
};

export const resetPasswordFinish = (key, newPassword) => (dispatch) => {
  return authRequest.resetPasswordFinish(key, newPassword);
};

export const register =
  ({ email, username, password, firstName, lastName, tenantId }) =>
  (dispatch) => {
    return authRequest
      .register(email, username, password, firstName, lastName, tenantId)
      .then(({ response }) => {
        gtag('event', 'sign_up', { method: 'password' });
        return response;
      });
  };

export const showErrorMessage = (err) => (dispatch) => {
  dispatch({
    type: ActionTypes.ADD_MESSAGE,
    message: {
      type: 'error',
      message: err.fieldErrors
        ? err.fieldErrors[err.fieldErrors.length - 1].message
        : err.message || JSON.stringify(err),
    },
  });
};

export const showSuccessMessage = (success) => (dispatch) => {
  dispatch({
    type: ActionTypes.ADD_MESSAGE,
    message: {
      type: 'success',
      message: success.fieldErrors
        ? success.fieldErrors[success.fieldErrors.length - 1].message
        : success.message || JSON.stringify(success),
    },
  });
};

export const reload = () => (dispatch, getState) => {
  dispatch({
    type: ActionTypes.RELOAD,
    key: getState().router.location['key'],
  });
};
