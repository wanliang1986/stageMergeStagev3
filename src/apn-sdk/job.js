/**
 * Created by chenghui on 5/31/17.
 */
import authRequest from './request';
import { sleep } from '../utils';
import { getUuid, getTextUuid } from './files';
// job list
export const searchMyJobList = (
  page = '',
  size = '',
  search = '',
  sort = 'postingTime,desc',
  advancedSearch = '',
  from_date = '',
  to_date = ''
) => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest.sendV2(
    `/my-jobs/?search=${search}&fromDate=${from_date}&toDate=${to_date}&page=${page}&size=${size}&sort=${sort}${advancedSearch}`,
    config
  );
};

export const getFavoriteJobList = () => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest.send(`/favorite/jobs`, config);
};

export const addFavoriteJobs = (jobIds) => {
  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(jobIds),
  };
  return authRequest.send(`/favorite/jobs`, config);
};

export const deleteFavoriteJobs = (jobIds) => {
  const config = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(jobIds),
  };
  return authRequest.send(`/favorite/jobs`, config);
};

export const getRecommendedJobList = (talentId, page) => {
  const config = {
    method: 'GET',
    headers: {},
  };
  return authRequest.sendV2(
    `/recommend-jobs-for-tenant-talent/talentId/${talentId}?page=${page}&size=1000`,
    config
  );
};

// commonPool推荐jobs(右边表格数据)
export const commonTalent = (esId) => {
  let query = {
    esId: esId,
  };
  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(query),
  };
  return authRequest.jobSend(`/recommend-jobs-for-common-talent/esId`, config);
};

// job detail
export const getJob = (jobId) => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest.jobSend(`/jobs/${jobId}`, config);
};

export const getJobApplications = (jobId) => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest.applicationSendV1(
    `/talent-recruitment-processes/jobId/${jobId}`,
    config
  );
};

export const upsertJob = (job, jobId = '') => {
  const config = {
    method: jobId ? 'PUT' : 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(job),
  };

  return authRequest.sendV2(`/jobs/${jobId}`, config);
};

//parser v2
export const getJobParserOutput = (uuid, type) => {
  const config = {
    method: 'GET',
    headers: {},
  };
  return authRequest.parserSendV2(`/parse/jd/uuid/${uuid}/${type}`, config);
};

export const parseJDAsync = (jdFile, uuid) => {
  const requestBody = new FormData();
  requestBody.append('file', jdFile);
  requestBody.append('uuid', uuid);
  const config = {
    method: 'POST',
    headers: {},
    body: requestBody,
  };
  return authRequest.parserSendV2(`/parse/jd`, config);
};

export const parseJD = async (jdFile, cb) => {
  const uuid = await getUuid(jdFile);
  const type = 1;
  const { response: parseOutputCache } = await getJobParserOutput(uuid, type);
  if (parseOutputCache.status === 'FINISHED') {
    return {
      uuid: parseOutputCache.uuid,
      name: parseOutputCache.name,
      s3Link: parseOutputCache.s3Link,
      // text: parseOutputCache.text,
      // parserOutput: parseOutputCache.parserOutput,
      parserOutput: parseOutputCache.data,
    };
  } else if (
    parseOutputCache.status === 'PARSING' ||
    parseOutputCache.status === 'QUEUED'
  ) {
    let count = 0;
    while (count < 14) {
      const { response: parseOutputCache } = await getJobParserOutput(
        uuid,
        type
      );
      parseOutputCache.parserOutput = parseOutputCache.data;
      if (parseOutputCache.status === 'FINISHED') {
        return {
          uuid: parseOutputCache.uuid,
          name: parseOutputCache.name,
          s3Link: parseOutputCache.s3Link,
          // text: parseOutputCache.text,
          parserOutput: parseOutputCache.parserOutput,
          // parserOutput: parseOutputCache.data,
        };
      } else if (parseOutputCache.status === 'ERROR') {
        throw new Error('Fail to parse job description!');
      }
      if (cb) {
        cb(parseOutputCache);
      }
      count++;
      await sleep(5000);
    }
    throw new Error('Fail to parse job description!');
  } else if (parseOutputCache.status === 'ERROR') {
    throw new Error('Fail to parse job description!');
  } else {
    const { response: jd } = await parseJDAsync(jdFile, uuid);
    // if (jd.parserOutput) {
    //   return {
    //     type: jd.type,
    //     name: jd.name,
    //     s3Link: jd.s3Link,
    //     // text: jd.text,
    //     // parserOutput: jd.parserOutput,
    //     // parserOutput: jd.data,
    //   };
    // }

    let count = 0;
    while (count < 14) {
      const { response: parseOutputCache } = await getJobParserOutput(
        uuid,
        type
      );
      jd.parserOutput = parseOutputCache.data;
      if (parseOutputCache.status === 'FINISHED') {
        return {
          uuid: uuid,
          name: jd.name,
          s3Link: jd.s3Link,
          // text: JSON.parse(jd.data).text,
          parserOutput: jd.parserOutput,
          // parserOutput:jd.data
        };
      } else if (parseOutputCache.status === 'ERROR') {
        throw new Error('Fail to parse job description!');
      }
      if (cb) {
        cb(parseOutputCache);
      }
      count++;
      await sleep(5000);
    }
    if (jd.parserOutput) {
      return {
        // type: jd.type,
        name: jd.name,
        s3Link: jd.s3Link,
        // text: JSON.parse(jd.data).text,
        parserOutput: jd.parserOutput,
        // parserOutput:jd.data
      };
    }
    throw new Error('Fail to parse job description!');
  }
};

