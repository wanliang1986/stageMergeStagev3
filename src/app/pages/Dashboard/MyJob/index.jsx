import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import {
  getDBMyJobList,
  getDBMyJobCountDetails,
  getCompanyNamelist,
} from '../../../../apn-sdk/dashboard';
import {
  getPeriod,
  getIndexList,
  sortList,
  makeCancelable,
} from '../../../../utils';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
// import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Select from 'react-select';
import Link from '@material-ui/core/Link';
import Tooltip from '@material-ui/core/Tooltip';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import Info from '@material-ui/icons/Info';

import Loading from '../../../components/particial/Loading';
import DashboardTable from '../Tables/DashboardTable';
import FormReactSelectContainer from '../../../components/particial/FormReactSelectContainer';
import CountDetailDialog from './CountDetailDialog';

const StyledTooltip = withStyles({
  tooltip: {
    width: 450,
    maxWidth: 450,
    backgroundColor: 'rgba(55, 55, 55, 0.98)',
    padding: 10,
  },
})(Tooltip);

const styles = {
  root: {
    padding: '14px 24px',
  },
  half: {
    flex: '0 0 1336px',
    overflow: 'hidden',
    position: 'relative',
    height: 300,
  },
  mask: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    backgroundColor: 'rgba(240,240,240,.5)',
  },
  columns: {
    padding: '0 8px',
    flex: 1,
  },
  left: {
    display: 'flex',
    flexDirection: 'column',
    flex: '0 0 32%',
    '& span': {
      fontWeight: '500',
      lineHeight: 2.2,
    },
  },
  right: {
    display: 'flex',
    flexDirection: 'column',
    flex: '0 0 68%',
    '& span': {
      lineHeight: 2.2,
    },
  },
};
let status = {};

const columns = [
  {
    colName: 'company',
    colWidth: 130,
    col: 'company',
    type: 'link',
    fixed: true,
    sortable: true,
  },
  {
    colName: 'jobTitle',
    colWidth: 200,
    col: 'jobTitle',
    type: 'jobHot',
    flexGrow: 1,
  },
  {
    colName: 'submittedToAM',
    colWidth: 110,
    col: 'applied',
    type: 'number',
  },
  {
    colName: 'mySubmittedToAM',
    colWidth: 120,
    col: 'myApplied',
    type: 'number',
  },
  {
    colName: 'submittedToClient',
    colWidth: 110,
    col: 'submitted',
    type: 'number',
  },
  {
    colName: 'mySubmittedToClient',
    colWidth: 110,
    col: 'mySubmitted',
    type: 'number',
  },
  {
    colName: 'interviews',
    colWidth: 110,
    col: 'interview',
    type: 'number',
  },
  {
    colName: 'myInterviews',
    colWidth: 120,
    col: 'myInterview',
    type: 'number',
  },
  {
    colName: 'offers',
    colWidth: 110,
    col: 'offered',
    type: 'number',
  },
  {
    colName: 'myOffers',
    colWidth: 110,
    col: 'myOffered',
    type: 'number',
  },
];

function onScrollEnd(scrollLeft, scrollTop) {
  status.scrollLeft = scrollLeft;
  status.scrollTop = scrollTop;
}

const statusMapping = {
  applied: { status: 'Applied', relatedToMe: false },
  myApplied: { status: 'Applied', relatedToMe: true },
  submitted: { status: 'Submitted', relatedToMe: false },
  mySubmitted: { status: 'Submitted', relatedToMe: true },
  interview: { status: 'Interview', relatedToMe: false },
  myInterview: { status: 'Interview', relatedToMe: true },
  offered: { status: 'Offered', relatedToMe: false },
  myOffered: { status: 'Offered', relatedToMe: true },
};

class MyDBJobs extends React.Component {
  constructor(props) {
    super(props);
    console.log('constructor', props.syncDashboard);
    this.state = {
      period: 'thisWeek',
      periodOptions: [
        { value: 'thisWeek', label: 'This Week' },
        { value: 'last2Weeks', label: 'Last 2 Weeks' },
        { value: 'thisMonth', label: 'This Month' },
        { value: 'last3Months', label: 'Last 3 Months' },
        { value: 'thisYear', label: 'Year to date' },
      ],
      company: '',
      companyOptions: [],
      myJobsOnly: false,
      searching: false,
      data: Immutable.List(),
      footerData: Immutable.Map(),
      colSortDirs: {},
      candidateCountData: {},
      selectedJobId: null,
      selectedStatus: null,
      detailData: Immutable.List(),
      syncDashboard: props.syncDashboard,
    };
    this.chart = React.createRef();
  }

  componentDidMount() {
    this.fetchData('', this.state.period, false, true);
  }

  // componentWillUnmount() {
  //     this.fetchTask.cancel();
  // }

  static getDerivedStateFromProps(props, state) {
    const newSyncDashboard = props.syncDashboard;

    if (newSyncDashboard === true) {
      return {
        syncDashboard: newSyncDashboard,
      };
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.syncDashboard !== prevProps.syncDashboard &&
      this.state.syncDashboard === true
    ) {
      this.fetchData(
        this.state.company,
        this.state.period,
        this.state.myJobsOnly,
        true
      );
    }
  }

