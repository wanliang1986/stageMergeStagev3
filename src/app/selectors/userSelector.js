import { createSelector } from 'reselect';
import Immutable from 'immutable';
import { JOB_USER_ROLES } from '../constants/formOptions';

const getJobId = (_, jobId) => parseInt(jobId, 10);
const getUsers = (state) => state.model.users;
const getJobs = (state) => state.model.jobs;
const getDivisions = (state) => state.model.divisions;
const getCurrentUserId = (state) => state.controller.currentUser.get('id');
const getCurrentTenantId = (state) =>
  state.controller.currentUser.get('tenantId');

const getOldUserId = (_, oldUserId) => parseInt(oldUserId, 10);

// get job&userRelation by filtering by jobId
export const getAssignedUsers = createSelector(
  [getJobId, getJobs, getCurrentUserId, getUsers],
  (jobId, jobs, currentUserId, users) => {
    const assignedUsers =
      jobs.getIn([String(jobId), 'assignedUsers']) || Immutable.List();
    return assignedUsers.map((au) => {
      const user = users.get(String(au.get('userId')));
      return Immutable.Map({
        jobId,
        userId: au.get('userId'),
        lastName: au.get('lastName'),
        firstName: au.get('firstName'),
        username: au.get('username'),
        permission: au.get('permission'),
        fullName: user && user.get('fullName'),
        email: user && user.get('email'),
        isMe: currentUserId === au.get('userId'),
      });
    });
  }
);
export const getAssignedUserArray = createSelector(
  [getAssignedUsers],
  (assignedUsers) => assignedUsers.toJS()
);

export const getAMList = createSelector([getAssignedUsers], (users) => {
  return users.filter(
    (user) =>
      user.get('permission') === JOB_USER_ROLES.AccountManager ||
      user.get('permission') === JOB_USER_ROLES.AccountCoordinator
  );
});

export const getAMArray = createSelector([getAMList], (amList) => {
  return amList.toJS();
});

export const getDMList = createSelector([getAssignedUsers], (users) => {
  return users.filter(
    (user) => user.get('permission') === JOB_USER_ROLES.DeliveryManager
  );
});
export const getDMArray = createSelector([getDMList], (dmList) => {
  return dmList.toJS();
});

export const getACList = createSelector([getAssignedUsers], (users) => {
  return users.filter(
    (user) => user.get('permission') === JOB_USER_ROLES.AccountCoordinator
  );
});
export const getACArray = createSelector([getACList], (acList) => {
  return acList.toJS();
});

export const getTenantUserList = createSelector(
  [getUsers, getDivisions, getCurrentTenantId],
  (users, divisions, tenantId) => {
    return users
      .filter((user) => user.get('tenantId') === tenantId)
      .map((user) => {
        const authorities = user.get('authorities') || Immutable.List();
        const divisionId = user.get('divisionId');
        let newUser = user;
        if (authorities) {
          newUser = newUser
            .set(
              'isSuperUser',
              authorities.includes(Immutable.Map({ name: 'ROLE_TENANT_ADMIN' }))
            )
            // .set('isAM', authorities.includes(Immutable.Map({ name: "ROLE_ACCOUNT_MANAGER" })))
            // .set('isSales', authorities.includes(Immutable.Map({ name: "ROLE_SALES" })))
            .set(
              'isPrimRecruiter',
              authorities.includes(
                Immutable.Map({ name: 'ROLE_PRIMARY_RECRUITER' })
              )
            )
            .set(
              'isUser',
              authorities.includes(Immutable.Map({ name: 'ROLE_USER' }))
            )
            .set(
              'isLimitedUser',
              authorities.includes(Immutable.Map({ name: 'ROLE_LIMIT_USER' }))
            )
            .set(
              'isHR',
              authorities.includes(Immutable.Map({ name: 'ROLE_HR' }))
            );
        }
        if (divisionId) {
          newUser = newUser.set(
            'divisionName',
            divisions.getIn([divisionId.toString(), 'name'])
          );
        }
        newUser = newUser.set('disabled', !user.get('activated'));
        return newUser;
      })
      .sortBy((user) =>
        (user.get('firstName') || user.get('username')).toLowerCase()
      )
      .sortBy((user) => !user.get('activated'))
      .toList();
  }
);

export const getTenantUserArray = createSelector(
  [getTenantUserList],
  (userList) => {
    return userList.toJS();
  }
);

export const getActiveTenantUserList = createSelector(
  [getTenantUserList],
  (userList) => {
    return userList.filter((user) => user.get('activated'));
  }
);

export const getActiveTenantUserIdList = createSelector(
  [getActiveTenantUserList],
  (userList) => {
    return userList.map((u) => u.get('id'));
  }
);

export const getActiveTenantUserArray = createSelector(
  [getActiveTenantUserList],
  (userList) => {
    return userList.toJS();
  }
);

export const getActiveUserList = createSelector(
  [getTenantUserList, getOldUserId],
  (userList, oldUserId) => {
    return userList.filter(
      (u) => u.get('activated') || u.get('id') === oldUserId
    );
  }
);

export const getLeaderList = createSelector(
  [getActiveTenantUserList],
  (userList) => {
    return userList.filter((user) => user.get('isPrimRecruiter'));
  }
);

export const getAllTenantUserList = createSelector(
  [getUsers, getDivisions, getCurrentTenantId],
  (users, divisions, tenantId) => {
    return users
      .filter((user) => user.get('tenantId') === tenantId)
      .map((user) => {
        const authorities = user.get('authorities') || Immutable.List();
        const divisionId = user.get('divisionId');
        let newUser = user;
        if (authorities) {
          newUser = newUser
            .set(
              'isSuperUser',
              authorities.includes(Immutable.Map({ name: 'ROLE_TENANT_ADMIN' }))
            )
            // .set('isAM', authorities.includes(Immutable.Map({ name: "ROLE_ACCOUNT_MANAGER" })))
            // .set('isSales', authorities.includes(Immutable.Map({ name: "ROLE_SALES" })))
            .set(
              'isPrimRecruiter',
              authorities.includes(
                Immutable.Map({ name: 'ROLE_PRIMARY_RECRUITER' })
              )
            )
            .set(
              'isUser',
              authorities.includes(Immutable.Map({ name: 'ROLE_USER' }))
            )
            .set(
              'isLimitedUser',
              authorities.includes(Immutable.Map({ name: 'ROLE_LIMIT_USER' }))
            )
            .set(
              'isHR',
              authorities.includes(Immutable.Map({ name: 'ROLE_HR' }))
            );
        }
        if (divisionId) {
          newUser = newUser.set(
            'divisionName',
            divisions.getIn([divisionId.toString(), 'name'])
          );
        }
        return newUser;
      })
      .sortBy((user) =>
        (user.get('firstName') || user.get('username')).toLowerCase()
      )
      .sortBy((user) => !user.get('activated'))
      .toList();
  }
);

export const getActiveAMList = createSelector(
  [getAssignedUsers, getActiveTenantUserIdList],
  (users, activeUserIdList) => {
    return users.filter(
      (user) =>
        (user.get('permission') === JOB_USER_ROLES.AccountManager ||
          user.get('permission') === JOB_USER_ROLES.AccountCoordinator) &&
        activeUserIdList.includes(user.get('userId'))
    );
  }
);

export const getActiveAMArray = createSelector([getActiveAMList], (amList) => {
  return amList.toJS();
});
