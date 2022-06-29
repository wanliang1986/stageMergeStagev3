import * as apnSDK from './../../apn-sdk/';
import * as ActionTypes from '../constants/actionTypes';
import { normalize, schema } from 'normalizr';

const template = new schema.Entity('templates');

export const tenantTemplateList = () => (dispatch, getState) => {
  return apnSDK.tenantTemplateList().then(({ response }) => {
    console.log('tenant JobCardListView', response);
    const normalizedData = normalize(response, [template]);
    console.log(normalizedData);

    dispatch({
      type: ActionTypes.GET_TENANT_TEMPLATE_LIST,
      normalizedData,
    });
  });
};

export const upsertTemplate =
  (template, templateId) => (dispatch, getState) => {
    return apnSDK
      .upsertEmailTemplate(template, templateId)
      .then(({ response }) => {
        console.log('template', response);
        dispatch({
          type: ActionTypes.UPSERT_TEMPLATE,
          template: response,
        });
      });
  };

export const deleteTemplate = (templateId) => (dispatch, getState) => {
  return apnSDK.deleteEmailTemplate(templateId).then(({ response }) => {
    console.log('template', response);
    dispatch({
      type: ActionTypes.DELETE_TEMPLATE,
      templateId: templateId.toString(),
    });
  });
};
