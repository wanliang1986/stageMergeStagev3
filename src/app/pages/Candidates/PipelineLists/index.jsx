import { withStyles } from '@material-ui/core';
import React, { Component } from 'react';
import { getRanges } from '../../../../utils';
import zhCN from 'rsuite/lib/IntlProvider/locales/zh_CN';
import enUS from 'rsuite/lib/IntlProvider/locales/en_US';
import Grid from '@material-ui/core/Grid';
import FormReactSelectContainer from '../../../components/particial/FormReactSelectContainer';
import CustomToggleButton from '../../../components/particial/CustomToggleButton';
import { DateRangePicker } from 'rsuite';
import dateFns from 'date-fns';
import PipelineDropDown from '../../../components/PipelineDropDown';
import PipelineButtonGroup from './pipelineButtonGroup';
import FilterLists from './FilterLists';
import {
  userRoles,
  jobType as newJobType,
  JOB_TYPES,
  getJobTypeLabel,
} from '../../../constants/formOptions';
import Button from '@material-ui/core/Button';
import PipelineList from '../../../components/Tables/PipelineList';
import { connect } from 'react-redux';
import {
  getPipelineList,
  getMyPipelineTemplate,
  getDict,
  putPipelineTemplate,
} from '../../../actions/myPipelineActions';
import Loading from '../../../components/particial/Loading';
import lodash from 'lodash';
import moment from 'moment-timezone';
import { showSuccessMessage } from '../../../actions';
import * as ActionTypes from '../../../constants/actionTypes';
const styles = {
  root: {
    width: '100%',
    height: '100%',
    padding: '10px',
    boxSizing: 'border-box',
  },
  filterBox: {
    width: '100%',
    minHeight: '60px',
    marginTop: '10px',
    padding: '10px',
    backgroundColor: '#fafafb',
  },
  pipelineList: {
    width: '100%',
    height: '550px',
    position: 'relative',
    marginTop: '20px',
  },
};

const filterList = [
  { title: 'Name', key: 'candidateName' },
  { title: 'Job Title', key: 'jobTitle' },
  { title: 'Company', key: 'companyName' },
  { title: 'Status', key: 'status' },
  { title: 'Location', key: 'jobLocation' },
  { title: 'Email', key: 'email' },
  { title: 'Skills', key: 'jobSkill' },
  { title: 'Recruiter', key: 'recruiterName' },
  { title: 'HR Coordinate', key: 'hrName' },
  { title: 'Hiring Manager', key: 'hmName' },
  { title: 'Job ID', key: 'jobId' },
];

class PipelineLists extends Component {
  constructor(props) {
    super(props);
    this.state = {
      range: this.props.mainFilters.range
        ? this.props.mainFilters.range
        : [dateFns.startOfWeek(new Date()), dateFns.endOfToday()],
      filterShow: true,
      userRole: this.props.mainFilters.userRole
        ? this.props.mainFilters.userRole
        : ['RECRUITER'],
      jobType: this.props.mainFilters.jobType
        ? this.props.mainFilters.jobType
        : ['FULL_TIME'],
      pageSize: this.props.mainFilters.pageSize
        ? this.props.mainFilters.pageSize
        : 10,
      pageNum: this.props.mainFilters.pageNum
        ? this.props.mainFilters.pageNum
        : 1,
      totalPages: null,
      myPipeline: null,
      isLoading: false,
      selectTemplate: null,
      hrList: null,
      hmList: null,
      recruiterList: null,
      totalItems: 0,
    };
  }

  componentDidMount() {
    this.props.dispatch(getDict());
    this.props.dispatch(getMyPipelineTemplate());
    this.fetchData();
  }

