/**
 * Created by chenghui on 5/23/17.
 */

import store from './../app/store';
import { LOGOUT } from '../app/constants/actionTypes';

// const _devHost = "http://localhost:8080"; // local
const _devHost = 'https://api-staging.hitalentech.com';
// const _devHost = 'https://api-singapore-staging.hitalentech.com';
// const _devHost = 'http://13.212.18.148:31025';
// const _devHost = 'http://192.168.8.2:8088';
// const _devHost = "http://192.168.0.164:8080"; // local
// const _devHost = 'https://r2-singapore.hitalentech.com';
// const _devHost = 'http://192.168.8.77:8088';
// const _devHost = 'https://api-singapore-staging.hitalentech.com';
// const _devHost = 'http://13.212.18.148:31034/'
// const _devHost = 'http://13.212.18.148:31025';
// const _devHost = 'https://api.hitalentech.com';
// const _devHost = 'http://192.168.8.38:8088';

export const api = '/api/v1';
export const apiV2 = '/api/v2';
export const apn = {
  host: process.env.REACT_APP_API_HOST || _devHost,
};

const expiredTokens = new Set();
const appName = 'apn';
let refreshing = null;

const authRequest = {
  send(endPoint, config) {
    const url = apn.host + api + endPoint;
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

  sendIPG(endPoint, config) {
    const url = apnIpg.host + apiV2 + endPoint;
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

  return response.json().then(
    (json) => ({
      response: json,
      headers: response.headers,
      status: response.status,
    }),
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
  let headers = response.headers;
  return response.blob().then(
    (blob) => ({ response: blob, headers: headers }),
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
