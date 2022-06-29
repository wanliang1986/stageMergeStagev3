import { createSelector } from 'reselect';
import Immutable from 'immutable';
import { formatUserName } from '../../utils';
import { JOB_TYPES } from '../constants/formOptions';
const defaultObject = {};

const getHistory = (state) =>
  JSON.stringify(state.router.location.state) || '{}';

const getJobIds = (state, tab) => state.controller.searchJobs[tab].ids;
const getJobs = (state) => state.model.jobs;
const getClients = (state) => state.model.clients;
const getTab = (_, tab) => tab;
const getTalentId = (_, talentId) => talentId;
const getTalents = (state) => state.model.talents;

const getMyJobsSort = (_, tab, sort) => {
  sort = sort || defaultObject;
  return (
    Object.keys(sort || {}).map((key) => [key, sort[key]])[0] || ['postingTime']
  );
};

export const getQuery = createSelector(
  [getHistory, getTab],
  (historyState, tab) => {
    historyState = JSON.parse(historyState);
    const query = (historyState && historyState[tab]) || {
      filters: {},
      sort: {},
    };
    return JSON.stringify(query);
  }
);

const makeGetSort = () =>
  createSelector(getQuery, (query) => {
    console.log('get sort', query);
    const { sort } = JSON.parse(query);
    return (
      Object.keys(sort || {}).map((key) => [key, sort[key]])[0] || [
        'postingTime',
      ]
    );
  });

export const makeGetJobList = () => {
  // console.log('make createSelector');
  const getSort = makeGetSort();
  return createSelector(
    [getSort, getJobIds, getJobs, getClients, getTab],
    (sort, ids, jobs, clients, tab) => {
      return ids
        ? ids
            .map((id) => {
              let job = jobs.get(id.toString());
              console.log(job);
              job =
                job &&
                job.set(
                  'hiringManager',
                  clients.getIn([
                    (job.get('hiringManagerId') || '').toString(),
                    'name',
                  ])
                );

              const applicationStats = JSON.parse(
                (job && job.get('applicationStats')) || '{}'
              );
              const activityStats =
                (job && job.get('activityStats')) || Immutable.Map();
              const onBoard = applicationStats.onBoard || 0;
              const starts = startTypes.reduce((res, type) => {
                if (applicationStats[type]) {
                  res += applicationStats[type];
                }
                return res;
              }, 0);
              const interviews =
                job && job.get('type') !== JOB_TYPES.Payrolling
                  ? interViewTypes.reduce((res, type) => {
                      if (applicationStats[type]) {
                        res += applicationStats[type];
                      }
                      return res;
                    }, starts)
                  : 0;

              const subs = interviews + (applicationStats.Submitted || 0);
              const applies = applyTypes.reduce((res, type) => {
                if (applicationStats[type]) {
                  res += applicationStats[type];
                }
                return res;
              }, subs);

              // const interviews = interViewTypes.reduce((res, type) => {
              //   if (applicationStats[type]) {
              //     res += applicationStats[type];
              //   }
              //   return res;
              // }, 0);

              // const subs = interviews + (applicationStats.Submitted || 0);
              // const onBoard = applicationStats.onBoard || 0;
              // const applies = applyTypes.reduce((res, type) => {
              //   if (applicationStats[type]) {
              //     res += applicationStats[type];
              //   }
              //   return res;
              // }, subs);

              return (
                job &&
                job.merge(
                  Immutable.fromJS({
                    starts: activityStats.get('Started') || '',
                    interviews: activityStats.get('Interview') || '',
                    subs: activityStats.get('Submitted') || '',
                    applies: activityStats.get('Applied') || '',
                    onBoard: onBoard || '',
                  })
                )
              );
            })
            .sortBy(
              (job) => job && job.get(sort[0]),
              (a, b) => {
                if (sort[0] !== 'id') {
                  a = a ? a.toLowerCase() : '';
                  b = b ? b.toLowerCase() : '';
                }
                if (a < b) {
                  return -((sort[1] === 'ASC') - 0.5);
                }
                if (a > b) {
                  return (sort[1] === 'ASC') - 0.5;
                }
                if (a === b) {
                  return 0;
                }
              }
            )
            .toList()
        : Immutable.List();
    }
  );
};

export const selectMyJobs = createSelector(
  [getMyJobsSort, getJobIds, getJobs, getClients],
  (sort, ids, jobs, clients) => {
    // console.log(sort);
    return ids
      ? ids
          .map(_getMapJobs(jobs, clients))
          .sortBy((job) => job.get(sort[0]), _getSortFunc(sort))
          .toList()
      : Immutable.List();
  }
);

export const getRecommendations = createSelector(
  [getTalentId, getTalents, getJobs],
  (talentId, talents, jobs) => {
    if (talents) {
      console.log(talents.toJS());
    }

    const ids = talents.getIn([talentId, 'jobIds']);
    if (ids) {
      console.log(ids.toJS());
    }

    return (
      ids &&
      ids.map((_id) => {
        const job = jobs.get(String(_id));
        return job;
      })
    );
  }
);

const _getMapJobs = (jobs, clients) => (jobId) => {
  let job = jobs.get(String(jobId));
  job = job.set(
    'hiringManager',
    clients.getIn([String(job.get('hiringManagerId')), 'name'])
  );
  const applicationStats = _getApplicationCounts(job);

  return job.merge(Immutable.fromJS(applicationStats));
};
const _getSortFunc = (sort) => (a, b) => {
  if (sort[0] !== 'id') {
    a = a ? a.toLowerCase() : '';
    b = b ? b.toLowerCase() : '';
  }
  if (a < b) {
    return -((sort[1] === 'ASC') - 0.5);
  }
  if (a > b) {
    return (sort[1] === 'ASC') - 0.5;
  }
  if (a === b) {
    return 0;
  }
};

const applyTypes = [
  'Applied',
  'Called_Candidate',
  'Meet_Candidate_In_Person',
  'Qualified',
  'Internal_Rejected',
];
const interViewTypes = [
  'Interview',
  'Shortlisted_By_Client',
  'Offered',
  'Client_Rejected',
  'Offer_Accepted',
  'Offer_Rejected',
  'FAIL_TO_ONBOARD',
];

const startTypes = [
  'Started',
  'START_TERMINATED',
  'START_EXTENSION',
  'START_RATE_CHANGE',
  'START_FAIL_WARRANTY',
];
const _getApplicationCounts = (job) => {
  const applicationStats = JSON.parse(job.get('applicationStats') || '{}');
  const activityStats = job.get('activityStats') || Immutable.Map();

  // const starts = startTypes.reduce((res, type) => {
  //   if (applicationStats[type]) {
  //     res += applicationStats[type];
  //   }
  //   return res;
  // }, 0);
  // const interviews =
  //   job.get('jobType') !== JOB_TYPES.Payrolling
  //     ? interViewTypes.reduce((res, type) => {
  //         if (applicationStats[type]) {
  //           res += applicationStats[type];
  //         }
  //         return res;
  //       }, starts)
  //     : 0;

  // const subs = interviews + (applicationStats.Submitted || 0);

  // const applies = applyTypes.reduce((res, type) => {
  //   if (applicationStats[type]) {
  //     res += applicationStats[type];
  //   }
  //   return res;
  // }, subs);
  return {
    starts: activityStats.get('Started') || '',
    interviews: activityStats.get('Interview') || '',
    subs: activityStats.get('Submitted') || '',
    applies: activityStats.get('Applied') || '',
    onBoard: applicationStats.onBoard || '',
  };
};
