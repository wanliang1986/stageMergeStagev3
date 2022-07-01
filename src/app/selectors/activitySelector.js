import { createSelector } from 'reselect';
// import Immutable from 'immutable';

const getApplicationId = (_, applicationId) => applicationId;
const getActivities = (state) => state.relationModel.activities;
// const getTalentId = (_, talentId) => parseInt(talentId);
// const getTalents = (state) => state.model.talents;
// const getJobs = (state) => state.model.jobs;
// const getResumes = (state) => state.model.talentResumes;
const getUsers = (state) => state.model.users;

export const getAllActivityList = createSelector(
  [getApplicationId, getActivities, getUsers],
  (applicationId, activities, users) => {
    console.log('getActivityList');
    return activities
      .filter(
        (activity) =>
          activity.get('applicationId') === applicationId &&
          activity.get('status') !== 'Watching'
      )
      .map((activity) =>
        activity.set('user', users.get(activity.get('userId').toString()))
      )
      .sortBy(
        (activity) => activity.get('createdDate'),
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
const getActivityList = createSelector([getAllActivityList], (activities) => {
  console.log('getActivityList');
  return activities.groupBy((activity) => activity.get('status')).toList();
});
export default getActivityList;
