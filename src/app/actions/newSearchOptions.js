export const getNewOptions = (payload) => {
  console.log('payload', payload);
  return {
    type: 'NEW_SEARCH_OPTIONS',
    payload,
  };
};
