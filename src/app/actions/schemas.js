import { schema } from 'normalizr';
import { formatFullName } from './../../utils';

///user schema
const tenant = new schema.Entity('tenants');
export const division = new schema.Entity('divisions');

export const user = new schema.Entity(
  'users',
  {
    tenant,
    division,
  },
  {
    processStrategy: (value) => {
      return getUser(value);
    },
  }
);

export const miniUser = new schema.Entity(
  'users',
  {},
  {
    processStrategy: (value) => {
      return getMiniUser(value);
    },
  }
);

// client schema (client contact)
const client = new schema.Entity('clients', {
  accountManager: miniUser,
});

// invoice schema
const invoiceActivity = new schema.Entity('invoiceActivities');
export const invoice = new schema.Entity('invoices', {
  activities: [invoiceActivity],
});

export const commission = new schema.Entity('commissions');

/// talent schema
const talentNote = new schema.Entity('talentNotes', { user });
export const talentOwnership = new schema.Entity(
  'talentOwnerships',
  {},
  {
    idAttribute: (value) => `${value.ownershipType}-${value.userId}`,
  }
);
export const talentResume = new schema.Entity(
  'talentResumes',
  {},
  {
    processStrategy: (value) => {
      return {
        id: value.id,
        talentId: value.talentId,
        name: value.name,
        s3Link: value.s3Link,
        sourceType: value.sourceType,
        text: value.text,
        uuid: value.uuid,

        createdBy: value.createdBy,
        createdDate: value.createdDate,
        lastModifiedDate: value.lastModifiedDate,
      };
    },
  }
);
export const start = new schema.Entity(
  'starts',
  {},
  {
    processStrategy: (value) => {
      if (!value.startCommissions) {
        delete value.startCommissions;
      }
      if (!value.startFteRate) {
        delete value.startFteRate;
      }
      if (!value.startContractRates) {
        delete value.startContractRates;
      }
      if (!value.startAddress) {
        delete value.startAddress;
      }
      if (!value.startClientInfo) {
        delete value.startClientInfo;
      }
      return value;
    },
  }
);

export const newStart = new schema.Entity(
  'starts',
  {},
  {
    processStrategy: (value) => {
      return value;
    },
  }
);

export const esStart = new schema.Entity(
  'starts',
  {},
  {
    idAttribute: (value) => Number(value._source.id),
    processStrategy: (value) => {
      const start = Object.assign({}, value._source);
      start.id = Number(value._source.id);
      return start;
    },
  }
);

export const talentBasic = new schema.Entity(
  'talents',
  {},
  {
    processStrategy: (value) => {
      return getTalentBasic(value);
    },
  }
);

export const newCandidateDetail = new schema.Entity(
  'talents',
  {
    notes: [talentNote],
    // ownerships: [talentOwnership],
  },
  {
    processStrategy: (value) => {
      return getTalentDetail(value);
    },
  }
);

//schema的参数:第一个参数为实体类的key名,这里只能用字符串，当这里定义以后，在存储redux时，我们可以根据这类名进行当前key名获取格式化后的数据，见talents.js第28行，
//第二个参数为newCandidateDetail中嵌套的内容，notes为嵌套的key，[talentNote]为嵌套对应的内容，如果直接写notes:talentNote,那么对应嵌套的内容格式为notes:{},加上[]后，对应的嵌套内容变为
//notes:[{}]格式，talentNote对应45行schema生成的对象
//第三个参数对象为可选参数,主要是对数据的一些预处理，方法：idAttribute,processStrategy
//idArrribute:返回数据中唯一的id值
//processStrategy:预处理，通过该方法添加额外参数或者默认值等

/// talent schema end

/// job schema
export const jobNote = new schema.Entity('jobNotes', { user });
const jobQuestion = new schema.Entity('jobQuestions', { user });
export const usersToJobsRelation = new schema.Entity(
  'usersToJobsRelations',
  { user },
  {
    idAttribute: (value) => `${value.jobId}-${value.id}-${value.userId}`,
    processStrategy: (value) => {
      return {
        id: value.id,
        jobId: value.jobId,
        userId: value.userId,

        permissionSet: value.permissionSet,
        searchString: value.searchString,

        // createdBy: value.createdBy,
        // createdDate: value.createdDate,
        // lastModifiedDate: value.lastModifiedDate,
        //entities
        user: value.user,
      };
    },
  }
);
export const jobBasic = new schema.Entity(
  'jobs',
  {
    hiringManagerEntity: client,
    hrEntity: client,
  },
  {
    processStrategy: (value) => {
      return getJobBasic(value);
    },
  }
);
export const jobDetail = new schema.Entity(
  'jobs',
  {
    notes: [jobNote],
    // createdUser: user,
  },
  {
    processStrategy: (value) => {
      return getJobDetail(value);
    },
  }
);

