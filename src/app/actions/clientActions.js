import * as apnSDK from './../../apn-sdk/';
import * as ActionTypes from '../constants/actionTypes';
import { normalize, schema } from 'normalizr';
import { miniUser, jobBasic } from './schemas';
import { showErrorMessage } from './index';
import Immutable from 'immutable';
import { getNewAMList } from '../../utils/index';

const companies = new schema.Entity('companies', {});
// const noContractClients = new schema.Entity('noContractClients',{})
const client = new schema.Entity('clients', {
  accountManager: miniUser,
  createdUser: miniUser,
  companyEntity: companies,
});
const contracts = new schema.Entity('contracts', {});
const programTeam = new schema.Entity('programTeams', {
  // users: [user]
});

export const getClientContact = (clientContactId) => (dispatch) => {
  return apnSDK.getClientContactById(clientContactId).then(({ response }) => {
    dispatch({
      type: ActionTypes.GET_CLIENT_CONTACT,
      client: response,
    });
  });
};

//创建&编辑联系人
export const upsertClientContact =
  (clientContact, clientContactId) => (dispatch, getState) => {
    return apnSDK
      .upsertClientContact(clientContact, clientContactId)
      .then(({ response }) => {
        dispatch({
          type: clientContactId
            ? ActionTypes.EDIT_CLIENT_CONTACT
            : ActionTypes.ADD_CLIENT_CONTACT,
          client: response,
        });
        return response;
      });
  };

//company new feature
export const getCompanyList = (type) => (dispatch, getState) => {
  dispatch({
    type: ActionTypes.REMOVE_COMPANIES,
  });

  return (
    apnSDK
      // .getCompanyList(type)
      .getAllClientCompanyList(type)
      .then(({ response }) => {
        const normalizedData = normalize(response, [companies]);
        // const normalizedNoContarctData = normalize(response.noContractCompany,[noContractClients])
        // console.log(normalizedNoContarctData)
        // console.log('normalized', normalizedData);
        dispatch({
          type: ActionTypes.RECEIVE_COMPANIES,
          normalizedData,
        });
        // dispatch({
        //   type: ActionTypes.NO_CONTRACT_CLIENT,
        //   normalizedNoContarctData: response.noContractCompany,
        // });
        return response;
      })
      .catch((err) => {
        dispatch({
          type: ActionTypes.FAILURE_COMPANIES,
        });
        throw err;
      })
  );
};

export const createCompany = (company) => (dispatch, getState) => {
  return apnSDK
    .createCompany(company)
    .then(({ response }) => {
      // console.log('create company', response);
      const normalizedData = normalize(response, companies);
      dispatch({
        type: ActionTypes.ADD_COMPANY,
        normalizedData,
      });
      return response;
    })
    .catch((err) => dispatch(showErrorMessage(err)));
};

export const putClientInfo = (params) => (dispatch, getState) => {
  return apnSDK
    .putClientInfo(params)
    .then(({ response }) => {
      // console.log('edit company', response);
      const normalizedData = normalize(response, companies);
      dispatch({
        type: ActionTypes.EDIT_COMPANY,
        normalizedData,
      });
      return response.id;
    })
    .catch((err) => dispatch(showErrorMessage(err)));
};

export const getCompany = (companyId, type) => (dispatch, getState) => {
  if (type === '0') {
    return apnSDK.getClientDetail(companyId, type).then(({ response }) => {
      let company = getNewAMList(response.salesLeadDetails);
      response.accountManager = company;
      const normalizedData = normalize(response, companies);
      dispatch({
        type: ActionTypes.RECEIVE_COMPANY,
        normalizedData,
      });
    });
  } else {
    return apnSDK.getProspectDetail(companyId, type).then(({ response }) => {
      let company = getNewAMList(response.salesLeadDetails);
      response.accountManager = company;
      const normalizedData = normalize(response, companies);
      dispatch({
        type: ActionTypes.RECEIVE_COMPANY,
        normalizedData,
      });
    });
  }
};

