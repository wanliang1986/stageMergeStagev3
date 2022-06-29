import authRequest from './request';
import moment from 'moment-timezone';

export const getJobReportByDetailsExcel = ({
  from_date,
  to_date,
  jobId,
  fileName = 'JobReportByDetails',
}) => {
  let timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jobId: jobId,
      fromDate: from_date,
      toDate: to_date,
      timeZone,
    }),
  };

  return authRequest
    .send2(`/report/job/details-excel`, config)
    .then(({ response }) => {
      handleDownload(response, fileName);
    });
};

export const getJobReportByDetails = ({
  from_date,
  to_date,
  jobType,
  jobId,
  selectedUserCountry,
  selectedJobCountry,
}) => {
  let timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jobId: jobId,
      fromDate: from_date,
      toDate: to_date,
      size: 10000,
      timeZone,
      jobType: jobType || undefined,
      userCountry: selectedUserCountry || undefined,
      jobCountry: selectedJobCountry || undefined,
    }),
  };

  return authRequest
    .send(`/report/job/details`, config)
    .then(({ response }) => {
      // console.log(response);
      return response;
    });
};

export const getMonthTrendReportExcel = (month) => {
  const config = {
    method: 'GET',
    headers: {},
  };

  let from_date = moment(month).date(1).utc().format();
  let to_date = moment(month).add('months', 1).date(0).utc().format();
  if (month === moment().format('YYYY-MM')) {
    to_date = moment().utc().format();
  }

  return authRequest
    .send2(
      `/report/trend/month-excel?from_date=${from_date}&to_date=${to_date}`,
      config
    )
    .then(({ response }) => {
      handleDownload(response, `month-trend-excel ${month}`);
    });
};

export const getMonthTrendReportData = (month) => {
  const config = {
    method: 'GET',
    headers: {},
  };

  let from_date = moment(month).date(1).utc().format();
  let to_date = moment(month).add('months', 1).date(0).utc().format();
  if (month === moment().format('YYYY-MM')) {
    to_date = moment().utc().format();
  }

  return authRequest
    .send(
      `/report/trend/month?from_date=${from_date}&to_date=${to_date}`,
      config
    )
    .then(({ response }) => {
      return response;
    });
};

export const getCompanyTrendReportExcel = (company) => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest
    .send2(`/report/trend/company-excel?company=${company}`, config)
    .then(({ response }) => {
      handleDownload(response, `company-trend-excel ${company}`);
    });
};

export const getCompanyTrendReportData = (company) => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest
    .send(`/report/trend/company?company=${company}`, config)
    .then(({ response }) => {
      return response;
    });
};

export const getCompanyListData = () => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest
    .send(`/report/trend/company-list`, config)
    .then(({ response }) => {
      return response;
    });
};

// V2 Pipeline Details Download
export const getPipelineReportByDetailsExcel_V2 = ({
  from_date = '',
  to_date = '',
  activity_id,
  activity_status,
  fileName = 'PipelineReportByDetails',
}) => {
  let timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      activityId: activity_id,
      size: 10000,
      timeZone,

      status: activity_status,
    }),
  };

  return authRequest
    .send2V2(`/report/pipeline/details-excel`, config)
    .then(({ response }) => {
      handleDownload(response, fileName);
    });
};

export const getPipelineReportByDetailsExcel = ({
  from_date = '',
  to_date = '',
  activity_id,
  fileName = 'PipelineReportByDetails',
}) => {
  let timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      activityId: activity_id,
      fromDate: from_date,
      toDate: to_date,
      size: 10000,
      timeZone,
    }),
  };

  return authRequest
    .send2(`/report/pipeline/details-excel`, config)
    .then(({ response }) => {
      handleDownload(response, fileName);
    });
};

