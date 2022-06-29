import authRequest from './request';

export const getNewPipelineReport = ({
  fromDate = '',
  toDate = '',
  userParams = '',
}) => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest.send(
    `/new-report/pipeline/recruiter?${userParams}&fromDate=${fromDate}&toDate=${toDate}`,
    config
  );
};

export const getReportJobCompany = ({
  fromDate = '',
  toDate = '',
  jobCountry = '',
  teamId = '',
  divisionId = '',
  allOpenJobs = '',
}) => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest
    .sendV2(
      `/report/job-company?fromDate=${fromDate}&toDate=${toDate}&jobCountry=${jobCountry}&teamId=${teamId}&divisionId=${divisionId}&allOpenJobs=${allOpenJobs}`,
      config
    )
    .then(({ response }) => {
      // console.log(response);
      return response;
    });
};

export const getReportJobCompanyExcel = ({
  fromDate = '',
  toDate = '',
  jobCountry = '',
  teamId = '',
  divisionId = '',
  allOpenJobs = '',
  fileName = 'JobReportByCompany',
}) => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest
    .send2V2(
      `/report/job-company-excel?fromDate=${fromDate}&toDate=${toDate}&jobCountry=${jobCountry}&teamId=${teamId}&divisionId=${divisionId}&allOpenJobs=${allOpenJobs}`,
      config
    )
    .then(({ response }) => {
      handleDownload(response, fileName);
    });
};

export const getReportJobUser = ({
  fromDate = '',
  toDate = '',
  jobCountry = '',
  teamId = '',
  divisionId = '',
}) => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest
    .sendV2(
      `/report/job-user?fromDate=${fromDate}&toDate=${toDate}&jobCountry=${jobCountry}&teamId=${teamId}&divisionId=${divisionId}`,
      config
    )
    .then(({ response }) => {
      return response;
    });
};

export const getReportJobUserExcel = ({
  fromDate = '',
  toDate = '',
  jobCountry = '',
  teamId = '',
  divisionId = '',
  fileName = 'JobReportByUser(AM)',
}) => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest
    .send2V2(
      `/report/job-user-excel?fromDate=${fromDate}&toDate=${toDate}&jobCountry=${jobCountry}&teamId=${teamId}&divisionId=${divisionId}`,
      config
    )
    .then(({ response }) => {
      handleDownload(response, fileName);
    });
};

export const getReportJobDetails = ({
  fromDate = '',
  toDate = '',
  jobCountry = '',
  teamId = '',
  divisionId = '',
  jobType = '',
  jobId = '',
}) => {
  let timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jobId,
      fromDate,
      toDate,
      jobType: jobType || undefined,
      divisionId: divisionId || undefined,
      teamId: teamId || undefined,
      timeZone,
      jobCountry: jobCountry || undefined,
    }),
  };

  return authRequest
    .sendV2(`/report/job-details`, config)
    .then(({ response }) => {
      return response;
    });
};

export const getReportJobDetailsExcel = ({
  fromDate = '',
  toDate = '',
  jobCountry = '',
  teamId = '',
  divisionId = '',
  jobType = '',
  jobId = '',
  fileName = 'jobReportDetails',
}) => {
  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jobId,
      fromDate,
      toDate,
      jobType: jobType || undefined,
      divisionId: divisionId || undefined,
      teamId: teamId || undefined,
      jobCountry: jobCountry || undefined,
    }),
  };

  return authRequest
    .send2V2(`/report/job-details-excel`, config)
    .then(({ response }) => {
      handleDownload(response, fileName);
    });
};

export const getReportActivitiesByUsers = ({
  fromDate = '',
  toDate = '',
  jobCountry = '',
  teamId = '',
  divisionId = '',
  // byWeeks,
  userParams,
}) => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest
    .sendV2(
      `/report/p1-pipeline-analytics-by-users?fromDate=${fromDate}&toDate=${toDate}&jobCountry=${jobCountry}&teamId=${teamId}&divisionId=${divisionId}${userParams}`,
      config
    )
    .then(({ response }) => {
      // console.log(response);
      return response;
    });
};

export const getReportActivitiesByUsersExcel = ({
  fromDate = '',
  toDate = '',
  jobCountry = '',
  teamId = '',
  divisionId = '',
  fileName = 'ActivitiesReportByUser',
  userParams,
}) => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest
    .send2V2(
      `/report/p1-pipeline-analytics-by-users-excel?fromDate=${fromDate}&toDate=${toDate}&jobCountry=${jobCountry}&teamId=${teamId}&divisionId=${divisionId}${userParams}`,
      config
    )
    .then(({ response }) => {
      handleDownload(response, fileName);
    });
};

