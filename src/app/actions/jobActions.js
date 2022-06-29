/**
 * Created by chenghui on 5/31/17.
 */
import * as apnSDK from './../../apn-sdk/';
import * as ActionTypes from '../constants/actionTypes';
import Immutable from 'immutable';
import { normalize } from 'normalizr';
import {
  recommendation,
  jobBasic,
  jobDetail,
  jobNote,
  application,
  usersToJobsRelation,
} from './schemas';
import { showErrorMessage } from './index';
import { replace } from 'connected-react-router';
import { countryList } from '../constants/formOptions';
import { getUploadFileType } from '../../apn-sdk/files';

// job detail
export const upsertJob = (job, jobId) => (dispatch, getState) => {
  return apnSDK
    .upsertJob_LOCAL(job, jobId)
    .then(({ response }) => {
      console.log('upsert job: ', response);
      const normalizedData = normalize(response, jobDetail);
      dispatch({
        type: jobId ? ActionTypes.EDIT_JOB : ActionTypes.ADD_JOB,
        normalizedData,
      });
      return response.id;
    })
    .catch((err) => {
      dispatch(showErrorMessage(err));
      throw err;
    });
};

// job detail
export const updateJobStatus = (jobId, status) => (dispatch, getState) => {
  // const job = getState().model.jobs.get(String(jobId)).set('status',status)
  const job = { id: jobId, status };
  return apnSDK
    .changeStatus(jobId, status)
    .then(({ response }) => {
      console.log('update Job Status: ', response);
      const normalizedData = normalize(response, jobDetail);
      dispatch({
        type: jobId ? ActionTypes.EDIT_JOB : ActionTypes.ADD_JOB,
        normalizedData,
      });
      return response.id;
    })
    .catch((err) => {
      dispatch(showErrorMessage(err));
      throw err;
    });
};

export const getJob = (jobId) => (dispatch, getState) => {
  dispatch({
    type: ActionTypes.REQUEST_JOB,
    jobId,
  });

  return apnSDK
    .getJob(jobId)
    .then(({ response }) => {
      console.log('get Job: ', response);
      const normalizedData = normalize(response, jobDetail);
      dispatch({
        type: ActionTypes.RECEIVE_JOB,
        normalizedData,
      });
      return response;
    })
    .catch((err) => {
      if (err.status === 404) {
        dispatch(replace('/jobs/nomatch'));
      }
      dispatch(showErrorMessage(err));
    });
};

export const newGetJobApplications = (jobId) => (dispatch, getState) => {
  dispatch({
    type: ActionTypes.REQUEST_JOB_APPLICATIONS,
    jobId,
  });

  return apnSDK.getJobApplications(jobId).then(({ response }) => {
    const normalizedData = normalize(response, [application]);
    dispatch({
      type: ActionTypes.RECEIVE_JOB_APPLICATIONS,
      normalizedData,
    });
    return response;
  });
};

export const uploadJobDescription = (jobFile) => (dispatch, getState) => {
  let type = getUploadFileType(jobFile);
  if (type) {
    return apnSDK
      .parseJD(jobFile)
      .then(({ parserOutput, text, uuid }) => {
        const parseResult = JSON.parse(parserOutput);
        parseResult.uuid = uuid;
        return _getJobFromParseResult(parseResult);
      })
      .catch((error) => {
        dispatch(showErrorMessage(error));
      });
  } else {
    dispatch(showErrorMessage('The file format is incorrect'));
    return Promise.resolve(null);
  }
};

export const getJobKeywordsByJD = (jd_text) => (dispatch, getState) => {
  return apnSDK.parseJDText(jd_text).then(({ parserOutput, text }) => {
    const parseResult = JSON.parse(parserOutput);
    parseResult.text = parseResult.text || text;
    return _getJobFromParseResult(parseResult);
  });
};

