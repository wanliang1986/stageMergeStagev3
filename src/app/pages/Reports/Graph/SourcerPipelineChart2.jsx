import React from 'react';
// import PropTypes from 'prop-types';
// import Immutable from 'immutable';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import {
  getNewPipelineReport,
  getTeamList,
  getAllDivisionListByTenantId,
  getNewPipelineReportBySubmittedDate,
} from '../../../../apn-sdk';
import { showErrorMessage } from '../../../actions';
import zhCN from 'rsuite/lib/IntlProvider/locales/zh_CN';
import enUS from 'rsuite/lib/IntlProvider/locales/en_US';
import { makeCancelable } from '../../../../utils';
import dateFns from 'date-fns';

import { Bar } from 'react-chartjs-2';
import { DateRangePicker } from 'rsuite';
import Select from 'react-select';

import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import FormControl from '@material-ui/core/FormControl';
import Checkbox from '@material-ui/core/Checkbox';

import ActivityTable from './ActivityTable';
import FormReactSelectContainer from '../../../components/particial/FormReactSelectContainer';
import PotentialButton from '../../../components/particial/PotentialButton';
import ScrollContainer from '../../../components/particial/ScrollContainer';
import CustomToggleButton from '../../../components/particial/CustomToggleButton';

const statusOptions = [
  {
    value: 'applied',
    label: 'Submitted to AM',
    color: '#ff6384',
  },
  {
    value: 'submitted',
    label: 'Submitted to Client',
    color: '#36a2eb',
  },
  // {
  //   value: 'shortlistedByClient',
  //   label: 'Shortlisted By Client',
  //   color: '#28ebe0'
  // },
  {
    value: 'interview',
    label: 'Interview',
    color: '#cc65fe',
  },
  {
    value: 'offered',
    label: 'Offered',
    color: '#ffce56',
  },
  {
    value: 'offerAccepted',
    label: 'Offer Accepted',
    color: '#ffae41',
  },
  {
    value: 'started',
    label: 'On board',
    color: '#26ff23',
  },
  // {
  //   value: 'candidateQuit',
  //   label: 'Candidate Quit',
  //   color: '#485049'
  // },
  // {
  //   value: 'clientRejected',
  //   label: 'Client Rejected',
  //   color: '#485049'
  // },
  // {
  //   value: 'offerRejected',
  //   label: 'Offer Rejected',
  //   color: '#485049'
  // }
];
const chartOptions = {
  legend: {
    display: false,
  },
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
          stepSize: 1,
        },

        stacked: true,
      },
    ],
    xAxes: [
      {
        stacked: true,
        gridLines: {
          display: false,
        },
      },
    ],
  },
  layout: {
    padding: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
  },
  events: ['click'],
  tooltips: {
    // enabled: false
  },
  hover: {
    mode: 'nearest',
  },
};
const userRoleOptions = [
  {
    value: 'SOURCER',
    label: 'Sourcer',
  },
  {
    value: 'RECRUITER',
    label: 'Recruiter',
  },
  {
    value: 'AM',
    label: 'Account Manager',
  },
];
const ranges = [
  {
    label: 'This Month',
    value: [dateFns.startOfMonth(new Date()), dateFns.endOfToday()],
  },
  {
    label: 'Last 3 Months',
    value: [
      dateFns.addMonths(dateFns.startOfToday(), -3),
      dateFns.endOfToday(),
    ],
  },
  {
    label: 'Year to Date',
    value: [dateFns.startOfYear(new Date()), dateFns.endOfToday()],
  },
];