export const getNewPipelineReportBySubmittedDate = ({
  fromDate = '',
  toDate = '',
  userParams = '',
}) => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest.sendV2(
    `/report/g2-pipeline-analytics-by-submit-to-am?${userParams}&fromDate=${fromDate}&toDate=${toDate}`,
    config
  );
};

export const getNewPipelineReportByUpdatedDate = ({
  fromDate = '',
  toDate = '',
  userParams = '',
}) => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest.sendV2(
    `/report/g4-pipeline-analytics-by-users?${userParams}&fromDate=${fromDate}&toDate=${toDate}`,
    config
  );
};

const handleDownload = (response, filename) => {
  console.log(response);

  const linkElement = document.createElement('a');
  try {
    const blob = new Blob([response], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = window.URL.createObjectURL(blob);
    linkElement.setAttribute('href', url);
    linkElement.setAttribute('download', filename);
    const clickEvent = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: false,
    });
    linkElement.dispatchEvent(clickEvent);
  } catch (ex) {
    console.log(ex);
  }
};

// sales Report
export const getSalesFteByMonth = ({
  country = '',
  companies = [],
  years = [2021, 2020, 2019],
}) => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest.send(
    `/report/sales-fte-by-month?country=${country}&companies=${companies}&years=${years}`,
    config
  );
};

export const getSalesFteByQuarter = ({
  country = '',
  companies = [],
  years = [2021, 2020, 2019],
}) => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest.send(
    `/report/sales-fte-by-quarter?country=${country}&companies=${companies}&years=${years}`,
    config
  );
};

export const getSalesFteByYear = ({
  country = '',
  companies = [],
  years = [2018, 2019, 2020, 2021, 2022],
}) => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest.send(
    `/report/sales-fte-by-year?country=${country}&companies=${companies}&years=${years}`,
    config
  );
};

export const getSalesContractByMonth = ({
  country = '',
  companies = [],
  years = [2020, 2021, 2022],
}) => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest.send(
    `/report/sales-contract-by-month?country=${country}&companies=${companies}&years=${years}`,
    config
  );
};

export const getSalesContractByQuarter = ({
  country = '',
  companies = [],
  years = [2021, 2020, 2019],
}) => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest.send(
    `/report/sales-contract-by-quarter?country=${country}&companies=${companies}&years=${years}`,
    config
  );
};

export const getSalesContractByYear = ({
  country = '',
  companies = [],
  years = [2018, 2019, 2020, 2021, 2022],
}) => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest.send(
    `/report/sales-contract-by-year?country=${country}&companies=${companies}&years=${years}`,
    config
  );
};

export const getSalesPayrollByMonth = ({
  country = '',
  companies = [],
  years = [2021, 2020, 2019],
}) => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest.send(
    `/report/sales-payroll-by-month/?country=${country}&companies=${companies}&years=${years}`,
    config
  );
};

// All, FTE, Contract, Payroll by month
export const getSalesAllByMonth = ({
  country = '',
  companies = [],
  years = [2021, 2020, 2019],
}) => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest.send(
    `/report/sales-all-by-month/?country=${country}&companies=${companies}&years=${years}`,
    config
  );
};

// 点击柱子时触发
export const getSalesDetalis = (params) => {
  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  };

  return authRequest.send(`/report/sales-details`, config);
};

// Sales Details downLoad
export const downLoadSales = (applicationID) => {
  const fileName = 'sales Report';
  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(applicationID),
  };

  return authRequest
    .send2(`/report/sales-details-excel`, config)
    .then(({ response }) => {
      handleDownload(response, fileName);
    });
};

// new-offer
export const getSalesNewOfferByWeekly = ({
  country = '',
  companies = [],
  jobType = '',
}) => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest.send(
    `/report/sales-by-weekly-new-offer?country=${country}&companies=${companies}&jobType=${jobType}`,
    config
  );
};

// Get company List
export const getCompanyListForSale = ({
  country = '',
  jobType = '',
  years = [],
}) => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest.send(
    `/report/sales/company/filter?country=${country}&jobTypes=${jobType}&years=${years}`,
    config
  );
};

// Get company list for Weekly New Offer
export const getCompanyListForWeeklyNewOffer = ({
  country = '',
  jobType = '',
}) => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest.send(
    `/report/sales-by-weekly-new-offer/company/filter?country=${country}&jobType=${jobType}`,
    config
  );
};