  fetchData = () => {
    this.setState({ isLoading: true });
    const { selectFilters } = this.props;
    const { range, userRole, jobType, pageNum, pageSize } = this.state;
    let _fromDate = moment(range[0]).format('YYYY-MM-DDTHH:mm:ss[Z]');
    let _endDate = moment(range[1]).format('YYYY-MM-DDTHH:mm:ss[Z]');
    let filter1 = {
      range: range,
      userRole: userRole,
      jobType: jobType,
      pageSize: pageSize,
      pageNum: pageNum,
    };
    this.props.dispatch({
      type: ActionTypes.RECEIVE_PIPELINE_MAIN_FILTER,
      filters: filter1,
    });
    let obj = {
      userRole: userRole,
      jobType: jobType,
      pageSize: pageSize,
      pageNum: pageNum,
      fromDate: _fromDate,
      endDate: _endDate,
    };
    if (selectFilters.jobId) {
      selectFilters.jobId = Number(selectFilters.jobId);
    }
    let data = { ...obj, ...selectFilters };
    this.props.dispatch(getPipelineList(data)).then((res) => {
      if (res) {
        let _hr = [];
        let _recruiter = [];
        let _hm = [];
        let data = res.response.data;
        data.forEach((item, i) => {
          let obj1 = {};

          let obj3 = {};
          let index = _hr.indexOf(item.hrName);
          if (index === -1 && item.hrName !== null) {
            obj1.value = item.hrName;
            obj1.label = item.hrName;
            _hr.push(obj1);
          }
          item.recruiterName.forEach((i, index) => {
            let _index = _recruiter.indexOf(i);
            let obj2 = {};
            if (_index === -1) {
              obj2.value = i;
              obj2.label = i;
              _recruiter.push(obj2);
            }
          });
          let _index1 = _hm.indexOf(item.hmName);
          if (_index1 === -1 && item.hmName !== null) {
            obj3.value = item.hmName;
            obj3.label = item.hmName;
            _hm.push(obj3);
          }
        });

        this.setState({
          isLoading: false,
          myPipeline: res.response.data,
          totalPages: res.response.totalPages,
          totalItems: res.response.totalItems,
          hrList: this.unique(_hr),
          hmList: this.unique(_hm),
          recruiterList: this.unique(_recruiter),
        });
      }
    });
  };

  unique = (arr) => {
    const res = new Map();
    return arr.filter((a) => !res.has(a.value) && res.set(a.value, 1));
  };

  handleDateRangeChange = (range) => {
    range[1] = dateFns.endOfDay(range[1]);
    this.setState({ range, pageNum: 1 }, () => {
      this.fetchData();
    });
  };

  rolesSelect = (arr) => {
    let _arr = lodash.clone(arr);
    let index = _arr.indexOf('All');
    if (index > -1) {
      let list = _arr.filter((item, index) => {
        if (item !== 'All') {
          return item;
        }
      });
      this.setState(
        {
          userRole: list,
          pageNum: 1,
        },
        () => {
          this.fetchData();
        }
      );
    } else {
      this.setState(
        {
          userRole: arr,
          pageNum: 1,
        },
        () => {
          this.fetchData();
        }
      );
    }
  };
  jobTypeSelect = (arr) => {
    let _arr = lodash.clone(arr);
    let index = _arr.indexOf('All');
    if (index !== -1) {
      let list = _arr.filter((item, index) => {
        if (item !== 'All') {
          return item;
        }
      });
      this.setState(
        {
          jobType: list,
          pageNum: 1,
        },
        () => {
          this.fetchData();
        }
      );
    } else {
      this.setState(
        {
          jobType: arr,
          pageNum: 1,
        },
        () => {
          this.fetchData();
        }
      );
    }
  };
  filtersShow = () => {
    this.setState({
      filterShow: !this.state.filterShow,
    });
  };

  setPageNum = (num) => {
    this.setState(
      {
        pageNum: num + 1,
      },
      () => {
        this.fetchData();
      }
    );
  };
  setPageSize = (num) => {
    this.setState(
      {
        pageSize: num,
      },
      () => {
        this.fetchData();
      }
    );
  };

  EditorTemplate = () => {
    const { selectTemplate } = this.state;
    const { columns } = this.props;
    let obj = {
      id: selectTemplate.id,
      itemSortAll: JSON.stringify(columns),
      tempName: selectTemplate.tempName,
    };
    this.props.dispatch(putPipelineTemplate(obj)).then((res) => {
      if (res === 'OK') {
        this.props.dispatch(
          showSuccessMessage(
            `Tempalte ${selectTemplate.tempName} edited successfully`
          )
        );
        this.props.dispatch(getMyPipelineTemplate());
      }
    });
  };

  getSelectTemplate = (template) => {
    this.setState({
      selectTemplate: template,
    });
  };

  // componentWillUnmount(){
  //   this.props.dispatch({
  //     type: ActionTypes.CLEAR_FILTERS,
  //   });
  // }
  setNewPageNum = () => {
    this.setState(
      {
        pageNum: 1,
      },
      () => {
        this.fetchData();
      }
    );
  };