  fetchData = (companyId, period, myJobsOnly, toGetCompanyNameList) => {
    const { from, to } = getPeriod(period);

    console.log('period', from, to);
    this.setState({ searching: true });

    if (toGetCompanyNameList) {
      getCompanyNamelist(
        Math.ceil(from / 1000),
        Math.ceil(to / 1000),
        myJobsOnly
      ).then((res) => {
        console.log('res', res);
        let companyOptions = [{ value: '', label: 'All Companies' }];
        for (let ele of res.response) {
          if (ele) {
            companyOptions.push({ value: ele.companyId, label: ele.company });
          }
        }

        this.setState({ companyOptions });
      });
    }

    getDBMyJobList(
      companyId,
      Math.ceil(from / 1000),
      Math.ceil(to / 1000),
      myJobsOnly
    ).then((res) => {
      this.props.dispatch({ type: 'FINISH_UPDATE_DB_DATA' });
      const companies = res.response;

      // let ids = new Set();
      // if (companies.length > 0) {
      //   for (let ele of companies) {
      //     if (ids.has(ele.companyId)) {
      //       continue;
      //     } else {
      //       ids.add(ele.companyId);
      //       companyOptions.push({ value: ele.companyId, label: ele.company });
      //     }
      //   }
      // }

      const tableData = Immutable.fromJS(companies).toList();
      this.setState({
        footerData: formatFooterData(companies),
        searching: false,
        data: tableData,
      });
    });
  };

  handlePeriodChange = (period) => {
    if (period) {
      this.setState({ period });
      this.fetchData(this.state.company, period, this.state.myJobsOnly, true);
    }
  };

  handleCompanyChange = (company) => {
    this.setState({ company });
    this.fetchData(company, this.state.period, this.state.myJobsOnly);
  };

  handleOnlyMyChange = (e) => {
    this.setState({ myJobsOnly: e.target.checked });
    this.fetchData(
      this.state.company,
      this.state.period,
      e.target.checked,
      true
    );
  };

  onSortChange = (columnKey, sortDir) => {
    const sort = sortDir ? { [columnKey]: sortDir } : {};
    this.setState({ colSortDirs: sort, data: sortData(this.state.data, sort) });
  };

  handleFetchDetails = (jobId, status) => {
    this.setState({ selectedJobId: jobId, selectedStatus: status });
    const mappedStatus = statusMapping[status];
    const finalStatus = mappedStatus.status;
    const relatedToMe = mappedStatus.relatedToMe;

    if (jobId) {
      getDBMyJobCountDetails(jobId, finalStatus, relatedToMe).then((res) => {
        this.setState({
          selectedJobId: jobId,
          selectedStatus: status,
          detailData: Immutable.fromJS(res.response),
        });
      });
    } else {
      this.setState({
        selectedJobId: null,
        selectedStatus: null,
        detailData: Immutable.List(),
      });
    }
  };

  closeCountDetailDialog = () => {
    this.setState({
      selectedJobId: null,
      selectedStatus: null,
      detailData: Immutable.List(),
    });
  };

  translationLabel = (stateKey) => {
    const { t } = this.props;
    let newOpt = this.state[stateKey].map((item) => ({
      value: item.value,
      label: t(`tab:${item.label}`),
    }));
    return newOpt;
  };

