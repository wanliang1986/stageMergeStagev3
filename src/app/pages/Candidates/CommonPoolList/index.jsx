import React from 'react';
import memoizeOne from 'memoize-one';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { withStyles } from '@material-ui/core';
import Select from '@material-ui/core/Select';

import { SEND_EMAIL_TYPES } from '../../../constants/formOptions';
// import clsx from 'clsx';
import { getResume } from '../../../actions/newCandidate';
import { getQuery } from '../../../selectors/talentSelector';
import { Trans } from 'react-i18next';
import { commonPoolFilterSearch } from '../../../../utils/search';

import {
  ADD_SEND_EMAIL_REQUEST,
  UN_SELECT_STATUS,
  SELECT_TO_STATUS_EMPTY,
  ORDER_STATES_DELETE,
} from '../../../constants/actionTypes';

import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputAdornment from '@material-ui/core/InputAdornment';
import Snackbar from '@material-ui/core/Snackbar';

import MailIcon from '@material-ui/icons/Mail';
import SearchIcon from '@material-ui/icons/Search';

import Loading from '../../../components/particial/Loading';
// import CreateCandidateButton from './CreateCandidateButton';
import AddEmailBlastButton from '../List/AddEmailBlastButton';
import AddTalentsToHotListButton from '../List/AddTalentsToHotListButton';
// import AllTable from '../newList/table/index';
import FromList from './FromList';
import FilterSearch from './FilterSearch';
import CommonPoolDropDown from '../../../components/CommonPoolDropDown';
import CommonPoolToDropDown from '../../../components/CommonPoolToDropDown';

import {
  resetPage,
  CommonPoolGeneral,
  candidateGetMyOrAll,
  commonPoolEmpty,
  candidateCurrentPageModel,
} from '../../../actions/newCandidate';

const status = {};

const styles = {
  flex: {
    display: 'flex',
    alignItems: 'center',
  },
  btn: {
    justifyContent: 'space-between',
  },
  fend: {
    justifyContent: 'flex-end',
  },
  show: {
    color: '#3398dc',
    marginLeft: 10,
    display: 'inline-block',
    width: '94px',
    textAlign: 'center',
    cursor: 'pointer',
  },
  search: {
    padding: '0 10px',
    boxSizing: 'border-box',
    minHeight: '100px',
  },
  horizontalDivider: {
    borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
    display: 'inline-block',
    width: 1,
    height: 32,
    margin: '0 10px',
  },
};

const candidatesOptions = [
  { value: 'UNLOCKED_CANDIDATE', label: 'Unlocked Candidates' },
  { value: 'LOCKED_CANDIDATE', label: 'Locked Candidates' },
  { value: 'All_CANDIDATES', label: 'All Candidates' },
];

