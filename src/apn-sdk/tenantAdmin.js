import authRequest from './request';

export const createTenant = (obj) => {
  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(obj),
  };

  return authRequest.send(`/tenants`, config);
};

export const getTenantAdminList = () => {
  const config = {
    method: 'GET',
    headers: {},
  };
  return authRequest.send(`/tenants/details`, config);
};

export const getTenantAdminDetails = (id) => {
  const config = {
    method: 'GET',
    headers: {},
  };
  return authRequest.send(`/tenants/${id}`, config);
};

export const putTenantAdmin = (obj) => {
  const config = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(obj),
  };

  return authRequest.send(`/tenants`, config);
};
