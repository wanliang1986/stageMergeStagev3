import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import { makeCancelable } from '../../../../utils/index';
import {
  getPipelineReportByRecruiter,
  getPipelineReportBySourcer,
} from '../../../../apn-sdk/index';
import { countryList } from '../../../constants/formOptions';

import moment from 'moment-timezone';

import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import { Bar, HorizontalBar } from 'react-chartjs-2';
import DateRangePicker from 'react-dates/esm/components/DateRangePicker';
import Select from 'react-select';

import FormReactSelectContainer from '../../../components/particial/FormReactSelectContainer';
import Loading from '../../../components/particial/Loading';
import PotentialButton from '../../../components/particial/PotentialButton';

const options = {
  legend: {
    display: false,
  },
  // title: {
  //     display: true,
  //     text: '',
  //     fontSize: 20,
  //     padding: 30
  // },

  scales: {
    yAxes: [
      {
        scaleLabel: {
          display: true,
          fontSize: 16,
        },
        afterFit: function (scale) {
          scale.height = 80; //<-- set value as you wish
        },
        ticks: {
          // Include a dollar sign in the ticks
          autoSkip: false,
          step: 1,
        },
        // barPercentage: 0.8
      },
    ],
    xAxes: [
      {
        scaleLabel: {
          display: true,
          fontSize: 14,
          labelString: 'Candidate Count',
        },
        position: 'top',
        ticks: {
          beginAtZero: true,
          callback: function (value) {
            if (value % 1 === 0) {
              return value;
            }
          },
        },
      },
    ],
  },
};

const styles = {
  link: {
    color: 'black',
    border: '1px solid #ccc',
    padding: '6px 10px',
    borderRadius: '5px',
    marginLeft: '30px',
  },
};

class PipeChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      from: moment().startOf('month').hours(12),
      to: moment().startOf('day').hours(12),
      loading: true,
      focusedInput: null,
      pipeData: [],

      selectedUserCountry: '',
      countryOptions: [{ value: '', label: 'All' }].concat(countryList),
      selectedJobCountry: '',

      isVertical: true,
    };
    this.chart = React.createRef();
    options.scales.yAxes[0].scaleLabel.labelString = props.type;
    options.scales.xAxes[0].scaleLabel.labelString =
      props.type === 'User' ? 'Activity Count' : 'Candidate Count';

    // options.title.text = props.title;
  }

  componentDidMount() {
    const { from, to } = this.state;
    this.fetchDataForPipe(from, to);
  }

  fetchDataForPipe = (
    from,
    to,
    selectedUserCountry,
    selectedJobCountry,
    blockTimerPromise = Promise.resolve()
  ) => {
    const from_date = moment(from).hours(0).utc().format();
    const to_date = moment(to).hours(0).utc().format();

    const fetchAPI =
      this.props.type === 'User'
        ? getPipelineReportByRecruiter
        : getPipelineReportBySourcer;

    this.candidateTask = makeCancelable(
      fetchAPI({ from_date, to_date, selectedUserCountry, selectedJobCountry })
    );
    this.candidateTask.promise
      .then((data) => {
        blockTimerPromise.then(() =>
          this.setState({
            loading: false,
            pipeData: this.prepareGraphData(data, this.props.field),
          })
        );
      })
      .catch((reason) => {
        if (!reason.isCanceled) {
          this.setState({ loading: false });
        }
      });
  };

  handleDateRangeChange = (
    { startDate: from, endDate: to },
    button = false
  ) => {
    if (button) {
      this.setState({ from, to, focusedInput: null });
    } else {
      this.setState({ from, to });
    }

    if (from && to) {
      console.log(from.format(), to.format());
      const { selectedUserCountry, selectedJobCountry } = this.state;
      this.fetchDataForPipe(
        from,
        to,
        selectedUserCountry,
        selectedJobCountry,
        this._blockTimer()
      );
    }
  };

  handleUserCountryChange = (selectedUserCountry) => {
    selectedUserCountry = selectedUserCountry || '';
    this.setState({ selectedUserCountry });
    const { from, to, selectedJobCountry } = this.state;
    this.fetchDataForPipe(
      from,
      to,
      selectedUserCountry,
      selectedJobCountry,
      this._blockTimer()
    );
  };

  handleJobCountryChange = (selectedJobCountry) => {
    selectedJobCountry = selectedJobCountry || '';
    this.setState({ selectedJobCountry });
    const { from, to, selectedUserCountry } = this.state;
    this.fetchDataForPipe(
      from,
      to,
      selectedUserCountry,
      selectedJobCountry,
      this._blockTimer()
    );
  };

  _blockTimer = (time = 400) => {
    if (this.bTimer) clearTimeout(this.bTimer);

    this.setState({ loading: true });
    return new Promise((resolve) => {
      this.bTimer = setTimeout(resolve, time);
    });
  };

  prepareGraphData = (dataList, dataField) => {
    const sortFilteredData = dataList
      .sort((a, b) => {
        return b[dataField] - a[dataField];
      })
      .filter((ele) => {
        return ele.recruiter !== 'Grand Total' && ele[dataField];
      });

    const labels = sortFilteredData.map((ele) => {
      return ele.recruiter;
    });

    let data = sortFilteredData.map((ele) => {
      return ele[dataField];
    });

    const labelFilter = (field) => {
      if (dataField === 'appliedCount') {
        return 'Submitted to AM';
      } else if (dataField === 'submittedCount') {
        return 'Submitted to Client';
      }
    };

    const dataForGraph = {
      labels: labels,
      datasets: [
        {
          label: `Sum of ${labelFilter(dataField)}`,
          backgroundColor: 'rgb(55, 99, 12)',
          borderColor: 'rgb(15, 99, 12)',
          data: data,
          barPercentage: 0.8,
        },
      ],
    };

    return dataForGraph;
  };

  renderCalendarInfo = () => {
    const endDate = moment().startOf('day').hours(12);
    const thisWeek_start = moment().startOf('week').hours(12);
    const lastWeek_start = moment()
      .startOf('week')
      .subtract(1, 'week')
      .hours(12);
    const lastWeek_end = moment().startOf('week').subtract(1, 'day').hours(12);

    return (
      <div
        className="flex-container flex-dir-column vertical-layout"
        style={{ padding: 18 }}
      >
        <Button
          variant="outlined"
          onClick={() =>
            this.handleDateRangeChange(
              { startDate: thisWeek_start, endDate: endDate },
              true
            )
          }
        >
          This Week
        </Button>
        <Button
          variant="outlined"
          onClick={() =>
            this.handleDateRangeChange(
              {
                startDate: lastWeek_start,
                endDate: lastWeek_end,
              },
              true
            )
          }
        >
          Last Week
        </Button>
      </div>
    );
  };

  downloadCanvas = (e, filename) => {
    const link = e.currentTarget;
    const canvas = this.chart.current.chartInstance.canvas;
    link.href = canvas.toDataURL();
    link.download = filename;
  };

  render() {
    const {
      from,
      to,
      loading,
      pipeData,
      selectedUserCountry,
      selectedJobCountry,
      countryOptions,
      isVertical,
    } = this.state;
    const { t, title, type } = this.props;

    return (
      <React.Fragment>
        <Paper
          className="flex-child-auto flex-container flex-dir-column"
          style={{ overflow: 'auto' }}
        >
          <div>
            <div
              style={{
                margin: '10px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography variant="h5">{title}</Typography>
              <PotentialButton
                component="a"
                onClick={(e) => this.downloadCanvas(e, `${title}.png`)}
              >
                Download Chart
              </PotentialButton>
            </div>
            <Divider variant="fullWidth" />
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
                    label={t(
                      type === 'User'
                        ? 'field:Presented Date'
                        : 'field:Sourced Date'
                    )}
                  />
                  <DateRangePicker
                    startDate={from} // momentPropTypes.momentObj or null,
                    startDateId="your_unique_start_date_id" // PropTypes.string.isRequired,
                    endDate={to} // momentPropTypes.momentObj or null,
                    endDateId="your_unique_end_date_id" // PropTypes.string.isRequired,
                    onDatesChange={this.handleDateRangeChange} // PropTypes.func.isRequired,
                    focusedInput={this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
                    onFocusChange={(focusedInput) =>
                      this.setState({ focusedInput })
                    } // PropTypes.func.isRequired,
                    small={true}
                    isOutsideRange={(a) =>
                      a.isAfter(moment().startOf('day').hours(12))
                    }
                    displayFormat="MM/DD/YYYY"
                    calendarInfoPosition="after"
                    renderCalendarInfo={this.renderCalendarInfo}
                  />
                </div>
              </div>
              <div>
                <div style={{ minWidth: 168, height: 53 }}>
                  <FormReactSelectContainer label={t('field:Job Country')}>
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

              <div>
                <div style={{ minWidth: 168, height: 53 }}>
                  <FormReactSelectContainer label={t('field:User Country')}>
                    <Select
                      value={selectedUserCountry}
                      options={countryOptions}
                      simpleValue
                      onChange={this.handleUserCountryChange}
                      autoBlur={true}
                      // searchable={false}
                      clearable={false}
                    />
                  </FormReactSelectContainer>
                </div>
              </div>
              <Button
                variant="outlined"
                size="small"
                onClick={() => this.setState({ isVertical: !isVertical })}
              >
                {isVertical ? 'Vertical' : 'Horizontal'}
              </Button>
            </div>
          </div>

          <div
            className="flex-child-auto"
            style={{ overflow: 'auto', position: 'relative' }}
          >
            {loading ? (
              <div
                className={'flex-container flex-dir-column'}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 1,
                  backgroundColor: 'rgba(240,240,240,.5)',
                }}
              >
                <Loading />
              </div>
            ) : (
              <div
                style={{
                  position: 'relative',
                  width: '80vw',
                  maxWidth: isVertical ? 800 : 1000,
                  marginLeft: '20px',
                }}
              >
                {isVertical ? (
                  <HorizontalBar
                    data={pipeData}
                    options={options}
                    ref={this.chart}
                    width={200}
                    height={400}
                  />
                ) : (
                  <Bar
                    data={pipeData}
                    options={{
                      ...options,
                      scales: {
                        yAxes: options.scales.xAxes,
                        xAxes: options.scales.yAxes,
                      },
                    }}
                    ref={this.chart}
                    width={400}
                    height={200}
                  />
                )}
              </div>
            )}
          </div>
        </Paper>
      </React.Fragment>
    );
  }
}

PipeChart.propTypes = {
  t: PropTypes.func.isRequired,
};

export default withTranslation(['tab', 'action', 'field', 'message'])(
  PipeChart
);
