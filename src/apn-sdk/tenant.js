import authRequest, { apn, api, _handleResponseToJson } from './request';

export const getTenantList = () => {
  const url = `${apn.host}${api}/tenants`;
  const config = {
    method: 'GET',
    headers: {},
  };

  return fetch(url, config).then(_handleResponseToJson);
};

export const getResume = (resume) => {
  const url = resume.get('s3Link');

  return fetch(url)
    .then(_handleResponseToBlob)
    .then(({ response }) => {
      const resumeFile = new File([response], resume.get('name'), {
        type: response.type,
      });
      return resumeFile;
    });
};

function _handleResponseToBlob(response) {
  if (!response.ok) {
    return response
      .text()
      .then((text) => {
        return Promise.reject({
          status: response.status,
          message: text,
        });
      })
      .catch((err) => {
        throw response.status;
      });
  }
  return response
    .blob()
    .then((blob) => {
      return {
        response: blob,
      };
    })
    .catch((err) => {
      console.log('err', err);
      return 'OK';
    });
}

export const updateUser = (userProps, userId = '') => {
  const config = {
    method: userId ? 'PUT' : 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userProps),
  };
  return authRequest.send(`/users/${userId}`, config);
};

export const updateCompany = (companyInfo, companyId) => {
  const config = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(companyInfo),
  };
  return authRequest.send(`/companies/${companyId}`, config);
};

export const getTenant = () => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest.send(`/normal-user/tenant`, config);
};
