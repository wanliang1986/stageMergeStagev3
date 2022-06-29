import { createSelector } from 'reselect';
import Immutable from 'immutable';

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
        activity.set('user', users.get(String(activity.get('userId'))))
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

export const getActivityList = createSelector(
  [getAllActivityList],
  (activities) => {
    // console.log('getActivityList');
    const { data } = activities.reduce(
      (res, value) => {
        if (!res.currentStatus || res.currentStatus !== value.get('status')) {
          res.currentStatus = value.get('status');
          res.data.push([value]);
        } else {
          res.data[res.data.length - 1].push(value);
        }
        return res;
      },
      { currentStatus: null, data: [] }
    );
    return Immutable.fromJS(data);
  }
);
export default getActivityList;
