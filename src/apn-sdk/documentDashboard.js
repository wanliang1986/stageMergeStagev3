import authRequest from './request';

export const getActivatedUsers = () => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest.send(`/activated-users?page=0&size=99999`, config);
};

export const getTenantCompany = () => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest.send(`/tenantCompany?page=0&size=99999`, config);
};

export const getDocuments = () => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest.sendV2(`/settings/documents?page=0&size=99999`, config);
};
export const getPackages = () => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest.sendV2(`/settings/packages?page=0&size=99999`, config);
};
// 获取用户自定义配置
export const getDocumentColumns = (type) => {
  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  return authRequest.sendV2(`/jobs/preference/${type}`, config);
};
// document view 表格初始配置colmun数据
export const getDefaultColumns = () => {
  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  return authRequest.sendV2(`/column/89`, config);
};

// package view 表格初始配置colmun数据
export const getPackageDefaultColumns = () => {
  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  return authRequest.sendV2(`/column/105`, config);
};
// 保存用户自定义配置
export const saveDocumentColumns = (data) => {
  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };

  return authRequest.sendV2(`/jobs/preference`, config);
};

// document普通搜索
export const searchDocument = (data) => {
  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };

  return authRequest.sendV2(`/dashboard/document/page`, config);
};
// package普通搜索
export const searchPackage = (data) => {
  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };

  return authRequest.sendV2(`/dashboard/package/page`, config);
};
// 用户保存save filters操作
export const saveFilterDocument = (data) => {
  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };

  return authRequest.sendV2('/jobs/search/config', config);
};
//获取用户document Save filter列表
export const getFilterDocument = () => {
  const config = {
    method: 'get',
    headers: {},
  };

  return authRequest.sendV2('/jobs/search/config/DASHBOARD_DOCUMENT', config);
};
//获取用户package Save filter列表
export const getPackageFilterDocument = () => {
  const config = {
    method: 'get',
    headers: {},
  };

  return authRequest.sendV2('/jobs/search/config/DASHBOARD_PACKAGE', config);
};
// 删除用户检索条件
export const deleteFilterCandidate = (id) => {
  const config = {
    method: 'DELETE',
    headers: {},
  };

  return authRequest.sendV2(`/jobs/search/${id}`, config);
};

// DocumenView sava filter中input搜索
export const getFilterSearchDocument = (value) => {
  const config = {
    method: 'get',
    headers: {},
  };

  return authRequest.sendV2(
    `/jobs/search/config/DASHBOARD_DOCUMENT?searchName=${value}&module=DASHBOARD_DOCUMENT`,
    config
  );
};

// packageView sava filter中input搜索
export const getFilterSearchPackage = (value) => {
  const config = {
    method: 'get',
    headers: {},
  };

  return authRequest.sendV2(
    `/jobs/search/config/DASHBOARD_PACKAGE?searchName=${value}&module=DASHBOARD_PACKAGE`,
    config
  );
};
