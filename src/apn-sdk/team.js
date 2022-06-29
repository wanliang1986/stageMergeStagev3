import authRequest from './request';

export const getTeamList = () => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest.send(`/teams`, config);
};

export const upseartTeam = (team, teamId = '') => {
  const config = {
    method: teamId ? 'PUT' : 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(team),
  };

  return authRequest.send(`/teams/${teamId}`, config);
};

export const updateTeamUser = (users, teamId = '') => {
  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(users),
  };

  return authRequest.send(`/teams/${teamId}/replace-users`, config);
};

export const deleteTeam = (teamId = '') => {
  const config = {
    method: 'DELETE',
    headers: {},
  };

  return authRequest.send(`/teams/${teamId}`, config);
};

export const getTenantCredit = (tenantId) => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest.send(`/tenants/credit/${tenantId}`, config);
};
