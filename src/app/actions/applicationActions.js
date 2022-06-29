/**
 * Created by chenghui on 5/31/17.
 */
import * as apnSDK from './../../apn-sdk/';
import * as ActionTypes from '../constants/actionTypes';
import Immutable from 'immutable';
import { normalize, schema } from 'normalizr';
import { miniUser } from './schemas';
import { showErrorMessage } from './index';
import { selectStartToOpen } from './startActions';

const talent = new schema.Entity('talents');
const job = new schema.Entity('jobs');
const resume = new schema.Entity('resumes');
const activity = new schema.Entity('activities', {
  user: miniUser,
});

const applicationCommission = new schema.Entity('applicationCommissions');

const application = new schema.Entity('applications', {
  talent,
  job,
  user: miniUser,
  resume,
  currentActivity: activity,
  lastModifiedUser: miniUser,
});

export const addApplication = (data) => (dispatch) => {
  return apnSDK.addApplication(data).then(({ response }) => {
    dispatch(getApplication(response.id));
    return response;
  });
};

export const getApplication = (applicationId) => (dispatch) => {
  return apnSDK.getApplication(applicationId).then(({ response }) => {
    const normalizedData = normalize(response, application);
    console.log('get application ', normalizedData);
    setTimeout(() => {
      dispatch({
        type: ActionTypes.ADD_APPLICATION,
        normalizedData,
      });
    });

    return response;
  });
};

export const addApplicationPayrolling = (data) => (dispatch) => {
  return apnSDK.addApplicationPayrolling(data).then(({ response }) => {
    dispatch(getApplication(response.id));
    return response;
  });
};

export const updateApplication =
  (data, applicationId) => (dispatch, getState) => {
    return apnSDK
      .updateApplication(data, applicationId)
      .then(({ response }) => {
        const normalizedData = normalize(response, application);
        console.log('add application ', normalizedData);
        const currentUser = getState().controller.currentUser;
        const currentActivity = Object.assign({}, response, {
          id: response.currentActivityId,
          applicationId: response.id,
          createdDate: new Date().toISOString(),
          job: undefined,
          applyToUser: undefined,
          lastModifiedUser: undefined,
          talent: undefined,
          user: undefined,
          createdBy: `${currentUser.get('id')},${currentUser.get('tenantId')}`,
        });
        dispatch({
          type: ActionTypes.EDIT_APPLICATION,
          normalizedData,
          currentActivity,
        });
        return response;
      });
    // .catch((err) => dispatch(showErrorMessage(err)));
  };

export const updateApplication2 =
  (data, applicationId) => (dispatch, getState) => {
    return apnSDK
      .updateApplication2(data, applicationId)
      .then(({ response }) => {
        const normalizedData = normalize(response, application);
        console.log('add application ', normalizedData);
        const currentUser = getState().controller.currentUser;
        const currentActivity = Object.assign({}, response, {
          id: response.currentActivityId,
          applicationId: response.id,
          createdDate: new Date().toISOString(),
          job: undefined,
          applyToUser: undefined,
          lastModifiedUser: undefined,
          talent: undefined,
          user: undefined,
          createdBy: `${currentUser.get('id')},${currentUser.get('tenantId')}`,
        });
        dispatch({
          type: ActionTypes.EDIT_APPLICATION,
          normalizedData,
          currentActivity,
        });
        return response;
      });
    // .catch((err) => dispatch(showErrorMessage(err)));
  };

export const reactiveApplication =
  (data, applicationId) => (dispatch, getState) => {
    return apnSDK
      .reactiveApplication(data, applicationId)
      .then(({ response }) => {
        const normalizedData = normalize(response, application);
        console.log('add application ', normalizedData);
        const currentUser = getState().controller.currentUser;
        const currentActivity = Object.assign({}, response, {
          id: response.currentActivityId,
          applicationId: response.id,
          createdDate: new Date().toISOString(),
          job: undefined,
          applyToUser: undefined,
          lastModifiedUser: undefined,
          talent: undefined,
          user: undefined,
          createdBy: `${currentUser.get('id')},${currentUser.get('tenantId')}`,
        });
        dispatch({
          type: ActionTypes.EDIT_APPLICATION,
          normalizedData,
          currentActivity,
        });
        return response;
      });
    // .catch((err) => dispatch(showErrorMessage(err)));
  };

export const getActivitiesByApplication =
  (applicationId) => (dispatch, getState) => {
    return apnSDK
      .getActivitiesByApplication(applicationId)
      .then(({ response }) => {
        const normalizedData = normalize(response, [activity]);
        console.log('get activities for application ', normalizedData);
        dispatch({
          type: ActionTypes.GET_ACTIVITIES_BY_APPLICATION,
          normalizedData,
          applicationId,
        });
        return response;
      });
  };

export const getApplicationByApplicationId =
  (applicationId) => (dispatch, getState) => {
    dispatch({
      type: ActionTypes.REQUEST_APPLICATION_BY_APPLICATIONID,
      applicationId,
    });

    return apnSDK.getApplication(applicationId).then(({ response }) => {
      const normalizedData = normalize(response, application);
      // console.log('[[[applications]]]', applicationId, normalizedData);
      dispatch({
        type: ActionTypes.RECEIVE_APPLICATION_BY_APPLICATIONID,
        normalizedData,
      });
      return response;
    });
  };

export const updateDashboardApplStatus =
  (applId, status) => (dispatch, getState) => {
    dispatch({
      type: ActionTypes.UPDATE_DASHBOARD_APPL_STATUS,
      applId,
      status,
    });
  };

export const updateApplicationCommissions =
  (applicationId, newApplicationCommissions) => (dispatch, getState) => {
    return apnSDK
      .updateApplicationCommissions(applicationId, newApplicationCommissions)
      .then(({ response }) => {
        dispatch(getApplication(applicationId));

        const currentStart = getState().controller.currentStart.get('start');
        if (
          currentStart &&
          currentStart.get('applicationId') === applicationId &&
          !currentStart.get('id')
        ) {
          // console.log('currentStart',response)
          dispatch(
            selectStartToOpen(
              currentStart.set('startCommissions', Immutable.fromJS(response))
            )
          );
        }
        return response;
      });
  };