export const parseJDTextAsync = (jdText, uuid) => {
  const requestBody = new FormData();
  requestBody.append('jdText', jdText);
  requestBody.append('uuid', uuid);
  const config = {
    method: 'POST',
    headers: {},
    body: requestBody,
  };
  return authRequest.parserSendV2(`/parse/jd-text`, config);
};

export const parseJDText = async (jdText, cb) => {
  let uuid = getTextUuid(jdText);
  const type = 2;
  const { response: parseOutputCache } = await getJobParserOutput(uuid, type);
  if (parseOutputCache.status === 'FINISHED') {
    return {
      uuid: uuid,
      name: parseOutputCache.name,
      s3Link: parseOutputCache.s3Link,
      // text: parseOutputCache.text,
      // parserOutput: parseOutputCache.parserOutput,
      parserOutput: parseOutputCache.data,
    };
  } else if (parseOutputCache.status === 'ERROR') {
    return new Error('Fail to parse job description!');
  } else if (parseOutputCache.status === 'PARSING') {
    let count = 0;
    while (count < 14) {
      const { response: parseOutputCache } = await getJobParserOutput(
        uuid,
        type
      );
      parseOutputCache.parserOutput = parseOutputCache.data;
      if (parseOutputCache.status === 'FINISHED') {
        return {
          uuid: uuid,
          name: parseOutputCache.name,
          s3Link: parseOutputCache.s3Link,
          // text: parseOutputCache.text,
          parserOutput: parseOutputCache.parserOutput,
          // parserOutput: parseOutputCache.data,
        };
      } else if (parseOutputCache.status === 'ERROR') {
        return new Error('Fail to parse job description!');
      }
      if (cb) {
        cb(parseOutputCache);
      }
      count++;
      await sleep(5000);
    }
    return new Error('Fail to parse job description!');
  } else {
    const { response: jd } = await parseJDTextAsync(jdText, uuid);
    // if (jd.parserOutput) {
    //   return {
    //     type: jd.type,
    //     name: jd.name,
    //     s3Link: jd.s3Link,
    //     text: jd.text,
    //     parserOutput: jd.parserOutput,
    //   };
    // }

    let count = 0;
    while (count < 14) {
      const { response: parseOutputCache } = await getJobParserOutput(
        uuid,
        type
      );
      jd.parserOutput = parseOutputCache.data;
      if (parseOutputCache.status === 'FINISHED') {
        return {
          uuid: uuid,
          name: jd.name,
          s3Link: jd.s3Link,
          // text: jd.text,
          parserOutput: jd.parserOutput,
          // parserOutput: jd.data,
        };
      } else if (parseOutputCache.status === 'ERROR') {
        return new Error('Fail to parse job description!');
      }
      if (cb) {
        cb(parseOutputCache);
      }
      count++;
      await sleep(5000);
    }
    if (jd.parserOutput) {
      return {
        // type: jd.type,
        name: jd.name,
        s3Link: jd.s3Link,
        // text: jd.text,
        parserOutput: jd.parserOutput,
        // parserOutput: jd.data,
      };
    }
    throw new Error('Fail to parse job description!');
  }
};

//parser v1
export const getJobParserOutputV1 = (uuid) => {
  const config = {
    method: 'GET',
    headers: {},
  };
  return authRequest.send(`/parsers/jd/uuid/${uuid}`, config);
};

export const parseJDAsyncV1 = (jdFile) => {
  const requestBody = new FormData();
  requestBody.append('file', jdFile);

  const config = {
    method: 'POST',
    headers: {},
    body: requestBody,
  };
  return authRequest.send(`/parsers/jd`, config);
};

