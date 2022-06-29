import React from 'react';
import moment from 'moment-timezone';
import clsx from 'clsx';
import { getDashboardPipeline } from '../../../../apn-sdk/index';
import Immutable from 'immutable';
import { withStyles } from '@material-ui/core/styles';

import DateRangePicker from 'react-dates/esm/components/DateRangePicker';
import Button from '@material-ui/core/Button';
import { Bar } from 'react-chartjs-2';

import ReportTableSummary from '../../../components/Tables/ReportTableSummary';

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
    position: 'bottom',
    onClick: (e, a) => {
      console.log(e, a);
    },
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
const columns = statusOptions.reduce((res, option) => {
  res[option.value] = [
    {
      colName: 'candidate',
      colWidth: 200,
      col: 'talentName',
      type: 'talentNameLink',
      fixed: true,
    },
    {
      colName: 'Current Status',
      colWidth: 170,
      col: 'latestActivityStatusDesc',
    },
    {
      colName: `Date of ${option.label}`,
      colWidth: 160,
      col: `${option.value}Date`,
      type: 'date',
    },

    {
      colName: 'jobTitle',
      colWidth: 200,
      col: 'title',
    },
    {
      colName: 'Job Status',
      colWidth: 120,
      flexGrow: 1,
      col: 'status',
    },
    {
      colName: 'Job Id',
      colWidth: 180,
      flexGrow: 1,
      col: 'jobId',
    },
    {
      colName: 'Client Job Code',
      colWidth: 180,
      flexGrow: 1,
      col: 'jobRef',
    },
    {
      colName: 'hiringManager',
      colWidth: 140,
      flexGrow: 1,
      col: 'hiringManager',
    },
    {
      colName: 'company',
      colWidth: 160,
      flexGrow: 2,
      col: 'company',
    },

    {
      colName: 'Sourced By',
      colWidth: 150,
      flexGrow: 1,
      col: 'appliedBy',
    },
  ];

  return res;
}, {});
const columns2 = statusOptions.reduce((res, option) => {
  res[option.value] = [
    {
      colName: 'candidate',
      colWidth: 200,
      col: 'talentName',
      type: 'talentNameLink',
      fixed: true,
    },
    {
      colName: 'Current Status',
      colWidth: 170,
      col: 'latestActivityStatusDesc',
    },
    {
      colName: `Date of ${option.label}`,
      colWidth: 160,
      col: `${option.value}Date`,
      type: 'date',
    },

    {
      colName: 'jobTitle',
      colWidth: 200,
      col: 'title',
    },
    {
      colName: 'Job Status',
      colWidth: 120,
      flexGrow: 1,
      col: 'status',
    },
    {
      colName: 'Job Id',
      colWidth: 180,
      flexGrow: 1,
      col: 'jobId',
    },
    {
      colName: 'Client Job Code',
      colWidth: 180,
      flexGrow: 1,
      col: 'jobRef',
    },
    {
      colName: 'company',
      colWidth: 160,
      flexGrow: 2,
      col: 'company',
    },

    {
      colName: 'Sourced By',
      colWidth: 150,
      flexGrow: 1,
      col: 'appliedBy',
    },
  ];

  return res;
}, {});

const styles = {
  hidden: {
    maxHeight: 0,
  },
};

class PipelineHistoryChart extends React.Component {
  constructor(props) {
    super(props);

    chartOptions.onClick = this.chartClickHandler;

    this.state = {
      from: moment().startOf('month').hours(12),
      to: moment().startOf('day').hours(12),
      focusedInput: null,

      options: chartOptions,
      chartData: {
        labels: [],
        datasets: [],
      },
      origin: {
        applied: {},
        submitted: {},
        interview: {},
        offered: {},
        started: {},
      },

      index: 0,
      datasetIndex: 0,
      selectedData: Immutable.List(),
      selectedStatus: 'applied',
      selectedLabel: '',
    };
  }

  chartClickHandler = (e, elements) => {
    console.log('selected', elements);
    if (elements[0]) {
      const {
        _index,
        _datasetIndex,
        _model: { label },
      } = elements[0];
      this.setState({
        selectedStatus: statusOptions[_datasetIndex].value,
        selectedData: Immutable.fromJS(
          this.state.origin[statusOptions[_datasetIndex].value][label]
        ),
        index: _index,
        datasetIndex: _datasetIndex,
        selectedLabel: label,
      });
    } else {
      this.setState({
        selectedData: Immutable.List(),
      });
    }
  };

  componentDidMount() {
    const { from, to } = this.state;
    this.fetchData(from, to);
  }

