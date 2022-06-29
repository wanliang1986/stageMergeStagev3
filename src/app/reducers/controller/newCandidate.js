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
  interviewIndex: null, //这个参数是流程当中回显看是点击的第几次面试
  positionPageSection: [], //流程部分提交至job获取页面配置信息
  recruitmentProcessId: null, //流程第一步通过api获取这个id
  editFlag: false, //此时是否是编辑还是新增 true是编辑，false是新增
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

    case ActionTypes.NEW_CANDIDATE_SELECT_OPTION:
      return state.set('dialogSelectOption', action.payload);

    case ActionTypes.NEW_CANDIDATE_SELECT_ID:
      return state.set('dialogSelectID', action.payload);

    case ActionTypes.NEW_CANDIDATE_DIALOG_USER:
      return state.set('dialogAllUser', action.payload);

    case ActionTypes.NEW_CANDIDATE_GENERAL:
      return state.set('general', action.payload);
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
    case ActionTypes.EDIT_INTERVIEW_INDEX:
      return state.set('interviewIndex', action.payload);
    case ActionTypes.APPLICATION_POSITION_SECTION:
      return state.set('positionPageSection', action.payload);
    case ActionTypes.APPLICATION_RECRUITMENTID_GET:
      return state.set('recruitmentProcessId', action.payload);
    case ActionTypes.APPLICATION_EDITFLAG:
      return state.set('editFlag', action.payload);
    default:
      return state;
  }
}
