import * as apnSDK from './../../apn-sdk/';
import * as ActionTypes from '../constants/actionTypes';
import { normalize, schema } from 'normalizr';
import { talentBasic, jobBasic, newCandidateDetail } from './schemas';

import { showErrorMessage } from './';

const hotList = new schema.Entity('hotLists');
const hotListUser = new schema.Entity('hotListUsers');
const hotListTalent = new schema.Entity('hotListTalents', {
  talent: newCandidateDetail,
  job: jobBasic,
});

export const getHotList = (listId) => (dispatch, getState) => {
  return apnSDK
    .getHotList(listId)
    .then(({ response }) => {
      console.log('hotList list', response);

      const normalizedData = normalize(response, hotList);
      dispatch({
        type: ActionTypes.GET_HOT_LIST_LIST,
        normalizedData,
      });
    })
    .catch((err) => dispatch(showErrorMessage(err)));
};

export const getMyHotListList = () => (dispatch, getState) => {
  return apnSDK
    .getMyHotList()
    .then(({ response }) => {
      console.log('my hot-list list', response);

      const normalizedData = normalize(response, [hotList]);
      dispatch({
        type: ActionTypes.GET_HOT_LIST_LIST,
        normalizedData,
      });
    })
    .catch((err) => dispatch(showErrorMessage(err)));
};

export const upseartHotList = (newList, oldListId) => (dispatch, getState) => {
  return apnSDK
    .upseartHotList(newList, oldListId)
    .then(({ response }) => {
      console.log('upsert hotList', response);
      const normalizedData = normalize(response, hotList);
      dispatch({
        type: ActionTypes.UPSERT_HOT_LIST,
        normalizedData,
      });

      return normalizedData.entities.hotLists[normalizedData.result];
    })
    .catch((err) => dispatch(showErrorMessage(err)));
};

export const getHotListUsersByHotListId =
  (hotListId) => (dispatch, getState) => {
    return apnSDK
      .getHotListUsersByHotListId(hotListId)
      .then(({ response }) => {
        console.log('get hot-list users', response);
        const normalizedData = normalize(response, [hotListUser]);
        dispatch({
          type: ActionTypes.RECEIVE_HOT_LIST_USERS,
          normalizedData,
        });
        return response;
      })
      .catch((err) => dispatch(showErrorMessage(err)));
  };

export const updateHotListUsers =
  (users = [], listId) =>
  (dispatch, getState) => {
    const currentUserId = getState().controller.currentUser.get('id');
    if (users.indexOf(currentUserId) === -1) {
      users.push(currentUserId);
    }
    console.log(users);
    return apnSDK
      .updateHotListUsers(users, listId)
      .then(({ response }) => {
        console.log('update hotlist users', response);
        const normalizedData = normalize(response, [hotListUser]);
        dispatch({
          type: ActionTypes.RECEIVE_HOT_LIST_USERS,
          normalizedData,
        });
        return response;
      })
      .catch((err) => dispatch(showErrorMessage(err)));
  };

export const getHotListTalents2 = (hotListId) => (dispatch, getState) => {
  return apnSDK
    .getHotListTalentsByHotListId2(hotListId)
    .then(({ response }) => {
      console.log('get hotlist talents', response);
      const normalizedData = normalize(response, [hotListTalent]);
      console.log('~~~~~~~~~~~!!!!~~~~~~~~~~');
      console.log(normalizedData);
      dispatch({
        type: ActionTypes.GET_HOT_LIST_TALENTS2,
        normalizedData,
      });
      return response;
    })
    .catch((err) => dispatch(showErrorMessage(err)));
};

export const addHotListTalent =
  (hotListId, talentId) => (dispatch, getState) => {
    return apnSDK
      .addHotListTalent(hotListId, talentId)
      .then(({ response }) => {
        console.log('add hotlist talents', response);
        const normalizedData = normalize(response, [talentBasic]);

        dispatch({
          type: ActionTypes.GET_HOT_LIST_TALENTS,
          hotListId: hotListId.toString(),
          normalizedData,
          talentId,
        });
        return response;
      })
      .catch((err) => {
        dispatch(showErrorMessage(err));
        throw err;
      });
  };

export const deleteHotListTalent =
  (hotListId, talentId) => (dispatch, getState) => {
    return apnSDK
      .deleteHotListTalent(hotListId, talentId)
      .then((response) => {
        console.log('delete hotlist talent', response);
        dispatch({
          type: ActionTypes.DELETE_HOT_LIST_TALENT,
          hotListId: hotListId.toString(),
          talentId,
        });
        return response;
      })
      .catch((err) => {
        dispatch(showErrorMessage(err));
      });
  };

export const deleteHotList = (listId) => (dispatch, getState) => {
  const state = getState();
  const hotList = state.relationModel.hotLists.get(String(listId));
  const currentUser = state.controller.currentUser;

  if (
    hotList.get('createdBy') ===
    `${currentUser.get('id')},${currentUser.get('tenant')}`
  ) {
    return apnSDK
      .deleteHotList(listId)
      .then(() => {
        dispatch({
          type: ActionTypes.DELETE_HOT_LIST,
          hotListId: listId.toString(),
        });
      })
      .catch((err) => {
        dispatch(showErrorMessage(err));
      });
  } else {
    dispatch(showErrorMessage('This is not your hotlist'));
  }
};

export const unSubscribeHotList = (hotListUserId, listId) => (dispatch) => {
  return apnSDK
    .deleteHotListUser(hotListUserId)
    .then(() => {
      dispatch({
        type: ActionTypes.DELETE_HOT_LIST,
        hotListId: String(listId),
      });
    })
    .catch((err) => {
      dispatch(showErrorMessage(err));
    });
};
