import authRequest from './request';
import moment from 'moment-timezone';
import { jobRequestEnum } from '../utils/search';

//根据companyId获取Client Contact
export const getClientContactByCompanyId = (companyId) => {
  const config = {
    method: 'GET',
    headers: {},
  };
  return authRequest.send(`/client-contacts/company/${companyId}`, config);
};

export const getClientContactById = (clientContactId) => {
  const config = {
    method: 'GET',
    headers: {},
  };
  return authRequest.send(`/client-contacts/${clientContactId}`, config);
};

export const upsertClientContact = (clientContact, clientContactId) => {
  const config = {
    method: clientContactId ? 'PUT' : 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(clientContact),
  };
  return authRequest.send(`/client-contacts/${clientContactId || ''}`, config);
};

export const addCommonPooltoCompany = (clientContact) => {
  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(clientContact),
  };
  return authRequest.send(`/client-contacts/common-pool`, config);
};

export const upsertapprover = (obj) => {
  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(obj),
  };
  return authRequest.send(`/client-contacts/approver`, config);
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
  return authRequest.send(`/client-contacts/company/${companyId}`, config);
};

export const gethasApproverPermissionId = (companyId) => {
  const config = {
    method: 'GET',
    headers: {},
  };
  return authRequest.send(
    `/client-contacts/hasApproverPermission/${companyId}`,
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

  return authRequest.send(`/client/${id}`, config);
};

export const putClientInfo = (params, id) => {
  const config = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  };
  return authRequest.send(`/client/${id}`, config);
};

export const createCompany = (obj) => {
  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(obj),
  };
  return authRequest.send(`/prospect-details`, config);
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
    pageSize: 600,
    pageNumber: 1,
    module,
    timezone: moment.tz.guess(),
  });
  return authRequest.sendV2(`/jobs/search`, config);
};

export const getUploadContractUrl = () => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest.send3(`/contracts/upload-url`, config);
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
  return authRequest.send(`/contracts`, config);
};

export const getContractsByCompany = (companyEntityId) => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest.send(
    `/contracts?companyEntityId=${companyEntityId}&page=0&size=1000&sort=status,desc&sort=contractType,asc&sort=uploadDate,desc&sort=startDate,desc`,
    config
  );
};

export const getContractById = (contractId) => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest.send(`/contracts/${contractId}`, config);
};

export const deleteContractById = (contractId) => {
  const config = {
    method: 'DELETE',
    headers: {},
  };

  return authRequest.send(`/contracts/${contractId}`, config);
};

export const getProgramTeamListByCompany = (companyId) => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest.send(`/project-teams/company/${companyId}`, config);
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

  return authRequest.send(`/project-teams/${teamId}`, config);
};

//根据公司id获取该公司saleLead
export const getSaleLead = (companyId) => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest.send(`/saleslead/company/${companyId}`, config);
};
//获取Potential Service Type树
export const getPotentialServiceTypeTree = () => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest.send(`/potentialServiceType`, config);
};

//地址模糊搜索
export const searchLocation = (location) => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest.send(`/geoinfo/search?condition=${location}`, config);
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
  return authRequest.send(`/company/${id}/note?contactId=${contactId}`, config);
};

//创建progressNotes
export const postProgressNotes = (id, params) => {
  const config = {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(params),
  };

  return authRequest.send(`/company/${id}/note`, config);
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
  return authRequest.send(`/company-address`, config);
};

//获取联系人地址
export const getCLientContactAddress = (companyId) => {
  const config = {
    method: 'GET',
    headers: {},
  };
  return authRequest.send(`/address/company/${companyId}`, config);
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

  return authRequest.send(`/project-teams`, config);
};

export const uploadProjectTeam = (params, id) => {
  const config = {
    method: 'PUT',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(params),
  };

  return authRequest.send(`/project-teams/${id}`, config);
};

export const addSaleLead = (params) => {
  const config = {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(params),
  };

  return authRequest.send(`/saleslead`, config);
};

export const putCompany = (params) => {
  const config = {
    method: 'PUT',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(params),
  };
  return authRequest.send(`/prospect-details`, config);
};

export const prospectUpgrade = (params) => {
  const config = {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(params),
  };

  return authRequest.send(`/prospect-upgrade`, config);
};

export const updateContactPhone = (params) => {
  const config = {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(params),
  };

  return authRequest.send(`/update-client-contacts-batch`, config);
};

export const setCompanyInfo = (companyId, info) => {
  const config = {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({ info }),
  };

  return authRequest.send(`/company-infos/companyId/${companyId}`, config);
};
export const getCompanyInfo = (companyId) => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest.send(`/company-infos/companyId/${companyId}`, config);
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

  return authRequest.sendV2(`/jobs/contact/${companyId}`, config);
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
    return authRequest.send(`/clientBriefList`, config);
  } else {
    return authRequest.send(`/clientBriefList?type=${type}`, config);
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

export const getSkipSubmitToAMCompanies = () => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest.send(`/skip-submit-to-am-companies`, config);
};
export const getSkipSubmitToAMUsers = (companyId) => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest.send(
    `/skip-submit-to-am-companies/${companyId}/all-users`,
    config
  );
};

export const updateSkipSubmitToAMUsers = (companyId, userIds) => {
  const config = {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(userIds),
  };

  return authRequest.send(
    `/skip-submit-to-am-companies/${companyId}/replace-users`,
    config
  );
};
