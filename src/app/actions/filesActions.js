import * as apnSDK from './../../apn-sdk/';

export const uploadAvatar = (file) => (dispatch, getState) => {
  return apnSDK.uploadAvatar(file).then(({ response }) => {
    console.log('upload file: ', response);
    // return message to component
    return response;
  });
};
