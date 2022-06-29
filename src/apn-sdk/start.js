import authRequest from './request';

export const createStart = (start) => {
  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(start),
  };

  return authRequest.send(`/starts`, config);
};

export const createExtension = (start, startId) => {
  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(start),
  };

  return authRequest.send(`/starts/extension/${startId}`, config);
};

export const updateStart = (start, startId) => {
  const config = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(start),
  };

  return authRequest.send(`/starts/${startId}`, config);
};
export const updateStartContractRate = (
  startContractRate,
  startContractRateId
) => {
  const config = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(startContractRate),
  };

  return authRequest.send(
    `/start-contract-rates/${startContractRateId}`,
    config
  );
};

export const addStartContractRate = (startContractRate, startId) => {
  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(startContractRate),
  };

  return authRequest.send(`/start-contract-rates/startId/${startId}`, config);
};

export const deleteStartContractRate = (startContractRateId) => {
  const config = {
    method: 'DELETE',
    headers: {},
  };

  return authRequest.send(
    `/start-contract-rates/${startContractRateId}`,
    config
  );
};

export const getStartContractRatesByStartId = (startId) => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest.send(`/start-contract-rates/startId/${startId}`, config);
};
export const updateStartAddress = (newAddress, startId) => {
  const config = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newAddress),
  };

  return authRequest.send(`/start-addresses/startId/${startId}`, config);
};

export const updateStartFteRate = (newFteRate, startId) => {
  const config = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newFteRate),
  };

  return authRequest.send(`/start-fte-rates/startId/${startId}`, config);
};

export const updateStartClientInfo = (newClientInfo, startId) => {
  const config = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newClientInfo),
  };

  return authRequest.send(`/start-client-infos/startId/${startId}`, config);
};

export const updateStartCommissions = (startCommissions, startId) => {
  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(startCommissions),
  };

  return authRequest.send(`/start-commissions/startId/${startId}`, config);
};

export const getStartCommissions = (startId) => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest.send(`/start-commissions/startId/${startId}`, config);
};

export const endStart = (start, startId) => {
  const config = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(start),
  };

  return authRequest.send(`/starts-end/${startId}`, config);
};

export const getStart = (startId) => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest.send(`/starts/${startId}`, config);
};

export const getStartByTalentId = (talentId) => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest.send(`/starts/talentId/${talentId}`, config);
};

export const searchStart = (from = 0, size = 1000, sort, query = {}) => {
  const search = {
    from,
    size,
    sort,
    query,
  };
  const config = {
    method: 'POST',
    headers: {},
    body: JSON.stringify(search),
  };
  return authRequest.send(`/search/starts`, config);
};

export const startFailedWarranty = (data, startId, update) => {
  const config = {
    method: update ? 'PUT' : 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };

  return authRequest.send(`/starts/failed-warranty/${startId}`, config);
};

export const startTermination = (data, startId) => {
  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };

  return authRequest.send(`/starts/termination/${startId}`, config);
};

export const startCancelTermination = (startId) => {
  const config = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    // body: JSON.stringify({}),
  };

  return authRequest.send(`/starts/cancel-termination/${startId}`, config);
};
