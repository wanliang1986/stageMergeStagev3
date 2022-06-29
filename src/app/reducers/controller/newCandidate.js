import * as ActionTypes from './../../constants/actionTypes';
import Immutable, { fromJS, toJS } from 'immutable';

const defaultState = fromJS({
  basicSearch: {
    title: null,
    code: null,
    companyName: null,
    type: null,
    locations: null,
    hiringManagerName: null,
    id: null,
    openings: null,
    maxSubmissions: null,
    applies: null,
    interviews: null,
    Languages: null,
  },
  loading: true,
  tableData: [],
  commonTableData: [],
  page: 1,
  size: 25,
  count: 0,
  sort: {},
  selectId: [],
  searchFlag: false,
  candidateDetail: {},
  dialogSelectOption: [],
  dialogSelectID: null,
  dialogAllUser: [],
  dialogRecommendation: [],
  commonPoolSelectList: '',
  commonPoolSelectListTo: [],
  searchLevel: 'BASE',
  advancedFilter: {},
  general: '',
  allOrMy: false,
  resume: false,
  stopFlag: false,
  statusFlag: false,
  pageModel: '',
  orderStatus: [],
  unSelectStatus: false,
  filterArrIndex: [1],
  generalTo: '',
  candidatesIdStatus: false,
});

