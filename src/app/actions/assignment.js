/**
 * Created by chenghui on 5/31/17.
 */
import * as apnSDK from './../../apn-sdk/';
import * as ActionTypes from '../constants/actionTypes';
import Immutable from 'immutable';
import { normalize, schema } from 'normalizr';
import { miniUser } from './schemas';
import { showErrorMessage } from './index';
import moment from 'moment-timezone';
import lodash from 'lodash';

export const saveAssignment = (params) => (dispatch) => {
  return apnSDK.saveAssignment(params).then(({ response }) => {
    dispatch({
      type: ActionTypes.RECEIVE_ASSIGNMENT_DETAIL,
      detail: response,
    });
    return response;
  });
};

export const updateAssignment = (params) => (dispatch) => {
  return apnSDK.updateAssignment(params).then(({ response }) => {
    dispatch(getAssignmentDetail(response));
    return response;
  });
};

export const getAssignmentCurrent = (startId) => (dispatch) => {
  return apnSDK.getAssignmentCurrent(startId).then(({ response }) => {
    dispatch({
      type: ActionTypes.RECEIVE_ASSIGNMENT_BASIC_INFO,
      basicInfo: response,
    });
    return response;
  });
};

export const getAssignmentDetail = (assignmentId) => (dispatch) => {
  return apnSDK
    .getAssignmentDetail(assignmentId)
    .then(({ response }) => {
      dispatch({
        type: ActionTypes.RECEIVE_ASSIGNMENT_DETAIL,
        detail: response,
      });
      return response;
    })
    .catch((err) => {
      dispatch(showErrorMessage(err));
    });
};

export const getAssignmentList = (startId) => (dispatch) => {
  return apnSDK
    .getAssignmentList(startId)
    .then(({ response }) => {
      // dispatch({
      //   type: ActionTypes.RECEIVE_ASSIGNMENT_CURRENT_LIST,
      //   list: response
      // })
      return response;
    })
    .catch((err) => {
      dispatch(showErrorMessage(err));
    });
};

export const deleteAssignmentList = (assignmentId) => (dispatch) => {
  return apnSDK
    .deleteAssignmentList(assignmentId)
    .then(({ response }) => {
      return response;
    })
    .catch((err) => {
      dispatch(showErrorMessage(err));
    });
};

export const getPaylist = (startId) => (dispatch) => {
  return apnSDK
    .getPaylist(startId)
    .then(({ response }) => {
      dispatch({
        type: ActionTypes.RECEIVE_PAY_LIST,
        list: response,
      });
      return response;
    })
    .catch((err) => {
      dispatch(showErrorMessage(err));
    });
};

export const getLatestAssignment = (startId) => (dispatch) => {
  return apnSDK
    .getLatestAssignment(startId)
    .then(({ response }) => {
      if (response) {
        let startDate = moment(response.endDate)
          .add(1, 'day')
          .format('YYYY-MM-DD');
        let endDate = moment(response.endDate)
          .add(7, 'day')
          .format('YYYY-MM-DD');
        let _response = lodash.cloneDeep(response);
        _response.startDate = startDate;
        _response.endDate = endDate;

        dispatch({
          type: ActionTypes.RECEIVE_LAST_ASSIGNMENT_DETAIL,
          detail: _response,
        });
      }
    })
    .catch((err) => {
      dispatch(showErrorMessage(err));
    });
};
