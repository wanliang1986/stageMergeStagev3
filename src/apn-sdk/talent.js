/**
 * Created by chenghui on 5/24/17.
 */
import authRequest from './request';
import { sleep } from '../utils';
import { getFileUuid } from './files';
import { jobRequestEnum } from '../utils/search';

// talent detail
export const getTalent = (talentId) => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest.sendV2(`/talents/${talentId}`, config);
};

// commonPool detail详情数据

export const getCommonDetail = (detailId) => {
  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    // body: JSON.stringify(detail),
  };
  return authRequest.send(`/es-talents/getTalent?id=${detailId}`, config);
};

// export const getCommonDetail = (commonPoolId) => {
//    const config = {
//     method: 'GET',
//     headers: {},
//   };
//   return authRequest.send(`/es-talents/getTalent/${commonPoolId}`, config);
// }

export const createCandidate = (talent) => {
  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(talent),
  };
  return authRequest.sendV2(`/talents`, config);
};

export const updateTalentBasic = (talent, talentId) => {
  delete talent.resumes;
  delete talent.notes;
  const config = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(talent),
  };
  return authRequest.sendV2(`/talents/${talentId}`, config);
};

// talent ownerships
export const getOwnershipsByTalentId = (talentId) => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest.send(`/talent/${talentId}/ownerships`, config);
};

export const replaceOwnershipsByTalentId = (userIds, talentId) => {
  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  };
  if (userIds.length) {
    config.body = JSON.stringify(userIds);
  } else {
    config.method = 'DELETE';
  }

  return authRequest.send(`/talent/${talentId}/ownerships`, config);
};

// talent resume
export const getResumesByTalentId = (talentId) => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest.send(`/talent-resumes/talent/${talentId}`, config);
};

export const addResume = (talentResume) => {
  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(talentResume),
  };
  return authRequest.send(`/talent-resumes`, config);
};

export const removeResume = (talentResumeId) => {
  const config = {
    method: 'DELETE',
    headers: {},
  };
  return authRequest.send(`/talent-resumes/${talentResumeId}`, config);
};

// parse resume
// upload resume only (used for get resume text only)
export const uploadResumeOnly = (resumeFile, uuid) => {
  let location = window.returnCitySN ? window.returnCitySN['cname'] : '';

  const requestBody = new FormData();
  requestBody.append('file', resumeFile);
  requestBody.append('uuid', uuid);
  requestBody.append('location', location);
  const config = {
    method: 'POST',
    headers: {},
    body: requestBody,
  };
  //{
  //     "createdBy": "143,4",
  //     "createdDate": "2021-10-13T00:37:03.714Z",
  //     "lastModifiedDate": "2021-10-13T00:37:03.714Z",
  //     "id": 109,
  //     "type": "RESUME",
  //     "uuid": "5cfe1f775563910a97f8f48d8ac21e84",
  //     "name": "CatherineLiu(UIUX).pdf",
  //     "s3Link": "https://s3-us-west-1.amazonaws.com/apn-cv-staging/42f244f5-23fc-4313-be72-d8618feba96c",
  //     "parserOutput": "{\"firstName\":\"Catherine\",\"lastName\":\"Liu\",\"educations\":[{\"collegeName\":\"LIAONING NORMAL UNIVERSITY, CHINA\",\"degreeLevel\":\"71\",\"majorName\":\"Advertising\"},{\"collegeName\":\"OHLONE COLLEGE, FREMONT, CA\",\"degreeLevel\":\"146\",\"majorName\":\"Web Design\"}],\"text\":\"Catherine Liu\\n (323) 346-9079\\n Design9992@gmail.com\\n SKILL SET:\\n  HTML5\\n  Interaction design\\n  Flash\\n  CSS3\\n  Visual design\\n  Lightroom\\n  Bootstrap\\n  Motion graphic design\\n  Sketch\\n  Sass\\n  Flat material design\\n  Axure\\n  LESS\\n  Data analysis\\n  Pencil\\n  JavaScript\\n  Data visualization\\n  Invison\\n  Angular JS\\n  SEO\\n  Font Awsome\\n  React JS\\n  WordPress\\n  Google Fonts\\n  JQuery\\n  Drupal\\n  Site Map\\n  JQuery Mobile\\n  Media Query\\n  Wireframe\\n  JQuery UI\\n  Flexible Box\\n  Prototype\\n  XML\\n  Fluid Grid\\n  SharePoint\\n  AJAX\\n  Visual studio\\n  Agile Development\\n  JSon\\n  Adobe Dreamweaver\\n  JIRA Agile Tool\\n  APIs\\n  Illustrator\\n  Microsoft Visio\\n  PHP with My SQL\\n  Photoshop\\n  Microsoft Office Suite\\n  Responsive web design\\n  Premiere\\n  native mobile app\\n  After Effect\\nCERTIFICATION:\\n Web Design Certification\\n  Graphic Design Certification\\nEDUCATION:\\n OHLONE COLLEGE, FREMONT, CA\\n Web Development\\n Web Design Certification\\n  LIAONING NORMAL UNIVERSITY, CHINA,\\n Bachelor Degree in Advertising\\n Graphic Design Certification\\nPROFESSIONAL EXPERIENCE:\\nOhlone College, Fremont\\n 01/2016—Present\\nTeaching Asistant\\nAWARDS:\\n First Place of Web Design Category in Multimedia Festival 2016.\\n  First Place of Digital Imagery Category in Multimedia Festival 2015.\\n  Second Place of illustration Category in CNPA Better Newspapers Contest 2015.\\n\",\"experiences\":[{\"current\":true,\"companyName\":\"Ohlone College, Fremont\",\"company\":\"Ohlone College, Fremont\",\"startDate\":\"2016-01-01\"}],\"contacts\":[{\"contact\":\"Design9992@gmail.com\",\"type\":\"EMAIL\"},{\"contact\":\"+13233469079\",\"type\":\"PHONE\"}]}",
  //     "tenantId": 4,
  //     "status": "FINISHED"
  // }
  return authRequest
    .sendV2(`/parsers/upload-resume-only`, config)
    .then(({ response }) => {
      if (response.status === 'EDIT') {
        throw new Error('Resume already exists');
      } else {
        const { name, s3Link, uuid, parserOutput } = response;
        return {
          name,
          s3Link,
          text: parserOutput && JSON.parse(parserOutput).text,
          uuid,
        };
      }
    });
};

