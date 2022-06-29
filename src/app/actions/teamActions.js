import * as apnSDK from './../../apn-sdk/';
import * as ActionTypes from '../constants/actionTypes';
import { normalize, schema } from 'normalizr';
import { showErrorMessage } from './index';
import { miniUser, jobBasic } from './schemas';
// const user = new schema.Entity('users');
const team = new schema.Entity('teams', {
  // users: [user]
});

export const getTeamList = () => (dispatch, getState) => {
  return apnSDK
    .getTeamList()
    .then(({ response }) => {
      console.log('teamList', response);
      const normalizedData = normalize(response, [team]);
      console.log('normalizedData', normalizedData);
      dispatch({
        type: ActionTypes.GET_TEAM_LIST,
        normalizedData,
      });
    })
    .catch((err) => {
      dispatch({
        type: ActionTypes.ADD_MESSAGE,
        message: {
          type: 'error',
          message: err.message ? JSON.stringify(err.message) : err,
        },
      });
    });
};

export const upseartTeam = (newTeam, oldTeam) => (dispatch, getState) => {
  return apnSDK
    .upseartTeam(newTeam, oldTeam.get('id'))
    .then(({ response }) => {
      console.log('upsert Team', response);
      response.users = oldTeam.get('users').toJS();
      dispatch({
        type: ActionTypes.UPSERT_TEAM,
        team: response,
      });

      return response;
    })
    .catch((err) => dispatch(showErrorMessage(err)));
};

export const updateTeamUsers =
  (users = [], teamId) =>
  (dispatch, getState) => {
    return apnSDK
      .updateTeamUser(users, teamId)
      .then(({ response }) => {
        console.log('upsert Team', response);
        dispatch({
          type: ActionTypes.UPSERT_TEAM,
          team: response,
        });
        return response;
      })
      .catch((err) => dispatch(showErrorMessage(err)));
  };

export const deleteTeam = (teamId) => (dispatch, getState) => {
  return apnSDK
    .deleteTeam(teamId)
    .then(() => {
      dispatch({
        type: ActionTypes.DELETE_TEAM,
        teamId: teamId.toString(),
      });
    })
    .catch((err) => {
      dispatch({
        type: ActionTypes.ADD_MESSAGE,
        message: {
          type: 'error',
          message: err.message ? JSON.stringify(err.message) : err,
        },
      });
    });
};

export const getAssignedUserJob = (userId) => (dispatch, getState) => {
  return apnSDK
    .getAssignedUserJob(userId)
    .then(({ response }) => {
      response.forEach((value) => {
        if (value.type === 'FULL_TIME') {
          value.type = 'Recruiting';
        }
        if (value.type === 'CONTRACT') {
          value.type = 'Staffing';
        }
      });
      const normalizedData = normalize(response, [jobBasic]);
      dispatch({
        type: ActionTypes.RECEIVE_OPENJOBSBYCOMPANY,
        tab: 'my',
        normalizedData,
      });
    })
    .catch((err) => {
      dispatch({
        type: ActionTypes.FAILURE_OPENJOBSBYCOMPANY,
        tab: 'my',
      });
      throw err;
    });
};
