import * as apnSDK from '../../apn-sdk';
import * as ActionTypes from '../constants/actionTypes';
import { showErrorMessage } from './index';

export const getDict = () => (dispatch, getState) => {
  dispatch({
    type: ActionTypes.CLEAR_PIPELINE_TEMPLATE,
  });
  return apnSDK
    .getDict()
    .then((response) => {
      dispatch({
        type: ActionTypes.RECEIVE_PIPELINE_TEMPLATE,
        template: response.response,
      });
    })
    .catch((error) => dispatch(showErrorMessage(error)));
};

export const getPipelineList = (data) => (dispatch, getState) => {
  return apnSDK
    .getPipelineList(data)
    .then((response) => {
      return response;
    })
    .catch((error) => dispatch(showErrorMessage(error)));
};

export const getMyPipelineTemplate = () => (dispatch, getState) => {
  dispatch({
    type: ActionTypes.CLEAR_PIPELINE_LIST,
  });
  return apnSDK
    .getMyPipelineTemplate()
    .then((response) => {
      dispatch({
        type: ActionTypes.RECEIVE_PIPELINE_LIST,
        list: response.response,
      });
    })
    .catch((error) => dispatch(showErrorMessage(error)));
};

export const savePipelineTemplate = (obj) => (dispatch, getState) => {
  return apnSDK
    .postPipelineTemplate(obj)
    .then((response) => {
      return response;
    })
    .catch((error) => dispatch(showErrorMessage(error)));
};

export const deletePipelineModule = (id) => (dispatch, getState) => {
  return apnSDK
    .deletePipelineTemplate(id)
    .then((response) => {
      return response;
    })
    .catch((error) => dispatch(showErrorMessage(error)));
};

export const putPipelineTemplate = (params) => (dispatch, getState) => {
  return apnSDK
    .putPipelineTemplate(params)
    .then((response) => {
      return response;
    })
    .catch((error) => dispatch(showErrorMessage(error)));
};
