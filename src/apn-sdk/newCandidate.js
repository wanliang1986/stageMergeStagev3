import authRequest from './request';
import { sleep } from '../utils';

// candiadate详情页add to a job表格初始配置colmun数据
export const getCandidateInitColumns = () => {
  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  return authRequest.sendV2(`/column/31`, config);
};

// commonPool表格初始配置colmun数据
export const getCommonPoolColumns = () => {
  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  return authRequest.sendV2(`/column/73`, config);
};

// 获取用户自定义配置
export const getCandidateColumns = (type) => {
  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  return authRequest.sendV2(`/jobs/preference/${type}`, config);
};

// 保存用户自定义配置
export const saveCandidateColumns = (data) => {
  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };

  return authRequest.sendV2(`/jobs/preference`, config);
};

// 用户检索条件保存
export const saveFilterCandidate = (data) => {
  data.module = 'CANDIDATE';
  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };

  return authRequest.sendV2('/jobs/search/config', config);
};
// commonPool用户检索条件
export const saveFilterCommonPool = (data) => {
  data.module = 'COMMON_POOL';
  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };

  return authRequest.sendV2('/jobs/search/config', config);
};
// 获取用户检索条件列表
export const getFilterCandidate = () => {
  const config = {
    method: 'get',
    headers: {},
  };

  return authRequest.sendV2('/jobs/search/config/CANDIDATE', config);
};

// commonPool获取用户检索条件列表
export const getFilterCommonPool = () => {
  const config = {
    method: 'get',
    headers: {},
  };

  return authRequest.sendV2('/jobs/search/config/COMMON_POOL', config);
};
// 删除用户检索条件
export const deleteFilterCandidate = (id) => {
  const config = {
    method: 'DELETE',
    headers: {},
  };

  return authRequest.sendV2(`/jobs/search/${id}`, config);
};

export const getFilterSearchCommonPool = (value) => {
  const config = {
    method: 'get',
    headers: {},
  };

  return authRequest.sendV2(
    `/jobs/search/config/COMMON_POOL?searchName=${value}&module=COMMON_POOL`,
    config
  );
};

export const getFilterSearchCandidate = (value) => {
  const config = {
    method: 'get',
    headers: {},
  };

  return authRequest.sendV2(
    `/jobs/search/config/CANDIDATE?searchName=${value}&module=CANDIDATE`,
    config
  );
};
