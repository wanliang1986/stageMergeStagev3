import authRequest from './request';
import { jobRequestEnum } from '../utils/search';
import moment from 'moment-timezone';

// company 下拉
export const companySelect = () => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest.sendV2(`/all-client-contacts`, config);
};

// Assigned UserassignedUsers 用户模糊查询 下拉
export const userSelect = (username = '') => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest.send(`/users/all-brief/${username}`, config);
};

// Assigned UserassignedUsers 用户模糊查询 下拉
export const distSelect = (dictCode = '') => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest.sendV2(`/dict/${dictCode}`, config);
};

export const distSelectZh = (dictCode = '') => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest.sendV2(`/dict-cn/${dictCode}`, config);
};

// 用户检索条件保存
export const saveFilter = (data) => {
  data.module = 'JOB';
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
export const getFilter = () => {
  const config = {
    method: 'get',
    headers: {},
  };

  return authRequest.sendV2('/jobs/search/config/JOB', config);
};

export const getFilterSearch = (value) => {
  const config = {
    method: 'get',
    headers: {},
  };

  return authRequest.sendV2(
    `/jobs/search/config/JOB?searchName=${value}&module=JOB`,
    config
  );
};

// 删除用户检索条件
export const deleteFilter = (id) => {
  const config = {
    method: 'DELETE',
    headers: {},
  };

  return authRequest.sendV2(`/jobs/search/${id}`, config);
};

// job 搜素
export const jobSearch = ({ filter, size, page, sort = {}, initFlag }) => {
  let module = jobRequestEnum.JOB;
  const config = {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  };
  let query = {
    condition: JSON.stringify(filter),
    pageSize: size,
    pageNumber: page,
    module,
    timezone: moment.tz.guess(),
    initialSearch: initFlag,
  };
  if (sort && JSON.stringify(sort) != '{}') {
    query.sort = sort;
  }
  if (Object.values(filter)[0].length != 0) {
    config.body = JSON.stringify(query);
  } else {
    query.condition = '';
    config.body = JSON.stringify(query);
  }
  return authRequest.sendV2(`/jobs/search`, config);
};

// candidate job 搜素
export const jobCandidateSearch = ({
  filter,
  size,
  page,
  sort = {},
  jobId,
  initFlag,
}) => {
  let module = jobRequestEnum.CANDIDATE;
  if (jobId) {
    module = jobRequestEnum.JOB_PICK_CANDIDATE;
  }
  const config = {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  };
  let query = {
    condition: JSON.stringify(filter),
    pageSize: size,
    pageNumber: page,
    module,
    jobId,
    timezone: moment.tz.guess(),
    initialSearch: initFlag,
  };

  if (jobId) {
    query.jobId = jobId;
  }
  if (sort && JSON.stringify(sort) != '{}') {
    query.sort = sort;
  }
  console.log(Object.values(filter)[0]);
  if (Object.values(filter)[0].length != 0) {
    config.body = JSON.stringify(query);
  } else {
    query.condition = '{}';
    config.body = JSON.stringify(query);
  }
  return authRequest.sendV2(`/talents/search`, config);
};

// commonPool job搜索
export const jobCommonPoolSearchSrot = ({
  filter,
  size,
  page,
  sort = {},
  jobId,
  defultStatus,
  commonPoolSelectList,
  initialSearch,
}) => {
  let module = jobRequestEnum.COMMON_POOL;
  // if (jobId) {
  //   module = jobRequestEnum.JOB_PICK_CANDIDATE;
  // }
  const config = {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  };
  let query = {
    condition: JSON.stringify(filter),
    pageSize: size,
    pageNumber: page,
    module,
    jobId,
    initialSearch,
    timezone: moment.tz.guess(),
  };
  if (commonPoolSelectList && commonPoolSelectList !== 'All_CANDIDATES') {
    query.commonPoolType = commonPoolSelectList;
  }
  if (jobId) {
    query.jobId = jobId;
  }
  if (sort && JSON.stringify(sort) != '{}') {
    query.sort = sort;
  }
  console.log(Object.values(filter)[0]);
  if (Object.values(filter)[0].length != 0) {
    config.body = JSON.stringify(query);
  } else {
    query.condition = '{}';
    config.body = JSON.stringify(query);
  }
  return authRequest.sendV2(`/talents/search`, config);
};

// job 通用搜素
export const getGeneralData = ({
  filter,
  size,
  page,
  sort = {},
  module,
  talentId,
  initFlag,
}) => {
  let query = {
    condition: JSON.stringify(filter),
    pageSize: size,
    pageNumber: page,
    module,
    talentId,
    timezone: moment.tz.guess(),
    initialSearch: initFlag,
  };
  if (sort && JSON.stringify(sort) != '{}') {
    query.sort = sort;
  }
  const config = {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(query),
  };
  return authRequest.sendV2(`/jobs/search`, config);
};

// jobList Columns
export const getColumns = () => {
  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  return authRequest.sendV2(`/jobs/preference/JOB`, config);
};

//  save jobList Columns
export const saveColumns = (data) => {
  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };

  return authRequest.sendV2(`/jobs/preference`, config);
};

