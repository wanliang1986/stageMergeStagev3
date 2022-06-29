import authRequest from './request';

export const getDBMyCandidateList = (from, to, recruiter, am, sourcer) => {
  const config = {
    method: 'GET',
    headers: {},
  };

  let userRoles = [];
  if (recruiter) userRoles.push('RECRUITER');
  if (am) userRoles.push('AM');
  if (sourcer) userRoles.push('SOURCER');
  console.log('userRoles', userRoles);

  return authRequest.sendV2(
    `/dashboard/my-candidates?from=${from}&to=${to}&userRoles=${userRoles.join(
      ','
    )}`,
    config
  );
};

export const getDBMyJobList = (companyId, from, to, myJobsOnly) => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest.sendV2(
    `/dashboard/my-jobs?companyId=${companyId}&from=${from}&to=${to}&myJobsOnly=${myJobsOnly}`,
    config
  );
};

export const getDBMyJobCountDetails = (companyId, status, relatedToMe) => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest.sendV2(
    `/dashboard/my-jobs/${companyId}?status=${status}&relatedToMe=${relatedToMe}`,
    config
  );
};

export const getCompanyNamelist = (from, to, myJobsOnly) => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest.sendV2(
    `/dashboard/my-jobs/company?myJobsOnly=${myJobsOnly}&to=${to}&from=${from}`,
    config
  );
};

export const getMyInvoiceList = (page = '', size = '', fromDate = '') => {
  const config = {
    method: 'GET',
    headers: {},
  };

  // console.log('requst', page, size, fromDate);

  return authRequest.send(
    `/my-invoices?page=${page}&size=${size}&fromDate=${fromDate}&toDate=&sort=`,
    config
  );
};

export const getStoppedTalentList = () => {
  const config = {
    method: 'GET',
    headers: {},
  };
  return authRequest.send(`/dashboard/dormant/applications`, config);
};

export const getStoppedJobList = () => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest.send(`/dashboard/dormant/jobs`, config);
};
