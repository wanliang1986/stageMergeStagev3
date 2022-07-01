import * as apnSDK from './../../apn-sdk/';
import * as ActionTypes from '../constants/actionTypes';
import Immutable from 'immutable';
import { normalize, schema } from 'normalizr';
import { start, esStart, miniUser, newStart } from './schemas';
import { showErrorMessage } from './index';
import { JOB_TYPES } from '../constants/formOptions';
import { getJob } from './jobActions';

const talent = new schema.Entity('talents');
const job = new schema.Entity('jobs');
const resume = new schema.Entity('resumes');
const activity = new schema.Entity('activities', {
  user: miniUser,
});
const application = new schema.Entity('applications', {
  talent,
  job,
  user: miniUser,
  resume,
  currentActivity: activity,
  lastModifiedUser: miniUser,
});

export const createStart = (data) => (dispatch) => {
  return apnSDK.createStart(data).then(({ response }) => {
    const normalizedData = normalize(response, start);
    console.log('add start ', normalizedData);

    dispatch({
      type: ActionTypes.ADD_START,
      normalizedData,
    });

    return normalizedData;
  });
};

// 新流程onboard
export const newCreateStart = (data) => (dispatch, getState) => {
  return apnSDK.ApplicationsSubmitToOnboard(data).then(({ response }) => {
    const normalizedData2 = normalize(response, application);
    const currentUser = getState().controller.currentUser;
    const currentActivity = Object.assign({}, response, {
      // id: response.currentActivityId,对应字段的发生变化
      id: response.recruitmentProcessId,
      applicationId: response.id,
      createdDate: new Date().toISOString(),
      job: undefined,
      applyToUser: undefined,
      lastModifiedUser: undefined,
      talent: undefined,
      user: undefined,
      createdBy: `${currentUser.get('id')},${currentUser.get('tenantId')}`,
    });
    dispatch({
      type: ActionTypes.EDIT_APPLICATION,
      normalizedData: normalizedData2,
      currentActivity,
    });
    const normalizedData = normalize(response, start);
    console.log('add start ', normalizedData);

    dispatch({
      type: ActionTypes.ADD_START,
      normalizedData,
    });

    return response;
  });
};

export const createExtension = (data, startId) => (dispatch) => {
  return apnSDK.createExtension(data, startId).then(({ response }) => {
    const normalizedData = normalize(response, start);
    console.log('add extension ', normalizedData);

    dispatch({
      type: ActionTypes.ADD_START,
      normalizedData,
    });

    return normalizedData;
  });
};

export const updateStartBasicInfo = (data, id) => (dispatch) => {
  return apnSDK.updateStart(data, id).then(({ response }) => {
    const normalizedData = normalize(response, start);
    console.log('update start ', normalizedData);

    dispatch({
      type: ActionTypes.EDIT_START,
      normalizedData,
    });
    return normalizedData;
  });
};

export const updateStart = (data, id) => (dispatch, getState) => {
  const starts = getState().relationModel.starts;
  const oldStart = starts.get(String(id)) && starts.get(String(id)).toJS();
  return apnSDK.updateStart(data, id).then(async ({ response: newStart }) => {
    //todo: refine handle failed
    if (data.startAddress) {
      await apnSDK
        .updateStartAddress(data.startAddress, id)
        .then(({ response: startAddress }) => {
          newStart.startAddress = startAddress;
        })
        .catch((err) => {
          dispatch(showErrorMessage(err));
          newStart.startAddress = oldStart.startAddress;
        });
    }
    if (data.startFteRate) {
      await apnSDK
        .updateStartFteRate(data.startFteRate, id)
        .then(({ response: startFteRate }) => {
          newStart.startFteRate = startFteRate;
        })
        .catch((err) => {
          dispatch(showErrorMessage(err));
          newStart.startFteRate = oldStart.startFteRate;
        });
    }

    if (data.startClientInfo) {
      await apnSDK
        .updateStartClientInfo(data.startClientInfo, id)
        .then(({ response: startClientInfo }) => {
          newStart.startClientInfo = startClientInfo;
        })
        .catch((err) => {
          dispatch(showErrorMessage(err));
          newStart.startClientInfo = oldStart.startClientInfo;
        });
    }

    if (data.startCommissions && data.positionType !== JOB_TYPES.Payrolling) {
      await apnSDK
        .updateStartCommissions(data.startCommissions, id)
        .catch(console.error);
    }

    const normalizedData = normalize({ ...data, ...newStart }, start);
    console.log('update start commissions ', normalizedData);
    dispatch({
      type: ActionTypes.RECEIVE_START,
      normalizedData,
    });

    return normalizedData;
  });
};

