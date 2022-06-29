import authRequest from './request';

export const getMyPipelineTemplate = () => {
  const config = {
    method: 'GET',
    headers: {},
  };
  return authRequest.send(`/pipeline-template/MY_PIPELINE`, config);
};

export const putPipelineTemplate = (params) => {
  const config = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  };
  return authRequest.send(`/pipeline-template`, config);
};

export const postPipelineTemplate = (params) => {
  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  };
  return authRequest.send(`/pipeline-template`, config);
};

export const deletePipelineTemplate = (id) => {
  const config = {
    method: 'DELETE',
    headers: {},
  };

  return authRequest.send(`/pipeline-module/${id}`, config);
};

export const getPipelineList = (data) => {
  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };
  return authRequest.sendV2(`/my-pipeline`, config);
};

export const getDict = () => {
  const config = {
    method: 'GET',
    headers: {},
  };
  return authRequest.sendV2(`/column/57`, config);
};
