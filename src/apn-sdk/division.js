import authRequest from './request';

export const getAllDivisionListByTenantId = () => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest.send(`/divisions`, config);
};

export const updateDivision = (division, divisionId = '') => {
  const config = {
    method: divisionId ? 'PUT' : 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(division),
  };
  return authRequest.send(`/divisions/${divisionId}`, config);
};

export const deleteDivision = (divisionId) => {
  const config = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  };
  return authRequest.send(`/divisions/${divisionId}`, config);
};