const contactOptions = [
  { value: 'hasLinkedIn', label: 'Linkedin' },
  { value: 'hasValidEmail', label: 'Email' },
  { value: 'hasPhone', label: 'Phone' },
];
function strlen(str) {
  var len = 0;
  for (var i = 0; i < str.length; i++) {
    var c = str.charCodeAt(i);
    //单字节加1
    if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
      len++;
    } else {
      len += 2;
    }
  }
  return len;
}
class CandidateListAll extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selected: Immutable.Set(),
      showFilter: true,
      preShowSearchBox: false,
      selectedEmails: null,
      initPage: false,
      orderStatusOpen: false,
      textStateuOpen: false,
      generalSelectValue: '',
    };
  }

  componentDidMount() {
    this.props.dispatch(candidateGetMyOrAll(false));
    // const {
    //   searchLevel,
    //   YesNoSearch,
    //   commonPoolSelectList,
    //   commonPoolSelectListTo,
    //   tableData,
    // } = this.props;
    // if (searchLevel === 'BASE') {
    //   if (
    //     YesNoSearch.length ||
    //     commonPoolSelectList ||
    //     commonPoolSelectListTo.length ||
    //     tableData.length
    //   ) {
    //     this.setState({
    //       initPage: true,
    //     });
    //   } else {
    //     this.setState({
    //       initPage: false,
    //     });
    //   }
    // } else if (searchLevel === 'ADVANCED') {
    //   this.setState({
    //     initPage: true,
    //   });
    // } else {
    //   this.setState({
    //     initPage: true,
    //   });
    // }
    // this.props.dispatch(commonPoolEmpty(this.props.selectData));
    // let selectOne = this.props.selectData.commonPoolSelectList;
    // let selectTo = this.props.selectData.commonPoolSelectListTo;
    // this.props.dispatch({
    //   type: COMMON_SELECT_ONE_VALUE_EMPTY,
    //   payload: selectOne,
    // });
    // this.props.dispatch({
    //   type: COMMON_SELECT_TO_VALUE_EMPTY,
    //   payload: selectTo,
    // });
  }

  componentDidUpdate(preProps) {
    // console.timeEnd('all talents');
    // const {
    //   searchLevel,
    //   YesNoSearch,
    //   commonPoolSelectList,
    //   commonPoolSelectListTo,
    //   tableData,
    // } = this.props;
    // if (searchLevel === 'BASE') {
    //   if (
    //     YesNoSearch.length ||
    //     commonPoolSelectList ||
    //     commonPoolSelectListTo.length ||
    //     tableData.length
    //   ) {
    //     this.setState({
    //       initPage: true,
    //     });
    //   } else {
    //     // this.setState({
    //     //   initPage: false
    //     // })
    //   }
    // } else if (searchLevel === 'ADVANCED') {
    //   this.setState({
    //     initPage: true,
    //   });
    // } else {
    //   this.setState({
    //     initPage: true,
    //   });
    // }
  }

  componentWillUnmount() {
    // this.candidateTask.cancel();
    this.props.dispatch(candidateCurrentPageModel('commonPool'));
  }

  static getDerivedStateFromProps(props, state) {
    // console.log(props, state);

    if (props.showSearchBox !== state.preShowSearchBox) {
      return {
        showFilter: props.showSearchBox,
        preShowSearchBox: props.showSearchBox,
      };
    }
    return null;
  }

  handleSendEmailToTalents = () => {
    const { dispatch, talentData } = this.props;
    console.log(talentData);
    const { selected, selectedEmails } = this.state;
    dispatch({
      type: ADD_SEND_EMAIL_REQUEST,
      request: {
        type: SEND_EMAIL_TYPES.SendEmailToTalents,
        data: {
          talentIds: selected,
          talentList: [],
          emails: talentData
            .filter((d) => selected.includes(d._id))
            .map((t) => t.emails || [])
            .flat()
            .join(','),
        },
      },
    });
  };

  onKeyDown = (e) => {
    if (e.keyCode === 13) {
      // console.log(strlen(e.target.value));
      // let reg = /^.{3,20}$/;
      if (/^\s+$/gi.test(e.target.value)) {
        console.log('不能全为空格');
      }
      if (e.target.value === '') {
        this.props.dispatch(resetPage());
        this.props.dispatch(CommonPoolGeneral(e.target.value));
        this.props.dispatch({
          type: 'GENER_VALUE_TO',
          payload: e.target.value,
        });
      } else {
        // const Chinese = new RegExp('[\u4E00-\u9FA5]+');
        // const English = new RegExp('[A-Za-z]+');
        // strlen方法判断input的值，中文占位符2个，英文占位符1个
        if (strlen(e.target.value) < 3) {
          this.setState({
            textStateuOpen: true,
          });
          setTimeout(() => {
            this.setState({
              textStateuOpen: false,
            });
          }, 2000);
        } else {
          this.props.dispatch(resetPage());
          this.props.dispatch(CommonPoolGeneral(e.target.value));
          this.setState({
            generalSelectValue: e.target.value,
          });
          this.props.dispatch({
            type: 'GENER_VALUE_TO',
            payload: e.target.value,
          });
          // if (Chinese.test(e.target.value)) {
          //   if (e.target.value.length >= 2) {
          //     this.props.dispatch(resetPage());
          //     this.props.dispatch(CommonPoolGeneral(e.target.value));
          //     this.setState({
          //       generalSelectValue: e.target.value,
          //     });
          //     this.props.dispatch({
          //       type: 'GENER_VALUE_TO',
          //       payload: e.target.value,
          //     });
          //   } else {
          //     this.setState({
          //       textStateuOpen: true,
          //     });
          //     setTimeout(() => {
          //       this.setState({
          //         textStateuOpen: false,
          //       });
          //     }, 2000);
          //   }
          // }
          // if (English.test(e.target.value)) {
          //   if (e.target.value.length >= 3) {
          //     this.props.dispatch(resetPage());
          //     this.props.dispatch(CommonPoolGeneral(e.target.value));
          //     this.setState({
          //       generalSelectValue: e.target.value,
          //     });
          //     this.props.dispatch({
          //       type: 'GENER_VALUE_TO',
          //       payload: e.target.value,
          //     });
          //   } else {
          //     this.setState({
          //       textStateuOpen: true,
          //     });
          //     setTimeout(() => {
          //       this.setState({
          //         textStateuOpen: false,
          //       });
          //     }, 2000);
          //   }
          // }
        }
        // if (!reg.test(e.target.value)) {
        //   this.setState({
        //     orderStatusOpen: true,
        //   });
        //   setTimeout(() => {
        //     this.setState({
        //       orderStatusOpen: false,
        //     });
        //   }, 2000);
        // } else {
        //   this.props.dispatch(resetPage());
        //   this.props.dispatch(CommonPoolGeneral(e.target.value));
        //   this.setState({
        //     generalSelectValue: e.target.value,
        //   });
        //   this.props.dispatch({
        //     type: 'GENER_VALUE_TO',
        //     payload: e.target.value,
        //   });
        // }
      }
    }
  };
  generalSearch = (e) => {
    this.props.dispatch({
      type: 'NEW_CANDIDATE_GENERAL',
      payload: e.target.value,
    });
  };
  generalSearchBlur = (e) => {
    console.log(e.target.value);
    console.log(this.state.generalSelectValue);
    console.log(this.props.generalTo);
    const Chinese = new RegExp('[\u4E00-\u9FA5]+');
    const English = new RegExp('[A-Za-z]+');
    if (Chinese.test(e.target.value)) {
      if (e.target.value.length >= 2) {
        console.log(66666);
      } else {
        this.props.dispatch({
          type: 'NEW_CANDIDATE_GENERAL',
          payload: this.state.generalSelectValue,
        });
      }
    }
    if (English.test(e.target.value)) {
      if (e.target.value.length >= 3) {
        console.log(11111);
      } else {
        this.props.dispatch({
          type: 'NEW_CANDIDATE_GENERAL',
          payload: this.state.generalSelectValue,
        });
      }
    }
    if (e.target.value !== this.props.generalTo) {
      this.props.dispatch({
        type: 'NEW_CANDIDATE_GENERAL',
        payload: this.state.generalSelectValue || this.props.generalTo,
      });
    } else {
      this.props.dispatch({
        type: 'NEW_CANDIDATE_GENERAL',
        payload: e.target.value,
      });
    }
    // if (e.target.value === '') {
    //   this.props.dispatch({
    //     type: 'NEW_CANDIDATE_GENERAL',
    //     payload: this.state.generalSelectValue,
    //   });
    // }
  };

  handleShow = () => {
    this.setState({
      showFilter: !this.state.showFilter,
    });
  };

  getSelected = (arr, emails) => {
    this.setState({
      selected: Immutable.Set(arr),
      selectedEmails: emails,
    });
  };

  changeResumeCheck = (e) => {
    this.props.dispatch(getResume(e.target.checked));
  };

  render() {
    console.time('all talents');
    const {
      classes,
      total,
      talentData,
      query,
      general,
      t,
      commonPoolSelectList,
      commonPoolSelectListTo,
      YesNoSearch,
      ...props
    } = this.props;
    console.log('talentData', talentData);
    const { selected, showFilter, initPage, orderStatusOpen, textStateuOpen } =
      this.state;
    return (
      <div className="flex-child-auto flex-container flex-dir-column">
        <div className="flex-container align-justify align-middle">
          <div
            className="flex-container align-middle item-padding"
            style={{
              minHeight: 56,
              flexShrink: 0,
              flexWrap: 'wrap',
            }}
          >
            <div style={{ marginRight: 13 }}>
              <CommonPoolDropDown
                defultOptions={candidatesOptions}
                defultStatus={'1'}
              />
            </div>
            <div style={{ marginRight: 13 }}>
              <CommonPoolToDropDown
                defultOptions={contactOptions}
                defultStatus={'2'}
              />
            </div>
            <Typography variant="subtitle1" className={'item-padding'}>
              {total ? total : 0} {t('common:results')}
            </Typography>
          </div>

          <div style={{ ...styles.flex, ...styles.fend }}>
            <OutlinedInput
              onKeyDown={this.onKeyDown}
              style={{ height: 30, width: 219, background: '#edf5ff' }}
              size="small"
              variant="outlined"
              placeholder={this.props.t('tab:Search Candidates')}
              value={general}
              onChange={(e) => {
                this.generalSearch(e);
                // this.props.dispatch({
                //   type: 'NEW_CANDIDATE_GENERAL',
                //   payload: e.target.value,
                // });
              }}
              onBlur={(e) => this.generalSearchBlur(e)}
              startAdornment={
                <InputAdornment color="disabled" position="start">
                  <SearchIcon style={{ fontSize: 18 }} />
                </InputAdornment>
              }
            />
            <span onClick={this.handleShow} style={{ ...styles.show }}>
              {showFilter
                ? this.props?.t('tab:Hide Filters')
                : this.props?.t('tab:Show Filters')}
            </span>
          </div>
        </div>
        {showFilter ? <FilterSearch /> : <></>}
        <Divider />

        <div className="flex-child-auto">
          <FromList
            history={this.props.history}
            getSelected={this.getSelected}
          />
          {/* {initPage ? (
            <FromList
              history={this.props.history}
              getSelected={this.getSelected}
            />
          ) : (
            <div
              style={{
                width: '100%',
                textAlign: 'center',
                position: 'relative',
                top: '50%',
                transform: 'translateY(-80%)',
                color: '#939393',
                fontSize: '14px',
              }}
            >
              <div
                style={{
                  fontSize: '60px',
                  margin: '20px 0',
                }}
              >
                (˚Δ˚)
              </div>
              <div>No search result</div>
              <div>Please apply filters above to complate search</div>
            </div>
          )} */}
        </div>
        <Snackbar
          open={orderStatusOpen}
          message={'Please enter a minimum of three - digit search criteria'}
        />
        <Snackbar
          open={textStateuOpen}
          message={
            'Please enter a minimum of two digits in Chinese or three digits in English'
          }
        />
      </div>
    );
  }
}

