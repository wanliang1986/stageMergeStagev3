import * as apnSDK from './../../apn-sdk/';
import * as ActionTypes from '../constants/actionTypes';
import { normalize, schema } from 'normalizr';

const myCandidates = new schema.Entity('myCandidates', {});

export const getDBMyCandidateList =
  (start, end, recruiter, am, sourcer) => (dispatch, getState) => {
    return apnSDK
      .getDBMyCandidateList(start, end, recruiter, am, sourcer)
      .then(({ response }) => {
        const normalizedData = normalize(response, [myCandidates]);
        console.log('normalized', normalizedData);
        dispatch({
          type: ActionTypes.RECEIVE_DASHBOARD_MYCANDIDATES,
          normalizedData,
        });
        return response;
      })
      .catch((err) => {
        throw err;
      });
  };
