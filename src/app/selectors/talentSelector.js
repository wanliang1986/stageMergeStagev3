import { createSelector } from 'reselect';
import Immutable from 'immutable';
import { formatUserName } from './../../utils';
import { getApplicationStatusLabel } from './../constants/formOptions';

const mapIdToTalent = (talents, id) => {
  let talent = talents.get(id.toString());
  return talent.set('createdBy', formatUserName(talent.get('createdUser')));
};

const sortComparator = (a, b, asc) => {
  a = a ? a.toLowerCase() : '';
  b = b ? b.toLowerCase() : '';
  if (a < b) {
    return -(asc - 0.5);
  }
  if (a > b) {
    return asc - 0.5;
  }
  if (a === b) {
    return 0;
  }
};
const _defaultQueries = {
  all: {
    filters: {
      contacts: true,
      resume: true,
    },
    sort: {},
  },
};
const _defaultQuery = {
  filters: {},
  sort: {},
};
// todo: replace _defaultQuery, it is unstable
export const getQuery = (state, tab) => {
  let historyState = state.router.location.state || {};
  return historyState[tab] || _defaultQueries[tab] || _defaultQuery;
};
const getTalentIds = (state, tab, filter) => {
  if (tab === 'myCandidates') {
    tab = 'my';
  } else if (tab === 'myHires') {
    tab = 'hired';
  }
  return (
    state.controller.searchTalents[tab].ids &&
    state.controller.searchTalents[tab].ids.subtract(filter)
  );
};
const getTalentIdsES = (state) => state.controller.searchTalents.es.ids;
const getTalents = (state) => state.model.talents;

const getSort = createSelector([getQuery], (query) => {
  console.log('create getSort');
  return (
    Object.keys(query.sort || {}).map((key) => [key, query.sort[key]])[0] || [
      'createdDate',
    ]
  );
});

const makeGetSort = () =>
  createSelector([getQuery], (query) => {
    console.log('create getSort');
    return (
      Object.keys(query.sort || {}).map((key) => [key, query.sort[key]])[0] || [
        'createdDate',
      ]
    );
  });

const getTalentList = createSelector(
  [getSort, getTalentIds, getTalents],
  (sort, ids, talents) => {
    console.log('create selector', ids);
    return ids
      ? ids
          .map((id) => mapIdToTalent(talents, id))
          .sortBy(
            (t) => t.get(sort[0]),
            (a, b) => sortComparator(a, b, sort[1] === 'ASC')
          )
          .toList()
      : Immutable.List();
  }
);
export const getTalentListByES = createSelector(
  [getTalentIdsES, getTalents],
  (ids, talents) => {
    console.log('create es selector', ids);
    return ids ? ids.map((id) => mapIdToTalent(talents, id)) : Immutable.List();
  }
);

export const makeGetTalentList = () => {
  const getSort = makeGetSort();
  return createSelector(
    [getSort, getTalentIds, getTalents],
    (sort, ids, talents) => {
      console.log('create selector');

      return ids
        ? ids
            .map((id) => mapIdToTalent(talents, id))
            .sortBy(
              (t) => t.get(sort[0]),
              (a, b) => sortComparator(a, b, sort[1] === 'ASC')
            )
            .toList()
        : Immutable.List();
    }
  );
};
export default getTalentList;

const submittedTalents = (state) =>
  state.model.talentsSubmitToClient.tstcActivity.get('talents');
const activityIds = (state) => state.model.talentsSubmitToClient.tstcIds;
const activityJobs = (state) =>
  state.model.talentsSubmitToClient.tstcActivity.get('jobs');
const resumes = (state) =>
  state.model.talentsSubmitToClient.tstcActivity.get('talentResumes');
const users = (state) =>
  state.model.talentsSubmitToClient.tstcActivity.get('users');
const activities = (state) =>
  state.model.talentsSubmitToClient.tstcActivity.get('activities');

export const getTalentsSubmitted = createSelector(
  [submittedTalents, activityIds, activityJobs, resumes, users, activities],
  (talents, ids, jobs, resumes, users, activities) => {
    if (ids) {
      return ids.map((activityId) => {
        let sAId = activityId.toString();
        let talentId = activities.getIn([sAId, 'talentId']).toString();
        let jobId = activities.getIn([sAId, 'jobId']).toString();
        let userId = activities.getIn([sAId, 'userId']).toString();
        let resumeId = activities.getIn([sAId, 'talentResume']).toString();
        console.log('----getTalentsSubmitted selector----');

        const res = {
          id: talentId,
          fullName: talents.getIn([talentId, 'fullName']),
          email: talents.getIn([talentId, 'email']),
          phone: talents.getIn([talentId, 'phone']),
          jobTitle: jobs.getIn([jobId, 'title']),
          submittedBy: users.getIn([userId, 'username']),
        };

        return Immutable.Map(res)
          .set('submittedAt', activities.getIn([sAId, 'createdDate']))
          .set('resume', resumes.getIn([resumeId, 's3Link']))
          .set('resumeName', resumes.getIn([resumeId, 'name']))
          .set(
            'currentStatus',
            getApplicationStatusLabel(
              activities.getIn([sAId, 'latestActivityStatus'])
            )
          );
      });
    }

    return Immutable.List();
  }
);
