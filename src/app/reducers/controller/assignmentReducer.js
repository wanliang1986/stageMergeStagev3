import * as ActionTypes from './../../constants/actionTypes';
import Immutable, { fromJS, toJS } from 'immutable';

const defaultState = fromJS({
  assignmentBasicInfor: {},
  assignmentDetail: {},
  assignmentBillLists: {},
  assignmentPayLists: [],
  assignmentCurrentList: [],
  assignmentLastDetail: {},
});

export default function (state = defaultState, action = {}) {
  switch (action.type) {
    case ActionTypes.RECEIVE_ASSIGNMENT_BASIC_INFO:
      return state.set('assignmentBasicInfor', action.basicInfo);
    case ActionTypes.RECEIVE_ASSIGNMENT_DETAIL:
      return state.set('assignmentDetail', action.detail);
    case ActionTypes.RECEIVE_ASSIGNMENT_CURRENT_LIST:
      return state.set('assignmentCurrentList', action.list);
    case ActionTypes.RECEIVE_PAY_LIST:
      return state.set('assignmentPayLists', action.list);
    case ActionTypes.RECEIVE_LAST_ASSIGNMENT_DETAIL:
      return state.set('assignmentLastDetail', action.detail);
    default:
      return state;
  }
}
