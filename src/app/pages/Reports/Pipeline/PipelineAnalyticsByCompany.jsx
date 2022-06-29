import React from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import * as ActionTypes from '../../../constants/actionTypes';
import moment from 'moment-timezone';
import {
  makeCancelable,
  sortList,
  getIndexList,
} from '../../../../utils/index';
import { withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

import {
  getPipelineReportByCompany,
  getPipelineReportByCompanyV2,
  getPipelineReportByCompanyUsers,
  getPipelineReportByCompanyExcel,
  getPipelineReportByCompanyFilters,
  getJobCountries,
  getUserCountries,
} from '../../../../apn-sdk/index';
import { countryList } from '../../../constants/formOptions';

import { DateRangePicker } from 'rsuite';
import Select from 'react-select';

import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';

import PotentialButton from '../../../components/particial/PotentialButton';
import ReportTableSummary from '../../../components/Tables/ReportTableSummary';
import ReportsActivity from '../ReportsActivity';
import FormReactSelectContainer from '../../../components/particial/FormReactSelectContainer';
import Loading from '../../../components/particial/Loading';

import CustomToggleButton from '../../../components/particial/CustomToggleButton';
import zhCN from 'rsuite/lib/IntlProvider/locales/zh_CN';
import enUS from 'rsuite/lib/IntlProvider/locales/en_US';
import dateFns from 'date-fns';
import { getRanges } from '../../../../utils';
import {
  styles,
  statusMap,
  pipelineByCompnayColumns as columns,
} from '../params';

class Reports extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      dataList: Immutable.List(),
      range: [dateFns.startOfWeek(new Date()), dateFns.endOfToday()],
      focusedInput: null,

      selectedRecruiter: '',
      recruiterOptions: [{ value: '', label: 'All' }],
      selectedUserCountry: '',
      countryOptions: [{ value: '', label: 'All' }],
      userOptions: [{ value: '', label: 'All' }],
      selectedUserId: '',
      selectedJobCountry: '',

      loading: true,

      filteredIndex: Immutable.List(),
      colSortDirs: {},

      roleOptions: [
        {
          label: 'All',
          value: '',
        },
        {
          label: 'Recruiter',
          value: 'RECRUITER',
        },
        {
          label: 'AM',
          value: 'AM',
        },
        {
          label: 'Sourcer',
          value: 'SOURCER',
        },
      ],
      selectedUserRole: '',
    };

    this.filteredList = Immutable.List();
  }

  componentDidMount() {
    this.fetchData();
    this.getJobCountriesList();
    this.getUsersList();
  }

  getJobCountriesList = () => {
    getJobCountries().then((res) => {
      let arr = res.response.map((item, index) => {
        return { value: item, label: item };
      });
      this.setState({
        countryOptions: this.state.countryOptions.concat(arr),
      });
    });
  };

  getUsersList = () => {
    const { selectedJobCountry, range } = this.state;

    range[1] = dateFns.endOfDay(range[1]);
    const from_date = range[0].toISOString();
    const to_date = range[1].toISOString();

    let curlBody = {
      from_date,
      to_date,
      selectedJobCountry,
    };
    this.setState({
      userOptions: [
        {
          value: '',
          label: 'All',
        },
      ],
      selectedUserId: '',

      selectedUserRole: '',
    });
    getPipelineReportByCompanyUsers(curlBody).then((res) => {
      let arr = res.map((item, index) => {
        return { value: item.id, label: `${item.firstName} ${item.lastName}` };
      });

      console.log(arr);
      this.setState({
        userOptions: this.state.userOptions.concat(arr),
      });
    });
  };

  fetchData = (
    selectedUserRole,
    selectedUserId,
    selectedJobCountry,
    blockTimerPromise = Promise.resolve()
  ) => {
    console.log(selectedUserRole);
    const { range } = this.state;
    range[1] = dateFns.endOfDay(range[1]);
    const from_date = range[0].toISOString();
    const to_date = range[1].toISOString();
    this.candidateTask = makeCancelable(
      getPipelineReportByCompanyV2({
        from_date,
        to_date,
        selectedUserRole,
        selectedUserId,
        selectedJobCountry,
      })
    );

    // getPipelineReportByCompany({
    //   from_date,
    //   to_date,
    //   selectedRecruiter,
    //   selectedUserCountry,
    //   selectedJobCountry,
    // })
    this.candidateTask.promise
      .then((data) => {
        const { colSortDirs } = this.state;
        const dataList = Immutable.fromJS(data);

        let footerData = data.reduce(
          (res, value) => {
            if (value.appliedActivityId) {
              res.appliedActivityId = res.appliedActivityId.union(
                Immutable.List(value.appliedActivityId.split(','))
              );
            }
            if (value.submittedActivityId) {
              res.submittedActivityId = res.submittedActivityId.union(
                Immutable.List(value.submittedActivityId.split(','))
              );
            }
            if (value.pipelineUpdateSubmittedActivityId) {
              res.pipelineUpdateSubmittedActivityId =
                res.pipelineUpdateSubmittedActivityId.union(
                  Immutable.List(
                    value.pipelineUpdateSubmittedActivityId.split(',')
                  )
                );
            }
            if (value.interviewActivityId) {
              res.interviewActivityId = res.interviewActivityId.union(
                Immutable.List(value.interviewActivityId.split(','))
              );
            }
            if (value.offeredActivityId) {
              res.offeredActivityId = res.offeredActivityId.union(
                Immutable.List(value.offeredActivityId.split(','))
              );
            }
            if (value.offerAcceptedActivityId) {
              res.offerAcceptedActivityId = res.offerAcceptedActivityId.union(
                Immutable.List(value.offerAcceptedActivityId.split(','))
              );
            }
            if (value.startedActivityId) {
              res.startedActivityId = res.startedActivityId.union(
                Immutable.List(value.startedActivityId.split(','))
              );
            }
            return res;
          },
          {
            appliedActivityId: Immutable.Set(),
            submittedActivityId: Immutable.Set(),
            pipelineUpdateSubmittedActivityId: Immutable.Set(),
            interviewActivityId: Immutable.Set(),
            offeredActivityId: Immutable.Set(),
            offerAcceptedActivityId: Immutable.Set(),
            startedActivityId: Immutable.Set(),
            // candidateQuitCount: 0,
            // clientRejectedCount: 0,
            // offerRejectedCount: 0,
            // shortlistedByClientCount: 0,
          }
        );
        footerData = {
          company: this.props.t('tab:Grand Total'),
          appliedCount: footerData.appliedActivityId.size,
          appliedActivityId: footerData.appliedActivityId.join(','),
          submittedCount: footerData.submittedActivityId.size,
          submittedActivityId: footerData.submittedActivityId.join(','),
          pipelineUpdateSubmittedCount:
            footerData.pipelineUpdateSubmittedActivityId.size,
          pipelineUpdateSubmittedActivityId:
            footerData.pipelineUpdateSubmittedActivityId.join(','),
          interviewCount: footerData.interviewActivityId.size,
          interviewActivityId: footerData.interviewActivityId.join(','),
          offeredCount: footerData.offeredActivityId.size,
          offeredActivityId: footerData.offeredActivityId.join(','),
          offerAcceptedCount: footerData.offerAcceptedActivityId.size,
          offerAcceptedActivityId: footerData.offerAcceptedActivityId.join(','),
          startedCount: footerData.startedActivityId.size,
          startedActivityId: footerData.startedActivityId.join(','),
        };

        console.log('footerData::::', footerData);
        let filteredIndex = getIndexList(dataList);
        const columnKey = Object.keys(colSortDirs)[0];
        if (columnKey) {
          // const preIndex = filteredIndex.pop();
          let sortDir = colSortDirs[columnKey];
          filteredIndex = sortList(filteredIndex, dataList, columnKey, sortDir);
        }

        blockTimerPromise.then(() =>
          this.setState({
            loading: false,
            dataList,
            filteredIndex,
            footerData: Immutable.Map(footerData),
          })
        );
      })
      .catch((reason) => {
        if (reason.isCanceled) {
          console.log('isCanceled');
        } else {
          console.log(reason);
          this.setState({ loading: false });
        }
      });
  };

  downloadData = () => {
    const { range, selectedUserRole, selectedUserId, selectedJobCountry } =
      this.state;
    range[1] = dateFns.endOfDay(range[1]);
    const from_date = range[0].toISOString();
    const to_date = range[1].toISOString();
    const { dispatch } = this.props;

    this.setState({ generating: true });
    getPipelineReportByCompanyExcel({
      from_date,
      to_date,
      selectedUserRole,
      selectedUserId,
      selectedJobCountry,
    })
      .catch(() =>
        dispatch({
          type: ActionTypes.ADD_MESSAGE,
          message: {
            type: 'error',
            message: 'There is no data to download.',
          },
        })
      )
      .finally(() => this.setState({ generating: false }));
  };

  handleDateRangeChange = (range) => {
    const { selectedUserRole, selectedUserId, selectedJobCountry } = this.state;
    this.setState({ range }, () => {
      this.fetchData(
        selectedUserRole,
        selectedUserId,
        selectedJobCountry,
        this._blockTimer()
      );

      this.getUsersList();
    });
  };

  handleJobCountryChange = (selectedJobCountry) => {
    selectedJobCountry = selectedJobCountry || '';
    this.setState({ selectedJobCountry }, () => {
      const { selectedUserRole, selectedUserId, selectedJobCountry } =
        this.state;
      this.fetchData(
        selectedUserRole,
        selectedUserId,
        selectedJobCountry,
        this._blockTimer()
      );
      this.getUsersList();
    });
  };

  handleClickActivityCount = ({
    activityId,
    company,
    recruiter,
    activityStatus,
  }) => {
    const title = `Pipeline(${statusMap[activityStatus]}) Details of ${
      company || ''
    } ${recruiter || ''}`;
    const { range } = this.state;
    let start = moment(range[0]);
    let end = moment(range[1]);
    const html = `presented between ${start.format(
      'MM/DD/YYYY'
    )} and ${end.format('MM/DD/YYYY')}`;
    this.setState({
      openActivityDetail: { activityId, title, range: html, activityStatus },
    });
  };

  _blockTimer = (time = 400) => {
    clearTimeout(this.bTimer);
    this.setState({ loading: true });
    return new Promise((resolve) => {
      this.bTimer = setTimeout(resolve, time);
    });
  };

  _formatUserName = (user) => {
    if (!user) {
      return '';
    }
    return user.firstName && user.lastName
      ? user.firstName + ' ' + user.lastName
      : user.username;
  };

  onSortChange = (columnKey, sortDir) => {
    const { filteredIndex, dataList } = this.state;
    // const preIndex = filteredIndex.pop();

    let indexList;
    indexList = sortDir
      ? sortList(filteredIndex, dataList, columnKey, sortDir)
      : getIndexList(dataList);

    this.setState({
      filteredIndex: indexList,
      colSortDirs: {
        [columnKey]: sortDir,
      },
    });
  };

  handleCloseDialog = () => {
    this.setState({ openActivityDetail: null });
  };

  //单选role add by bill
  handleUserRoleChange = (selectedUserRole) => {
    console.log(selectedUserRole);
    // 如果role选择全部 那么userId 也需要被重置
    if (!selectedUserRole) {
      this.setState({
        selectedUserId: '',
      });
    }

    this.setState(
      {
        selectedUserRole,
      },
      () => {
        const { selectedUserRole, selectedUserId, selectedJobCountry } =
          this.state;
        this.fetchData(
          selectedUserRole,
          selectedUserId,
          selectedJobCountry,
          this._blockTimer()
        );
      }
    );
  };

  handleUserChange = (selectedUserId) => {
    // 如果user选择全部 则UserRole默认选择成Recruiter
    if (!selectedUserId) {
      this.setState({
        selectedUserRole: '',
      });
    } else {
      // 如果user 选择的不是全部 是具体的某一个人
      // 而且selectedUserRole也为空 则自动选择默认的Role-RECRUITER
      if (!this.state.selectedUserRole) {
        this.setState({
          selectedUserRole: 'RECRUITER',
        });
      }
    }

    this.setState(
      {
        selectedUserId,
      },
      () => {
        const { selectedUserRole, selectedUserId, selectedJobCountry } =
          this.state;
        this.fetchData(
          selectedUserRole,
          selectedUserId,
          selectedJobCountry,
          this._blockTimer()
        );
      }
    );
  };

  render() {
    const { t, classes, i18n } = this.props;
    const {
      dataList,
      selectedRecruiter,
      recruiterOptions,
      selectedUserCountry,
      selectedJobCountry,
      countryOptions,
      loading,
      openActivityDetail,
      filteredIndex,
      colSortDirs,
      range,

      // role
      roleOptions,
      selectedUserRole,

      // user
      userOptions,
      selectedUserId,
    } = this.state;
    const isZH = i18n.language.match('zh');
    const filteredList = filteredIndex.map((index) => dataList.get(index));
    if (!this.filteredList.equals(filteredList)) {
      this.filteredList = filteredList;
    }

    return (
      <Paper
        className={clsx(
          'flex-child-auto flex-container flex-dir-column',
          classes.root
        )}
      >
        <div>
          <Typography variant="h5" className="item-padding">
            {t('tab:Pipeline Analytics by Company')}
          </Typography>

          <div
            className={clsx('horizontal-layout align-bottom', classes.actions)}
          >
            <div style={{ zIndex: 111 }}>
              <div>
                <FormReactSelectContainer
                  label={t('field:Pipeline Presented Date')}
                />
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
              </div>
            </div>

            <div>
              <div style={{ minWidth: 168, height: 53 }}>
                <FormReactSelectContainer label={t('field:Job country')}>
                  <Select
                    value={selectedJobCountry}
                    options={countryOptions}
                    simpleValue
                    onChange={this.handleJobCountryChange}
                    autoBlur={true}
                    // searchable={false}
                    clearable={false}
                  />
                </FormReactSelectContainer>
              </div>
            </div>

            {/* 新增user  */}
            <div>
              <div style={{ minWidth: 168, height: 53 }}>
                <FormReactSelectContainer label={t('field:User')}>
                  <Select
                    value={selectedUserId}
                    options={userOptions}
                    onChange={this.handleUserChange}
                    autoBlur={true}
                    simpleValue
                    clearable={false}
                  />
                </FormReactSelectContainer>
              </div>
            </div>

            {/* 新增 单选role select */}
            <div>
              <div style={{ minWidth: 150, height: 53 }}>
                <FormReactSelectContainer label={t('field:Role')}>
                  <Select
                    disabled={selectedUserId ? false : true}
                    value={selectedUserRole}
                    options={roleOptions}
                    simpleValue
                    onChange={this.handleUserRoleChange}
                    autoBlur
                    clearable={false}
                  />
                </FormReactSelectContainer>
              </div>
            </div>

            <div className="flex-child-auto" />
            <PotentialButton
              onClick={this.downloadData}
              processing={this.state.generating}
            >
              {t('common:download')}
            </PotentialButton>
          </div>
        </div>

        <Divider />
        <div className={clsx('flex-child-auto', classes.contentContainer)}>
          {loading ? (
            <div
              className={clsx(
                'flex-container flex-dir-column',
                classes.contentMask
              )}
            >
              <Loading />
            </div>
          ) : (
            <ReportTableSummary
              dataList={this.filteredList}
              columns={columns}
              onClickActivity={this.handleClickActivityCount}
              colSortDirs={colSortDirs}
              onSortChange={this.onSortChange}
              footerData={this.state.footerData}
            />
          )}
        </div>
        <Dialog
          open={!!openActivityDetail}
          onClose={this.handleCloseDialog}
          fullWidth
          maxWidth="md"
        >
          <ReportsActivity
            t={t}
            {...openActivityDetail}
            onRequestClose={this.handleCloseDialog}
          />
        </Dialog>
      </Paper>
    );
  }
}

Reports.propTypes = {
  t: PropTypes.func.isRequired,
};

export default withTranslation(['tab', 'action', 'field', 'message'])(
  connect()(withStyles(styles)(Reports))
);