// parse resume (upload resume and trigger parsing)
export const parseResumeAsync = (resumeFile, uuid, priority = 0) => {
  const requestBody = new FormData();
  requestBody.append('file', resumeFile);
  requestBody.append('uuid', uuid);
  requestBody.append('priority', priority);
  const config = {
    method: 'POST',
    headers: {},
    body: requestBody,
  };
  return authRequest.sendV2(`/parsers/resume/mq`, config);
};
export const bulkParseResumeAsync = (resumeFile, uuid, priority = 1) => {
  const requestBody = new FormData();
  requestBody.append('file', resumeFile);
  requestBody.append('uuid', uuid);
  requestBody.append('priority', priority);
  const config = {
    method: 'POST',
    headers: {},
    body: requestBody,
  };
  return authRequest.sendV2(`/parsers/bulk-resume-only/mq`, config);
};

// get parse result by uuid
export const getParserOutputAsync = (uuid) => {
  let location = window.returnCitySN ? window.returnCitySN['cname'] : '';
  const config = {
    method: 'GET',
    headers: {},
  };
  //{
  //     "status": "FINISHED",
  //     "data": "{\"firstName\":\"Catherine\",\"lastName\":\"Liu\",\"educations\":[{\"collegeName\":\"LIAONING NORMAL UNIVERSITY, CHINA\",\"degreeLevel\":\"71\",\"majorName\":\"Advertising\"},{\"collegeName\":\"OHLONE COLLEGE, FREMONT, CA\",\"degreeLevel\":\"146\",\"majorName\":\"Web Design\"}],\"text\":\"Catherine Liu\\n (323) 346-9079\\n Design9992@gmail.com\\n SKILL SET:\\n  HTML5\\n  Interaction design\\n  Flash\\n  CSS3\\n  Visual design\\n  Lightroom\\n  Bootstrap\\n  Motion graphic design\\n  Sketch\\n  Sass\\n  Flat material design\\n  Axure\\n  LESS\\n  Data analysis\\n  Pencil\\n  JavaScript\\n  Data visualization\\n  Invison\\n  Angular JS\\n  SEO\\n  Font Awsome\\n  React JS\\n  WordPress\\n  Google Fonts\\n  JQuery\\n  Drupal\\n  Site Map\\n  JQuery Mobile\\n  Media Query\\n  Wireframe\\n  JQuery UI\\n  Flexible Box\\n  Prototype\\n  XML\\n  Fluid Grid\\n  SharePoint\\n  AJAX\\n  Visual studio\\n  Agile Development\\n  JSon\\n  Adobe Dreamweaver\\n  JIRA Agile Tool\\n  APIs\\n  Illustrator\\n  Microsoft Visio\\n  PHP with My SQL\\n  Photoshop\\n  Microsoft Office Suite\\n  Responsive web design\\n  Premiere\\n  native mobile app\\n  After Effect\\nCERTIFICATION:\\n Web Design Certification\\n  Graphic Design Certification\\nEDUCATION:\\n OHLONE COLLEGE, FREMONT, CA\\n Web Development\\n Web Design Certification\\n  LIAONING NORMAL UNIVERSITY, CHINA,\\n Bachelor Degree in Advertising\\n Graphic Design Certification\\nPROFESSIONAL EXPERIENCE:\\nOhlone College, Fremont\\n 01/2016—Present\\nTeaching Asistant\\nAWARDS:\\n First Place of Web Design Category in Multimedia Festival 2016.\\n  First Place of Digital Imagery Category in Multimedia Festival 2015.\\n  Second Place of illustration Category in CNPA Better Newspapers Contest 2015.\\n\",\"experiences\":[{\"current\":true,\"companyName\":\"Ohlone College, Fremont\",\"company\":\"Ohlone College, Fremont\",\"startDate\":\"2016-01-01\"}],\"contacts\":[{\"contact\":\"Design9992@gmail.com\",\"type\":\"EMAIL\"},{\"contact\":\"+13233469079\",\"type\":\"PHONE\"}]}",
  //     "uuid": "5cfe1f775563910a97f8f48d8ac21e84",
  //     "name": "CatherineLiu(UIUX).pdf",
  //     "s3Link": "https://s3-us-west-1.amazonaws.com/apn-cv-staging/42f244f5-23fc-4313-be72-d8618feba96c",
  //     "faceRecognizeStatus": "FINISHED"
  // }
  return authRequest.sendV2(
    `/parsers/resume/mq/uuid?uuid=${uuid}&location=${location}`,
    config
  );
};
export const getParseData = async (uuid) => {
  let { response: parseOutputCache } = await getParserOutputAsync(uuid);
  if (!parseOutputCache.status) {
    throw { status: 404, message: 'Resume is not exist!' };
  }
  let count = 0;
  while (
    count < 40 &&
    (parseOutputCache.status === 'PARSING' ||
      parseOutputCache.status === 'STARTED')
  ) {
    await sleep(2000);
    parseOutputCache = (await getParserOutputAsync(uuid)).response;
    count++;
  }
  return _handleParseDateStatus(parseOutputCache);
};
export const _handleParseDateStatus = async (parseOutputCache) => {
  console.log('_handleParseDateStatus', parseOutputCache);
  switch (parseOutputCache.status) {
    case 'EDIT': {
      //todo check usage
      return {
        name: parseOutputCache.name,
        s3Link: parseOutputCache.s3Link,
        talentId: parseOutputCache.talentId,
        uuid: parseOutputCache.uuid,
        status: parseOutputCache.status,
      };
    }
    case 'FINISHED': {
      return {
        name: parseOutputCache.name,
        s3Link: parseOutputCache.s3Link,
        photoUrl: parseOutputCache.photoUrl,
        text: parseOutputCache.data && JSON.parse(parseOutputCache.data).text,
        uuid: parseOutputCache.uuid,
        parserOutput: parseOutputCache.data,
        status: parseOutputCache.status,
      };
    }
    case 'ERROR':
    default: {
      if (
        !parseOutputCache.name ||
        !parseOutputCache.s3Link ||
        !parseOutputCache.uuid
      ) {
        throw new Error('Fail to parse resume!');
      } else {
        try {
          return {
            name: parseOutputCache.name,
            s3Link: parseOutputCache.s3Link,
            photoUrl: parseOutputCache.photoUrl,
            text:
              parseOutputCache.data && JSON.parse(parseOutputCache.data).text,
            uuid: parseOutputCache.uuid,
            parserOutput: parseOutputCache.data,
            status: parseOutputCache.status,
          };
        } catch (e) {
          throw new Error('Fail to parse resume!!');
        }
      }
    }
  }
};