// jobList InitColumns
export const getInitColumns = () => {
  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  return authRequest.sendV2(`/column/1`, config);
};

// changeStatus
export const changeStatus = (id, status) => {
  const config = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  return authRequest.sendV2(`/jobs/${id}/${status}`, config);
};

// 添加收藏
export const saveCollect = (id) => {
  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  return authRequest.sendV2(`/jobs/favorite/${id}`, config);
};

// 删除收藏
export const deleteCollect = (id) => {
  const config = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      favoriteJobId: id,
    }),
  };

  return authRequest.sendV2(`/jobs/favorite/${id}`, config);
};

export const updateCollect = (id, type) => {
  let config = {
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      favoriteJobId: id,
    }),
  };
  if (type === 'DELETE') config.method = 'DELETE';
  if (type === 'POST') config.method = 'POST';

  return authRequest.sendV2(`/jobs/favorite/${id}`, config);
};

// job chart搜素
export const jobChartSearch = (params) => {
  const config = {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  };
  return authRequest.sendV2(`/jobs/search`, config);
};

export const getJobCompanyList = () => {
  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };
  return authRequest.sendV2(`/job-companies`, config);
};

export const getCountryList = () => {
  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };
  return authRequest.sendV2(`/job-countries`, config);
};

// CommonPool 下拉框 搜素
export const jobCommonPoolSearch = ({
  filter,
  size,
  page,
  sort = {},
  jobId,
  commonPoolType,
  defultStatus,
  commonPoolSelectList,
  initialSearch,
}) => {
  let module = jobRequestEnum.COMMON_POOL;
  const config = {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  };
  let query = {
    condition: JSON.stringify(filter),
    pageSize: size,
    pageNumber: page,
    module,
    jobId,
    initialSearch,
    timezone: moment.tz.guess(),
  };
  if (defultStatus === '1' && commonPoolType) {
    if (commonPoolType !== 'All_CANDIDATES') {
      query.commonPoolType = commonPoolType;
    }
  }
  if (defultStatus === '2') {
    if (commonPoolSelectList) {
      if (commonPoolSelectList !== 'All_CANDIDATES') {
        query.commonPoolType = commonPoolSelectList;
      }
    }
  }

  if (jobId) {
    query.jobId = jobId;
  }
  if (sort && JSON.stringify(sort) != '{}') {
    query.sort = sort;
  }
  if (Object.values(filter)[0].length != 0) {
    config.body = JSON.stringify(query);
  } else {
    query.condition = '{}';
    config.body = JSON.stringify(query);
  }
  return authRequest.sendV2(`/talents/search`, config);
};

// CommonPool通用搜索
export const commonPoolCurrencySearch = ({
  filter,
  size,
  page,
  sort = {},
  jobId,
  defultStatus,
  commonPoolSelectList,
  // initialSearch,
}) => {
  let module = jobRequestEnum.COMMON_POOL;
  // if (jobId) {
  //   module = jobRequestEnum.JOB_PICK_CANDIDATE;
  // }
  const config = {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  };
  let query = {
    condition: JSON.stringify(filter),
    pageSize: size,
    pageNumber: page,
    module,
    jobId,
    // initialSearch,
    timezone: moment.tz.guess(),
  };
  if (commonPoolSelectList && commonPoolSelectList) {
    // let selectValue = commonPoolSelectList.split(',');
    // if (selectValue.length !== 2) {
    //   query.commonPoolType = commonPoolSelectList;
    // }
    if (commonPoolSelectList !== 'All_CANDIDATES') {
      query.commonPoolType = commonPoolSelectList;
    }
  }
  if (jobId) {
    query.jobId = jobId;
  }
  if (sort && JSON.stringify(sort) != '{}') {
    query.sort = sort;
  }
  console.log(Object.values(filter)[0]);
  if (Object.values(filter)[0].length != 0) {
    config.body = JSON.stringify(query);
  } else {
    query.condition = '{}';
    config.body = JSON.stringify(query);
  }
  return authRequest.sendV2(`/talents/search`, config);
};

// commonPool点击购买
export const commonPoolAddUnlock = (obj) => {
  const config = {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(obj),
  };
  return authRequest.send(`/credit-transactions/commonPool`, config);
};

// 查询用户余额
export const getUserAccount = () => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest.send(`/account`, config);
};

// commonPool页面点击添加到candidates
export const commonPoolAddCandidates = (data) => {
  const config = {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };
  return authRequest.sendV2(`/talents/commonPool`, config);
};
