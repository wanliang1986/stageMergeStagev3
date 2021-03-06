import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  jobChartSearch,
  getCountryList,
  getJobCompanyList,
} from '../../../../apn-sdk/newSearch';
import moment from 'moment-timezone';

import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Loading from '../../../components/particial/Loading';
import PotentialButton from '../../../components/particial/PotentialButton';
import Select from 'react-select';
import { Bar } from 'react-chartjs-2';
import FormReactSelectContainer from '../../../components/particial/FormReactSelectContainer';

const options = {
  legend: {
    display: false,
  },
  title: {
    display: true,
    text: 'Job Analysis Details -- All',
    fontSize: 20,
    padding: 30,
  },
  scales: {
    xAxes: [
      {
        scaleLabel: {
          display: true,
          labelString: 'Month',
          fontSize: 16,
        },
        afterFit: function (scale) {
          scale.height = 80; //<-- set value as you wish
        },
        ticks: {
          autoSkip: false,
          step: 1,
        },
        barPercentage: 0.8,
      },
    ],
    yAxes: [
      {
        scaleLabel: {
          display: true,
          labelString: 'Job Count',
          fontSize: 14,
        },
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

class JobChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      jobData: [],
      company: 'All',
      companyList: [{ value: 'All', label: 'All' }],
      country: 'All',
      countryList: [{ value: 'All', label: 'All' }],
    };
    this.chart = React.createRef();
  }

  componentDidMount() {
    this.getCountryList();
    this.getCompanyList();
    this.fetchDataForJob();
  }

  getCountryList = () => {
    const { dispatch } = this.props;
    getCountryList()
      .then(({ response }) => {
        let arr = response.map((item) => {
          return { value: item, label: item };
        });
        this.setState({
          countryList: this.state.countryList.concat(arr),
        });
      })
      .catch((error) => {
        if (error?.message) {
          dispatch({
            type: 'add_message',
            message: {
              message: error.message,
              type: 'error',
            },
          });
        }
      });
  };

  getCompanyList = () => {
    const { dispatch } = this.props;
    getJobCompanyList()
      .then(({ response }) => {
        let arr = response.map((item) => {
          return { value: item.id, label: item.name };
        });
        this.setState({
          companyList: this.state.companyList.concat(arr),
        });
      })
      .catch((error) => {
        if (error?.message) {
          dispatch({
            type: 'add_message',
            message: {
              message: error.message,
              type: 'error',
            },
          });
        }
      });
  };

  fetchDataForJob = (company, country) => {
    const { dispatch } = this.props;
    const now = moment(new Date()).format('YYYY-MM-DD');
    const preYears = moment(now).subtract('1', 'years').format('YYYY-MM-DD');
    let and = [{ and: [{ postingTime: { gte: preYears, lte: now } }] }];
    if (company != 'All') {
      and.push({ or: [{ companyId: company }] });
    }
    if (country != 'All') {
      and.push({ or: [{ location: country }] });
    }
    const time = JSON.stringify({ and });
    let params = {
      pageSize: 10000,
      pageNumber: 1,
      module: 'REPORTS',
      condition: time,
      timezone: moment.tz.guess(),
    };
    jobChartSearch(params)
      .then(({ response }) => {
        this.setState({
          loading: false,
          tableData: response,
        });
      })
      .catch((error) => {
        if (error?.message) {
          dispatch({
            type: 'add_message',
            message: {
              message: error.message,
              type: 'error',
            },
          });
        }
      });
  };

  prepareGraphData = (dataList) => {
    // console.log('dataList', dataList);
    const dateStart = moment()
      .subtract(1, 'years')
      .add(1, 'days')
      .startOf('month');
    const dateEnd = moment().startOf('month');

    let issuedDate = dataList
      .map((ele) => ele.postingTime)
      .reduce((acc, ele) => {
        const key = moment(ele).format('YYYY/MM');
        // console.log(data,key);

        if (acc[key]) {
          acc[key] += 1;
        } else {
          acc[key] = 1;
        }
        return acc;
      }, {});

    const labels = [];

    while (
      dateEnd > dateStart ||
      dateStart.format('M') === dateEnd.format('M')
    ) {
      labels.push(dateStart.format('YYYY/MM'));
      dateStart.add(1, 'month');
    }

    const dataForGraph = {
      labels: labels,
      datasets: [
        {
          label: 'Jobs By Month',
          backgroundColor: 'rgb(25, 149, 132)',
          borderColor: 'rgb(25, 149, 132)',
          data: labels.map((key) => issuedDate[key] || 0),
        },
      ],
    };
    return dataForGraph;
  };

  downloadCanvas = (e, filename = 'Job-Analysis-Details.png') => {
    const link = e.currentTarget;
    const canvas = this.chart.current.chartInstance.canvas;
    link.href = canvas.toDataURL();
    link.download = filename;
  };

  handleCountryChange = (country) => {
    this.setState(
      {
        country,
        loading: true,
        company: 'All',
      },
      () => {
        if (country == 'All') {
          this.fetchDataForJob(this.state.company, null);
        } else {
          this.fetchDataForJob(this.state.company, country);
        }
      }
    );
  };

  handleCompanyChange = (company) => {
    this.setState(
      {
        company: company.value,
        loading: true,
      },
      () => {
        if (company.value == 'All') {
          this.fetchDataForJob(null, this.state.country);
        } else {
          this.fetchDataForJob(String(company.value), this.state.country);
        }
      }
    );
  };

  render() {
    const { loading, company, companyList, country, countryList } = this.state;
    const { t } = this.props;

    const graphOptions = options;
    let companyName = companyList.filter((item) => item.value == company);
    graphOptions.title.text = `Jobs By Month -- ${
      companyName[0].label || country || 'All'
    }`;
    const jobData = this.state.tableData
      ? this.prepareGraphData(this.state.tableData)
      : [];
    return (
      <React.Fragment>
        <Paper
          className="flex-child-auto flex-container flex-dir-column"
          style={{ overflow: 'auto' }}
        >
          <div
            style={{
              margin: '10px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="h5">{t('message:Analysis Graph')}</Typography>
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
            <div>
              <div style={{ minWidth: 168, height: 53 }}>
                <FormReactSelectContainer label={t('field:country')}>
                  <Select
                    value={country}
                    options={countryList}
                    simpleValue
                    onChange={this.handleCountryChange}
                    autoBlur={true}
                    // searchable={false}
                    clearable={false}
                  />
                </FormReactSelectContainer>
              </div>
            </div>
            <div>
              <div style={{ minWidth: 168, height: 53 }}>
                <FormReactSelectContainer label={t('field:company')}>
                  <Select
                    value={company}
                    options={companyList}
                    onChange={(e) => {
                      this.handleCompanyChange(e);
                    }}
                    autoBlur={true}
                    // searchable={false}
                    clearable={false}
                  />
                </FormReactSelectContainer>
              </div>
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
                  maxWidth: '800px',
                  marginLeft: '20px',
                }}
              >
                <Bar data={jobData} options={graphOptions} ref={this.chart} />
              </div>
            )}
          </div>
        </Paper>
      </React.Fragment>
    );
  }
}

JobChart.propTypes = {
  t: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {
    tenantId: state.controller.currentUser.get('tenantId'),
  };
};

export default withTranslation(['tab', 'action', 'field', 'message'])(
  connect(mapStateToProps)(JobChart)
);
