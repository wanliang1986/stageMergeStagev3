import authRequest from './request';

export const searchAllCommissionList = (
  page = '',
  size = '',
  sort = '',
  advancedSearch = ''
) => {
  console.log('query', advancedSearch);

  const config = {
    method: 'GET',
    headers: {}
  };

  return authRequest.send(
    `/commissions/?page=${page}&size=${size}&sort=${sort}&sort=id,desc${advancedSearch}`,
    config
  );
};

export const getCommissionById = commissionId => {
  const config = {
    method: 'GET',
    headers: {}
  };

  return authRequest.send(`/commissions/${commissionId}`, config);
};

export const getCommissionsByUsers = ({ fromDate = '', toDate = '' }) => {
  const config = {
    method: 'GET',
    headers: {}
  };

  return authRequest.send(
    `/commissions/all-users?fromDate=${fromDate}&toDate=${toDate}`,
    config
  );
};

export const getCommissionsByUser = (userId, commissionIds) => {
  const config = {
    method: 'GET',
    headers: {}
  };

  return authRequest.send(
    `/commissions/userId/${userId}?commissionIds=${commissionIds}`,
    config
  );
};

export const createCommission = commission => {
  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(commission)
  };
  return authRequest.send(`/commissions`, config);
};

export const updateCommission = (commission, commissionId = '') => {
  const config = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(commission)
  };
  return authRequest.send(`/commissions/${commissionId}`, config);
};
