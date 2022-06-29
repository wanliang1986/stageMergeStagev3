const url = 'https://api-staging.hitalentech.com/lnkd/api/linkedin/syncProfile';
export default identifier => {
  const options = {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({ identifier })
  };
  return fetch(url, options).then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw response.status;
    }
  });
};
