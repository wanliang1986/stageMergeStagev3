/**
 * Created by chenghui on 5/24/17.
 */
import * as apnSDK from './../../apn-sdk/';
import * as ActionTypes from '../constants/actionTypes';
import { replace } from 'connected-react-router';
import { normalize, schema } from 'normalizr';
import { getValidTalentFromParseResult } from '../../utils';
import { addHotListTalent } from './hotlistAction';
import {
  miniUser,
  talentBasic,
  talentResume,
  jobBasic,
  application,
  talentOwnership,
  newCandidateDetail,
  newStart,
} from './schemas';
import { showErrorMessage } from './index';
import { getJob } from './jobActions';
import { getFileUuid, getUploadFileType } from '../../apn-sdk/files';

import loadsh from 'lodash';
const parseRecord = new schema.Entity('parseRecords');

const submitToClientActivity = new schema.Entity('activities', {
  talent: talentBasic,
  job: jobBasic,
  user: miniUser,
  talentResume,
});

//talent detail
export const getTalent = (talentId) => (dispatch, getState) => {
  dispatch({
    type: ActionTypes.REQUEST_TALENT,
    talentId,
  });

  return apnSDK
    .getTalent(talentId)
    .then(({ response }) => {
      console.log('get talent : ', response);
      if (response.tenantLabels && response.tenantLabels.workAuthorization) {
        apnSDK
          .getCandidateWorkName(response.tenantLabels.workAuthorization[0])
          .then((res) => {
            response.label = res.response && res.response.data;
            const candidateDetail = loadsh.cloneDeep(response);
            dispatch({
              type: ActionTypes.NEW_CANDIDATE_DETAIL,
              candidateDetail: candidateDetail,
            });
            const normalizedData = normalize(response, newCandidateDetail);
            //normalize方法参数（第一个参数为需要转换的原数据，第二个参数为转换的schema,见./schema 122行)
            dispatch({
              type: ActionTypes.RECEIVE_TALENT,
              normalizedData,
            });
            if (response.ownerships) {
              dispatch({
                type: ActionTypes.RECEIVE_TALENT_OWNERSHIPS,
                normalizedData: normalize(response.ownerships, [
                  talentOwnership,
                ]),
                talentId: response.id,
              });
            }
          });
      } else {
        const candidateDetail = loadsh.cloneDeep(response);
        dispatch({
          type: ActionTypes.NEW_CANDIDATE_DETAIL,
          candidateDetail: candidateDetail,
        });
        const normalizedData = normalize(response, newCandidateDetail);
        dispatch({
          type: ActionTypes.RECEIVE_TALENT,
          normalizedData,
        });
        if (response.ownerships) {
          dispatch({
            type: ActionTypes.RECEIVE_TALENT_OWNERSHIPS,
            normalizedData: normalize(response.ownerships, [talentOwnership]),
            talentId: response.id,
          });
        }
      }
      return response;
    })
    .catch((err) => {
      if (err.status === 404) {
        dispatch(replace('/candidates/nomatch'));
      }
      dispatch(showErrorMessage(err));
    });
};

export const createCandidate = (talentData) => (dispatch, getState) => {
  console.log(talentData);

  return apnSDK.createCandidate(talentData).then(({ response }) => {
    console.log(response);
    const normalizedData = normalize(response, newCandidateDetail);
    console.log('create talent : ', normalizedData);
    // dispatch({
    //   type: ActionTypes.ADD_TALENT,
    //   normalizedData,
    // });
    return normalizedData.result;
  });
};

// 无法做到局部更新数据，这个api只能在候选人编辑页面调用，调用时必须传完整的数据，不然会丢失数据。
export const newUpdateCandidate =
  (talentData, talentId) => (dispatch, getState) => {
    return apnSDK
      .updateTalentBasic(talentData, talentId)
      .then(({ response }) => {
        const normalizedData = normalize(response, talentBasic);
        console.log('edit talent : ', normalizedData);
        dispatch({
          type: ActionTypes.EDIT_TALENT,
          normalizedData,
        });
        return normalizedData;
      });
  };