  render() {
    const { classes, t } = this.props;
    // console.log('render', this.props.syncDashboard);
    const {
      data,
      footerData,
      searching,
      colSortDirs,
      period,
      periodOptions,
      company,
      companyOptions,
      onlyMy,
      selectedJobId,
      selectedStatus,
      detailData,
    } = this.state;

    let _periodOptions = this.translationLabel('periodOptions');
    let _companyOptions = this.translationLabel('companyOptions');

    const showCountDetailDialog = !!selectedJobId;
    const infoDetail = (
      <div style={{ display: 'flex' }}>
        <div className={classes.left}>
          <Typography color="inherit" variant="caption">
            {t('tab:submitted to am')}:
          </Typography>
          <Typography color="inherit" variant="caption">
            {t('tab:my submitted to am')}:
          </Typography>
          <Typography color="inherit" variant="caption">
            {t('tab:submitted to client')}:
          </Typography>
          <Typography color="inherit" variant="caption">
            {t('tab:my submitted to client')}:
          </Typography>
          <Typography color="inherit" variant="caption">
            {t('tab:interviews')}:
          </Typography>
          <Typography color="inherit" variant="caption">
            {t('tab:my interviews')}:
          </Typography>
          <Typography color="inherit" variant="caption">
            {t('tab:offers')}:
          </Typography>
          <Typography color="inherit" variant="caption">
            {t('tab:my offers')}:
          </Typography>
        </div>
        <div className={classes.right}>
          <Typography color="inherit" variant="caption">
            {t('tab:Total number of candidates submitted to AM')}
          </Typography>
          <Typography color="inherit" variant="caption">
            {t('tab:Total number of candidates submitted to AM by you')}
          </Typography>
          <Typography color="inherit" variant="caption">
            {t('tab:Total number of candidates submitted to client')}
          </Typography>
          <Typography color="inherit" variant="caption">
            {t('tab:Total number of candidates submitted to client by you')}
          </Typography>
          <Typography color="inherit" variant="caption">
            {t('tab:Total number of candidates submitted to client by you')}
          </Typography>
          <Typography color="inherit" variant="caption">
            {t('tab:Total number of your candidates in interview stage')}
          </Typography>
          <Typography color="inherit" variant="caption">
            {t('tab:Total number of candidates in offer stage')}
          </Typography>
          <Typography color="inherit" variant="caption">
            {t('tab:Total number of your candidates in offer stage')}
          </Typography>
        </div>
      </div>
    );

    return (
      <Paper className={classes.root}>
        <div
          className="flex-container align-justify"
          style={{ marginBottom: 12 }}
        >
          <Typography variant="h6">
            {t('tab:JobsByCompanies')}
            <StyledTooltip arrow placement="top" title={infoDetail}>
              <Info
                style={{
                  verticalAlign: 'text-bottom',
                  width: '.75em',
                  height: '.75em',
                  color: '#bdbdbd',
                  marginTop: 3,
                  marginLeft: 8,
                }}
              />
            </StyledTooltip>
          </Typography>
          <Link href="/jobs?tab=my">{t('tab:More')}</Link>
        </div>
        <div className="flex-container align-justify">
          <div className="flex-container">
            <div style={{ minWidth: 168, marginRight: 30 }}>
              <FormReactSelectContainer>
                <Select
                  value={period}
                  options={_periodOptions}
                  simpleValue
                  onChange={this.handlePeriodChange}
                  autoBlur={true}
                  searchable={false}
                  clearable={false}
                />
              </FormReactSelectContainer>
            </div>

            <div style={{ minWidth: 168 }}>
              <FormReactSelectContainer>
                <Select
                  value={company}
                  options={_companyOptions}
                  simpleValue
                  onChange={this.handleCompanyChange}
                  autoBlur={true}
                  searchable={false}
                  clearable={false}
                />
              </FormReactSelectContainer>
            </div>
          </div>
          <FormControlLabel
            control={
              <Switch
                size="small"
                checked={onlyMy}
                onChange={this.handleOnlyMyChange}
                value="checkedOnlyMy"
                color="primary"
              />
            }
            labelPlacement="start"
            label={t('action:onlyShowMyJobs')}
          />
        </div>
        <Divider />
        <div className="flex-container align-justify">
          <div style={styles.half}>
            <DashboardTable
              data={data}
              colSortDirs={colSortDirs}
              onSortChange={this.onSortChange}
              onScrollEnd={onScrollEnd}
              scrollLeft={status.scrollLeft}
              scrollTop={status.scrollTop}
              columns={columns}
              footerData={footerData}
              handleFetchDetails={this.handleFetchDetails}
              t={t}
              footerHeight={40}
              jobTable={true}
            />
            {searching && <Loading style={styles.mask} />}
          </div>

          {showCountDetailDialog && (
            <CountDetailDialog
              t={t}
              onClose={this.closeCountDetailDialog}
              status={selectedStatus}
              detailData={detailData}
            />
          )}
        </div>
      </Paper>
    );
  }
}

MyDBJobs.propTypes = {
  t: PropTypes.func.isRequired,
};

export default connect()(withStyles(styles)(MyDBJobs));

function formatFooterData(response) {
  let applied = 0;
  let submitted = 0;
  let interview = 0;
  let offered = 0;
  let myApplied = 0;
  let mySubmitted = 0;
  let myInterview = 0;
  let myOffered = 0;
  const data = Immutable.List(
    response.forEach((job) => {
      applied += job.applied === null ? 0 : job.applied;
      myApplied += job.myApplied === null ? 0 : job.myApplied;
      submitted += job.submitted === null ? 0 : job.submitted;
      mySubmitted += job.mySubmitted === null ? 0 : job.mySubmitted;
      interview += job.interview === null ? 0 : job.interview;
      myInterview += job.myInterview === null ? 0 : job.myInterview;
      offered += job.offered === null ? 0 : job.offered;
      myOffered += job.myOffered === null ? 0 : job.myOffered;
    })
  );

  const footerData = {
    title: 'Total',
    applied,
    myApplied,
    submitted,
    mySubmitted,
    interview,
    myInterview,
    offered,
    myOffered,
  };
  // console.log(footerData);

  return Immutable.Map(footerData);
}

function sortData(data, sort) {
  sort = Object.keys(sort || {}).map((key) => [key, sort[key]])[0] || ['id'];

  return data.sortBy(
    (job) => job.get(sort[0]),
    (a, b) => {
      if (a < b) {
        return -((sort[1] === 'ASC') - 0.5);
      }
      if (a > b) {
        return (sort[1] === 'ASC') - 0.5;
      }
      if (a === b) {
        return 0;
      }
    }
  );
}
