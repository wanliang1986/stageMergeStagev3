/**
 * Created by chenghui on 6/12/17.
 */
import * as apnSDK from './../../apn-sdk/';
import * as ActionTypes from '../constants/actionTypes';
import { normalize } from 'normalizr';
import { user, miniUser } from './schemas';
import { setUserId } from '../gtag';
import { showErrorMessage } from './index';
import { saveCandidateColumns } from './../../apn-sdk/';

export const getUsers = () => (dispatch) => {
  //admin only
  dispatch({
    type: ActionTypes.REQUEST_USERS,
  });

  return apnSDK
    .getUserList()
    .then(({ response }) => {
      console.log('get users: ', response);
      const normalizedData = normalize(response, [user]);
      dispatch({
        type: ActionTypes.RECEIVE_USERS,
        normalizedData,
      });
    })
    .catch((err) => dispatch(showErrorMessage(err)));
};

export const getAllUsers = () => (dispatch) => {
  return apnSDK
    .getAllBriefUserList()
    .then(({ response }) => {
      // console.log('get users: ', response);
      const normalizedData = normalize(response, [miniUser]);
      response &&
        response.map((item) => {
          item.value = item.id;
        });
      dispatch({
        type: ActionTypes.NEW_CANDIDATE_DIALOG_USER,
        payload: response,
      });
      dispatch({
        type: ActionTypes.RECEIVE_BRIEF_USERS,
        normalizedData,
      });
    })
    .catch((err) => dispatch(showErrorMessage(err)));
};

export const getCurrentUser = () => (dispatch) => {
  return apnSDK
    .getCurrentUser()
    .then(({ response }) => {
      const normalizedData = normalize(response, user);
      // console.log('current user', normalizedData);
      setUserId(response.id);
      dispatch({
        type: ActionTypes.GET_CURRENT_USER,
        normalizedData,
      });
    })
    .catch((err) => dispatch(showErrorMessage(err)));
};

export const changePassword = (newPassword) => (dispatch) => {
  return apnSDK.changePassword(newPassword).then(({ response }) => {
    console.log('changePassword', response);
  });
};

export const updateAccount = (account) => (dispatch) => {
  return apnSDK.updateAccount(account).then(({ response }) => {
    const normalizedData = normalize(response, user);
    // console.log('current user', normalizedData);
    dispatch({
      type: ActionTypes.GET_CURRENT_USER,
      normalizedData,
    });
  });
};

export const getCandidatePreference = () => (dispatch) => {
  return apnSDK
    .getCandidateColumns('CANDIDATE')
    .then(({ response }) => {
      // console.log(response);
      dispatch({
        type: ActionTypes.SET_PREFERENCE,
        module: 'candidate',
        preference: response,
      });

      return response;
    })
    .catch((err) => dispatch(showErrorMessage(err)));
};

export const updateCandidatePreference = (preference) => (dispatch) => {
  dispatch({
    type: ActionTypes.UPDATE_PREFERENCE,
    module: 'candidate',
    preference,
  });
  preference.module = 'CANDIDATE';
  return apnSDK
    .saveCandidateColumns(preference)
    .catch((err) => dispatch(showErrorMessage(err)));
};