export const replaceTalentOwnerships = (userIds, talentId) => (dispatch) => {
  return apnSDK
    .replaceOwnershipsByTalentId(userIds, talentId)
    .then(({ response }) => {
      const normalizedData = normalize(response || [], [talentOwnership]);
      console.log('replace talent ownerships: ', normalizedData);
      dispatch({
        type: ActionTypes.RECEIVE_TALENT_OWNERSHIPS,
        normalizedData,
        talentId,
      });
      return normalizedData;
    })
    .catch((err) => dispatch(showErrorMessage(err)));
};

export const getTalentOwnerships = (talentId) => (dispatch) => {
  return apnSDK.getOwnershipsByTalentId(talentId).then(({ response }) => {
    const normalizedData = normalize(response, [talentOwnership]);
    console.log('get talent ownerships: ', normalizedData);
    dispatch({
      type: ActionTypes.RECEIVE_TALENT_OWNERSHIPS,
      normalizedData,
      talentId,
    });
    return response;
  });
};

//talent additional info
export const getResumesByTalentId = (talentId) => (dispatch) => {
  return apnSDK.getResumesByTalentId(talentId).then(({ response }) => {
    const normalizedData = normalize(response, [talentResume]);
    console.log('get talent resumes: ', normalizedData);
    dispatch({
      type: ActionTypes.RECEIVE_TALENT_RESUME,
      normalizedData,
    });
    return normalizedData;
  });
};

export const uploadResumeOnly = (resumeFile) => (dispatch, getState) => {
  let type = getUploadFileType(resumeFile);
  if (!type) {
    return Promise.reject('The file format is incorrect');
  }
  return getFileUuid(resumeFile).then(async (uuid) => {
    const resume = await apnSDK.getParseData(uuid).catch(console.log);
    if (resume) {
      return {
        name: resume.name,
        s3Link: resume.s3Link,
        text: resume.text,
        uuid: resume.uuid,
      };
    }
    return apnSDK.uploadResumeOnly(resumeFile, uuid);
  });
};

//获取简历解析状态部分
//通过uuid拿取解析结果
export const getParserOutputByUuid = (uuid) => (dispatch, getState) => {
  // console.log(uuid);
  return apnSDK.getParseData(uuid).then((response) => {
    console.log('get parse record by uuid : ', response);
    dispatch({
      type: ActionTypes.RECEIVE_PARSE_RECORD_BY_UUID,
      parseOutput: response,
    });
    return response;
  });
};

export const parseResume = (resumeFile) => (dispatch) => {
  let type = getUploadFileType(resumeFile);
  if (type) {
    return apnSDK
      .parseResume(resumeFile)
      .catch((err) => dispatch(showErrorMessage(err)));
  } else {
    return Promise.reject('The file format is incorrect');
  }
};

export const bulkParseResume = (resumeFile) => (dispatch, getState) => {
  return apnSDK.bulkParseResume(resumeFile);
};

// talent resume
export const addResume = (resume) => (dispatch, getState) => {
  console.log('adding resume', resume);
  return apnSDK
    .addResume(resume)
    .then(({ response }) => {
      console.log('add talent resume', response);
      const normalizedData = normalize(response, talentResume);
      dispatch({
        type: ActionTypes.ADD_TALENT_RESUME,
        normalizedData,
      });
      return response;
    })
    .catch((err) => {
      dispatch(showErrorMessage(err));
    });
};

export const removeResume = (talentResumeId) => (dispatch, getState) => {
  return apnSDK
    .removeResume(talentResumeId)
    .then((response) => {
      console.log('remove candidate resume', response);
      dispatch({
        type: ActionTypes.DELETE_TALENT_RESUME,
        talentResumeId,
      });
    })
    .catch((err) => {
      dispatch(showErrorMessage(err));
    });
};