///获取简历解析状态
export const getParserStatusAsync = (uuid) => {
  const config = {
    method: 'GET',
    headers: {},
  };
  //{
  //     "status": "PARSING",
  //     "uuid": "3245126fce8b57308a46809291eb84ed",
  //     "name": "钱伟-Huawei-技术类-视频云解决方案规划专家.docx",
  //     "s3Link": "https://s3-us-west-1.amazonaws.com/apn-cv-staging/328f7bfd-ee84-4625-9b87-f3f56a7aeb17"
  // }
  return authRequest.sendV2(`/parse/status/mq/${uuid}`, config);
};

//parse resume and get parsed data
export const parseResume = async (resumeFile, priority) => {
  const uuid = await getFileUuid(resumeFile);
  const { response: status } = await getParserStatusAsync(uuid);
  if (!status.status) {
    //check if resume is uploaded before, if not upload
    await parseResumeAsync(resumeFile, uuid, priority);
  }
  return getParseData(uuid);
};

export const bulkParseResume = async (resumeFile, priority) => {
  const uuid = await getFileUuid(resumeFile);
  const { response: status } = await getParserStatusAsync(uuid);
  if (!status.status) {
    // check if resume is uploaded before, if not upload
    // upload resume with another api to unblock normal parsing process
    await bulkParseResumeAsync(resumeFile, uuid, priority);
  }
  return getParseData(uuid);
};

