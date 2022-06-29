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

const getMergedApplications = createSelector(
  [
    getApplications,
    getTalents,
    getResumes,
    getUsers,
    getUsersToJobsRelations,
    getJobId,
  ],
  (applications, talents, resumes, users, usersToJobsRelations, jobId) => {
    return applications
      .map((application) => {
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
      .map((application) => {
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
            company: job && job.get('company'),
            companyName: job && job.get('companyName'),
            jobType: job && job.get('jobType'),
            code: job && job.get('code'),
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
  [getApplicationId, getApplications],
  (applicationId, getApplications) => {
    return getApplications.getIn([
      String(applicationId),
      'applicationCommissions',
    ]);
  }
);
