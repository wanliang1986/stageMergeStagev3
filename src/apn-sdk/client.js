import authRequest from './request';
import moment from 'moment-timezone';
import { jobRequestEnum } from '../utils/search';

//根据companyId获取Client Contact
export const getClientContactByCompanyId = (companyId) => {
  const config = {
    method: 'GET',
    headers: {},
  };
  return authRequest.companySend(
    `/saleslead/client-contact/company/${companyId}`,
    config
  );
};

export const getClientContactById = (clientContactId) => {
  const config = {
    method: 'GET',
    headers: {},
  };
  return authRequest.send(`/client-contacts/${clientContactId}`, config);
};

export const upsertClientContact = (clientContact, clientContactId) => {
  if (clientContactId) {
    clientContact.id = clientContactId;
  }
  const config = {
    method: clientContactId ? 'PUT' : 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(clientContact),
  };
  return authRequest.companySend(`/saleslead/client-contact`, config);
};

//创建联系人
export const postClientContact = (params, clientId = '') => {
  const config = {
    method: clientId ? 'PUT' : 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(params),
  };
  return authRequest.send(`/client-contacts/${clientId}`, config);
};

//
export const getClientContactList = (companyId) => {
  const config = {
    method: 'GET',
    headers: {},
  };
  return authRequest.companySend(
    `/saleslead/client-contact/company/${companyId}`,
    config
  );
};

// export const deleteClientContact = (clientId) => {
//   const config = {
//     method: 'DELETE',
//     headers: {
//       'Content-Type': 'application/json'
//     }
//   };
//   return authRequest.send(`/client-contacts/${clientId}`, config);
// };

export const getCompanyList = (type) => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest.send(`/companies?type=${type}`, config);
};

//compony search
export const companySearch = (str) => {
  const config = {
    method: 'GET',
    headers: {},
  };
  return authRequest.send(`/company/search?search=${str}`, config);
};

//公司名称匹配
export const validateProspectName = (str) => {
  const config = {
    method: 'GET',
    headers: {},
  };
  return authRequest.send(`/prospect-validate?name=${str}`, config);
};
//CheckName
export const prospectCheckname = (str) => {
  const config = {
    method: 'GET',
    headers: {},
  };
  return authRequest.send(`/prospect-checkname?name=${str}`, config);
};

export const getClientInfo = (id) => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest.companySend(`/company/client/${id}`, config);
};

export const putClientInfo = (params) => {
  const config = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  };
  return authRequest.companySend(`/company/client`, config);
};

export const createCompany = (obj) => {
  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(obj),
  };
  // return authRequest.send(`/prospect-details`, config);
  return authRequest.companySend(`/company/`, config);
};

export const getCompanyById = (companyId, type) => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest.send(`/company/${companyId}?type=${type}`, config);
};

//根据id查潜在客户
export const getProCompanyById = (companyId) => {
  const config = {
    method: 'GET',
    headers: {},
  };
  return authRequest.send(`/prospect/${companyId}`, config);
};

export const getOpenJobsByCompany = (companyId) => {
  let module = jobRequestEnum.COMPANY;
  // const config = {
  //   method: 'GET',
  //   headers: {},
  // };

  // return authRequest.send(
  //   `/jobs?search=companyId:${companyId}&status=OPEN&size=1000`,
  //   config
  // );
  const config = {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // return authRequest.send(
  //   `/jobs?search=companyId:${companyId}&status=OPEN&size=1000`,
  //   config
  // );
  config.body = JSON.stringify({
    condition: JSON.stringify({
      and: [
        {
          or: [
            {
              status: 'OPEN',
            },
            {
              status: 'REOPENED',
            },
          ],
          // or: [
          //   {
          //     type: 'CONTRACT',
          //   },
          //   {
          //     type: 'FULL_TIME',
          //   },
          // ],
        },
        {
          or: [
            {
              companyId,
            },
          ],
        },
      ],
    }),
    pageSize: 10,
    pageNumber: 1,
    module,
    timezone: moment.tz.guess(),
  });
  return authRequest.jobSend(`/jobs/search`, config);
};

export const getUploadContractUrl = () => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest.companySend2(`/contract/upload-url`, config);
};

export const createContract = (contract, contractId) => {
  console.log('request', contractId);
  const config = {
    method: contractId ? 'PUT' : 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(contract),
  };
  return authRequest.companySend(`/contract`, config);
};

export const getContractsByCompany = (companyEntityId) => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest.companySend(`/contract/${companyEntityId}`, config);
};

export const getContractById = (contractId) => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest.companySend2(`/contract/detail/${contractId}`, config);
};

export const deleteContractById = (contractId) => {
  const config = {
    method: 'DELETE',
    headers: {},
  };

  return authRequest.companySend(`/contract/${contractId}`, config);
};

export const getProgramTeamListByCompany = (companyId) => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest.companySend(
    `/company/project-teams/company/${companyId}`,
    config
  );
};

export const upsertProgramTeam = (team, teamId = '') => {
  const config = {
    method: teamId ? 'PUT' : 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(team),
  };

  return authRequest.send(`/project-teams/${teamId}`, config);
};

export const updateProgramTeamUsers = (users, teamId = '') => {
  console.log(users);
  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(users),
  };

  return authRequest.send(`/project-teams/${teamId}/replace-users`, config);
};

export const deleteProgramTeam = (teamId = '') => {
  const config = {
    method: 'DELETE',
    headers: {},
  };

  return authRequest.companySend(`/company/project-teams/${teamId}`, config);
};

