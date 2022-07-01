import { createSelector } from 'reselect';
import Immutable from 'immutable';
import { formatUserName } from './../../utils';
import { currency } from '../constants/formOptions';

const getCurrentUserId = (state) => state.controller.currentUser.get('id');
const getCurrentTenantId = (state) =>
  state.controller.currentUser.get('tenantId');
const getJobId = (_, jobId) => parseInt(jobId, 10);
const getApplicationId = (_, applicationId) => parseInt(applicationId, 10);

const getTalentId = (_, talentId) => parseInt(talentId, 10);
const getCurrentApplicationId = (_, __, currentApplicationId) =>
  parseInt(currentApplicationId, 10);

const getApplications = (state) => state.relationModel.applications;
const getTalents = (state) => state.model.talents;
const getJobs = (state) => state.model.jobs;
const getUsersToJobsRelations = (state) =>
  state.relationModel.usersToJobsRelations;
const getResumes = (state) => state.model.talentResumes;
const getUsers = (state) => state.model.users;
const getApplicationCommissions = (state) =>
  state.relationModel.applicationCommissions;

const getMergedApplications = createSelector(
  [
    getApplications,
    getTalents,
    getResumes,
    getUsers,
    getUsersToJobsRelations,
    getJobId,
    getJobs,
  ],
  (
    applications,
    talents,
    resumes,
    users,
    usersToJobsRelations,
    jobId,
    jobs
  ) => {
    return applications
      .map((application) => {
        const job = jobs.get(application.get('jobId').toString());
        const talent = talents.get(String(application.get('talentId')));
        const sales = usersToJobsRelations
          .toList()
          .toJS()
          .filter((ele) => ele.jobId === jobId)
          .find((ele) => {
            return ele.permissionSet.findIndex((ele) => ele === 'Owner') !== -1;
          });

        return application.merge(
          Immutable.Map({
            user: formatUserName(users.get(String(application.get('userId')))),
            applyToUser: formatUserName(
              users.get(String(application.get('applyToUserId')))
            ),
            resume: resumes.get(String(application.get('resumeId'))),
            lastModifiedUser: formatUserName(
              users.get(String(application.get('lastModifiedUser')))
            ),
            sales: sales && formatUserName(users.get(String(sales.userId))),
            //todo: remove score fix
            score: Number(application.get('score')) * 100 || 0,
            customScore: application.get('customScore') || 0,
            applicationStatus: application.get('status'),
            companyName: job && job.get('companyName'),
            fullName: talent && talent.get('fullName'),
            email: talent && talent.get('email'),
            phone: talent && talent.get('phone'),
            company:
              talent &&
              talent.get('experiences') &&
              talent.get('experiences').toJS(),
            title:
              talent &&
              talent.get('experiences') &&
              talent.get('experiences').toJS(),
            jobTitle: job && job.get('title'),
            // expectedPayRate:
            //   talent && talent.get('preferredSalaryRange')
            //     ? (talent.get('preferredSalaryRange') / 2000).toLocaleString(
            //         undefined,
            //         {
            //           minimumFractionDigits: 2,
            //           maximumFractionDigits: 2,
            //         }
            //       ) + ' / year'
            //     : 'N/A',
            filterStatus: filterItem(
              application.get('talentRecruitmentProcessNodes')
            ),
            jobType: job && job.get('jobType'),
            expectedPayRate:
              talent &&
              talent.get('preferredCurrency') &&
              talent.get('preferredSalaryRange')
                ? currency.find(
                    (item) => item.value === talent.get('preferredCurrency')
                  ).label +
                  ' ' +
                  (talent.get('preferredSalaryRange')
                    ? talent.get('preferredSalaryRange').toJS().gte
                    : '') +
                  ' - ' +
                  (talent.get('preferredSalaryRange')
                    ? talent.get('preferredSalaryRange').toJS().lte
                    : '') +
                  ' / ' +
                  talent.get('preferredPayType')
                : 'N/A',
          })
        );
      })
      .toList();
  }
);

const filterItem = (item) => {
  let items = item && item.toJS();
  let nodeType;
  let eliminated = items.filter((x) => x.nodeStatus === 'ELIMINATED');
  let active = items.filter((x) => x.nodeStatus === 'ACTIVE');
  let onBoard = items.filter((x) => x.nodeType === 'ON_BOARD');
  if (eliminated && eliminated.length > 0) {
    nodeType = eliminated[0].nodeStatus;
    return nodeType;
  } else if (active && active.length > 0) {
    nodeType = active[0].nodeType;
    return nodeType;
  } else {
    nodeType = onBoard[0].nodeType;
    return nodeType;
  }
};

const getApplicationList = createSelector(
  [getJobId, getMergedApplications],
  (jobId, applications) => {
    return applications.filter(
      (application) =>
        application.get('status') !== 'Watching' &&
        application.get('jobId') === jobId
    );
  }
);

