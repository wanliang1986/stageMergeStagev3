export const getNewOptions = (payload) => {
  console.log(payload);
  return {
    type: 'NEW_SEARCH_OPTIONS',
    payload,
  };
};