export const getOpenJobsByCompany = (companyId) => (dispatch, getState) => {
  if (getState().controller.searchJobs.byCompany.isFetching) {
    return Promise.resolve('loading...');
  }

  dispatch({
    type: ActionTypes.REQUEST_OPENJOBSBYCOMPANY,
    tab: 'byCompany',
  });

  return apnSDK
    .getOpenJobsByCompany(companyId)
    .then(({ response, headers }) => {
      // console.log('OPENJOBSBYCOMPANY jobs', response);
      // headers.forEach(value=>console.log(value))
      response.forEach((value) => {
        if (value.type === 'FULL_TIME') {
          value.type = 'Recruiting';
        }
        if (value.type === 'CONTRACT') {
          value.type = 'Staffing';
        }
      });
      const normalizedData = normalize(response, [jobBasic]);
      dispatch({
        type: ActionTypes.RECEIVE_OPENJOBSBYCOMPANY,
        tab: 'byCompany',
        normalizedData,
      });
    })
    .catch((err) => {
      dispatch({
        type: ActionTypes.FAILURE_OPENJOBSBYCOMPANY,
        tab: 'byCompany',
      });
      throw err;
    });
};

export const createContract = (contract, id) => (dispatch, getState) => {
  return apnSDK
    .createContract(contract, id)
    .then(({ response }) => {
      // console.log('upsert contract : ', response);
      dispatch({
        type: id ? ActionTypes.EDIT_CONTRACT : ActionTypes.ADD_CONTRACT,
        contract: response,
      });
      return response;
    })
    .catch((err) => dispatch(showErrorMessage(err)));
};

export const getContractsByCompany =
  (companyEntityId) => (dispatch, getState) => {
    dispatch({
      type: ActionTypes.REQUEST_CONTRACTSBYCOMPANY,
    });

    return apnSDK
      .getContractsByCompany(companyEntityId)
      .then(({ response }) => {
        const normalizedData = normalize(response, [contracts]);

        // console.log('[contracts]', normalizedData);
        dispatch({
          type: ActionTypes.RECEIVE_CONTRACTSBYCOMPANY,
          normalizedData,
        });
        return response;
      })
      .catch((err) => {
        dispatch({
          type: ActionTypes.FAILURE_CONTRACTSBYCOMPANY,
        });
        throw err;
      });
  };

export const deleteContractById = (contractId) => (dispatch, getState) => {
  return apnSDK.deleteContractById(contractId).then((res) => {
    dispatch({
      type: ActionTypes.DELETE_CONTRACT,
      contractId,
    });
  });
};

export const getProgramTeamList = (companyId) => (dispatch, getState) => {
  return apnSDK
    .getProgramTeamListByCompany(companyId)
    .then(({ response }) => {
      const normalizedData = normalize(response, [programTeam]);
      dispatch({
        type: ActionTypes.GET_PROGRAM_TEAM_LIST,
        normalizedData,
      });
    })
    .catch((err) => dispatch(showErrorMessage(err)));
};

export const upseartProgramTeam = (newTeam, oldTeam) => (dispatch) => {
  return apnSDK
    .upsertProgramTeam(newTeam, oldTeam.get('id'))
    .then(({ response }) => {
      response.users = oldTeam.get('users').toJS();
      dispatch({
        type: ActionTypes.UPSERT_PROGRAM_TEAM,
        programTeam: response,
      });

      return response;
    });
};

export const updateProgramTeamUsers =
  (users = [], teamId) =>
  (dispatch) => {
    return apnSDK.updateProgramTeamUsers(users, teamId).then(({ response }) => {
      dispatch({
        type: ActionTypes.UPSERT_PROGRAM_TEAM,
        programTeam: response,
      });
      return response;
    });
  };

export const deleteProgramTeam = (teamId) => (dispatch, getState) => {
  return apnSDK
    .deleteProgramTeam(teamId)
    .then(() => {
      dispatch({
        type: ActionTypes.DELETE_PROGRAM_TEAM,
        programTeamId: String(teamId),
      });
    })
    .catch((err) => dispatch(showErrorMessage(err)));
};