export const updateStartContractRate = (data, id, startId) => (dispatch) => {
  return apnSDK.updateStartContractRate(data, id).then(({ response }) => {
    dispatch({
      type: ActionTypes.EDIT_START_CONTRACT_RATE,
      startId,
      response,
    });

    return response;
  });
};

export const addStartContractRate = (data, startId) => (dispatch) => {
  return apnSDK.addStartContractRate(data, startId).then(({ response }) => {
    dispatch({
      type: ActionTypes.EDIT_START_CONTRACT_RATE,
      startId,
      response,
    });

    return response;
  });
};

export const deleteStartContractRate =
  (startContractRateId, startId) => (dispatch) => {
    return apnSDK.deleteStartContractRate(startContractRateId).then(() => {
      return apnSDK
        .getStartContractRatesByStartId(startId)
        .then(({ response }) => {
          dispatch({
            type: ActionTypes.EDIT_START_CONTRACT_RATE,
            startId,
            response,
          });

          return response;
        });
    });
  };

export const updateStartAddress = (newAddress, startId) => (dispatch) => {
  return apnSDK.updateStartAddress(newAddress, startId).then(({ response }) => {
    console.log('update start address ', response);

    dispatch({
      type: ActionTypes.EDIT_START_ADDRESS,
      startId,
      response,
    });

    return response;
  });
};

export const getStart = (startId) => (dispatch) => {
  return apnSDK.getStart(startId).then(({ response }) => {
    const normalizedData = normalize(response, start);
    console.log('get start ', normalizedData);

    dispatch({
      type: ActionTypes.RECEIVE_START,
      normalizedData,
    });

    return normalizedData;
  });
};

export const getStartByTalentId = (talentId) => (dispatch) => {
  return apnSDK
    .getStartByTalentId(talentId)
    .then(({ response }) => {
      const normalizedData = normalize(response, [start]);
      console.log('get talent start ', normalizedData);

      dispatch({
        type: ActionTypes.RECEIVE_START,
        normalizedData,
      });

      return normalizedData;
    })
    .catch((e) => e);
};

// talent list es
export const searchAllStart =
  (from = 0, size = 1000, sort = {}, query = {}) =>
  (dispatch, getState) => {
    const state = getState();
    if (state.controller.searchStarts.all.isFetching) {
      return Promise.resolve('loading...');
    }
    dispatch({
      type: ActionTypes.REQUEST_START_LIST,
      tab: 'all',
    });

    return apnSDK
      .searchStart(from, size, sort, query)
      .then(({ response, headers }) => {
        if (response.status >= 400) throw new Error(response.error.type);

        console.log('search starts', response);
        const normalizedData = normalize(response.hits.hits, [esStart]);
        dispatch({
          type: ActionTypes.RECEIVE_START_LIST,
          tab: 'all',
          normalizedData,
          total: response.hits.total,
        });
        return headers;
      })
      .catch((err) => {
        dispatch({
          type: ActionTypes.FAILURE_START_LIST,
          tab: 'all',
        });
        dispatch(showErrorMessage(err));
      });
  };

