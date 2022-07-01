import authRequest from './request';

export const searchTalents = (param) => {
  console.log(param);

  const config = {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(param),
  };
  // return Promise.resolve('test')
  return authRequest.send(`/search-talents-es`, config);
};

export const getGlobalCandidateDetails = (esId) => {
  const config = {
    method: 'GET',
    headers: {},
  };
  return authRequest.send(`/es-talents/?es_id=${esId}`, config);
};

export const purchaseTalent = (profileId) => {
  const param = { profileId };
  const config = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(param),
  };

  return authRequest.send(`/credit-transactions`, config);
};

// export const reduceCredit = (fullname, linkedInUrl) => {
//     const fullName = encodeURIComponent(fullname);
//     const config = {
//         method: 'GET',
//         headers: {}
//     };
//     return authRequest.send(`/query-talent?name=${fullName}&profile=${linkedInUrl}`, config);
// }
