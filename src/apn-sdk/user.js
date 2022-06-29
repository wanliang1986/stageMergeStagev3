/**
 * Created by chenghui on 6/12/17.
 */
import authRequest from './request';

export const getUserList = () => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest.send(`/users?size=1000`, config);
};

export const getAllBriefUserList = () => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest.send(`/users/all-brief`, config);
};

export const getCurrentUser = () => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest.send(`/account`, config);
};

export const changePassword = (password) => {
  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ password }),
  };
  return authRequest.send('/account/change_password', config);
};

export const updateAccount = (account) => {
  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(account),
  };
  return authRequest.send(`/account`, config);
};

// export const getTaskRecords = () => {
//     const config = {
//         method: 'GET',
//         headers: {}
//     };
//
//     return authRequest.send(`/my-task-records`, config);
// };

export const getUserOpiton = (res) => {
  const config = {
    method: 'GET',
    headers: {},
  };
  return authRequest.send(`/users/search?name=${res}`, config);
};