export const loadMoreAllStart =
  (from, size, sort, query) => (dispatch, getState) => {
    const state = getState();
    if (state.controller.searchStarts.all.isFetching) {
      return Promise.resolve('loading...');
    }
    dispatch({
      type: ActionTypes.REQUEST_START_LIST,
      tab: 'all',
    });

    return apnSDK
      .searchStart(from, size, sort, query)
      .then(({ response, headers }) => {
        if (response.status >= 400) throw new Error(response.error.type);

        console.log('es candidates', response);
        const normalizedData = normalize(response.hits.hits, [esStart]);
        dispatch({
          type: ActionTypes.ADD_START_TO_LIST,
          tab: 'all',
          normalizedData,
        });
      })
      .catch((err) => {
        dispatch({
          type: ActionTypes.FAILURE_START_LIST,
          tab: 'all',
        });
        dispatch(showErrorMessage(err));
      });
  };

export const selectStartToOpen = (start) => (dispatch, getState) => {
  try {
    window.dispatchEvent(new CustomEvent('resize'));
    // issue: https://github.com/mui-org/material-ui/issues/9337
  } catch (e) {
    console.log(e);
  }
  if (!start || !start.get('id')) {
    dispatch({
      type: ActionTypes.SELECT_START,
      start,
    });
    dispatch(selectExtensionToOpen());
    dispatch(selectConversionFTEToOpen());
  } else {
    const state = getState();
    // const startType = start.get('startType');
    const applicationId = start.get('applicationId');
    const starts = state.relationModel.starts;
    const startList = starts
      .filter((s) => s.get('applicationId') === Number(applicationId))
      .sortBy((el) => el.get('id'));
    const extension = startList
      .filter((s) => s.get('startType') === 'CONTRACT_EXTENSION')
      .last();
    const conversionStart = startList
      .filter((s) => s.get('startType') === 'CONVERT_TO_FTE')
      .last();
    console.log(
      'selectStartToOpen',
      start.get('id'),
      applicationId,
      startList.toJS(),
      extension && extension.toJS()
    );
    dispatch({
      type: ActionTypes.SELECT_START,
      start: startList.first(),
    });
    dispatch(selectExtensionToOpen(extension));
    dispatch(selectConversionFTEToOpen(conversionStart));
  }
};

export const selectExtensionToOpen = (extension) => (dispatch) => {
  dispatch({
    type: ActionTypes.SELECT_EXTENSION,
    extension,
  });
};

export const selectConversionFTEToOpen = (conversionStart) => (dispatch) => {
  dispatch({
    type: ActionTypes.SELECT_CONVERSION_START,
    conversionStart,
  });
};

export const selectExtensionIdToOpen =
  (extensionId) => (dispatch, getState) => {
    dispatch({
      type: ActionTypes.SELECT_EXTENSION,
      extension: getState().relationModel.starts.get(String(extensionId)),
    });
  };

export const startFailedWarranty = (data, startId, update) => (dispatch) => {
  return apnSDK
    .startFailedWarranty(data, startId, update)
    .then(({ response }) => {
      const normalizedData = normalize(response, start);
      console.log('startFailedWarranty', normalizedData);

      dispatch({
        type: ActionTypes.RECEIVE_START,
        normalizedData,
      });
      return response;
    });
};

export const startTermination = (data, startId) => (dispatch) => {
  return apnSDK.startTermination(data, startId).then(({ response }) => {
    const normalizedData = normalize(response, start);
    console.log('startTermination', normalizedData);

    dispatch({
      type: ActionTypes.TERMINATE_START,
      normalizedData,
      startId,
    });
    return response;
  });
};

export const startCancelTermination = (startId) => (dispatch) => {
  return apnSDK.startCancelTermination(startId).then(({ response }) => {
    const normalizedData = normalize(response, start);
    console.log('startCancelTermination', normalizedData);

    dispatch({
      type: ActionTypes.RECEIVE_START,
      normalizedData,
    });
    return response;
  });
};
