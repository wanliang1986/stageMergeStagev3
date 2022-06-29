import * as ActionTypes from '../../constants/actionTypes';

const defaultSate = {
  tree: null,
};

export default function (state = defaultSate, action = {}) {
  let newState = JSON.parse(JSON.stringify(defaultSate));
  switch (action.type) {
    case ActionTypes.POTENTIAL_SERVICE_TYPE_TREE:
      newState.tree = action.tree;
      return newState;
    default:
      return state;
  }
}
