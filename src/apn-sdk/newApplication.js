import authRequest from './request';

// 获取流程页面配置组件信息
export const getApplicationPageSection = (application, jobType) => {
  const config = {
    method: 'GET',
    headers: {},
  };
  if (jobType) {
    return authRequest.applicationSendV1(
      `/recruitment-process-node-page-sections/nodeType/${application}?jobType=${jobType}`,
      config
    );
  } else {
    return authRequest.applicationSendV1(
      `/recruitment-process-node-page-sections/nodeType/${application}`,
      config
    );
  }
};

export const getRecruitmentProcessId = (type) => {
  const config = {
    method: 'GET',
    headers: {},
  };
  return authRequest.applicationSendV1(
    `/recruitment-processes/default?jobType=${type}`,
    config
  );
};

export const getAllApplicationsByTalentId = (talentId) => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest.applicationSendV1(
    `/talent-recruitment-processes/talentId/${talentId}`,
    config
  );
};

// 根据Id查询
export const getAllApplicationsById = (id) => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest.applicationSendV1(
    `/talent-recruitment-processes/${id}`,
    config
  );
};

// 推荐至job
export const AddApplicationsOnTalent = (applicationCommissions) => {
  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(applicationCommissions),
  };

  return authRequest.applicationSendV1(
    `/talent-recruitment-processes/submit-to-job`,
    config
  );
};

// 推荐至客户
export const ApplicationsSubmitToClient = (clientCommissions) => {
  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(clientCommissions),
  };

  return authRequest.applicationSendV1(
    `/talent-recruitment-processes/submit-to-client`,
    config
  );
};

// 面试
export const ApplicationsSubmitToInterview = (interviewCommissions) => {
  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(interviewCommissions),
  };

  return authRequest.applicationSendV1(
    `/talent-recruitment-processes/interview`,
    config
  );
};

// offer
export const ApplicationsSubmitToOffer = (offerCommissions) => {
  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(offerCommissions),
  };

  return authRequest.applicationSendV1(
    `/talent-recruitment-processes/offer`,
    config
  );
};

// offerAccept
export const ApplicationsSubmitToOfferAccept = (
  offerCommissions,
  versionsFlag
) => {
  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(offerCommissions),
  };
  if (versionsFlag) {
    return authRequest.applicationSendV1(
      `/talent-recruitment-processes/commission`,
      config
    );
  } else {
    return authRequest.applicationSendV1(
      `/talent-recruitment-processes/offer-accept`,
      config
    );
  }
};

// onboard
export const ApplicationsSubmitToOnboard = (boardCommissions) => {
  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(boardCommissions),
  };

  return authRequest.applicationSendV1(
    `/talent-recruitment-processes/onboard`,
    config
  );
};

// 淘汰
export const ApplicationsEliminate = (commissions) => {
  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(commissions),
  };

  return authRequest.applicationSendV1(
    `/talent-recruitment-processes/eliminate`,
    config
  );
};

// 取消淘汰
export const ApplicationsCancelEliminate = (talentRecruitmentProcessId) => {
  const config = {
    method: 'POST',
    headers: {},
  };

  return authRequest.applicationSendV1(
    `/talent-recruitment-processes/cancel-eliminate/talentRecruitmentProcessId/${talentRecruitmentProcessId}`,
    config
  );
};

// Contract类型获取税率
export const NewApplicationOfferLetterParam = () => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest.applicationSendV1(
    `/talent-recruitment-processes/ipg-offer-letter-cost-rates`,
    config
  );
};