export default getApplicationList;

export const getApplicationListByTalent = createSelector(
  [
    getTalentId,
    getApplications,
    getJobs,
    getResumes,
    getUsers,
    getCurrentTenantId,
    getTalents,
  ],
  (talentId, applications, jobs, resumes, users, tenantId, talents) => {
    return applications
      .filter((application) => {
        return (
          application.get('status') !== 'Watching' &&
          application.get('talentId') === Number(talentId) &&
          application.get('tenantId') === tenantId
        );
      })
      .map((application) => {
        const talent = talents.get(String(application.get('talentId')));
        const job = jobs.get(application.get('jobId').toString());
        return application.merge(
          Immutable.Map({
            user: formatUserName(users.get(String(application.get('userId')))),
            applyToUser: formatUserName(
              users.get(String(application.get('applyToUserId')))
            ),
            resume: resumes.get(String(application.get('resume'))),
            lastModifiedUser: formatUserName(
              users.get(String(application.get('lastModifiedUser')))
            ),

            score: application.get('score') || 0,
            customScore: application.get('customScore') || 0,

            title: job && job.get('title'),
            jobTitle: job && job.get('title'),
            company: job && job.get('company'),
            companyName: job && job.get('companyName'),
            jobType: job && job.get('jobType'),
            code: job && job.get('code'),
            fullName: talent && talent.get('fullName'),
          })
        );
      })
      .sortBy(
        (application) => application.get('lastModifiedDate'),
        (a, b) => {
          if (a < b) {
            return 1;
          }
          if (a > b) {
            return -1;
          }
          if (a === b) {
            return 0;
          }
        }
      )
      .toList();
  }
);

export const getOfferListByTalent = createSelector(
  [getApplicationListByTalent, getCurrentApplicationId],
  (applications, currentApplicationId) => {
    return applications.filter((application) => {
      return (
        application.get('status') === 'Offer_Accepted' &&
        application.get('id') !== currentApplicationId
      );
    });
  }
);

export const getApplicationJobListByTalent = createSelector(
  [
    getTalentId,
    getApplications,
    getJobs,
    getResumes,
    getUsers,
    getCurrentTenantId,
  ],
  (talentId, applications, jobs, resumes, users, tenantId) => {
    return applications
      .filter((application) => {
        return (
          application.get('status') !== 'Watching' &&
          application.get('talentId') === Number(talentId) &&
          application.get('tenantId') === tenantId
        );
      })
      .sortBy(
        (application) => application.get('lastModifiedDate'),
        (a, b) => {
          if (a < b) {
            return 1;
          }
          if (a > b) {
            return -1;
          }
          if (a === b) {
            return 0;
          }
        }
      )
      .map((application) => {
        const job = jobs.get(application.get('jobId').toString());
        return job && job.set('score', (application.get('score') || 0) * 100);
      })
      .toList();
  }
);

export const getApplicationCommissionsByApplicationId = createSelector(
  [getApplicationId, getApplicationCommissions],
  (applicationId, applicationCommissions) => {
    return applicationCommissions
      .filter((ac) => ac.get('applicationId') === applicationId)
      .toList();
  }
);

export const getApplicationPositionListByTalent = createSelector(
  [getTalentId, getApplications, getJobs, getUsers, getCurrentTenantId],
  (talentId, applications, jobs, users, tenantId) => {
    return applications
      .filter((application) => {
        return (
          application.get('status') !== 'Watching' &&
          application.get('talentId') === Number(talentId) &&
          application.get('tenantId') === tenantId
        );
      })
      .map((application) => {
        const job = jobs.get(application.get('jobId').toString());
        return application.merge(
          Immutable.Map({
            user: formatUserName(users.get(String(application.get('userId')))),
            applyToUser: formatUserName(
              users.get(String(application.get('applyToUserId')))
            ),
            lastModifiedUser: formatUserName(
              users.get(String(application.get('lastModifiedUser')))
            ),
            createdDate: application.get('createdDate'),
            lastModifiedDate: application.get('lastModifiedDate'),
            jobId: application.get('jobId'),
            title: job && job.get('title'),
            jobTitle: job && job.get('title'),
            company: job && job.get('company'),
            companyName: job && job.get('companyName'),
            jobType: job && job.get('jobType'),
            code: job && job.get('code'),
            assignedUsers: job && job.get('assignedUsers'),
            jobStatus: job && job.get('status'),
          })
        );
      })
      .sortBy(
        (application) => application.get('lastModifiedDate'),
        (a, b) => {
          if (a < b) {
            return 1;
          }
          if (a > b) {
            return -1;
          }
          if (a === b) {
            return 0;
          }
        }
      )
      .toList();
  }
);