export const getPipelineReportByDetails_V2 = ({
  from_date,
  to_date,
  activity_id,
  activity_status,

  selectedCompany,
  selectedRecruiter,
  selectedUserCountry,
  selectedJobCountry,
}) => {
  let timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      activityId: activity_id,
      fromDate: from_date,
      toDate: to_date,

      company: selectedCompany || undefined,
      recruiterId: selectedRecruiter || undefined,
      size: 10000,
      timeZone,
      userCountry: selectedUserCountry || undefined,
      jobCountry: selectedJobCountry || undefined,

      status: activity_status,
    }),
  };

  return authRequest
    .sendV2(`/report/pipeline/details`, config)
    .then(({ response }) => {
      // console.log(response);
      return response;
    });
};

export const getPipelineReportByDetails = ({
  from_date,
  to_date,
  activity_id,
  selectedCompany,
  selectedRecruiter,
  selectedUserCountry,
  selectedJobCountry,
}) => {
  let timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      activityId: activity_id,
      fromDate: from_date,
      toDate: to_date,

      company: selectedCompany || undefined,
      recruiterId: selectedRecruiter || undefined,
      size: 10000,
      timeZone,
      userCountry: selectedUserCountry || undefined,
      jobCountry: selectedJobCountry || undefined,
    }),
  };

  return authRequest
    .send(`/report/pipeline/details`, config)
    .then(({ response }) => {
      // console.log(response);
      return response;
    });
};

export const getPipelineReportByDetailsFilters = ({
  from_date = '',
  to_date = '',
}) => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest
    .send(
      `/report/pipeline/details/filter?from_date=${from_date}&to_date=${to_date}`,
      config
    )
    .then(({ response }) => {
      console.log(response);
      return response;
    });
};

export const getPipelineReportByRecruiterExcel = ({
  from_date = '',
  to_date = '',
  fileName = 'PipelineReportByRecruiter',
}) => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest
    .send2(
      `/report/pipeline/recruiter-excel?from_date=${from_date}&to_date=${to_date}`,
      config
    )
    .then(({ response }) => {
      handleDownload(response, fileName);
    });
};

export const getPipelineReportByRecruiter = ({
  from_date = '',
  to_date = '',
  selectedCompany = '',
  selectedUserCountry = '',
  selectedJobCountry = '',
}) => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest
    .send(
      `/report/pipeline/recruiter?from_date=${from_date}&to_date=${to_date}&company=${selectedCompany}&user_country=${selectedUserCountry}&job_country=${selectedJobCountry}`,
      config
    )
    .then(({ response }) => {
      console.log(response);
      return response;
    });
};

export const getPipelineReportByRecruiterFilters = ({
  from_date = '',
  to_date = '',
}) => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest
    .send(
      `/report/pipeline/recruiter/filter?from_date=${from_date}&to_date=${to_date}`,
      config
    )
    .then(({ response }) => {
      console.log(response);
      return response;
    });
};

export const getPipelineReportBySourcerExcel = ({
  from_date = '',
  to_date = '',
  fileName = 'PipelineReportBySourcer',
}) => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest
    .send2(
      `/report/pipeline/sourcer-excel?from_date=${from_date}&to_date=${to_date}`,
      config
    )
    .then(({ response }) => {
      handleDownload(response, fileName);
    });
};

export const getPipelineReportBySourcer = ({
  from_date = '',
  to_date = '',
  selectedCompany = '',
  selectedUserCountry = '',
  selectedJobCountry = '',
}) => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest
    .send(
      `/report/pipeline/sourcer?from_date=${from_date}&to_date=${to_date}&company=${selectedCompany}&user_country=${selectedUserCountry}&job_country=${selectedJobCountry}`,
      config
    )
    .then(({ response }) => {
      console.log(response);
      return response;
    });
};

export const getPipelineReportBySourcerFilters = ({
  from_date = '',
  to_date = '',
}) => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest
    .send(
      `/report/pipeline/sourcer/filter?from_date=${from_date}&to_date=${to_date}`,
      config
    )
    .then(({ response }) => {
      console.log(response);
      return response;
    });
};

