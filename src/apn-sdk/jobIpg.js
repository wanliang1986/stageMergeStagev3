import authRequest from './request';
import { sleep } from '../utils';
import { getUuid, getTextUuid } from './files';

export const upsertJob_Ipg = (job, status, jobId) => {
  const config = {
    method: status === 'NO_PUBLISHED' ? 'POST' : 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(job),
  };
  if (status === 'NO_PUBLISHED') {
    return authRequest.sendV2(`/jobs/sync/toIpg`, config);
  } else {
    return authRequest.sendV2(`/jobs/sync/toIpg/${jobId}`, config);
  }
};

export const closeJob_Ipg = (jobId) => {
  const config = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id: jobId, status: 'CLOSED' }),
  };

  return authRequest.sendV2(`/jobs/sync/toIpg/${jobId}/CLOSED`, config);
};

export const getJd_Ipg = (jobId) => {
  const config = {
    method: 'GET',
    headers: {},
  };
  return authRequest.sendV2(`/jobs/sync/toIpg/${jobId}`, config);
};
