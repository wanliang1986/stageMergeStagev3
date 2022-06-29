import * as ActionTypes from './../../constants/actionTypes';

export default function (state = '', action) {
  switch (action.type) {
    case ActionTypes.TAB_SELECT:
      return (state = action.selectedTab);
    default:
      return state;
  }
}
