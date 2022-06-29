import * as apnSDK from './../../apn-sdk/';
import * as ActionTypes from '../constants/actionTypes';

import { normalize, schema } from 'normalizr';

const notification = new schema.Entity('notifications');

export const deleteNotification = (notificationId) => (dispatch, getState) => {
  return apnSDK.deleteNotification(notificationId).then(() => {
    dispatch({
      type: ActionTypes.DELETE_NOTIFICATION,
      notificationId,
    });
  });
};

export const getMyNotifications = () => (dispatch, getState) => {
  if (getState().controller.loggedin) {
    return apnSDK.getMyNotifications().then(({ response }) => {
      if (response) {
        const normalizedData = normalize(response, [notification]);
        // console.log('get user notification', normalizedData);
        setTimeout(() => {
          dispatch({
            type: ActionTypes.GET_USER_NOTIFICATION,
            normalizedData,
          });
        });

        return normalizedData;
      }
    });
  }
};
