/**
 * Created by chenghui on 5/31/17.
 */
import authRequest from './request';

export const saveAssignment = (params) => {
  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  };
  return authRequest.sendV2(`/assignment/save`, config);
};

export const updateAssignment = (params) => {
  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  };
  return authRequest.sendV2(`/assignment/update`, config);
};

export const getAssignmentCurrent = (startId) => {
  const config = {
    method: 'GET',
    headers: {},
  };
  return authRequest.sendV2(`/assignment/current?startId=${startId}`, config);
};

export const getAssignmentDetail = (assignmentId) => {
  const config = {
    method: 'GET',
    headers: {},
  };
  return authRequest.sendV2(`/assignment/detail?id=${assignmentId}`, config);
};

export const getAssignmentList = (startId) => {
  const config = {
    method: 'GET',
    headers: {},
  };
  return authRequest.sendV2(`/assignment/list?startId=${startId}`, config);
};

export const deleteAssignmentList = (assignmentId) => {
  const config = {
    method: 'DELETE',
    headers: {},
  };
  return authRequest.sendV2(`/assignment/delete?id=${assignmentId}`, config);
};

export const getPaylist = (startId) => {
  const config = {
    method: 'GET',
    headers: {},
  };
  return authRequest.sendV2(`/assignment/payList?startId=${startId}`, config);
};

export const getLatestAssignment = (startId) => {
  const config = {
    method: 'GET',
    headers: {},
  };
  return authRequest.sendV2(
    `/assignment/latestAssignment?startId=${startId}`,
    config
  );
};