function mapStoreStateToProps(state) {
  const total = state.controller.newCandidateJob.get('count');
  const talentData = state.controller.newCandidateJob.get('tableData');
  const { resume, basicSearch, advancedFilter, general } =
    state.controller.newCandidateJob.toJS();
  const showSearchBox =
    Object.values(basicSearch).some((_item) => !!_item) ||
    Object.values(advancedFilter).length !== 0;
  const selectData = state.controller.newCandidateJob.toJS();
  let { newCandidateJob } = state.controller;
  let searchFilter = newCandidateJob.toJS();
  let { strBox } = commonPoolFilterSearch(searchFilter.basicSearch);
  return {
    total,
    talentData: talentData,
    query: getQuery(state, 'all'),
    resume,
    showSearchBox,
    selectData,
    general,
    YesNoSearch: strBox,
    commonPoolSelectList:
      state.controller.newCandidateJob.toJS().commonPoolSelectList,
    commonPoolSelectListTo:
      state.controller.newCandidateJob.toJS().commonPoolSelectListTo,
    searchLevel: state.controller.newCandidateJob.toJS().searchLevel,
    tableData: state.controller.newCandidateJob.toJS().commonTableData,
    generalTo: state.controller.newCandidateJob.toJS().generalTo,
  };
}

export default connect(mapStoreStateToProps)(
  withStyles(styles)(CandidateListAll)
);