export const getApplicationsByTalentId = (talentId) => (dispatch) => {
  return apnSDK.getAllApplicationsByTalentId(talentId).then(({ response }) => {
    const normalizedData = normalize(response, [application]);

    console.log('get talent applications: ', response);
    let arr = []; //写流程，不清楚他的作用，所以没删
    let StartArr = []; //走完流程的数据
    response &&
      response.map((item) => {
        dispatch(getJob(item.jobId));
        if (
          JSON.stringify(item.onboard) !== '{}' &&
          JSON.stringify(item.eliminate) === '{}'
        ) {
          StartArr.push(item);
          // 现在没有专门获取start数据的api,从所有流程的api里面过滤
          const normalizedStartData = normalize(StartArr, [newStart]);
          dispatch({
            type: ActionTypes.RECEIVE_START,
            normalizedData: normalizedStartData,
          });
        }
      });
    dispatch({
      type: ActionTypes.NEW_CANDIDATE_RELATIONS,
      payload: arr,
    });
    dispatch({
      type: ActionTypes.RECEIVE_APPLICATION_LIST,
      normalizedData,
    });
    return normalizedData;
  });
};
// commonPool左边详情数据
export const getCommonId = (commonPoolDetailId) => (dispatch) => {
  return apnSDK.getCommonDetail(commonPoolDetailId).then(({ response }) => {
    dispatch({
      type: ActionTypes.COMMON_POOL_DETAIL,
      payload: response,
    });
  });
};
// commonPool右边表格数据
export const getCommonTalentFrom = (commonPoolFromId) => (dispatch) => {
  return apnSDK.commonTalent(commonPoolFromId).then(({ response }) => {
    dispatch({
      type: ActionTypes.COMMON_POOL_RIGHT_FROM,
      payload: response,
    });
  });
};

//todo: fix
export const addTalentNote = (note) => (dispatch, getState) => {
  return apnSDK
    .addTalentNote(note)
    .then(({ response }) => {
      console.log('add candidate notes', response);
      dispatch({
        type: ActionTypes.ADD_TALENT_NOTE,
        talentNote: response,
      });
      return response;
    })
    .catch((err) => {
      dispatch(showErrorMessage(err));
      throw err;
    });
};

export const editTalentNote = (note, id) => (dispatch) => {
  return apnSDK
    .editTalentNote(note, id)
    .then(({ response }) => {
      console.log('add candidate notes', response);
      dispatch({
        type: ActionTypes.ADD_TALENT_NOTE,
        talentNote: response,
      });
      return response;
    })
    .catch((err) => {
      dispatch(showErrorMessage(err));
      throw err;
    });
};

// talent list sql
export const getTalentsSubmitToClient = (clientId) => (dispatch) => {
  dispatch({
    type: ActionTypes.TALENTS_SUBMIT_TO_CLIENT_REQUEST,
  });

  return apnSDK
    .getTalentsSubmitToClient(clientId)
    .then(({ response, headers }) => {
      if (response.status >= 400) {
        throw new Error(response.error.type);
      }

      const normalizedData = normalize(response, [submitToClientActivity]);
      dispatch({
        type: ActionTypes.TALENTS_SUBMIT_TO_CLIENT_SUCCESS,
        data: normalizedData,
      });
      return headers;
    })
    .catch((err) => {
      dispatch({
        type: ActionTypes.TALENTS_SUBMIT_TO_CLIENT_FAILURE,
      });
      throw err;
    });
};

//parse record
export const getMyParseRecords = () => (dispatch, getState) => {
  dispatch({
    type: ActionTypes.REQUEST_PARSE_RECORDS,
  });

  return apnSDK
    .getMyParseRecords()
    .then(({ response }) => {
      console.log('parse records list', response);
      const normalizedData = normalize(response, [parseRecord]);
      dispatch({
        type: ActionTypes.RECEIVE_PARSE_RECORDS,
        normalizedData,
      });
    })
    .catch((err) => {
      dispatch({
        type: ActionTypes.FAILURE_PARSE_RECORDS,
      });
      throw err;
    });
};