export default function (state = defaultState, action = {}) {
  switch (action.type) {
    case ActionTypes.NEW_CANDIDATE_SEARCH:
      return state.setIn(
        ['basicSearch', action.payload.type],
        action.payload.value
      );
    case ActionTypes.NEW_CANDIDATE_DELETE:
      return state.setIn(['basicSearch', action.payload.type], null);
    case ActionTypes.NEW_CANDIDATE_LEVEL:
      return state.set('searchLevel', action.payload);
    case ActionTypes.NEW_CANDIDATE_SEARCH_RESET:
      return state.set('basicSearch', defaultState.toJS().basicSearch);
    case ActionTypes.NEW_CANDIDATE_SETIN:
      return state.set('basicSearch', action.payload);

    case ActionTypes.NEW_CANDIDATE_PAGEMODEL:
      return state.set('pageModel', action.payload);

    case ActionTypes.NEW_CANDIDATE_DATA:
      return state.set('tableData', action.payload);

    case ActionTypes.NEW_CANDIDATE_RESTEDATA:
      return state.set('tableData', []);
    case ActionTypes.NEW_CANDIDATE_COMONPOOL_DATA:
      return state.set('commonTableData', action.payload);
    case ActionTypes.NEW_CANDIDATE_COMONPOOL_RESETDATA:
      return state.set('commonTableData', []);
    case ActionTypes.NEW_CANDIDATE_LOADING:
      return state.set('loading', action.payload);

    case ActionTypes.NEW_CANDIDATE_SORT:
      return state.setIn(['sort', action.payload.name], action.payload.value);

    case ActionTypes.NEW_CANDIDATE_ADVANCED:
      return state.set('advancedFilter', action.payload);

    case ActionTypes.NEW_CANDIDATE_RESET_ADVANCED:
      return state.set('advancedFilter', defaultState.toJS().advancedFilter);

    case ActionTypes.NEW_CANDIDATE_ADVANCED_RESET:
      return state.set('advancedFilter', {});

    case ActionTypes.NEW_CANDIDATE_PAGESIZE:
      let newstate = state.set('page', action.payload.page);
      newstate = newstate.set('size', action.payload.size);
      return newstate;
    case ActionTypes.NEW_CANDIDATE_COUNT:
      return state.set('count', action.payload);
    case ActionTypes.NEW_CANDIDATE_COUNT_RESET:
      return state.set('count', 0);
    case ActionTypes.NEW_CANDIDATE_MYORALL:
      return state.set('allOrMy', action.payload);

    case ActionTypes.NEW_CANDIDATE_RESETSORT:
      return state.set('sort', {});

    case ActionTypes.NEW_CANDIDATE_SELECTID:
      return state.set('selectId', action.payload);

    case ActionTypes.NEW_CANDIDATE_SARCHFLAG:
      return state.set('searchFlag', action.payload);

    case ActionTypes.NEW_CANDIDATE_DETAIL:
      return state.set('candidateDetail', action.candidateDetail);
    case ActionTypes.BASIC_INFORMATION_DETAILS:
      return state.set('basicInformationDetail', action.basicInformationDetail);
    case ActionTypes.NEW_CANDIDATE_SELECT_OPTION:
      return state.set('dialogSelectOption', action.payload);
    case ActionTypes.ADDRES_ID:
      return state.set('addredataId', action.id);
    case ActionTypes.NEW_CANDIDATE_SELECT_ID:
      return state.set('dialogSelectID', action.payload);

    case ActionTypes.NEW_CANDIDATE_DIALOG_USER:
      return state.set('dialogAllUser', action.payload);

    case ActionTypes.NEW_CANDIDATE_GENERAL:
      return state.set('general', action.payload);
    case ActionTypes.GENER_VALUE_TO:
      return state.set('generalTo', action.payload);
    case ActionTypes.NEW_CANDIDATE_GENERAL_RESET:
      return state.set('general', '');
    case ActionTypes.NEW_CANDIDATE_RELATIONS:
      return state.set('dialogRecommendation', action.payload);
    case ActionTypes.NEW_CANDIDATE_RESUME:
      return state.set('resume', action.payload);
    case ActionTypes.NEW_CANDIDATE_STOPFLAG:
      return state.set('stopFlag', action.payload);
    case ActionTypes.COMMON_POOL_SELECT_VALUE:
      return state.set('commonPoolSelectList', action.payload);
    case ActionTypes.COMMON_POOL_SELECT_DEFULT_STATUS:
      return state.set('defultStatus', action.payload);
    case ActionTypes.COMMON_POOL_SELECT_TO_VALUE:
      return state.set('commonPoolSelectListTo', action.payload);
    case ActionTypes.COMMON_POOL_DEFULT_STATUS:
      return state.set('commonPoolDefultStatus', action.payload);
    case ActionTypes.COMMON_POOL_DETAIL:
      return state.set('commonPoolDetail', action.payload);
    case ActionTypes.CREDIT_TRAN_SACTION_ID:
      return state.set('creditTransactionId', action.payload);
    case ActionTypes.QUERY_BALANCE:
      return state.set('userMoney', action.payload);
    case ActionTypes.COMMON_POOL_RIGHT_FROM:
      return state.set('commonPoolFrom', action.payload);
    case ActionTypes.ADD_COMMON_POOL_DATA_ID:
      return state.set('addCommonPoolDataetailId', action.payload);
    case ActionTypes.ADD_COMMON_POOL_DATA_TENLENT_ID:
      return state.set('addCommonPoolDataTelentId', action.payload);
    case ActionTypes.PURCHASE_SUCCESS:
      return state.set('tableData', action.payload);
    case ActionTypes.COMMON_SELECT_ONE_VALUE_EMPTY:
      return state.set('commonPoolSelectList', '');
    case ActionTypes.COMMON_SELECT_TO_VALUE_EMPTY:
      return state.set('commonPoolSelectListTo', []);
    case ActionTypes.ADD_COMMON_POOL_EMAIL_STATUS:
      return state.set('addCommonPoolEmailStatus', action.payload);
    case ActionTypes.ADD_REPLACE_STATUS:
      return state.set('statusFlag', action.payload);
    case ActionTypes.ORDER_STATES:
      return state.set('orderStatus', action.payload);
    case ActionTypes.ORDER_STATES_DELETE:
      return state.set('orderStatus', []);
    case ActionTypes.UN_SELECT_STATUS:
      return state.set('unSelectStatus', action.payload);
    case ActionTypes.SELECT_TO_STATUS:
      return state.set('selectToStatus', action.payload);
    case ActionTypes.SELECT_TO_STATUS_EMPTY:
      return state.set('selectToStatus', []);
    case ActionTypes.FILTER_ARR_INDEX:
      return state.set('filterArrIndex', action.payload);
    case ActionTypes.CANDIDATES_ID_STATUS:
      return state.set('candidatesIdStatus', action.payload);
    case ActionTypes.APP_LICATION_ID:
      return state.set('applicationid', action.payload);
    default:
      return state;
  }
}
