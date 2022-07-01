//地址模糊搜索
import authRequest from './request';

export const searchLocation2 = (location) => {
  const config = {
    method: 'GET',
    headers: {},
  };
  console.log('searchLocation2', location);

  return authRequest.locationSendV3(
    `/geoinfo/search?condition=${location}`,
    config
  );
};