export const upsertParseRecord = (record, recordId) => (dispatch, getState) => {
  return apnSDK
    .sendParseFeedback(record, recordId) //发送分析反馈
    .then(({ response }) => {
      console.log('upsert parseRecord', response);
      if (response.reviewed) {
        dispatch({
          type: ActionTypes.DELETE_PARSE_RECORD,
          recordId,
        });
      } else {
        dispatch({
          type: ActionTypes.RECEIVE_PARSE_RECORD,
          parseRecord: response,
        });
      }
      return response;
    })
    .catch((err) => {
      dispatch(showErrorMessage(err));
    });
};

export const deleteParseRecord = (recordId) => (dispatch, getState) => {
  return apnSDK.deleteParseRecord(recordId).then(() => {
    dispatch({
      type: ActionTypes.DELETE_PARSE_RECORD,
      recordId,
    });
  });
};

// bulk upload resume
export const createTalentWithParseResult =
  (resume, parseRecordId, hotListId) => async (dispatch, getState) => {
    // console.log(
    //   'createTalentWithParseResult',
    //   resume,
    //   parseRecordId,
    //   hotListId
    // );
    const hotList =
      hotListId &&
      getState().relationModel.hotLists.get(hotListId).remove('talentIds');

    if (resume.talentId) {
      if (hotListId) {
        dispatch(upsertParseRecord({ reviewed: true }, parseRecordId));
        return dispatch(addHotListTalent(hotListId, resume.talentId));
      }

      const note = JSON.stringify({
        other: `Talent is already exists. TalentId: ${resume.talentId}`,
        hotList,
      });
      dispatch(upsertParseRecord({ note }, parseRecordId));
      return Promise.reject({
        message: `Talent is already exists. TalentId: ${resume.talentId}`,
      });
    }
    const talent = getValidTalentFromParseResult(resume);

    if (!talent.fullName) {
      const note = JSON.stringify({
        other: 'Talent name is required.',
        hotList,
      });
      dispatch(upsertParseRecord({ note }, parseRecordId));
      return Promise.reject({ message: 'Talent name is required.' });
    }
    if (!talent.contacts || talent.contacts.length === 0) {
      const note = JSON.stringify({
        other: 'Talent contact is required.',
        hotList,
      });
      dispatch(upsertParseRecord({ note }, parseRecordId));
      return Promise.reject({ message: 'Talent contact is required.' });
    }
    let newContactObj = { contacts: talent.contacts };
    const { response: duplications } = await apnSDK
      .searchTalentByContacts(newContactObj)
      .catch((err) => {
        const note = JSON.stringify({
          other:
            `Failed to check talent's existence` +
            (err.fieldErrors
              ? err.fieldErrors[err.fieldErrors.length - 1].message
              : err.message || err),
          hotList,
        });
        dispatch(upsertParseRecord({ note }, parseRecordId));
        return Promise.reject(`Failed to check talent's existence`);
      });

    if (duplications.length > 0) {
      const talentId = duplications[0].id;
      if (hotListId) {
        dispatch(upsertParseRecord({ reviewed: true }, parseRecordId));
        talent.resumes[0].talentId = talentId;
        dispatch(addResume(talent.resumes[0]));
        return dispatch(addHotListTalent(hotListId, talentId));
      } else {
        const note = JSON.stringify({
          other: `Talent is already exists. TalentId: ${talentId}`,
          hotList,
        });
        dispatch(upsertParseRecord({ note }, parseRecordId));
        return Promise.reject(
          `Talent is already exists. TalentId: ${talentId}.`
        );
      }
    } else {
      talent.creationTalentType = 'BULK_UPLOAD_RESUMES';

      return dispatch(createCandidate(talent))
        .then((talentId) => {
          dispatch(upsertParseRecord({ reviewed: true }, parseRecordId));
          if (hotListId) {
            return dispatch(addHotListTalent(hotListId, talentId));
          }
          return talentId;
        })
        .catch((err) => {
          const note = JSON.stringify({
            other:
              `Failed to create talent` +
              (err.fieldErrors
                ? err.fieldErrors[err.fieldErrors.length - 1].message
                : err.message || err),
            hotList,
          });
          dispatch(upsertParseRecord({ note }, parseRecordId));
          return Promise.reject(`Failed to create talent`);
        });
    }
  };