export const recommendation = new schema.Entity(
  'jobs',
  {},
  {
    processStrategy: (value) => {
      return getESJob(value);
    },
  }
);

export const esJob = new schema.Entity(
  'jobs',
  {},
  {
    idAttribute: (value) => value.id,
    processStrategy: (value) => {
      return getJobBasic(value);
    },
  }
);

/// application schema
export const application = new schema.Entity('applications', {
  user,
  job: jobBasic,
  talent: talentBasic,
  resume: talentResume,
  // lastModifiedUser: user,
});

//utils
const getTalentBasic = (talent) => {
  const res = {
    id: talent.id,
    active: talent.active,
    verified: talent.verified,
    purchased: talent.purchased,
    esId: talent.esId,
    chinese: talent.chinese,

    firstName: talent.firstName,
    fullName: talent.fullName,
    lastName: talent.lastName,

    birthDate: talent.birthDate,
    gender: talent.gender,
    website: talent.website,
    photoUrl: talent.photoUrl,
    summary: talent.summary,
    talentType: talent.talentType,

    industries: talent.industries,
    expectedSalary: talent.expectedSalary,
    currentLocation: talent.currentLocation,

    createdBy: talent.createdBy,
    createdDate: talent.createdDate,
    lastModifiedDate: talent.lastModifiedDate,
    experiences: talent.experiences,
  };
  if (talent.contacts && talent.contacts.length > 0) {
    res.contacts = talent.contacts.sort((a, b) => {
      let aSort = a.sort || 100;
      let bSort = b.sort || 100;
      return aSort - bSort;
    });
  }
  if (talent.skills && talent.skills.length > 0) {
    res.skills = talent.skills;
  }
  if (talent.watchApplicationCount) {
    res.watchApplicationCount = talent.watchApplicationCount;
  }
  if (talent.createdUser) {
    res.createdUser = getMiniUser(talent.createdUser);
  }
  if (talent.socialNetworks) {
    res.socialNetworks = talent.socialNetworks;
  }
  if (talent.jobFunctions) {
    res.jobFunctions = talent.jobFunctions;
  }
  if (talent.languages) {
    res.languages = talent.languages;
  }
  if (talent.payType) {
    res.payType = talent.payType;
  }
  if (talent.salaryRange) {
    res.salaryRange = talent.salaryRange;
  }
  if (talent.sourcingChannel) {
    res.sourcingChannel = talent.sourcingChannel;
  }
  if (talent.workAuthorization) {
    res.workAuthorization = talent.workAuthorization;
  }
  if (talent.ownerships) {
    res.ownerships = talent.ownerships;
  }
  if (talent.projects) {
    res.projects = talent.projects;
  }
  if (talent.preferredPayType) {
    res.preferredPayType = talent.preferredPayType;
  }
  if (talent.preferredSalaryRange) {
    res.preferredSalaryRange = talent.preferredSalaryRange;
  }
  if (talent.preferredLocations) {
    res.preferredLocations = talent.preferredLocations;
  }
  if (talent.preferredCurrency) {
    res.preferredCurrency = talent.preferredCurrency;
  }
  if (talent.currency) {
    res.currency = talent.currency;
  }
  if (talent.resumes) {
    res.resumes = talent.resumes;
  }
  if (talent.label) {
    res.label = talent.label;
  }

  if (talent.experiences) {
    res.experiences = talent.experiences;
  }

  if (talent.preferredCurrency) {
    res.preferredCurrency = talent.preferredCurrency;
  }
  if (talent.additionalInfo) {
    res.additionalInfo = talent.additionalInfo;
  }
  if (talent.tenantLabels) {
    res.tenantLabels = talent.tenantLabels;
  }

  return res;
};
const getTalentDetail = (talent) => {
  const res = getTalentBasic(talent);
  res.notes = talent.notes;
  res.certificates = talent.certificates;
  res.educations = talent.educations;
  res.experiences = talent.experiences;
  return res;
};
const getUser = (user) => {
  const res = {
    id: user.id,
    divisionId: user.divisionId,
    tenantId: user.tenantId,
    username: user.username,
    lastName: user.lastName,
    firstName: user.firstName,
    phone: user.phone,
    fullName: user.username,
    email: user.email,
    note: user.note,
    activated: user.activated,
    createdDate: user.createdDate,
  };
  if (user.authorities) {
    res.authorities = user.authorities;
  }
  if (user.tenant) {
    res.tenant = user.tenant;
  }
  if (user.division) {
    res.division = user.division;
  }
  if (user.monthlyCredit) {
    res.monthlyCredit = user.monthlyCredit;
  }
  if (user.bulkCredit) {
    res.bulkCredit = user.bulkCredit;
  }
  if (user.usedMonthlyCredit) {
    res.usedMonthlyCredit = user.usedMonthlyCredit;
  }
  if (user.usedBulkCredit) {
    res.usedBulkCredit = user.usedBulkCredit;
  }
  if (user.effectCredit >= 0) {
    res.effectCredit = user.effectCredit;
  }
  if (user.creditEffectType) {
    res.creditEffectType = user.creditEffectType;
  }
  if (user.firstName && user.lastName) {
    res.fullName = formatFullName(user.firstName.trim(), user.lastName.trim());
  }
  return res;
};
const getMiniUser = (user) => ({
  id: user.id,
  username: user.username,
  email: user.email,
  lastName: user.lastName,
  firstName: user.firstName,
  fullName:
    user.firstName && user.lastName
      ? formatFullName(user.firstName.trim(), user.lastName.trim())
      : user.username,
  activated: user.activated,
  tenantId: user.tenantId,
});

