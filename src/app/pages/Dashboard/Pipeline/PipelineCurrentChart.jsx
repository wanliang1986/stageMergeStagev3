import React from 'react';
import Immutable from 'immutable';
import { withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { getDashboardPipeline } from '../../../../apn-sdk/index';

import { Bar } from 'react-chartjs-2';
import ReportTableSummary from '../../../components/Tables/ReportTableSummary';

const statusOptions = [
  {
    value: 'applied',
    label: 'Submitted to AM',
    color: '#ff6384'
  },
  {
    value: 'submitted',
    label: 'Submitted to Client',
    color: '#36a2eb'
  },
  {
    value: 'interview',
    label: 'Interview',
    color: '#cc65fe'
  },
  {
    value: 'offered',
    label: 'Offered',
    color: '#ffce56'
  },
  {
    value: 'started',
    label: 'On board',
    color: '#26ff23'
  }
];
const chartOptions = {
  legend: {
    display: false
  },
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true
          // stepSize: 1
        },

        stacked: true
      }
    ],
    xAxes: [
      {
        stacked: true,
        gridLines: {
          display: false
        }
      }
    ]
  },
  layout: {
    padding: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    }
  },
  events: ['click'],
  tooltips: {
    // enabled: false
  },
  hover: {
    mode: 'nearest'
  }
};
const columns = statusOptions.reduce((res, option) => {
  res[option.value] = [
    {
      colName: 'candidate',
      colWidth: 200,
      col: 'talentName',
      type: 'talentNameLink',
      fixed: true
    },
    {
      colName: 'Current Status',
      colWidth: 170,
      col: 'latestActivityStatusDesc'
    },
    {
      colName: `Date of ${option.label}`,
      colWidth: 160,
      col: `${option.value}Date`,
      type: 'date'
    },

    {
      colName: 'jobTitle',
      colWidth: 200,
      col: 'title'
    },
    {
      colName: 'Job Status',
      colWidth: 120,
      flexGrow: 1,
      col: 'status'
    },
    {
      colName: 'Job Id',
      colWidth: 180,
      flexGrow: 1,
      col: 'jobId'
    },
    {
      colName: 'Client Job Code',
      colWidth: 180,
      flexGrow: 1,
      col: 'jobRef'
    },
    {
      colName: 'hiringManager',
      colWidth: 140,
      flexGrow: 1,
      col: 'hiringManager'
    },
    {
      colName: 'company',
      colWidth: 160,
      flexGrow: 2,
      col: 'company'
    },

    {
      colName: 'Sourced By',
      colWidth: 150,
      flexGrow: 1,
      col: 'appliedBy'
    }
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
      fixed: true
    },
    {
      colName: 'Current Status',
      colWidth: 170,
      col: 'latestActivityStatusDesc'
    },
    {
      colName: `Date of ${option.label}`,
      colWidth: 160,
      col: `${option.value}Date`,
      type: 'date'
    },

    {
      colName: 'jobTitle',
      colWidth: 200,
      col: 'title'
    },
    {
      colName: 'Job Status',
      colWidth: 120,
      flexGrow: 1,
      col: 'status'
    },
    {
      colName: 'Job Id',
      colWidth: 180,
      flexGrow: 1,
      col: 'jobId'
    },
    {
      colName: 'Client Job Code',
      colWidth: 180,
      flexGrow: 1,
      col: 'jobRef'
    },
    {
      colName: 'company',
      colWidth: 160,
      flexGrow: 2,
      col: 'company'
    },

    {
      colName: 'Sourced By',
      colWidth: 150,
      flexGrow: 1,
      col: 'appliedBy'
    }
  ];

  return res;
}, {});
const styles = {
  hidden: {
    maxHeight: 0
  }
};

class PipelineCurrentChart extends React.Component {
  constructor(props) {
    super(props);

    chartOptions.onClick = this.chartClickHandler;

    this.state = {
      chartData: {
        labels: [],
        datasets: []
      },
      origin: {
        applied: [],
        submitted: [],
        interview: [],
        offered: [],
        started: []
      },
      index: 0,
      datasetIndex: 0,
      selectedData: Immutable.List(),
      selectedStatus: 'applied',
      options: chartOptions
    };
  }

  chartClickHandler = (e, elements) => {
    console.log('selected', elements);
    if (elements[0]) {
      const { _index, _datasetIndex } = elements[0];
      this.setState({
        selectedStatus: statusOptions[_index].value,
        selectedData: Immutable.fromJS(
          this.state.origin[statusOptions[_index].value]
        ),
        index: _index,
        datasetIndex: _datasetIndex
      });
    } else {
      this.setState({
        selectedData: Immutable.List()
      });
    }
  };

  componentDidMount() {
    this.fetchData();
  }

  fetchData = blockTimerPromise => {
    getDashboardPipeline({})
      .then(response => {
        const chartData = {
          labels: statusOptions.map(status => status.label),
          datasets: [
            {
              data: statusOptions.map(status => response[status.value].length),
              backgroundColor: '#3498DB',
              borderColor: '#3498DB'
            }
          ]
        };

        if (blockTimerPromise) {
          blockTimerPromise.then(() =>
            this.setState({ loading: false, chartData, origin: response })
          );
        } else {
          this.setState({ loading: false, chartData, origin: response });
        }
      })
      .catch(err => this.setState({ loading: false }));
  };

  _blockTimer = (time = 400) => {
    this.setState({ loading: true });
    return new Promise(resolve => {
      this.bTimer = setTimeout(resolve, time);
    });
  };

  render() {
    const { chartData, options, selectedStatus, selectedData } = this.state;
    const { classes, hidden, isLimitUser } = this.props;
    return (
      <div
        className={clsx('flex-child-auto', {
          [classes.hidden]: hidden
        })}
        style={{ overflow: 'auto' }}
      >
        <div
          className="chart-container item-padding"
          style={{
            position: 'relative',
            width: '80vw',
            maxWidth: 800,
            cursor: 'pointer'
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

export default withStyles(styles)(PipelineCurrentChart);
