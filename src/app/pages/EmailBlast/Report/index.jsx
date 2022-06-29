import React, { Component } from 'react';

import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import Select from 'react-select';
import FormReactSelectContainer from '../../../components/particial/FormReactSelectContainer';
import Paper from '@material-ui/core/Paper';
import MyHistoryList from './ReportsHistoryList';

import { getEmailReport } from '../../../../apn-sdk/email';
import { getPeriod } from '../../../../utils';
import { emailHistoryStatus } from '../../../constants/formOptions';
import { CircularProgress } from '@material-ui/core';
import ReportsChart from './ReportsChart';

const styles = {
  dataList: {
    display: 'flex',
    flexDirection: 'column',
    borderLeft: '1px solid #e0e0e0',
    padding: '0px 10px',
  },
  percentList: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    top: 36,
    left: 320,
    bottom: 36,
    justifyContent: 'space-between',
  },
};

const periodOptions = [
  { value: 'lastHour', label: 'Last Hour' },
  { value: 'last24Hours', label: 'Last 24 Hours' },
  { value: 'last7Days', label: 'Last 7 Days' },
  { value: 'last30Days', label: 'Last 30 Days' },
  { value: 'last90Days', label: 'Last 90 Days' },
];

const statusOptions = ['OPEN', 'CLICK', 'BOUNCE', 'FAIL'];
const labels = ['Delivery rate', 'Open rate', 'Click rate', 'Bounce rate'];
const colors = ['#3398db', '#3398db', '#3398db', '#f56d50'];

class EmailReports extends Component {
  constructor(props) {
    super(props);
    this.state = {
      period: 'lastHour',
      fetching: false,
      dataShow: [],
      sum: 0,
    };
    this.myRef = React.createRef();
  }

  componentDidMount() {
    this.fetchData(this.state.period);
  }

  componentDidUpdate() {
    // if(this.myRef.current){
    //   console.log('ref',this.myRef.current.chartInstance.generateLegend)
    //   this.myRef.current.chartInstance.generateLegend()      }
  }

  fetchData = (period) => {
    const { from, to } = getPeriod(period);

    this.setState({ fetching: true });
    getEmailReport(Math.ceil(from / 1000), Math.ceil(to / 1000)).then((res) => {
      const dataShow = [];
      let success = 0;
      let opens = 0;
      let clicks = 0;
      let bounces = 0;
      let sum = 0;
      res.response.forEach((ele) => {
        if (emailHistoryStatus.opens.indexOf(ele.status) !== -1) {
          opens += ele.count;
        }
        if (emailHistoryStatus.clicks.indexOf(ele.status) !== -1) {
          clicks += ele.count;
        }
        if (emailHistoryStatus.bounces.indexOf(ele.status) !== -1) {
          bounces += ele.count;
        }
        if (emailHistoryStatus.success.indexOf(ele.status) !== -1) {
          success += ele.count;
          sum += ele.count;
        }
        if (emailHistoryStatus.fail.indexOf(ele.status) !== -1) {
          sum += ele.count;
        }
      });

      dataShow.push(success, opens, clicks, bounces, sum);
      console.log('dataShow', dataShow);

      this.setState({ dataShow, sum });
      setTimeout(() => {
        this.setState({ fetching: false });
      }, 500);
    });
  };
  handlePeriodChange = (period) => {
    if (period) {
      // console.log('peri', period);
      this.setState({ period });

      this.fetchData(period);
    }
  };

  render() {
    const { period, fetching, dataShow, sum } = this.state;
    const { classes, ...props } = this.props;

    return (
      <div>
        <Typography
          variant="h6"
          style={{
            fontSize: '18px',
            color: '#505050',
            margin: '20px 0px 0px 20px',
          }}
        >
          Summary
        </Typography>
        <div
          style={{
            width: 168,
            margin: '10px 20px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <FormReactSelectContainer>
            <Select
              value={period}
              options={periodOptions}
              simpleValue
              onChange={this.handlePeriodChange}
              autoBlur={true}
              searchable={false}
              clearable={false}
            />
          </FormReactSelectContainer>
        </div>

        <Paper
          style={{
            margin: '20px 20px 40px 20px',
            position: 'relative',
            display: 'flex',
            padding: 20,
            height: 190,
          }}
        >
          {fetching && (
            <CircularProgress
              size={60}
              thickness={5}
              style={{
                position: 'absolute',
                top: '40%',
                left: '40%',
              }}
            />
          )}

          {!fetching &&
            (sum > 0 ? (
              <>
                {Array(4)
                  .fill(1)
                  .map((ele, index) => (
                    <ReportsChart
                      key={index}
                      label={labels[index]}
                      dataShow={dataShow[index]}
                      sum={dataShow[4]}
                      period={period}
                      color={colors[index]}
                    />
                  ))}
              </>
            ) : (
              <p>
                {' '}
                There is no activity during the{' '}
                {periodOptions
                  .find((ele) => ele.value === period)
                  .label.toLocaleLowerCase()}
              </p>
            ))}
        </Paper>

        <Typography
          variant="h6"
          style={{
            fontSize: '18px',
            color: '#505050',
            margin: '20px 0px 10px 20px',
          }}
        >
          Reports by Campaign
        </Typography>

        <Paper
          className="flex-child-auto flex-container flex-dir-column"
          style={{ width: '100%', height: '420px' }}
        >
          <MyHistoryList noAction={true} {...props} />
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(EmailReports);