//todo:check parse result
const _getJobFromParseResult = (parseResult) => {
  console.log('parseResult', parseResult);
  const job = {
    locations: parseResult.locations,
    minimumDegreeLevel: parseResult.minimumDegreeLevel,
    requiredLanguages: parseResult.requiredLanguages,
    experienceYearRange: parseResult.experienceYearRange,
    jobFunctions: parseResult.jobFunctions,
    companyName: parseResult.companyName,
    preferredSkills: parseResult.preferredSkills,

    lastModifiedDate: new Date().toISOString(),
    company: parseResult.company,
    title: parseResult.title,
    code: parseResult.code,
    startDate: parseResult.startDate,
    endDate: parseResult.endDate,
    //
    minimumDegree: parseResult.minimumDegree,
    preferredDegrees: parseResult.preferredDegrees,
    leastExperienceYear: parseResult.leastExperienceYear,
    mostExperienceYear: parseResult.mostExperienceYear,
    openings: parseResult.openings,
    salaryRange: parseResult.salaryRange,

    uuid: parseResult.uuid,
    //
    skills: parseResult.requiredSkills,
    requiredSkills: parseResult.requiredSkills,
    jdUrl: parseResult.jdUrl,

    jdText: parseResult.text,
    publicDesc: `<p>${(parseResult.text || '')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .split('\n')
      .join('</p><p>')}</p>`,
  };
  console.log('_getJobFromParseResult', job);

  return job;
};

export const updateJobUserRelations = (userRelations, jobId) => (dispatch) => {
  return apnSDK
    .updateJobUserRelations(userRelations)
    .then(({ response }) => {
      const normalizedData = normalize(response, [usersToJobsRelation]);
      console.log('updateJobUserRelations', normalizedData, jobId);
      dispatch({
        type: ActionTypes.UPDATE_JOB_ASSOCIATED_USERS,
        normalizedData,
        jobId,
      });
    })
    .catch((err) => {
      dispatch(showErrorMessage(err));
    });
};

export const deleteJobUserRelation =
  (userRelationId, jobId) => (dispatch, getState) => {
    return apnSDK
      .deleteJobUserRelation(userRelationId)
      .then(() => {
        console.log('remove associated users: ');
        dispatch({
          type: ActionTypes.DELETE_JOB_ASSOCIATED_USERS,
          userRelationId,
          jobId,
        });
      })
      .catch((err) => {
        dispatch(showErrorMessage(err));
        throw err;
      });
  };

export const addJobNote = (note) => (dispatch, getState) => {
  return apnSDK
    .addJobNote(note)
    .then(({ response }) => {
      console.log('add job notes', response);
      // let resText = { ...response };
      // resText.createdDate = resText.createdDate;
      const normalizedData = normalize(response, jobNote);
      dispatch({
        type: ActionTypes.ADD_JOB_NOTE,
        normalizedData,
      });
    })
    .catch((err) => {
      dispatch(showErrorMessage(err));
      throw err;
    });
};

export const editJobNote = (note, id) => (dispatch) => {
  return apnSDK
    .editJobNote(note, id)
    .then(({ response }) => {
      console.log('add job notes', response);
      // let resText = { ...response };
      // resText.createdDate = resText.createdDate;
      const normalizedData = normalize(response, jobNote);
      dispatch({
        type: ActionTypes.ADD_JOB_NOTE,
        normalizedData,
      });
    })
    .catch((err) => {
      dispatch(showErrorMessage(err));
      throw err;
    });
};

export const getAIRecommendedJobList =
  (talentId, page, pageStatus) => (dispatch, getState) => {
    return apnSDK.getRecommendedJobList(talentId, page).then(({ response }) => {
      console.log('response', response);
      let jobs = response.jobs;
      let status = response.status;
      let normalizedData = normalize(jobs || [], [recommendation]);
      console.log('get Recommended Job List', normalizedData);
      dispatch({
        type: ActionTypes.RECEIVE_RECOMMENDATION_JOB_LIST,
        normalizedData,
        talentId,
      });
      return response;
    });
    // .catch((err) => {
    //   dispatch(showErrorMessage(err));
    //   throw err;
    // });
  };
export const commonAIRecommendedJobList =
  (talentId, page, pageStatus) => (dispatch, getState) => {
    return apnSDK.commonTalent(talentId, page).then(({ response }) => {
      console.log('response', response);
      let jobs = response.jobs;
      let status = response.status;
      let normalizedData = normalize(jobs || [], [recommendation]);
      console.log('get Recommended Job List', normalizedData);
      dispatch({
        type: ActionTypes.RECEIVE_RECOMMENDATION_JOB_LIST,
        normalizedData,
        talentId,
      });
      return response;
    });
    // .catch((err) => {
    //   dispatch(showErrorMessage(err));
    //   throw err;
    // });
  };
