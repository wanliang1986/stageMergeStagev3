import { createSelector } from 'reselect';

const getTalentId = (_, talentId) => parseInt(talentId, 10);
const getTalentOwnerships = (state) => state.model.talentOwnerships;
const getUsers = (state) => state.model.users;

export const getTalentOwnerList = createSelector(
  [getTalentId, getTalentOwnerships, getUsers],
  (talentId, ownerships, users) => {
    return ownerships
      .map((ownership) =>
        ownership.set('user', users.get(String(ownership.get('userId'))))
      )
      .filter(
        (ownership) =>
          ownership.get('talentId') === talentId &&
          ownership.get('ownershipType') === 'OWNER'
      )
      .sortBy((ownerships) => ownerships.getIn(['user', 'firstName']))
      .toList();
  }
);

export const getTalentShareList = createSelector(
  [getTalentId, getTalentOwnerships, getUsers],
  (talentId, ownerships, users) => {
    return ownerships
      .map((ownership) =>
        ownership.set('user', users.get(String(ownership.get('userId'))))
      )
      .filter(
        (ownership) =>
          ownership.get('talentId') === talentId &&
          ownership.get('ownershipType') === 'SHARE'
      )
      .sortBy((ownerships) => ownerships.getIn(['user', 'firstName']))
      .toList();
  }
);