//client search
export const companySearch = (str) => (dispatch, getState) => {
  return apnSDK
    .companySearchV3(str)
    .catch((err) => dispatch(showErrorMessage(err)));
};

//get saleLead
export const getSaleLead = (id) => (dispatch, getState) => {
  return apnSDK.getSaleLead(id).catch((err) => dispatch(showErrorMessage(err)));
};

//get potentialServiceTypeTree

export const getPotentialServiceType = () => (dispatch, getState) => {
  return apnSDK
    .getPotentialServiceTypeTree()
    .then((res) => {
      dispatch({
        type: ActionTypes.POTENTIAL_SERVICE_TYPE_TREE,
        tree: res.response,
      });
    })
    .catch((err) => dispatch(showErrorMessage(err)));
};

//根据companyId获取progressNotes

export const getAllProgressNotesByCompanyId =
  (id, contactId) => (dispatch, getState) => {
    return apnSDK
      .getAllProgressNotesByCompanyId(id, contactId)
      .catch((err) => dispatch(showErrorMessage(err)));
  };

//根据companyId获取Client Contact

export const getClientContactByCompanyId =
  (companyId) => (dispatch, getState) => {
    return apnSDK
      .getClientContactByCompanyId(companyId)
      .then(({ response }) => {
        const normalizedData = normalize(response, [client]);
        dispatch({
          type: ActionTypes.RECEIVE_CLIENT_CONTACTS,
          normalizedData,
        });
        return { response };
      })
      .catch((err) => dispatch(showErrorMessage(err)));
  };

//创建progressNotes
export const postProgressNotes = (params) => (dispatch, getState) => {
  return apnSDK
    .postProgressNotes(params)
    .catch((err) => dispatch(showErrorMessage(err)));
};

//创建联系人地址
export const postClientContactAddress = (obj) => (dispatch, getState) => {
  return apnSDK
    .postClientContactAddress(obj)
    .catch((err) => dispatch(showErrorMessage(err)));
};

//获取联系人地址
export const getCLientContactAddress = (companyId) => (dispatch, getState) => {
  return apnSDK
    .getCLientContactAddress(companyId)
    .catch((err) => dispatch(showErrorMessage(err)));
};

//根据公司获取联系人列表
export const getClientContactList =
  (companyEntityId) => (dispatch, getState) => {
    dispatch({
      type: ActionTypes.REQUEST_CLIENTSBYCOMPANY,
    });

    return apnSDK
      .getCompanyContact(companyEntityId)
      .then(({ response }) => {
        // console.log('client list BYCOMPANY', response);
        const normalizedData = normalize(response, [client]);
        // console.log('normalized', normalizedData);
        dispatch({
          type: ActionTypes.RECEIVE_CLIENTSBYCOMPANY,
          normalizedData,
        });
        return response;
      })
      .catch((err) => {
        dispatch({
          type: ActionTypes.FAILURE_CLIENTSBYCOMPANY,
        });
        throw err;
      });
  };
//project-team
export const createProjectTeam = (params) => (dispatch, getState) => {
  return apnSDK
    .createProjectTeam(params)
    .catch((err) => dispatch(showErrorMessage(err)));
};
//
export const uploadProjectTeam = (params, id) => (dispatch, getState) => {
  return apnSDK
    .uploadProjectTeam(params, id)
    .catch((err) => dispatch(showErrorMessage(err)));
};
//addSaleLead
export const addSaleLead = (params) => (dispatch, getState) => {
  return apnSDK.addSaleLead(params);
  // .catch((err) => dispatch(showErrorMessage(err)));
};

export const putCompany = (params) => (dispatch, getState) => {
  return apnSDK
    .putCompany(params)
    .then(({ response }) => {
      // console.log('create company', response);
      // const normalizedData = normalize(response, companies);
      // dispatch({
      //   type: ActionTypes.ADD_COMPANY,
      //   normalizedData,
      // });
      return response;
    })
    .catch((err) => dispatch(showErrorMessage(err)));
};