  render() {
    const { classes, t, i18n, userList, columns, mainFilters, templateList } =
      this.props;
    const {
      range,
      filterShow,
      myPipeline,
      isLoading,
      selectTemplate,
      hrList,
      hmList,
      recruiterList,
      totalItems,
    } = this.state;
    const isZH = i18n.language.match('zh');
    return (
      <div className={classes.root}>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Grid container spacing={1}>
              <Grid item xs={2}>
                <FormReactSelectContainer>
                  <DateRangePicker
                    value={range}
                    ranges={getRanges(t)}
                    cleanable={false}
                    toggleComponentClass={CustomToggleButton}
                    size="md"
                    style={{ height: 32 }}
                    block
                    onChange={this.handleDateRangeChange}
                    placeholder={t('message:selectDateRange')}
                    locale={isZH ? zhCN.DateRangePicker : enUS.DateRangePicker}
                  />
                </FormReactSelectContainer>
              </Grid>
              <Grid item xs={3}>
                <PipelineDropDown
                  options={userRoles}
                  defaultSelected={
                    mainFilters.userRole ? mainFilters.userRole : ['RECRUITER']
                  }
                  defaultSelectedLabel={['Recruiter']}
                  defaultSelect={['RECRUITER']}
                  selected={(arr) => {
                    this.rolesSelect(arr);
                  }}
                />
              </Grid>
              <Grid item xs={5}>
                <PipelineDropDown
                  options={newJobType}
                  defaultSelected={
                    mainFilters.jobType
                      ? mainFilters.jobType
                      : [JOB_TYPES.FullTime]
                  }
                  defaultSelectedLabel={[getJobTypeLabel(JOB_TYPES.FullTime)]}
                  defaultSelect={[JOB_TYPES.FullTime]}
                  selected={(arr) => {
                    this.jobTypeSelect(arr);
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={6}>
            <Grid container spacing={1} justify="flex-end">
              <Grid item xs={8} style={{ textAlign: 'right' }}>
                <PipelineButtonGroup
                  getSelectTemplate={(template) => {
                    this.getSelectTemplate(template);
                  }}
                />
              </Grid>
              {selectTemplate && templateList.size > 0 && (
                <Grid item xs={2} style={{ textAlign: 'right' }}>
                  <Button
                    color="primary"
                    onClick={() => {
                      this.EditorTemplate();
                    }}
                  >
                    Editor Template
                  </Button>
                </Grid>
              )}
              <Grid item xs={2} style={{ textAlign: 'right' }}>
                <Button
                  color="primary"
                  onClick={() => {
                    this.filtersShow();
                  }}
                >
                  {filterShow
                    ? this.props?.t('tab:Hide Filters')
                    : this.props?.t('tab:Show Filters')}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        {filterShow && (
          <div className={classes.filterBox}>
            <FilterLists
              filterList={filterList}
              hrList={hrList}
              hmList={hmList}
              recruiterList={recruiterList}
              setNewPageNum={() => {
                this.setNewPageNum();
              }}
              fetchData={() => {
                this.fetchData();
              }}
            />
          </div>
        )}
        <div className={classes.pipelineList}>
          {isLoading ? (
            <div
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(1,1,1,0.1)',
                position: 'absolute',
                zIndex: '100',
              }}
            >
              <Loading style={{ width: '100%', height: '100%' }} />
            </div>
          ) : null}
          <PipelineList
            t={t}
            rowData={myPipeline}
            pageSize={mainFilters.pageSize}
            pageNum={mainFilters.pageNum}
            totalItems={totalItems}
            fetchData={() => {
              this.fetchData();
            }}
            setPageNum={(num) => {
              this.setPageNum(num);
            }}
            setPageSize={(num) => {
              this.setPageSize(num);
            }}
          />
        </div>
      </div>
    );
  }
}

const mapStoreStateToProps = (state) => {
  let filters = state.controller.myPipelineFilter;
  let columns = state.controller.pipelineTemplate;
  let mainFilters = state.controller.pipelineMainFilter;
  let templateList = state.controller.pipelineTemplateList;
  return {
    selectFilters: filters,
    templateList: templateList,
    columns: columns,
    mainFilters: mainFilters,
  };
};

export default connect(mapStoreStateToProps)(withStyles(styles)(PipelineLists));
