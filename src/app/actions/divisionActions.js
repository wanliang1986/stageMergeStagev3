import * as apnSDK from './../../apn-sdk/';
import * as ActionTypes from '../constants/actionTypes';
import { normalize } from 'normalizr';
import { division } from './schemas';

export const getAllDivisionList = () => (dispatch, getState) => {
  return apnSDK.getAllDivisionListByTenantId().then(({ response }) => {
    console.log('division list', response);
    const normalizedData = normalize(response, [division]);
    console.log('normalized', normalizedData);
    dispatch({
      type: ActionTypes.GET_DIVISIONS,
      normalizedData,
    });
  });
  // .catch(err => {
  //
  //     throw err
  // })
};

// export const getDivision = (divisionId) => (dispatch, getState) => {
//
//     return apnSDK.getDivision(divisionId)
//         .then(({ response }) => {
//             console.log('get division : ', response);
//             dispatch({
//                 type: ActionTypes.RECEIVE_DIVISION,
//                 division: response,
//             });
//
//         })
// };

export const upsertDivision =
  (division, divisionId) => (dispatch, getState) => {
    return apnSDK.updateDivision(division, divisionId).then(({ response }) => {
      console.log('upsert division : ', response);
      dispatch({
        type: divisionId ? ActionTypes.EDIT_DIVISION : ActionTypes.ADD_DIVISION,
        division: response,
      });
    });
  };

export const deleteDivision = (divisionId) => (dispatch, getState) => {
  return apnSDK.deleteDivision(divisionId).then(() => {
    dispatch({
      type: ActionTypes.DELETE_DIVISION,
      divisionId,
    });
  });
};