export const parseJDV1 = async (jdFile, cb) => {
  const { response: jd } = await parseJDAsyncV1(jdFile);
  if (jd.parserOutput) {
    return {
      type: jd.type,
      name: jd.name,
      s3Link: jd.s3Link,
      text: jd.text,
      parserOutput: jd.parserOutput,
    };
  }

  let count = 0;
  while (count < 14) {
    const { response: parseOutputCache } = await getJobParserOutputV1(jd.uuid);
    jd.parserOutput = parseOutputCache.data;
    if (parseOutputCache.status === 'FINISHED') {
      return {
        type: jd.type,
        name: jd.name,
        s3Link: jd.s3Link,
        text: jd.text,
        parserOutput: jd.parserOutput,
      };
    }
    if (cb) {
      cb(parseOutputCache);
    }
    count++;
    await sleep(5000);
  }
  if (jd.parserOutput) {
    return {
      type: jd.type,
      name: jd.name,
      s3Link: jd.s3Link,
      text: jd.text,
      parserOutput: jd.parserOutput,
    };
  }
  throw new Error('Fail to parse job description!');
};

export const parseJDTextAsyncV1 = (jdText) => {
  const config = {
    method: 'POST',
    headers: {},
    body: jdText,
  };
  return authRequest.send(`/parsers/jd-text`, config);
};

export const parseJDTextV1 = async (jdText, cb) => {
  const { response: jd } = await parseJDTextAsyncV1(jdText);
  if (jd.parserOutput) {
    return {
      type: jd.type,
      name: jd.name,
      s3Link: jd.s3Link,
      text: jd.text,
      parserOutput: jd.parserOutput,
    };
  }

  let count = 0;
  while (count < 14) {
    const { response: parseOutputCache } = await getJobParserOutputV1(jd.uuid);
    jd.parserOutput = parseOutputCache.data;
    if (parseOutputCache.status === 'FINISHED') {
      return {
        type: jd.type,
        name: jd.name,
        s3Link: jd.s3Link,
        text: jd.text,
        parserOutput: jd.parserOutput,
      };
    }
    if (cb) {
      cb(parseOutputCache);
    }
    count++;
    await sleep(5000);
  }
  if (jd.parserOutput) {
    return {
      type: jd.type,
      name: jd.name,
      s3Link: jd.s3Link,
      text: jd.text,
      parserOutput: jd.parserOutput,
    };
  }
  throw new Error('Fail to parse job description!');
};

// job relations
export const updateJobUserRelations = (userRelations) => {
  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userRelations),
  };

  return authRequest.send(`/user-job-relations/multi-upsert`, config);
};

export const assignUsersToJobsMulti = (userRelations) => {
  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userRelations),
  };

  return authRequest.jobSendV1(`/user-job-relations/multi-requests`, config);
};

export const deleteJobUserRelation = (userRelationId) => {
  const config = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  return authRequest.send(`/user-job-relations/${userRelationId}`, config);
};

export const addJobNote = (note) => {
  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(note),
  };
  return authRequest.jobSendV1(`/job-notes`, config);
};

export const editJobNote = (note, id) => {
  const config = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(note),
  };
  return authRequest.jobSendV1(`/job-notes/${id}`, config);
};

export const upsertJobInterviewQuestion = (jobQuestion, jobQuestionId = '') => {
  const config = {
    method: jobQuestionId ? 'PUT' : 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(jobQuestion),
  };
  return authRequest.send(`/job-questions/${jobQuestionId}`, config);
};

export const getJobCountries = () => {
  const config = {
    method: 'GET',
    headers: {},
  };
  return authRequest.sendV2(`/job-countries`, config);
};

export const getUserCountries = () => {
  const config = {
    method: 'GET',
    headers: {},
  };
  return authRequest.sendV2(`/user-countries`, config);
};

// job V2 下拉加载
export const getJobFunction = () => {
  const config = {
    method: 'GET',
    headers: {},
  };
  return authRequest.jobSend(`/dict/1`, config);
};

export const getAllProjectTeam = () => {
  const config = {
    method: 'GET',
    headers: {},
  };
  return authRequest.companySend(`/company/project-teams`, config);
};
export const getAllProjectTeamUserByID = (id) => {
  const config = {
    method: 'GET',
    headers: {},
  };
  return authRequest.companySend(`/company/project-teams/users/${id}`, config);
};
export const getAllDegree = () => {
  const config = {
    method: 'GET',
    headers: {},
  };
  return authRequest.jobSend(`/dict/65`, config);
};
export const getAllLanguages = () => {
  const config = {
    method: 'GET',
    headers: {},
  };
  return authRequest.jobSend(`/dict/38`, config);
};

export const upsertJob_LOCAL = (job, jobId = '') => {
  const config = {
    method: jobId ? 'PUT' : 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(job),
  };
  if (jobId) {
    return authRequest.jobSend(`/jobs/${jobId}`, config);
  } else {
    return authRequest.jobSend(`/jobs`, config);
  }
};