//根据公司id获取该公司saleLead
export const getSaleLead = (companyId) => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest.companySend(`/salesLead/${companyId}`, config);
};
//获取Potential Service Type树
export const getPotentialServiceTypeTree = () => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest.companySend(`/company/service-types`, config);
};

//地址模糊搜索
export const searchLocation = (location) => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest.locationSendV3(
    `/geoinfo/search?condition=${location}`,
    config
  );
};

export const searchAudience = (params) => {
  const config = {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(params),
  };

  return authRequest.send(`/search-audience?size=10`, config);
};

//根据companyId获取progressNotes
export const getAllProgressNotesByCompanyId = (id, contactId) => {
  const config = {
    method: 'GET',
    headers: {},
  };
  if (contactId) {
    return authRequest.companySend(
      `/company/progress-note/${id}/?clientContactId=${contactId}`,
      config
    );
  } else {
    return authRequest.companySend(`/company/progress-note/${id}`, config);
  }
};

//创建progressNotes
export const postProgressNotes = (params) => {
  const config = {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(params),
  };

  return authRequest.companySend(`/company/progress-note`, config);
};

//保存联系人地址
export const postClientContactAddress = (obj) => {
  const config = {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(obj),
  };
  return authRequest.companySend(`/company/address`, config);
};

//获取联系人地址
export const getCLientContactAddress = (companyId) => {
  const config = {
    method: 'GET',
    headers: {},
  };
  return authRequest.companySend(`/company/address/${companyId}`, config);
};

//
export const createProjectTeam = (params) => {
  const config = {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(params),
  };

  return authRequest.companySend(`/company/project-teams`, config);
};

export const uploadProjectTeam = (params, id) => {
  const config = {
    method: 'PUT',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(params),
  };

  return authRequest.companySend(`/company/project-teams/${id}`, config);
};

export const addSaleLead = (params) => {
  const config = {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(params),
  };

  return authRequest.companySend(`/saleslead`, config);
};

export const putCompany = (params) => {
  const config = {
    method: 'PUT',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(params),
  };
  return authRequest.companySend(`/company/prospect`, config);
};

export const prospectUpgrade = (params) => {
  const config = {
    method: 'PUT',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(params),
  };

  return authRequest.companySend(`/company/prospect/upgrade`, config);
};

export const updateContactPhone = (params) => {
  const config = {
    method: 'PUT',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(params),
  };

  return authRequest.companySend(
    `/saleslead/client-contact/batch-update`,
    config
  );
};

export const setCompanyInfo = (companyId, info) => {
  const config = {
    method: 'PUT',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({ id: companyId, note: info }),
  };

  return authRequest.companySend(`/company/client/note`, config);
};
export const getCompanyInfo = (companyId) => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest.companySend(`/company/client/note/${companyId}`, config);
};

//AmReport 获取数据

export const getAmReport = (params) => {
  const config = {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(params),
  };
  return authRequest.send(`/am/reports`, config);
};

//getHrInfo

export const getHrInfo = (companyId) => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest.jobSend(`/jobs/contact/${companyId}`, config);
};

export const amReportDown = (companyId) => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest.send2(`/am/download/${companyId}`, config);
};

//edit Experience

export const editExperience = (params) => {
  const config = {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(params),
  };
  return authRequest.send(`/am/update/he`, config);
};

export const saveActivities = (params) => {
  const config = {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(params),
  };
  return authRequest.send(`/activities`, config);
};

//新增接口，获取所有clientList
export const getClientBriefList = (type) => {
  const config = {
    method: 'GET',
    headers: {},
  };
  if (type === null) {
    return authRequest.companySend(`/company/clients/list`, config);
  } else {
    return authRequest.companySend(
      `/company/clients/list?type=${type}`,
      config
    );
  }
};

//internal performance report

export const getInternalReport = (params) => {
  const config = {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(params),
  };
  return authRequest.send(`/performance/reports`, config);
};

export const internalDownLoad = (params) => {
  const config = {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(params),
  };

  return authRequest.send2(`/performance/download`, config);
};

//v3

export const getAllClientCompanyList = (type) => {
  console.log(type);
  const config = {
    method: 'GET',
    headers: {},
  };
  if (type === 0) {
    return authRequest.companySend(
      `/company/clients?mine=false&page=0&size=2000`,
      config
    );
  } else if (type === 1) {
    return authRequest.companySend(
      `/company/clients?mine=true&page=0&size=2000`,
      config
    );
  } else if (type === 3) {
    return authRequest.companySend(
      `/company/prospects?mine=true&page=0&size=2000`,
      config
    );
  } else {
    return authRequest.companySend(
      `/company/prospects?mine=false&page=0&size=2000`,
      config
    );
  }
};

export const searchLocationV3 = (location) => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest.locationSendV3(
    `/geoinfo/search?condition=${location}`,
    config
  );
};

export const getNoContracts = () => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest.companySend(`/company/noContracts`, config);
};

export const companySearchV3 = (str) => {
  const config = {
    method: 'GET',
    headers: {},
  };
  return authRequest.companySend(`/company/search/${str}`, config);
};

export const getClientDetail = (id) => {
  const config = {
    method: 'GET',
    headers: {},
  };
  return authRequest.companySend(`/company/client/${id}`, config);
};

export const getProspectDetail = (id) => {
  const config = {
    method: 'GET',
    headers: {},
  };
  return authRequest.companySend(`/company/prospect/${id}`, config);
};

export const getCompanyContact = (id) => {
  const config = {
    method: 'GET',
    headers: {},
  };
  return authRequest.companySend(
    `/saleslead/client-contact/company/${id}`,
    config
  );
};
