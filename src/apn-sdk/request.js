/**
 * Created by chenghui on 5/23/17.
 */

import store from './../app/store';
import { LOGOUT } from '../app/constants/actionTypes';

// const _devHost = "http://localhost:8080"; // local
const _devHost = 'https://api-staging.hitalentech.com:8888';
// const _devHost1 = 'http://api-staging.hitalentech.com:8888';
// const _devHost = 'http://13.212.18.148:31025';
// const _devHost = 'http://192.168.8.8:8088';
// const _devHost = "http://192.168.0.164:8080"; // local
// const _devHost = 'https://r2-singapore.hitalentech.com';
// const _devHost = 'http://192.168.8.77:8088';
// const _devHost = 'https://api-singapore-staging.hitalentech.com';
// const _devHost = 'http://13.212.18.148:31005';
// const _devHost = 'https://api.hitalentech.com';
export const api = '/user/api/v1';
export const apiV1 = '/api/v1';
export const apiV2 = '/api/v2';
export const jobApi = '/job/api/v2';
export const jobApiV1 = '/job/api/v1';
export const talentApiV1 = '/talent/api/v1';
export const talentApiV2 = '/talent/api/v2';
export const talentApiV3 = '/talent/api/v3';
export const companyApiV3 = '/company/api/v3';
export const financeApiV1 = '/finance/api/v1';
export const locationApiV3 = '/location/api/v3';
export const applicationApiV1 = '/application/api/v1';
export const parserApiV1 = '/parser/api/v1';
export const parserApiV2 = '/parser/api/v2';
export const storeApiV1 = '/store/api/v1';
export const userApiV3 = '/user/api/v3';
export const apn = {
  host: process.env.REACT_APP_API_HOST || _devHost,
};
// export const apn1 = {
//   host: process.env.REACT_APP_API_HOST || _devHost1,
// };

const expiredTokens = new Set();
const appName = 'apn';
let refreshing = null;

const authRequest = {
  send(endPoint, config) {
    const url = apn.host + api + endPoint;
    return _sendRequest(url, config, _handleResponseToJson);
  },

  sendV1(endPoint, config) {
    const url = apn.host + apiV1 + endPoint;
    return _sendRequest(url, config, _handleResponseToJson);
  },

  sendV2(endPoint, config) {
    const url = apn.host + apiV2 + endPoint;
    return _sendRequest(url, config, _handleResponseToJson);
  },

  send2(endPoint, config) {
    const url = apn.host + api + endPoint;
    return _sendRequest(url, config, _handleResponseToBlob);
  },

  send2V2(endPoint, config) {
    const url = apn.host + apiV2 + endPoint;
    return _sendRequest(url, config, _handleResponseToBlob);
  },

  send3(endPoint, config) {
    const url = apn.host + api + endPoint;
    return _sendRequest(url, config, _handleResponseToText);
  },
  jobSendV1(endPoint, config) {
    const url = apn.host + jobApiV1 + endPoint;
    return _sendRequest(url, config, _handleResponseToJson);
  },

  jobSend(endPoint, config) {
    const url = apn.host + jobApi + endPoint;
    return _sendRequest(url, config, _handleResponseToJson);
  },
  companySend(endPoint, config) {
    const url = apn.host + companyApiV3 + endPoint;
    return _sendRequest(url, config, _handleResponseToJson);
  },
  companySend2(endPoint, config) {
    const url = apn.host + companyApiV3 + endPoint;
    return _sendRequest(url, config, _handleResponseToText);
  },
  talentSendV1(endPoint, config) {
    const url = apn.host + talentApiV1 + endPoint;
    return _sendRequest(url, config, _handleResponseToJson);
  },
  talentSendV2(endPoint, config) {
    const url = apn.host + talentApiV2 + endPoint;
    return _sendRequest(url, config, _handleResponseToJson);
  },
  talentSendV3(endPoint, config) {
    const url = apn.host + talentApiV3 + endPoint;
    return _sendRequest(url, config, _handleResponseToJson);
  },
  financeSendV1(endPoint, config) {
    const url = apn.host + financeApiV1 + endPoint;
    return _sendRequest(url, config, _handleResponseToJson);
  },
  locationSendV3(endPoint, config) {
    const url = apn.host + locationApiV3 + endPoint;
    return _sendRequest(url, config, _handleResponseToJson);
  },
  applicationSendV1(endPoint, config) {
    const url = apn.host + applicationApiV1 + endPoint;
    return _sendRequest(url, config, _handleResponseToJson);
  },
  parserSendV1(endPoint, config) {
    const url = apn.host + parserApiV1 + endPoint;
    return _sendRequest(url, config, _handleResponseToJson);
  },
  parserSendV2(endPoint, config) {
    const url = apn.host + parserApiV2 + endPoint;
    return _sendRequest(url, config, _handleResponseToJson);
  },
  userSendV3(endPoint, config) {
    const url = apn.host + userApiV3 + endPoint;
    return _sendRequest(url, config, _handleResponseToJson);
  },

  checkLogin() {
    console.log('checkLogin');
    let token = localStorage.token;

    if (token && JSON.parse(token)) {
      return Promise.resolve(true);
    }

    return Promise.resolve(false);
  },

  refreshToken(refresh_token) {
    const url = `${apn.host}${api}/refresh-token`;
    const config = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ refresh_token }),
    };
    config.credentials = 'include';
    return fetch(url, config)
      .then(_handleResponseToJson)
      .then(({ response: token }) => {
        console.log('refresh', token);
        token.createdAt = Date.now();
        token.createdBy = appName;
        localStorage.token = JSON.stringify(token);
        return true;
      })
      .catch((err) => {
        console.log(err, err.status);
        if (err.status) {
          localStorage.removeItem('token');
          return false;
        }
        return true;
      });
  },

  login(username, password) {
    const url = `${apn.host}${api}/login`;
    const config = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    };
    config.credentials = 'include';
    return fetch(url, config)
      .then(_handleResponseToJson)
      .then(({ response }) => {
        let token = response.credential;
        console.log('login', token);
        token.createdAt = Date.now();
        token.createdBy = appName;
        localStorage.token = JSON.stringify(token);
      });
  },

  logout() {
    return Promise.resolve(true).then((success) => {
      if (success) {
        localStorage.removeItem('token');
      }
      return success;
    });
  },

  resetPasswordInit(email) {
    const url = `${apn.host}${api}/account/reset_password/init`;
    const config = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        email,
      }),
    };
    config.credentials = 'include';
    return fetch(url, config).then(_handleResponseToText);
  },

  resetPasswordFinish(key, newPassword) {
    const url = `${apn.host}${api}/account/reset_password/finish`;
    const config = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        key,
        newPassword,
      }),
    };
    config.credentials = 'include';
    return fetch(url, config).then(_handleResponseToText);
  },

  register(email, username, password, firstName, lastName, tenantId) {
    const url = `${apn.host}${api}/register`;
    const config = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        firstName,
        lastName,
        tenantId,
        email,
        username,
        password,
      }),
    };
    config.credentials = 'include';
    return fetch(url, config).then(_handleResponseToJson);
  },
};

