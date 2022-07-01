import { createSelector } from 'reselect';
// import Immutable from 'immutable';
const getCompanyId = (_, companyId) => parseInt(companyId, 10);
const getTeams = (state) => state.relationModel.teams;
const getProgramTeams = (state) => state.relationModel.programTeams;

const getTeamList = createSelector([getTeams], (teams) => {
  return teams
    .sortBy(
      (team) => team.get('id'),
      (a, b) => {
        if (a < b) {
          return -1;
        }
        if (a > b) {
          return 1;
        }
        if (a === b) {
          return 0;
        }
      }
    )
    .toList();
});

export const getProgramTeamList = createSelector(
  [getProgramTeams, getCompanyId],
  (teams, companyId) => {
    return teams
      .filter((team) => team.get('companyId') === companyId)
      .sortBy(
        (team) => team.get('id'),
        (a, b) => {
          if (a < b) {
            return -1;
          }
          if (a > b) {
            return 1;
          }
          if (a === b) {
            return 0;
          }
        }
      )
      .toList();
  }
);

export default getTeamList;
