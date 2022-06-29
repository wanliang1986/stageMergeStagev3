import authRequest from './request';

export const getDocumentTableData = () => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest.sendV2(`/settings/documents`, config);
};

export const UploadFile = (file) => {
  const requestBody = new FormData();
  requestBody.append('file', file);

  const config = {
    method: 'POST',
    headers: {},
    body: requestBody,
  };

  return authRequest.sendV2(`/settings/files/upload`, config);
};

export const deleteDocuments = (documentId = '') => {
  const config = {
    method: 'DELETE',
    headers: {},
  };

  return authRequest.sendV2(`/settings/documents/${documentId}`, config);
};

export const addDocument = (params) => {
  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  };

  return authRequest.sendV2(`/settings/documents`, config);
};

export const editDocument = (params, documentId) => {
  const config = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  };

  return authRequest.sendV2(`/settings/documents/${documentId}`, config);
};

export const getDocument = (documentId) => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest.sendV2(`/settings/documents/${documentId}`, config);
};

export const getPackageTableData = () => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest.sendV2(`/settings/packages`, config);
};

export const deletePackages = (packageId = '') => {
  const config = {
    method: 'DELETE',
    headers: {},
  };

  return authRequest.sendV2(`/settings/packages/${packageId}`, config);
};

export const addPackages = (params) => {
  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  };

  return authRequest.sendV2(`/settings/packages`, config);
};

export const editPackages = (params, packageId) => {
  const config = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  };

  return authRequest.sendV2(`/settings/packages/${packageId}`, config);
};

export const getPackageDocumentTableData = (packageId = '') => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest.sendV2(
    `/settings/packages-documents/${packageId}`,
    config
  );
};

export const deletePackagesDocument = (packageId = '', documentId = '') => {
  const config = {
    method: 'DELETE',
    headers: {},
  };

  return authRequest.sendV2(
    `/settings/packages/documents/${packageId}/${documentId}`,
    config
  );
};

export const getSelectDocumentTableData = (packageId = '', params) => {
  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  };

  return authRequest.sendV2(`/settings/documents/${packageId}`, config);
};

export const saveSelectDocumentTableData = (params, packageId) => {
  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  };

  return authRequest.sendV2(
    `/settings/packages/documents/${packageId}`,
    config
  );
};

export const getEsignatureData = () => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest.sendV2(`/settings/signature`, config);
};

export const saveEsignatureData = (params) => {
  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  };

  return authRequest.sendV2(`/settings/signature`, config);
};

export const getPackagesList = (applicationId) => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest.sendV2(`/onboarding/packages/${applicationId}`, config);
};

export const getSelectDocuments = (applicationId, id) => {
  const config = {
    method: 'GET',
    headers: {},
  };
  return authRequest.sendV2(
    `/onboarding/packages-documents/${applicationId}/${id}`,
    config
  );
};

export const getDrafts = (id) => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest.sendV2(`/onboarding/processing/drafts/${id}`, config);
};

export const getHistory = (params, id) => {
  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  };

  return authRequest.sendV2(`/onboarding/processing/histories/${id}`, config);
};

export const fetchAddDocumentData = (params) => {
  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  };

  return authRequest.sendV2(`/onboarding/documents`, config);
};

export const PreviewPackageS3link = (params) => {
  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  };

  return authRequest.sendV2(`/onboarding/processing/preview`, config);
};

export const saveDrafts = (params, applicationId) => {
  const config = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  };
  return authRequest.sendV2(
    `/onboarding/processing/drafts/${applicationId}`,
    config
  );
};

export const CancelBtnAction = (applicationId) => {
  const config = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  };
  return authRequest.sendV2(
    `/onboarding/processing/drafts/${applicationId}`,
    config
  );
};

export const getCompletedList = (applicationId) => {
  const params = {};
  params.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  };
  return authRequest.sendV2(
    `/onboarding/processing/completions/${applicationId}`,
    config
  );
};

export const DownloadCompleted = (params, applicationId) => {
  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  };

  return authRequest.send2V2(
    `/onboarding/processing/downloading/${applicationId}`,
    config
  );
};

export const handleRemind = (applicationId) => {
  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  return authRequest.sendV2(
    `/onboarding/processing/reminding/${applicationId}`,
    config
  );
};

export const completedAction = (params) => {
  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  };

  return authRequest.sendV2(`/onboarding/processing/approvement`, config);
};

export const getTemplateEmailContent = (applicationId, params) => {
  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  };

  return authRequest.sendV2(
    `/onboarding/processing/emails/${applicationId}`,
    config
  );
};

export const onboardSendEmail = (params) => {
  const requestBody = new FormData();

  if (params.email.cc) {
    let ccArr = params.email.cc.split(',');

    requestBody.append('cc', ccArr);
  }
  if (params.email.bcc) {
    let bccArr = params.email.bcc.split(',');
    requestBody.append('bcc', bccArr);
  }
  requestBody.append('applicationId', params.applicationId);
  if (params.packageId) {
    requestBody.append('packageId', params.packageId);
  }
  if (params.packageName) {
    requestBody.append('packageName', params.packageName);
  }
  requestBody.append('documents', JSON.stringify(params.documents));

  requestBody.append('to', params.email.to);
  requestBody.append('subject', params.email.subject || '( no subject )');
  requestBody.append('htmlContents', params.email.htmlContents);
  if (params.email.files) {
    params.email.files.forEach((file) => requestBody.append('files', file));
  }

  const config = {
    method: 'POST',
    headers: {},
    body: requestBody,
  };

  return authRequest.sendV2(`/onboarding/processing/emails`, config);
};

export const candidatesSendEmailDetails = (talentId) => {
  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };
  return authRequest.sendV2(
    `/onboarding/processing/portal/emails/${talentId}`,
    config
  );
};

export const candidatesReseting = (params, talentId) => {
  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  };

  return authRequest.sendV2(
    `/onboarding/processing/accounts/reseting/${talentId}`,
    config
  );
};

// 查询候选人账号状态
export const getProtal = (talentId) => {
  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };
  return authRequest.sendV2(
    `/onboarding/processing/portal/${talentId}`,
    config
  );
};

export const candidatesSendEmail = (params) => {
  const requestBody = new FormData();

  if (params.email.cc) {
    let ccArr = params.email.cc.split(',');

    requestBody.append('cc', ccArr);
  }
  if (params.email.bcc) {
    let bccArr = params.email.cc.split(',');
    requestBody.append('bcc', bccArr);
  }
  requestBody.append('to', params.email.to);
  requestBody.append('subject', params.email.subject || '( no subject )');
  requestBody.append('htmlContents', params.email.htmlContents);
  if (params.email.files) {
    params.email.files.forEach((file) => requestBody.append('files', file));
  }

  const config = {
    method: 'POST',
    headers: {},
    body: requestBody,
  };
  return authRequest.sendV2(
    `/onboarding/processing/portal/emails/${params.talentId}`,
    config
  );
};