const styles = {
  root: {
    overflow: 'auto',
    position: 'relative',
    '& $mask': {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      background: 'rgba(255,255,255,.2)',
    },
  },

  actionsContainer: {
    margin: '10px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mask: {},

  scrollContainer: {
    overflowY: 'overlay',
    overflowX: 'hidden',
    paddingRight: 8,
    flex: 1,
  },
  shadowTop: {
    position: 'absolute',
    zIndex: 111,
    top: 0,
    left: 1,
    right: 1,
    height: 8,
    background: `linear-gradient(rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0) 100%)`,
    opacity: 0,
  },
  shadowBottom: {
    position: 'absolute',
    zIndex: 111,
    bottom: 0,
    left: 1,
    right: 1,
    background: `linear-gradient(to top, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0) 100%)`,
    height: 8,
    opacity: 0,
  },
};

class ChartWithTable extends React.Component {
  constructor(props) {
    super(props);

    chartOptions.onClick = this.chartClickHandler;

    this.state = {
      range: [dateFns.startOfMonth(new Date()), dateFns.endOfToday()],

      loading: true,

      selectedGroup: '',
      groupOptions: [{ value: '', label: 'All' }],

      selectedUser: '',
      userOptions: [{ id: '', fullName: 'Grand Total' }],
      filteredUserOptions: [{ id: '', fullName: 'Grand Total' }],
      userRole: userRoleOptions[0].value,

      recruiter: true,
      am: false,
      sourcer: false,

      type: 'applicationCurrentStatus', // 'applicationAllStatus'

      data: null,

      chartData: {
        labels: [],
        datasets: [],
      },

      index: 0,
      datasetIndex: 0,

      selectedStatus: '',
      options: chartOptions,
    };

    this.chart = React.createRef();
  }

  chartClickHandler = (e, elements) => {
    console.log('selected', elements);
    if (elements[0]) {
      const { _index, _datasetIndex } = elements[0];
      this.setState({
        selectedStatus: statusOptions[_index].value,
        index: _index,
        datasetIndex: _datasetIndex,
      });
    } else {
      this.setState({
        selectedStatus: '',
      });
    }
  };

  componentDidMount() {
    const { range } = this.state;
    this.fetchData(range);
    this.fetchUserOptions();
    this.fetchGroupOptions();
  }
  componentWillUnmount(): void {
    this.task.cancel();
  }

  fetchUserOptions = () => {
    const userOptions = this.props.briefUsers
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
      });
    this.setState({
      userOptions: [{ id: '', fullName: 'Grand Total' }].concat(userOptions),
    });
  };

  fetchGroupOptions = () => {
    Promise.all([
      getTeamList().catch((err) => ({ response: [] })),
      getAllDivisionListByTenantId().catch((err) => ({ response: [] })),
    ]).then(([{ response: teams }, { response: divisions }]) => {
      // console.log(teams, divisions);

      this.setState({
        groupOptions: [{ value: '', label: 'All' }].concat(
          teams.map((team) => {
            team.users = team.users.map((user) => user.id);
            team.type = 'team';
            team.value = `&teamId=${team.id}`;
            team.label = `Team ${team.name}`;
            return team;
          }),
          divisions.map((division) => {
            division.value = `&divisionId=${division.id}`;
            division.type = 'division';
            division.label = division.name;
            return division;
          })
        ),
      });
    });
  };

  fetchData = (
    range,
    userId,
    userRole,
    blockTimerPromise = Promise.resolve()
  ) => {
    const fromDate = range[0].toISOString();
    const toDate = range[1].toISOString();
    let userParams = '';
    if (userId) {
      userParams = `userId=${userId}`;
      const { recruiter, am, sourcer } = this.state;
      if (recruiter) {
        userParams += '&userRoles=RECRUITER';
      }
      if (am) {
        userParams += '&userRoles=AM';
      }
      if (sourcer) {
        userParams += '&userRoles=SOURCER';
      }
    } else {
      userParams = this.state.selectedGroup.value || '';
    }
    if (this.task) {
      this.task.cancel();
    }
    this.task = makeCancelable(
      getNewPipelineReportBySubmittedDate({ fromDate, toDate, userParams })
    );
    this.task.promise
      .then(({ response }) => {
        blockTimerPromise.then(() =>
          this.setState({
            loading: false,
            data: response,
            selectedStatus: '',
            chartData: this.getChartData(response, this.state.type),
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

  getChartData = (data, type) => {
    return data
      ? {
          labels: statusOptions.map((status) => status.label),
          datasets: [
            {
              data: statusOptions.map(
                (status) => data[type][`${status.value}Count`]
              ),
              backgroundColor: statusOptions.map((status) => status.color),
              borderColor: statusOptions.map((status) => status.color),
            },
          ],
        }
      : {
          labels: [],
          datasets: [],
        };
  };

  handleDateRangeChange = (range) => {
    range[1] = dateFns.endOfDay(range[1]);
    this.setState({ range }, () => {
      if (range.length) {
        const { selectedUser, userRole } = this.state;
        this.fetchData(range, selectedUser, userRole, this._blockTimer());
      } else {
        this.setState({
          chartData: {
            labels: [],
            datasets: [],
          },
          data: null,
          selectedStatus: '',
        });
      }
    });
  };

  handleUserChange = (selectedUser) => {
    this.setState(
      {
        selectedUser: selectedUser || '',
      },
      () => {
        const { range, selectedUser, userRole } = this.state;
        if (range.length) {
          this.fetchData(range, selectedUser, userRole, this._blockTimer());
        }
      }
    );
  };

  handleGroupChange = (selectedGroup) => {
    // console.log(selectedGroup);
    let filteredUserOptions = [{ id: '', fullName: 'Grand Total' }];
    if (selectedGroup) {
      if (selectedGroup.type === 'team') {
        filteredUserOptions = filteredUserOptions.concat(
          this.state.userOptions.filter((user) =>
            selectedGroup.users.includes(user.id)
          )
        );
      } else if (selectedGroup.type === 'division') {
        filteredUserOptions = filteredUserOptions.concat(
          this.state.userOptions.filter(
            (user) => user.divisionId === selectedGroup.id
          )
        );
      }
    }
    this.setState(
      {
        selectedGroup: selectedGroup || '',
        selectedUser: '',
        filteredUserOptions,
      },
      () => {
        const { range, selectedUser, userRole } = this.state;
        if (range.length) {
          this.fetchData(range, selectedUser, userRole, this._blockTimer());
        }
      }
    );
  };

  handleUserRoleChange2 = (e) => {
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
        const { range, selectedUser, userRole } = this.state;
        if (range.length) {
          this.fetchData(range, selectedUser, userRole, this._blockTimer());
        }
      }
    );
  };

  handleTypeChange = (event) => {
    this.setState(
      {
        type: event.target.checked
          ? 'applicationAllStatus'
          : 'applicationCurrentStatus',
        selectedStatus: '',
      },
      () => {
        this.setState({
          chartData: this.getChartData(this.state.data, this.state.type),
        });
      }
    );
  };

  downloadCanvas = (
    e,
    filename = 'Pipeline Analytics by Submitted Date.png'
  ) => {
    const link = e.currentTarget;
    const canvas = this.chart.current.chartInstance.canvas;
    link.href = canvas.toDataURL();
    link.download = filename;
  };

  _blockTimer = (time = 400) => {
    this.setState({ loading: true });
    return new Promise((resolve) => {
      this.bTimer = setTimeout(resolve, time);
    });
  };

  handleChange = (key) => () => {};

  render() {
    const {
      loading,
      range,

      selectedGroup,
      groupOptions,
      selectedUser,
      userOptions,
      filteredUserOptions,
      // userRole,

      data,
      type,
      chartData,
      options,
      selectedStatus,
    } = this.state;

    const { t, i18n, classes } = this.props;
    const isZH = i18n.language.match('zh');

    return (
      <Paper
        className="flex-child-auto flex-container flex-dir-column"
        style={{ overflow: 'hidden' }}
      >
        <div>
          <div className={classes.actionsContainer}>
            <Typography variant="h5">
              {t('message:Pipeline Analytics per Submittal Perspective')}
            </Typography>
            <PotentialButton component="a" onClick={this.downloadCanvas}>
              Download as image
            </PotentialButton>
          </div>
          <Divider />
          <div
            className="horizontal-layout align-bottom"
            style={{
              minHeight: 40,
              padding: 8,
              flexWrap: 'wrap',
            }}
          >
            <div>
              <FormReactSelectContainer label={t('field:Sourced Date')}>
                <DateRangePicker
                  value={range}
                  ranges={ranges}
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
            <div>
              <div style={{ minWidth: 198, height: 53 }}>
                <FormReactSelectContainer label={t('field:Team/Office')}>
                  <Select
                    value={selectedGroup}
                    options={groupOptions}
                    onChange={this.handleGroupChange}
                    autoBlur={true}
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
                      selectedGroup && selectedGroup.value
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
              <FormControl component="fieldset">
                <div className={classes.checkboxes}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={this.state.recruiter || !selectedUser}
                        onChange={this.handleUserRoleChange2}
                        name="recruiter"
                        color="primary"
                        disabled={!selectedUser}
                      />
                    }
                    label="Recruiter"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={this.state.am || !selectedUser}
                        onChange={this.handleUserRoleChange2}
                        name="am"
                        color="primary"
                        disabled={!selectedUser}
                      />
                    }
                    label="AM"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={this.state.sourcer || !selectedUser}
                        onChange={this.handleUserRoleChange2}
                        name="sourcer"
                        color="primary"
                        disabled={!selectedUser}
                      />
                    }
                    label="Sourcer"
                  />
                </div>
              </FormControl>
            </div>
            <div className="flex-child-auto" />
            <div>
              <FormControlLabel
                control={
                  <Switch
                    checked={type === 'applicationAllStatus'}
                    onChange={this.handleTypeChange}
                    color="primary"
                  />
                }
                label={'Show All Status'}
              />
            </div>
          </div>
        </div>
        <div
          className={clsx(
            classes.root,
            'flex-child-auto flex-container flex-dir-column'
          )}
        >
          <ScrollContainer classes={classes}>
            <div className="container-padding">
              <div
                className="chart-container"
                style={{
                  position: 'relative',
                  maxWidth: 1200,
                  cursor: 'pointer',
                }}
              >
                <Bar
                  data={chartData}
                  options={options}
                  width={600}
                  height={150}
                  ref={this.chart}
                />
              </div>
            </div>

            <div className="container-padding">
              <div
                className="flex-container flex-dir-column"
                style={{
                  height: 500,
                  outline: '1px solid lightgray',
                  overflow: 'hidden',
                }}
              >
                <ActivityTable
                  activityId={
                    (data && data[type][`${selectedStatus}ActivityId`]) || ''
                  }
                  activityStatus={selectedStatus}
                />
              </div>
            </div>
          </ScrollContainer>

          {loading && <div className={classes.mask} />}
        </div>
      </Paper>
    );
  }
}

function mapStateToProps(state) {
  return {
    briefUsers: state.controller.newCandidateJob.toJS().dialogAllUser,
  };
}

export default withTranslation(['tab', 'action', 'field', 'message'])(
  connect(mapStateToProps)(withStyles(styles)(ChartWithTable))
);