export const getPipelineReportByCompanyExcel = ({
  from_date = '',
  to_date = '',
  selectedUserRole = '',
  selectedUserId = '',
  selectedJobCountry = '',
  fileName = 'PipelineReportByCompany',
}) => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest
    .send2V2(
      `/report/p2-pipeline-analytics-by-company-excel?fromDate=${from_date}&toDate=${to_date}&userRole=${selectedUserRole}&userId=${selectedUserId}&jobCountry=${selectedJobCountry}`,
      config
    )
    .then(({ response }) => {
      handleDownload(response, fileName);
    });
};

export const getPipelineReportByCompany = ({
  from_date = '',
  to_date = '',
  selectedRecruiter = '',
  selectedUserCountry = '',
  selectedJobCountry = '',
}) => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest
    .send(
      `/report/pipeline/company?from_date=${from_date}&to_date=${to_date}&recruiter_id=${selectedRecruiter}&user_country=${selectedUserCountry}&job_country=${selectedJobCountry}`,
      config
    )
    .then(({ response }) => {
      console.log(response);
      return response;
    });
};

export const getPipelineReportByCompanyV2 = ({
  from_date = '',
  to_date = '',
  selectedUserRole = '',
  selectedUserId = '',
  selectedJobCountry = '',
}) => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest
    .sendV2(
      `/report/p2-pipeline-analytics-by-company?fromDate=${from_date}&toDate=${to_date}&userRole=${selectedUserRole}&userId=${selectedUserId}&jobCountry=${selectedJobCountry}`,
      config
    )
    .then(({ response }) => {
      console.log(response);
      return response;
    });
};

export const getPipelineReportByCompanyUsers = ({
  from_date = '',
  to_date = '',
  selectedJobCountry = '',
}) => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest
    .sendV2(
      `/report/p2-pipeline-analytics-by-company/user/filter?fromDate=${from_date}&toDate=${to_date}&jobCountry=${selectedJobCountry}`,
      config
    )
    .then(({ response }) => {
      console.log(response);
      return response;
    });
};

export const getPipelineReportByCompanyFilters = ({
  from_date = '',
  to_date = '',
}) => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest
    .send(
      `/report/pipeline/company/filter?from_date=${from_date}&to_date=${to_date}`,
      config
    )
    .then(({ response }) => {
      console.log(response);
      return response;
    });
};

export const getDashboardPipeline = ({ from_date = '', to_date = '' }) => {
  const config = {
    method: 'GET',
    headers: {},
  };

  let timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  let encodedTZ = encodeURIComponent(timeZone);
  return authRequest
    .send(
      `/report/dashboard/pipeline?from_date=${from_date}&to_date=${to_date}&time_zone=${encodedTZ}`,
      config
    )
    .then(({ response }) => {
      // console.log(response);
      return response;
    });
};

export const getWeekReport = ({
  from_date = '',
  to_date = '',
  selectedType = 'LINKEDIN',
}) => {
  const config = {
    method: 'GET',
    headers: {},
  };

  let timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  let encodedTZ = encodeURIComponent(timeZone);

  return authRequest
    .send(
      `/report/user/linkedin-stats?from_date=${from_date}&to_date=${to_date}&time_zone=${encodedTZ}&type=${selectedType}`,
      config
    )
    .then(({ response }) => {
      // console.log(response);
      return response;
    });
};

export const getWeekReportExcel = ({
  from_date = '',
  to_date = '',
  selectedType = 'LINKEDIN',
  fileName = `SourceUsageReport_${selectedType}`,
}) => {
  const config = {
    method: 'GET',
    headers: {},
  };

  let timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  let encodedTZ = encodeURIComponent(timeZone);

  return authRequest
    .send2(
      `/report/user/all-linkedin-stats?from_date=${from_date}&to_date=${to_date}&time_zone=${encodedTZ}&type=${selectedType}`,
      config
    )
    .then(({ response }) => {
      handleDownload(response, fileName);
    });
};