  fetchData = (from, to, blockTimerPromise) => {
    const from_date = moment(from).hours(0).utc().format();
    const to_date = moment(to).hours(0).utc().format();
    getDashboardPipeline({ from_date, to_date })
      .then((response) => {
        const weekFrom = from.week();
        const weekTo = to.week();
        const range = Array.from(Array(weekTo - weekFrom + 1));
        const labels = range.map((d, index) =>
          moment()
            .week(weekFrom + index)
            .day(5)
            .format('MM/DD')
        );
        const origin = getData(response);
        const chartData = {
          labels: labels,
          datasets: statusOptions.map((status) => {
            const counts = labels.map((label) =>
              origin[status.value][label]
                ? origin[status.value][label].length
                : 0
            );
            return {
              label: status.label,
              data: counts,
              backgroundColor: status.color,
              borderColor: status.color,
            };
          }),
        };

        if (blockTimerPromise) {
          blockTimerPromise.then(() =>
            this.setState({ loading: false, chartData, origin })
          );
        } else {
          this.setState({ loading: false, chartData, origin });
        }
      })
      .catch((err) => this.setState({ loading: false }));
  };

  renderCalendarInfo = () => {
    const endDate = moment().startOf('day').hours(12);
    const mFrom = moment().startOf('month').hours(12);
    const qFrom = moment().startOf('quarter').hours(12);
    const yFrom = moment().startOf('year').hours(12);

    return (
      <div
        className="flex-container flex-dir-column vertical-layout"
        style={{ padding: 18 }}
      >
        <Button
          variant="outlined"
          onClick={() => {
            this.handleDateRangeChange({ startDate: mFrom, endDate });
            this.setState({ focusedInput: null });
          }}
        >
          This Month
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            this.handleDateRangeChange({ startDate: qFrom, endDate });
            this.setState({ focusedInput: null });
          }}
        >
          This Quarter
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            this.handleDateRangeChange({ startDate: yFrom, endDate });
            this.setState({ focusedInput: null });
          }}
        >
          This Year
        </Button>
      </div>
    );
  };

  handleDateRangeChange = ({ startDate: from, endDate: to }) => {
    this.setState({ from, to });
    if (from && to) {
      this.fetchData(from, to, this._blockTimer());
    }
  };

  _blockTimer = (time = 400) => {
    clearTimeout(this.bTimer);
    this.setState({ loading: true });

    return new Promise((resolve) => {
      this.bTimer = setTimeout(resolve, time);
    });
  };

  render() {
    const { classes, hidden, isLimitUser } = this.props;
    const {
      focusedInput,
      from,
      to,
      chartData,
      options,
      selectedData,
      selectedStatus,
    } = this.state;
    return (
      <div
        className={clsx('flex-child-auto', {
          [classes.hidden]: hidden,
        })}
        style={{ overflow: 'auto' }}
      >
        <div className="container-padding" style={{ paddingTop: 0 }}>
          <DateRangePicker
            startDate={from} // momentPropTypes.momentObj or null,
            startDateId="your_unique_start_date_id" // PropTypes.string.isRequired,
            endDate={to} // momentPropTypes.momentObj or null,
            endDateId="your_unique_end_date_id" // PropTypes.string.isRequired,
            onDatesChange={this.handleDateRangeChange} // PropTypes.func.isRequired,
            focusedInput={focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
            onFocusChange={(focusedInput) => this.setState({ focusedInput })} // PropTypes.func.isRequired,
            small
            isOutsideRange={(a) => a.isAfter(moment().startOf('day').hours(12))}
            displayFormat="MM/DD/YYYY"
            // numberOfMonths={1}
            calendarInfoPosition="after"
            renderCalendarInfo={this.renderCalendarInfo}
          />
        </div>

        <div
          className="chart-container item-padding"
          style={{
            position: 'relative',
            width: '80vw',
            maxWidth: 800,
            cursor: 'pointer',
          }}
        >
          <Bar data={chartData} options={options} width={400} height={150} />
        </div>

        <div className="container-padding">
          <div style={{ height: 400, outline: '1px solid lightgray' }}>
            <ReportTableSummary
              dataList={selectedData}
              columns={
                isLimitUser ? columns2[selectedStatus] : columns[selectedStatus]
              }
            />
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(PipelineHistoryChart);

const getData = (data) => {
  let selected = {
    statusIndex: 0,
    label: moment().day(5).format('MM/DD'),
  };
  const origin = {};

  statusOptions.forEach((status, index) => {
    origin[status.value] = data[status.value].reduce((res, entity) => {
      const week = moment(entity[status.value + 'Date']).week();
      const weekLabel = moment().week(week).day(5).format('MM/DD');
      if (res[weekLabel]) {
        res[weekLabel].push(entity);
      } else {
        res[weekLabel] = [entity];
      }
      return res;
    }, {});

    const label = Object.keys(origin[status.value]).sort()[0];
    if (label && selected.label > label) {
      selected.statusIndex = index;
      selected.label = label;
    }
  });

  console.log(origin);
  return origin;
};
