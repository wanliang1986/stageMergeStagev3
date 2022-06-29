import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import moment from 'moment-timezone';
import { withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

import { Bar } from 'react-chartjs-2';
import { DateRangePicker } from 'rsuite';
import Select from 'react-select';

import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

import ActivityTable from './ActivityTable';
import FormReactSelectContainer from '../../../components/particial/FormReactSelectContainer';
import PotentialButton from '../../../components/particial/PotentialButton';
import CustomToggleButton from '../../../components/particial/CustomToggleButton';
import zhCN from 'rsuite/lib/IntlProvider/locales/zh_CN';
import enUS from 'rsuite/lib/IntlProvider/locales/en_US';
import dateFns from 'date-fns';
import { getRanges } from '../../../../utils';
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
    value: 'started',
    label: 'On board',
    color: '#26ff23',
  },
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
const styles = {
  root: {
    overflow: 'auto',
  },

  actionsContainer: {
    margin: '10px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
};

class ChartWithTable extends React.Component {
  constructor(props) {
    super(props);

    chartOptions.onClick = this.chartClickHandler;

    this.state = {
      range: [dateFns.startOfWeek(new Date()), dateFns.endOfToday()],
      loading: true,
      focusedInput: null,

      selectedUser: 'null',
      userOptions: [],

      dataMap: {},
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
    this.fetchData();
    this.fetchUserOptions();
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
      userOptions: [{ id: 'null', fullName: 'Grand Total' }].concat(
        userOptions
      ),
    });
  };

  fetchData = (blockTimerPromise = Promise.resolve()) => {
    const { range } = this.state;
    range[1] = dateFns.endOfDay(range[1]);
    const from_date = range[0].toISOString();
    const to_date = range[1].toISOString();
    this.props
      .getPipelineData({ from_date, to_date })
      .then((response) => {
        const dataMap = response.reduce((res, item) => {
          if (item.recruiterUserId) {
            res[item.recruiterUserId] = item;
          } else {
            res['null'] = item;
          }
          return res;
        }, {});
        blockTimerPromise.then(() =>
          this.setState({
            loading: false,
            dataMap,
            selectedStatus: '',
            chartData: this.getChartDataFromUser(
              this.state.selectedUser,
              dataMap
            ),
          })
        );
      })
      .catch((err) => this.setState({ loading: false }));
  };

  getChartDataFromUser = (selectedUser, dataMap) => {
    console.log(selectedUser);
    const userData = (selectedUser
      ? dataMap[selectedUser]
      : dataMap['null']) || {
      // recruiterUserId: item.id,
      // recruiter: fullName,
      openingCount: 0,
      appliedCount: 0,
      submittedCount: 0,
      interviewCount: 0,
      offeredCount: 0,
      offerAcceptedCount: 0,
      startedCount: 0,
    };
    return selectedUser
      ? {
          labels: statusOptions.map((status) => status.label),
          datasets: [
            {
              data: statusOptions.map(
                (status) => userData[`${status.value}Count`]
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
    this.setState({ range }, () => {
      this.fetchData(this._blockTimer());
    });
  };

  handleUserChange = (selectedUser) => {
    selectedUser = selectedUser || this.state.selectedUser;
    this.setState({
      selectedUser,
      chartData: this.getChartDataFromUser(selectedUser, this.state.dataMap),
      selectedStatus: '',
    });
  };

  downloadCanvas = (e, filename = 'Job-Analysis-Details.png') => {
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

  render() {
    const {
      chartData,
      options,
      selectedStatus,
      from,
      to,
      selectedUser,
      userOptions,
      range,
    } = this.state;
    console.log(chartData);
    const { t, classes, type, title, i18n } = this.props;
    const isZH = i18n.language.match('zh');
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
              {t(title)}
              {t()}
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
            }}
          >
            <div style={{ zIndex: 111 }}>
              <div>
                <FormReactSelectContainer
                  label={
                    type === 'sourcer'
                      ? t('field:Sourced Date')
                      : t('field:Activity Date')
                  }
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
                <FormReactSelectContainer label={t('field:Sourcer')}>
                  <Select
                    valueKey="id"
                    labelKey="fullName"
                    value={selectedUser}
                    options={userOptions}
                    onChange={this.handleUserChange}
                    autoBlur={true}
                    // searchable={false}
                    simpleValue
                    clearable={false}
                  />
                </FormReactSelectContainer>
              </div>
            </div>
          </div>
        </div>

        <div className="container-padding">
          <div
            className="chart-container"
            style={{ position: 'relative', maxWidth: 800, cursor: 'pointer' }}
          >
            <Bar
              data={chartData}
              options={options}
              width={400}
              height={150}
              ref={this.chart}
            />
          </div>
        </div>

        <div className="container-padding">
          <div style={{ height: 500, outline: '1px solid lightgray' }}>
            <ActivityTable
              activityId={
                selectedUser && this.state.dataMap[selectedUser]
                  ? this.state.dataMap[selectedUser][
                      `${selectedStatus}ActivityId`
                    ]
                  : ''
              }
              activityStatus={selectedStatus}
            />
          </div>
        </div>
      </Paper>
    );
  }
}

ChartWithTable.propTypes = {
  getPipelineData: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    briefUsers: state.controller.newCandidateJob.toJS().dialogAllUser,
  };
}

export default withTranslation(['tab', 'action', 'field', 'message'])(
  connect(mapStateToProps)(withStyles(styles)(ChartWithTable))
);