export const getWeekReportCommonSearch = ({
  from_date = '',
  to_date = '',
  tenant_id,
}) => {
  const config = {
    method: 'GET',
    headers: {},
  };

  let timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  let encodedTZ = encodeURIComponent(timeZone);

  return authRequest
    .send(
      `/report/user/es-stats?from_date=${from_date}&to_date=${to_date}&time_zone=${encodedTZ}&tenant_id=${tenant_id}`,
      config
    )
    .then(({ response }) => {
      console.log(response);
      return response;
    });
};

export const getWeekReportCommonSearchExcel = ({
  from_date = '',
  to_date = '',
  tenant_id,
  fileName = `CommonSearchUsageReport`,
}) => {
  const config = {
    method: 'GET',
    headers: {},
  };

  let timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  let encodedTZ = encodeURIComponent(timeZone);

  return authRequest
    .send2(
      `/report/user/all-es-stats?from_date=${from_date}&to_date=${to_date}&time_zone=${encodedTZ}&tenant_id=${tenant_id}`,
      config
    )
    .then(({ response }) => {
      handleDownload(response, fileName);
    });
};

const handleDownload = (response, filename) => {
  console.log(response);

  var linkElement = document.createElement('a');
  try {
    var blob = new Blob([response], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    var url = window.URL.createObjectURL(blob);
    linkElement.setAttribute('href', url);
    linkElement.setAttribute('download', filename);
    var clickEvent = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: false,
    });
    linkElement.dispatchEvent(clickEvent);
  } catch (ex) {
    console.log(ex);
  }
};

export const getAgingReport = ({
  from_date,
  to_date,
  company = '',
  recruiter_id = '',
}) => {
  const config = {
    method: 'GET',
    headers: {},
  };

  let timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  let encodedTZ = encodeURIComponent(timeZone);
  return authRequest
    .send(
      `/report/pipeline/submittals-aging?from_date=${from_date}&to_date=${to_date}&time_zone=${encodedTZ}&company=${company}&recruiter_id=${recruiter_id}`,
      config
    )
    .then(({ response }) => {
      console.log(response);
      return response;
    });
};

export const getAgingReportFilter = ({ from_date, to_date }) => {
  const config = {
    method: 'GET',
    headers: {},
  };

  // console.log('time format', `/report/pipeline/submittals-aging-filter?from_date=${from_date}&to_date=${to_date}`);
  return authRequest.send(
    `/report/pipeline/submittals-aging-filter?from_date=${from_date}&to_date=${to_date}`,
    config
  );
};

export const getCurrentJobsAndTalents = (teamId, divisionId) => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest
    .send(
      `/report/resign-user-jobs-talents?teamId=${teamId || ''}&divisionId=${
        divisionId || ''
      }`,
      config
    )
    .then(({ response }) => {
      return response;
    });
};

export const getJobListByIds = (jobIds) => {
  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ jobIds }),
  };
  return authRequest
    .sendV2(`/jobs/jobIds`, config)
    .then(({ response }) => response);
};

export const getTalentListByIds = (talentIds) => {
  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ talentIds }),
  };
  return authRequest
    .sendV2(`/talents/talentIds`, config)
    .then(({ response }) => response);
};

export const getStoppedJobReportCount = (searchParams) => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest
    .send(`/report/dormant/jobs?${searchParams}`, config)
    .then(({ response }) => {
      return response;
    });
};

export const getStoppedJobReportDetail = (amId) => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest
    .send(`/report/dormant/jobs/${amId}`, config)
    .then(({ response }) => {
      return response;
    });
};

export const getStoppedCandidateReportCount = (status, searchParams) => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest
    .send(
      `/report/dormant/applications?status=${status}${searchParams}`,
      config
    )
    .then(({ response }) => {
      return response;
    });
};

export const getStoppedCandidateReportDetail = (recruiterId, status) => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest
    .send(
      `/report/dormant/applications/${recruiterId}?status=${status}`,
      config
    )
    .then(({ response }) => {
      return response;
    });
};