export default authRequest;

export const _handleResponseToJson = (response) => {
  // console.log('_handleResponseToJson');

  if (!response.ok) {
    if (response.status >= 500) {
      throw {
        status: response.status,
        statusText: response.statusText,
        endpoint: new URL(response.url).pathname,
      };
    }

    if (response.status >= 400) {
      return response.json().then(
        (data) => {
          data.status = response.status;
          data.statusText = response.statusText;
          return Promise.reject(data);
        },
        () =>
          Promise.reject({
            status: response.status,
            statusText: response.statusText,
          })
      );
    }
  }

  if (response.status === 204) {
    return 'OK';
  }
  console.log(12345, response);
  return response.json().then(
    (json) => ({ response: json, headers: response.headers }),
    () => 'OK'
  );
};

function _handleResponseToText(response) {
  if (!response.ok) {
    return response.text().then(
      (text) =>
        Promise.reject({
          status: response.status,
          statusText: response.statusText,
          message: text,
        }),
      () =>
        Promise.reject({
          status: response.status,
          statusText: response.statusText,
        })
    );
  }
  return response.text().then(
    (text) => ({ message: text }),
    () => 'OK'
  );
}

function _handleResponseToBlob(response) {
  if (!response.ok) {
    if (response.status >= 500) {
      throw {
        status: response.status,
        statusText: response.statusText,
      };
    }

    if (response.status >= 400) {
      return response.json().then(
        (data) => {
          data.status = response.status;
          data.statusText = response.statusText;
          return Promise.reject(data);
        },
        () =>
          Promise.reject({
            status: response.status,
            statusText: response.statusText,
          })
      );
    }
  }
  return response.blob().then(
    (blob) => ({ response: blob }),
    () => 'OK'
  );
}

const _retry = (url, config, oldToken) => {
  return refreshingQueue(oldToken).then((success) => {
    if (success) {
      let token = JSON.parse(localStorage.token);
      config.headers['Authorization'] = `Bearer ${token['access_token']}`;
      return fetch(url, config);
    } else {
      store.dispatch({
        type: 'logout',
      });
    }
  });
};

window.refreshToken =
  (window.refreshAPNTokenFunctions &&
    window.refreshAPNTokenFunctions[window.location.host.split('.')[0]]) ||
  ((oldToken) => {
    console.log('expired', oldToken);
    let token = localStorage.token;
    if (token && JSON.parse(token)) {
      token = JSON.parse(token);
      if (expiredTokens.has(oldToken)) {
        return Promise.resolve(true);
      }
      if (oldToken) {
        expiredTokens.add(oldToken);
      }
      return authRequest.refreshToken(token.refresh_token);
    } else {
      return Promise.resolve(false);
    }
  });

const refreshingQueue = (oldToken) => {
  if (!refreshing) {
    refreshing = window
      .refreshToken(oldToken)
      .finally(() => (refreshing = null));
  }
  return refreshing;
};

const _sendRequest = (url, config, handleResponse) => {
  let token = localStorage.token;
  if (token && JSON.parse(token)) {
    token = JSON.parse(token);
    config.headers['Authorization'] = `Bearer ${token.access_token}`;
    config.credentials = 'include';
    return (refreshing || Promise.resolve(''))
      .then(() => fetch(url, config))
      .then(handleResponse)
      .catch((err) => {
        console.error(err);
        if (err.error === 'invalid_token') {
          return _retry(url, config, token.access_token).then(handleResponse);
        }
        throw err;
      });
  } else {
    store.dispatch({
      type: LOGOUT,
    });
    return Promise.reject('You have logged out!');
  }
};