const getJobBasic = (job) => {
  console.log(job);
  const res = {
    billRange: job.billRange,
    salaryRange: job.salaryRange,
    experienceYearRange: job.experienceYearRange,
    minimumDegreeLevel: job.minimumDegreeLevel,
    contactCategoryId: job.contactCategoryId,

    id: job.id,
    code: job.code,
    internal: job.internal,
    visible: job.visible,
    status: job.status,

    favorite: job.favorite || job.favoriteFlag,
    favoriteFlag: job.favorite || job.favoriteFlag,

    company: job.company,
    companyId: job.company ? job.company.id : job.companyId,
    companyName: job.company ? job.company.name : job.companyName,

    title: job.title,
    jobType: job.jobType || job.type,
    type: job.jobType || job.type,

    openings: job.openings,
    maxSubmissions: job.maxSubmissions,

    postingTime: job.postingTime,
    startDate: job.startDate,
    endDate: job.endDate,

    // description: job.description,
    jdText: job.jdText,
    publicDesc:
      job.publicDesc ||
      `<p>${(job.jdText || '')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .split('\n')
        .join('</p><p>')}</p>`,

    createdBy: job.createdBy,
    createdDate: job.createdDate,
    lastModifiedDate: job.lastModifiedDate,

    department: job.department,
    locations: job.locations,
    currency: job.currency,
    payType: job.payType,
    jobFunctions: job.jobFunctions,
    requiredSkills: job.requiredSkills,
    assignedUsers: job.assignedUsers,
    clientContactCategory: job.clientContactCategory,
    clientContactName: job.clientContactName,
    minimumDegree: job.minimumDegree,
    leastExperienceYear: job.leastExperienceYear,
    mostExperienceYear: job.mostExperienceYear,
    requiredLanguages: job.requiredLanguages,
    preferredLanguages: job.preferredLanguages,
    preferredSkills: job.preferredSkills,
  };
  if (job.applicationStats) {
    res.applicationStats = job.applicationStats;
  }
  if (job.activityStats) {
    res.activityStats = job.activityStats.reduce((res, value) => {
      res[value.status] = value.count;
      return res;
    }, {});
  }

  return res;
};
const getJobDetail = (job) => {
  const res = getJobBasic(job);
  res.notes = job.notes;

  return res;
};
const getESJob = (job) => {
  const res = {
    billRange: job.billRange,
    id: job.id,

    code: job.code,
    internal: job.internal,
    visible: job.visible,
    status: job.status,
    primaryRecruiter: job.primaryRecruiter,
    primarySale: job.primarySale,
    hiringManager: job.hiringManager,

    score: job.score && Number(job.score) * 100,

    company:
      job.companyName && job.companyId
        ? { id: job.companyId, name: job.companyName }
        : job.company,
    companyName: job.companyName,
    companyId: job.companyId,
    postingTime: job.postingTime,
    preferredSkills: job.preferredSkills,
    requiredSkills: job.requiredSkills,
    title: job.title,
    jobType: job.jobType || job.type,
    type: job.jobType || job.type,
    priority: job.priority,
    openings: job.openings,
    maxSubmissions: job.maxSubmissions,
    startDate: job.startDate,
    endDate: job.endDate,

    createdUser: job.createdUser,
    createdDate: job.createdDate,
    // lastModifiedDate: job.lastModifiedDate
  };

  if (job.applicationStats) {
    res.applicationStats = job.applicationStats;
  }
  if (job.activityStats) {
    res.activityStats = job.activityStats.reduce((res, value) => {
      res[value.status] = value.count;
      return res;
    }, {});
  }
  return res;
};

// boolstr: null
// createdUser: null
// division: ""
// domain: null
// durationInDays: null
//
// jdUrl: null
// overview: null
//
// requirement: null
// responsibility: null
// searchString: null
// skills: null