export const upsertContact = (contact, contactId = '') => {
  const config = {
    method: contactId ? 'PUT' : 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(contact),
  };
  return authRequest.send(`/talent-contacts/${contactId}`, config);
};

export const deleteContact = (contactId) => {
  const config = {
    method: 'DELETE',
    headers: {},
  };
  return authRequest.send(`/talent-contacts/${contactId}`, config);
};

// talent qualifications
export const upsertExperience = (experience, experienceId = '') => {
  const config = {
    method: experienceId ? 'PUT' : 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(experience),
  };
  return authRequest.send(`/talent-experiences/${experienceId}`, config);
};

export const deleteExperience = (experienceId) => {
  const config = {
    method: 'DELETE',
    headers: {},
  };
  return authRequest.send(`/talent-experiences/${experienceId}`, config);
};

export const upsertEducation = (education, educationId = '') => {
  const config = {
    method: educationId ? 'PUT' : 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(education),
  };
  return authRequest.send(`/talent-educations/${educationId}`, config);
};

export const deleteEducation = (educationId) => {
  const config = {
    method: 'DELETE',
    headers: {},
  };
  return authRequest.send(`/talent-educations/${educationId}`, config);
};

export const upsertSkill = (talentSkill, talentSkillId = '') => {
  const config = {
    method: talentSkillId ? 'PUT' : 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(talentSkill),
  };
  return authRequest.send(`/talent-skills/${talentSkillId}`, config);
};

export const deleteSkill = (talentSkillId) => {
  const config = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  };
  return authRequest.send(`/talent-skills/${talentSkillId}`, config);
};

export const upsertCertificate = (certificate, certificateId = '') => {
  const config = {
    method: certificateId ? 'PUT' : 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(certificate),
  };
  return authRequest.send(`/talent-certificates/${certificateId}`, config);
};

export const deleteCertificate = (certificateId) => {
  const config = {
    method: 'DELETE',
    headers: {},
  };
  return authRequest.send(`/talent-certificates/${certificateId}`, config);
};

// talent note
export const addTalentNote = (talentNote) => {
  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(talentNote),
  };
  return authRequest.sendV2(`/talent-notes`, config);
};

export const editTalentNote = (talentNote, id) => {
  const config = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(talentNote),
  };
  return authRequest.sendV2(`/talent-notes/${id}`, config);
};

// talent resume parse record
export const sendParseFeedback = (records, recordId = '') => {
  const config = {
    method: recordId ? 'PUT' : 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(records),
  };
  return authRequest.send(`/parse-records/${recordId}`, config);
};

export const getMyParseRecords = () => {
  const config = {
    method: 'GET',
    headers: {
      accept: 'application/json;charset=UTF-8',
    },
  };

  return authRequest.send(`/my-parse-records?size=1000`, config);
};

export const deleteParseRecord = (recordId) => {
  const config = {
    method: 'DELETE',
    headers: {},
  };

  return authRequest.send(`/parse-records/${recordId}`, config);
};

export const searchTalentByContacts = (contacts) => {
  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(contacts),
  };

  return authRequest.sendV2(`/talents/search_by_contactlist`, config);
};

export const getApplicationsByTalentId = (talentId) => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest.send(`/applications/talent/${talentId}`, config);
};

export const getRecommendedCommonTalentList = (jobId) => {
  const config = {
    method: 'GET',
    headers: {},
  };
  return authRequest.sendV2(
    `/recommend-common-talents/jobId/${jobId}?page=0&size=1000`,
    config
  );
};

export const getRecommendedTenantTalentList = (jobId, page, size) => {
  const config = {
    method: 'GET',
    headers: {},
  };
  return authRequest.sendV2(
    `/recommend-tenant-talents/jobId/${jobId}?page=${page || 0}&size=${
      size || 1000
    }`,
    config
  );
};

export const getCandidateWorkName = (id) => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest.sendV2(`/dict/format/92/${id}`, config);
};

//talent list
export const getTalentsSubmitToClient = (clientId) => {
  const config = {
    method: 'GET',
    headers: {},
  };
  return authRequest.send(`/client-talents/${clientId}`, config);
};
export const getAssignedUserJob = (userId) => {
  let module = jobRequestEnum.COMPANY;
  const config = {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  };
  config.body = JSON.stringify({
    condition: JSON.stringify({
      and: [
        // {
        //   or: [
        //     {
        //       status: 'OPEN',
        //     },
        //     {
        //       status: 'REOPENED',
        //     },
        //   ],
        // },
        {
          and: [
            {
              assignedUsers: {
                ANY: userId,
              },
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
