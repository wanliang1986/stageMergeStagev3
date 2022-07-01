/**
 * Created by chenghui on 5/31/17.
 */
import * as apnSDK from './../../apn-sdk/';
import * as ActionTypes from '../constants/actionTypes';
import Immutable from 'immutable';
import { normalize, schema } from 'normalizr';
import { miniUser, newStart } from './schemas';
import { showErrorMessage } from './index';
import { selectStartToOpen } from './startActions';
import { getJob } from './jobActions';
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

export const addApplicationJob = (data) => (dispatch) => {
  return apnSDK.AddApplicationsOnTalent(data).then(({ response }) => {
    dispatch(getApplicationJob(response.id));
    return response;
  });
};

export const getApplicationJob = (id) => (dispatch) => {
  return apnSDK.getAllApplicationsById(id).then(({ response }) => {
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

export const addApplication = (data) => (dispatch) => {
  return apnSDK.AddApplicationsOnTalent(data).then(({ response }) => {
    dispatch(getApplicationJob(response.id));
    return response;
  });
};

export const getPositionApplication = (talentId) => (dispatch) => {
  return apnSDK.getAllApplicationsByTalentId(talentId).then(({ response }) => {
    const normalizedData = normalize(response, [application]);
    response &&
      response.map((item) => {
        dispatch(getJob(item.jobId));
      });
    // dispatch({
    //   type: ActionTypes.NEW_CANDIDATE_RELATIONS,
    //   payload: arr,
    // });
    dispatch({
      type: ActionTypes.RECEIVE_APPLICATION_LIST,
      normalizedData,
    });
    return normalizedData;
  });
};

export const getApplication = (talentId) => (dispatch) => {
  return apnSDK.getAllApplicationsByTalentId(talentId).then(({ response }) => {
    const normalizedData = normalize(response, [application]);

    console.log('get talent application: ', response);
    let arr = []; //写流程，不清楚他的作用，所以没删
    let StartArr = []; //走完流程的数据
    response &&
      response.map((item) => {
        dispatch(getJob(item.jobId));
        if (
          JSON.stringify(item.onboard) !== '{}' &&
          JSON.stringify(item.eliminate) === '{}'
        ) {
          StartArr.push(item);
          // 现在没有专门获取start数据的api,从所有流程的api里面过滤
          const normalizedStartData = normalize(StartArr, [newStart]);
          dispatch({
            type: ActionTypes.ADD_START,
            normalizedData: normalizedStartData,
          });
        }
      });
    dispatch({
      type: ActionTypes.NEW_CANDIDATE_RELATIONS,
      payload: arr,
    });
    dispatch({
      type: ActionTypes.RECEIVE_APPLICATION_LIST,
      normalizedData,
    });
    return normalizedData;
  });
};

export const addApplicationPayrolling = (data) => (dispatch) => {
  return apnSDK.AddApplicationsOnTalent(data).then(({ response }) => {
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

export const newApplicationSubmitToClient = (data) => (dispatch, getState) => {
  return apnSDK.ApplicationsSubmitToClient(data).then(({ response }) => {
    const normalizedData = normalize(response, application);
    console.log('add application ', normalizedData);
    const currentUser = getState().controller.currentUser;
    const currentActivity = Object.assign({}, response, {
      // id: response.currentActivityId,对应字段的发生变化
      id: response.recruitmentProcessId,
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

export const newApplicationSubmitToOffer = (data) => (dispatch, getState) => {
  return apnSDK.ApplicationsSubmitToOffer(data).then(({ response }) => {
    const normalizedData = normalize(response, application);
    console.log('add application ', normalizedData);
    const currentUser = getState().controller.currentUser;
    const currentActivity = Object.assign({}, response, {
      // id: response.currentActivityId,对应字段的发生变化
      id: response.recruitmentProcessId,
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

export const newApplicationSubmitToOfferAccept =
  (data, versionsFlag) => (dispatch, getState) => {
    return apnSDK
      .ApplicationsSubmitToOfferAccept(data, versionsFlag)
      .then(({ response }) => {
        const normalizedData = normalize(response, application);
        console.log('add application ', normalizedData);
        const currentUser = getState().controller.currentUser;
        const currentActivity = Object.assign({}, response, {
          // id: response.currentActivityId,对应字段的发生变化
          id: response.recruitmentProcessId,
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

export const updateNewInterviewApplication = (data) => (dispatch, getState) => {
  return apnSDK.ApplicationsSubmitToInterview(data).then(({ response }) => {
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

// 淘汰
export const updateNewElimanateApplication = (data) => (dispatch, getState) => {
  return apnSDK.ApplicationsEliminate(data).then(({ response }) => {
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
    // 淘汰清空start里面的数据
    dispatch({
      type: ActionTypes.CLRAE_START,
      id: data.talentRecruitmentProcessId,
    });
    return response;
  });
  // .catch((err) => dispatch(showErrorMessage(err)));
};
// 取消淘汰
export const updateCancelElimanateApplication =
  (talentRecruitmentProcessId) => (dispatch, getState) => {
    return apnSDK
      .ApplicationsCancelEliminate(talentRecruitmentProcessId)
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
        // 取消淘汰后看取消的这个值是否已入职，已入职放在start里面
        let StartArr = [];
        if (
          JSON.stringify(response.onboard) !== '{}' &&
          JSON.stringify(response.eliminate) === '{}'
        ) {
          StartArr.push(response);

          const normalizedStartData = normalize(StartArr, [newStart]);
          dispatch({
            type: ActionTypes.RECEIVE_START,
            normalizedData: normalizedStartData,
          });
        }
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

export const getApplicationCommissions = (applicationId) => (dispatch) => {
  return apnSDK
    .getApplicationCommissions(applicationId)
    .then(({ response }) => {
      console.log('getApplicationCommissions', response);
      const normalizedData = normalize(response, [applicationCommission]);
      dispatch({
        type: ActionTypes.RECEIVE_APPLICATION_COMMISSIONS,
        normalizedData,
        applicationId,
      });
      return response;
    });
};

export const updateApplicationCommissions =
  (applicationId, newApplicationCommissions) => (dispatch, getState) => {
    return apnSDK
      .updateApplicationCommissions(applicationId, newApplicationCommissions)
      .then(({ response }) => {
        dispatch(getApplicationCommissions(applicationId));
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