export const prospectUpgrade = (params) => (dispatch, getState) => {
  return apnSDK
    .prospectUpgrade(params)
    .catch((err) => dispatch(showErrorMessage(err)));
};

export const updateContactPhone = (params) => (dispatch, getState) => {
  return apnSDK
    .updateContactPhone(params)
    .catch((err) => dispatch(showErrorMessage(err)));
};

//AmReport
export const getAmReport = (params) => (dispatch, getState) => {
  dispatch({
    type: ActionTypes.CLEAR_AM_REPORT_JOBDATA,
  });
  return apnSDK
    .getAmReport(params)
    .then((res) => {
      if (res.response && res.response.jobData) {
        let list = res.response.jobData.map((item, index) => {
          return Immutable.Map(item);
        });
        dispatch({
          type: ActionTypes.SET_AM_REPORT_JOBDATA,
          jobData: list,
        });
      }
      return res;
    })
    .catch((err) => dispatch(showErrorMessage(err)));
};

//getHRInfo
export const getHrInfo = (companyId) => (dispatch, getState) => {
  return apnSDK
    .getHrInfo(companyId)
    .catch((err) => dispatch(showErrorMessage(err)));
};

//AmReportDown
export const amReportDown = (companyId) => (dispatch, getState) => {
  return apnSDK
    .amReportDown(companyId)
    .then(({ response }) => {
      let fileName = 'Am Report';
      handleDownload(response, fileName);
      return response;
    })
    .catch((err) => dispatch(showErrorMessage(err)));
};

export const editExperience = (params) => (dispatch, getState) => {
  return apnSDK
    .editExperience(params)
    .catch((err) => dispatch(showErrorMessage(err)));
};

export const saveActivities = (params) => (dispatch, getState) => {
  return apnSDK
    .saveActivities(params)
    .catch((err) => dispatch(showErrorMessage(err)));
};

//获取所有clientList
export const getClientBriefList = (type) => (dispatch, getState) => {
  dispatch({
    type: ActionTypes.REMOVE_COMPANIES,
  });
  return apnSDK
    .getClientBriefList(type)
    .then((response) => {
      const normalizedData = normalize(response.response, [companies]);
      // dispatch({
      //   type: ActionTypes.RECEIVE_COMPANIES,
      //   normalizedData,
      // });
      return response;
    })
    .catch((err) => {
      dispatch(showErrorMessage(err));
      throw err;
    });
};

const handleDownload = (response, filename) => {
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

//getInternalReport

export const getInternalReport = (params) => (dispatch, getState) => {
  dispatch({
    type: ActionTypes.CLEAR_INTERNAL_REPORT_JOBDATA,
  });
  return apnSDK
    .getInternalReport(params)
    .then((res) => {
      if (res.response && res.response.jobData) {
        let list = res.response.jobData.map((item, index) => {
          return Immutable.Map(item);
        });
        dispatch({
          type: ActionTypes.SET_INTERNAL_REPORT_JOBDATA,
          jobData: list,
        });
      }
      return res;
    })
    .catch((err) => dispatch(showErrorMessage(err)));
};

export const InternalReportDown = (params) => (dispatch, getState) => {
  return apnSDK
    .internalDownLoad(params)
    .then(({ response }) => {
      let fileName = 'Internal Performance Report';
      handleDownload(response, fileName);
      return response;
    })
    .catch((err) => dispatch(showErrorMessage(err)));
};

export const getNoContracts = () => (dispatch, getState) => {
  return apnSDK
    .getNoContracts()
    .then(({ response }) => {
      dispatch({
        type: ActionTypes.NO_CONTRACT_CLIENT,
        normalizedNoContarctData: response,
      });
      return response;
    })
    .catch((err) => dispatch(showErrorMessage(err)));
};
