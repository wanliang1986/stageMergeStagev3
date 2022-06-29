import authRequest from './request';

export const getHotList = (hotListId) => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest.send(`/hot-lists/${hotListId}`, config);
};

export const getMyHotList = () => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest.send(`/my-hot-lists`, config);
};

export const getHotListTalentsByHotListId = (hotListId) => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest.send(`/hot-list-talents/hot-list/${hotListId}`, config);
};

export const getHotListTalentsByHotListId2 = (hotListId) => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest.sendV2(`/hot-list-talents/hot-list/${hotListId}`, config);
};

export const upseartHotList = (list, listId = '') => {
  const config = {
    method: listId ? 'PUT' : 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(list),
  };

  return authRequest.send(`/hot-lists/${listId}`, config);
};

export const getHotListUsersByHotListId = (hotListId) => {
  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  return authRequest.send(`/hot-list-users/hot-list/${hotListId}`, config);
};

export const updateHotListUsers = (users, listId) => {
  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(users),
  };

  return authRequest.send(`/hot-list-users/replace/${listId}`, config);
};

export const addHotListTalent = (hotListId, talentId) => {
  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify([talentId]),
  };

  return authRequest.send(`/hot-list-talents/append/${hotListId}`, config);
};

export const addTalentsToHotList = (hotListId, talentIds) => {
  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(talentIds),
  };

  return authRequest.send(`/hot-list-talents/append/${hotListId}`, config);
};

export const deleteHotListTalent = (hotListId, talentId) => {
  const config = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify([talentId]),
  };

  return authRequest.send(`/hot-list-talents/delete/${hotListId}`, config);
};

export const deleteHotList = (listId = '') => {
  const config = {
    method: 'DELETE',
    headers: {},
  };

  return authRequest.send(`/hot-lists/${listId}`, config);
};

export const deleteHotListUser = (hotListUserId = '') => {
  const config = {
    method: 'DELETE',
    headers: {},
  };

  return authRequest.send(`/hot-list-users/${hotListUserId}`, config);
};
