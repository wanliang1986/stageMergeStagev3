import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import {
  makeCancelable,
  sortList,
  getIndexList,
  getRanges,
} from '../../../../utils/index';
import { withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import {
  getAllDivisionListByTenantId,
  getReportActivitiesByUsers,
  getReportActivitiesByUsersExcel,
  getTeamList,
} from '../../../../apn-sdk';
import { jobType as jobTypeOptions } from '../../../constants/formOptions';
import zhCN from 'rsuite/lib/IntlProvider/locales/zh_CN';
import enUS from 'rsuite/lib/IntlProvider/locales/en_US';
import dateFns from 'date-fns';

import { DateRangePicker } from 'rsuite';
import Select from 'react-select';

import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';

import ReportTableSummary from '../../../components/Tables/ReportTableSummary';
import ReportsActivity from '../ReportsActivity';
import FormReactSelectContainer from '../../../components/particial/FormReactSelectContainer';
import Loading from '../../../components/particial/Loading';
import CustomToggleButton from '../../../components/particial/CustomToggleButton';
import PipelineColumsGroup from '../../../components/Tables/ColumnGroups/Pipeline';
import CustomAutoComplete from '../../../components/particial/CustomAutoComplete/WithCheckBox';
import ForbiddenPage from '../../../components/ForbiddenPage';

import {
  styles,
  statusMap,
  pipelineByRecruiterColumns as columns,
} from '../params';
import { showErrorMessage } from '../../../actions';
import { withTranslation } from 'react-i18next';

import GetAppIcon from '@material-ui/icons/GetApp';

const status = {};

const styles_inside = {
  downLoadIcon: {
    position: 'absolute',
    marginTop: 25,
    right: '2%',
    color: 'rgb(170, 177, 184)',
    fontSize: '25px',
    cursor: 'pointer',
  },
};

class Reports extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      range: status.range || [
        dateFns.startOfMonth(new Date()),
        dateFns.endOfToday(),
      ],

      selectedDivision: '',
      divisionOptions: [{ value: '', label: 'All' }],
      selectedTeam: '',
      teamOptions: [{ value: '', label: 'All' }],

      selectedUser: '',
      userOptions: [{ id: '', fullName: 'All' }],
      filteredUserOptions: [{ id: '', fullName: 'All' }],

      jobTypes: status.jobTypes || jobTypeOptions,
      jobTypeOptions,

      loading: true,
      dataList: Immutable.List(),
      filteredIndex: Immutable.List(),
      colSortDirs: { null: 'null' },

      recruiter: true,
      am: false,
      sourcer: false,

      otherColumns: [
        {
          name: 'User',
          width: 180,
        },

        {
          name: 'Submission & Screening',
          width: 185 + 200,
        },
        {
          name: 'Pipeline Updates',
          width: 135 + 185 + 150,
        },
      ],

      roleOptions: [
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

      selectedRole: 'RECRUITER',
    };

    this.filteredList = Immutable.List();
  }

  componentDidMount() {
    this.fetchData();
    this.fetchGroupOptions();
  }

  componentWillUnmount(): void {
    this.task.cancel();
    status.range = this.state.range;
    status.jobTypes = this.state.jobTypes;
  }

  fetchGroupOptions = () => {
    Promise.all([
      getTeamList().catch((err) => ({ response: [] })),
      getAllDivisionListByTenantId().catch((err) => ({ response: [] })),
    ]).then(([{ response: teams }, { response: divisions }]) => {
      // console.log(teams, divisions);
      let users = this.props.briefUsers;
      this.setState({
        teamOptions: [{ value: '', label: 'All' }].concat(
          teams.map((team) => {
            team.users = team.users.map((user) => user.id);
            team.value = `${team.id}`;
            team.label = `${team.name}`;
            return team;
          })
        ),
        divisionOptions: [{ value: '', label: 'All' }].concat(
          divisions.map((division) => {
            division.value = `${division.id}`;
            division.label = division.name;
            return division;
          })
        ),
        userOptions: [{ id: '', fullName: 'All' }].concat(
          users
            .filter((u) => u.activated)
            .map((u) => {
              u.fullName =
                u.firstName && u.lastName
                  ? `${u.firstName} ${u.lastName}`
                  : u.username;
              return u;
            })
            .sort((a, b) => {
              a = a.fullName.toLowerCase().trim();
              b = b.fullName.toLowerCase().trim();
              if (a > b) {
                return 1;
              }
              if (a < b) {
                return -1;
              }
              if (a === b) {
                return 0;
              }
            })
        ),
      });
    });
  };

  fetchData = (blockTimerPromise = Promise.resolve()) => {
    const {
      range,
      selectedTeam,
      selectedDivision,
      recruiter,
      am,
      selectedUser,
      sourcer,
      jobTypes,
    } = this.state;
    if (this.task) {
      this.task.cancel();
    }

    let userParams = '';
    if (recruiter) {
      userParams += '&userRole=RECRUITER';
    }
    if (am) {
      userParams += '&userRole=AM';
    }
    if (sourcer) {
      userParams += '&userRole=SOURCER';
    }
    if (selectedUser) {
      userParams += `&userId=${selectedUser}`;
    }
    if (jobTypes && jobTypes.length > 0) {
      jobTypes.forEach((jobType) => {
        userParams += `&jobTypes=${jobType.value}`;
      });
    }

    const fromDate = range[0].toISOString();
    const toDate = range[1].toISOString();

    this.task = makeCancelable(
      getReportActivitiesByUsers({
        fromDate,
        toDate,
        teamId: selectedTeam.value || '',
        divisionId: selectedDivision.value || '',
        userParams,
      })
    );
    this.task.promise
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
          userName: this.props.t('tab:Grand Total'),
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
        // console.log(footerData);
        let filteredIndex = getIndexList(dataList);
        const columnKey = Object.keys(colSortDirs)[0];
        if (columnKey) {
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
      .catch((err) => {
        if (!err.isCanceled) {
          this.props.dispatch(showErrorMessage(err));
          this.setState({ loading: false });
        }
      });
  };

  downloadData = () => {
    const {
      range,
      selectedTeam,
      selectedDivision,
      selectedUser,
      recruiter,
      am,
      sourcer,
      jobTypes,
    } = this.state;
    let userParams = '';
    if (recruiter) {
      userParams += '&userRole=RECRUITER';
    }
    if (am) {
      userParams += '&userRole=AM';
    }
    if (sourcer) {
      userParams += '&userRole=SOURCER';
    }
    if (selectedUser) {
      userParams += `&userId=${selectedUser}`;
    }
    if (jobTypes && jobTypes.length > 0) {
      jobTypes.forEach((jobType) => {
        userParams += `&jobTypes=${jobType.value}`;
      });
    }
    const { dispatch } = this.props;
    const fromDate = range[0].toISOString();
    const toDate = range[1].toISOString();
    this.setState({ generating: true });
    getReportActivitiesByUsersExcel({
      fromDate,
      toDate,
      teamId: selectedTeam.value || '',
      divisionId: selectedDivision.value || '',
      userParams,
    })
      .catch((err) => dispatch(showErrorMessage(err)))
      .finally(() => this.setState({ generating: false }));
  };

  handleDateRangeChange = (range) => {
    range[1] = dateFns.endOfDay(range[1]);
    this.setState({ range }, () => {
      status.range = this.state.range;
      this.fetchData(this._blockTimer());
    });
  };

  handleTeamChange = (selectedTeam) => {
    selectedTeam = selectedTeam || '';
    if (selectedTeam !== this.state.selectedTeam) {
      let filteredUserOptions = [{ id: '', fullName: 'All' }];
      if (selectedTeam && selectedTeam.value) {
        filteredUserOptions = filteredUserOptions.concat(
          this.state.userOptions.filter((user) =>
            selectedTeam.users.includes(user.id)
          )
        );
      }

      this.setState(
        {
          selectedTeam,
          selectedDivision: '',
          filteredUserOptions,
          selectedUser: '',
        },
        () => {
          this.fetchData(this._blockTimer());
        }
      );
    }
  };

  handleDivisionChange = (selectedDivision) => {
    selectedDivision = selectedDivision || '';
    if (selectedDivision !== this.state.selectedDivision) {
      let filteredUserOptions = [{ id: '', fullName: 'All' }];
      if (selectedDivision && selectedDivision.value) {
        filteredUserOptions = filteredUserOptions.concat(
          this.state.userOptions.filter(
            (user) => user.divisionId === selectedDivision.id
          )
        );
      }

      this.setState(
        {
          selectedDivision,
          selectedTeam: '',
          filteredUserOptions,
          selectedUser: '',
        },
        () => {
          this.fetchData(this._blockTimer());
        }
      );
    }
  };

  handleUserChange = (selectedUser) => {
    this.setState(
      {
        selectedUser: selectedUser || '',
      },
      () => {
        this.fetchData(this._blockTimer());
      }
    );
  };

  handleClickActivityCount = ({ activityId, activityStatus }) => {
    const { range } = this.state;
    const title = `Pipeline(${statusMap[activityStatus]}) Details`;
    let rangeStr = '';
    if (activityStatus === 'interview') {
      rangeStr = `Date of Updated to Interview: ${dateFns.format(
        range[0],
        'MM/DD/YYYY'
      )} - ${dateFns.format(range[1], 'MM/DD/YYYY')}`;
    } else {
      rangeStr = `Date Range: ${dateFns.format(
        range[0],
        'MM/DD/YYYY'
      )} -${dateFns.format(range[1], 'MM/DD/YYYY')}`;
    }

    this.setState({
      openActivityDetail: {
        activityId,
        title,
        range: rangeStr,
        activityStatus,
      },
    });
  };

  _blockTimer = (time = 400) => {
    clearTimeout(this.bTimer);
    this.setState({ loading: true });
    return new Promise((resolve) => {
      this.bTimer = setTimeout(resolve, time);
    });
  };

  onSortChange = (columnKey, sortDir) => {
    const { filteredIndex, dataList } = this.state;
    const indexList = sortDir
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

  // 多选
  handleUserRoleChange = (e) => {
    const { recruiter, am, sourcer } = this.state;
    const value = recruiter + am + sourcer;
    if (!e.target.checked && value === 1) {
      return;
    }
    this.setState(
      {
        [e.target.name]: e.target.checked,
      },
      () => {
        this.fetchData(this._blockTimer());
      }
    );
  };

  //单选 add by bill
  handleUserRoleChange2 = (checkedRole) => {
    this.setState(
      {
        selectedRole: checkedRole,

        am: checkedRole === 'AM' ? true : false,
        recruiter: checkedRole === 'RECRUITER' ? true : false,
        sourcer: checkedRole === 'SOURCER' ? true : false,
      },
      () => {
        this.fetchData(this._blockTimer());
      }
    );
  };

  handleJobTypeChange = (jobTypes) => {
    this.setState(
      {
        jobTypes,
      },
      () => {
        this.fetchData(this._blockTimer());
      }
    );
  };

  render() {
    const { t, i18n, classes, userRole } = this.props;
    const isZH = i18n.language.match('zh');
    const {
      loading,
      openActivityDetail,
      filteredIndex,
      colSortDirs,
      dataList,
      range,
      selectedTeam,
      teamOptions,
      selectedDivision,
      divisionOptions,
      selectedUser,
      filteredUserOptions,
      userOptions,
      otherColumns,
      roleOptions,
      selectedRole,
      jobTypes,
      jobTypeOptions,
    } = this.state;

    const filteredList = filteredIndex.map((index) => dataList.get(index));
    if (!this.filteredList.equals(filteredList)) {
      this.filteredList = filteredList;
    }
    if (userRole === 'normal') {
      return <ForbiddenPage />;
    }

    return (
      <Paper
        className={clsx(
          'flex-child-auto flex-container flex-dir-column',
          classes.root
        )}
      >
        <div>
          <div className={classes.actionsContainer}>
            <Typography variant="h5">
              {t('tab:Pipeline Analytics by User')}
              {/* update by bill in 2021/7/14 */}
              <Typography style={{ color: '#808a94' }}>
                {t(
                  'tab:This report demonstrates employee’s candidate-submission workload and candidates’ pipeline update.'
                )}
              </Typography>
            </Typography>
          </div>
          <Divider />

          <div
            className={clsx('horizontal-layout align-bottom', classes.actions)}
          >
            <div>
              <FormReactSelectContainer label={t('tab:Date Range')}>
                {/* t('field:Status Modified Date') */}
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
            </div>
            {userRole === 'admin' && (
              <>
                <div>
                  <div style={{ minWidth: 228, height: 53 }}>
                    <FormReactSelectContainer label={t('tab:Division')}>
                      {/* t('field:Office') */}
                      <Select
                        value={selectedDivision}
                        options={divisionOptions}
                        // simpleValue
                        onChange={this.handleDivisionChange}
                        autoBlur
                        clearable={false}
                      />
                    </FormReactSelectContainer>
                  </div>
                </div>
              </>
            )}
            <div>
              <div style={{ minWidth: 168, height: 53 }}>
                <FormReactSelectContainer label={t('field:Team')}>
                  <Select
                    value={selectedTeam}
                    options={teamOptions}
                    onChange={this.handleTeamChange}
                    // simpleValue
                    autoBlur
                    clearable={false}
                  />
                </FormReactSelectContainer>
              </div>
            </div>
            <div>
              <div style={{ minWidth: 168, height: 53 }}>
                <FormReactSelectContainer label={t('field:User')}>
                  <Select
                    valueKey="id"
                    labelKey="fullName"
                    value={selectedUser}
                    options={
                      (selectedTeam && selectedTeam.value) ||
                      (selectedDivision && selectedDivision.value)
                        ? filteredUserOptions
                        : userOptions
                    }
                    onChange={this.handleUserChange}
                    autoBlur={true}
                    simpleValue
                    clearable={false}
                  />
                </FormReactSelectContainer>
              </div>
            </div>

            <div>
              {/* 新增 单选role select */}
              <div>
                <div style={{ minWidth: 150, height: 53 }}>
                  <FormReactSelectContainer label={t('field:Role')}>
                    {/* t('field:Office') */}
                    <Select
                      value={selectedRole}
                      options={roleOptions}
                      simpleValue
                      onChange={this.handleUserRoleChange2}
                      autoBlur
                      clearable={false}
                    />
                  </FormReactSelectContainer>
                </div>
              </div>

              {/* 初始多选role */}
              {/* <FormControl component="fieldset">
                <div className={classes.checkboxes}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={this.state.recruiter}
                        onChange={this.handleUserRoleChange}
                        name="recruiter"
                        color="primary"
                      />
                    }
                    label="Recruiter"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={this.state.am}
                        onChange={this.handleUserRoleChange}
                        name="am"
                        color="primary"
                      />
                    }
                    label="AM"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={this.state.sourcer}
                        onChange={this.handleUserRoleChange}
                        name="sourcer"
                        color="primary"
                      />
                    }
                    label="Sourcer"
                  />
                </div>
              </FormControl> */}
              {/* 下载按钮 */}
              <GetAppIcon
                style={styles_inside.downLoadIcon}
                onClick={this.downloadData}
                // processing={this.state.generating}
              />
            </div>

            <div>
              <div style={{ width: 250, height: 53 }}>
                <FormReactSelectContainer label={t('field:Service Type')}>
                  <CustomAutoComplete
                    value={jobTypes}
                    options={jobTypeOptions}
                    onChange={this.handleJobTypeChange}
                  />
                </FormReactSelectContainer>
              </div>
            </div>
          </div>
        </div>

        {/* <Divider /> */}
        {/* 新增一列 thead */}
        <PipelineColumsGroup columns={otherColumns} />
        <div className={clsx('flex-child-auto', classes.contentContainer)}>
          <ReportTableSummary
            dataList={this.filteredList}
            columns={columns}
            onClickActivity={this.handleClickActivityCount}
            colSortDirs={colSortDirs}
            onSortChange={this.onSortChange}
            footerData={this.state.footerData}
          />

          {loading && (
            <div
              className={clsx(
                'flex-container flex-dir-column',
                classes.contentMask
              )}
            >
              <Loading />
            </div>
          )}
        </div>

        <Dialog
          open={!!openActivityDetail}
          onClose={this.handleCloseDialog}
          fullWidth
          maxWidth="lg"
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

function mapStateToProps(state) {
  let userRole = 'normal';
  const authorities = state.controller.currentUser.get('authorities');
  if (authorities) {
    if (
      authorities.includes(Immutable.Map({ name: 'ROLE_PRIMARY_RECRUITER' }))
    ) {
      userRole = 'leader';
    }
    if (
      authorities.includes(Immutable.Map({ name: 'PRIVILEGE_REPORT' })) ||
      authorities.includes(Immutable.Map({ name: 'ROLE_TENANT_ADMIN' }))
    ) {
      userRole = 'admin';
    }
  }
  return {
    userRole,
    briefUsers: state.controller.newCandidateJob.toJS().dialogAllUser,
  };
}

export default withTranslation(['tab', 'action', 'field', 'message'])(
  connect(mapStateToProps)(withStyles(styles)(Reports))
);
