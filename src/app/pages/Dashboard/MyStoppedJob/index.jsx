import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { getStoppedJobList } from '../../../../apn-sdk/dashboard';
import { makeCancelable } from '../../../../utils';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Tooltip from '@material-ui/core/Tooltip';
import Info from '@material-ui/icons/Info';

import Loading from '../../../components/particial/Loading';
import DashboardTable from '../Tables/DashboardTable';

import JobStatus from '../../Jobs/List/JobStatus';
import Popover from '@material-ui/core/Popover';

const StyledTooltip = withStyles({
  tooltip: {
    maxWidth: 450,
    backgroundColor: 'rgba(55, 55, 55, 0.98)',
    padding: 10,
    fontSize: 13,
  },
})(Tooltip);

const styles = {
  root: {
    padding: '14px 24px',
  },
  half: {
    flex: '0 0 635px',
    overflow: 'hidden',
    position: 'relative',
    height: 370,
  },
  graph: {
    flex: '0 0 600px',
    marginTop: '46px',
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
};
let status = {};

const columns = [
  {
    colName: 'jobTitle',
    colWidth: 120,
    col: 'jobTitle',
    fixed: true,
    type: 'jobHot',
    flexGrow: 2,
  },
  {
    colName: 'company',
    colWidth: 100,
    col: 'company',
    type: 'link',
    flexGrow: 1,
    sortable: true,
  },
  {
    colName: 'postingDate',
    colWidth: 140,
    col: 'postingTime',
    type: 'date',
    sortable: true,
  },

  {
    colName: 'status',
    colWidth: 150,
    col: 'jobStatus',
    type: 'changeJobStatus',
    // flexGrow: 1,
    sortable: true,
  },
];

function onScrollEnd(scrollLeft, scrollTop) {
  status.scrollLeft = scrollLeft;
  status.scrollTop = scrollTop;
}

class MyDBCandidates extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      period: 'thisWeek',
      periodOptions: [
        { value: 'thisWeek', label: 'This Week' },
        { value: 'last2Weeks', label: 'Last 2 Weeks' },
        { value: 'thisMonth', label: 'This Month' },
        { value: 'last3Months', label: 'Last 3 Months' },
        { value: 'thisYear', label: 'This Year' },
      ],
      searching: false,
      data: Immutable.List(),
      footerData: Immutable.Map(),
      colSortDirs: {},
      candidateCountData: {},
      selectedApplicationId: null,
      selectedJobId: null,
      syncDashboard: props.syncDashboard,
      openJobStatus: false,
    };
    this.chart = React.createRef();
  }

  componentDidMount() {
    this.fetchData();
  }

  componentWillUnmount() {
    this.fetchTask.cancel();
  }

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
      this.fetchData();
    }
  }

  fetchData = () => {
    this.setState({ searching: true });
    this.fetchTask = makeCancelable(getStoppedJobList());
    this.fetchTask.promise.then((res) => {
      // console.log('res', res);
      this.setState({
        searching: false,
        data: Immutable.fromJS(res.response).toList(),
      });
    });
  };

  onSortChange = (columnKey, sortDir) => {
    const sort = sortDir ? { [columnKey]: sortDir } : {};
    this.setState({ colSortDirs: sort, data: sortData(this.state.data, sort) });
  };

  handleStatusChange = (event, selectedJobId) => {
    event.preventDefault();
    this.setState({
      anchorEl: event.currentTarget,
      selectedJobId,
      openJobStatus: true,
    });
  };

  handleClosePop = () => {
    this.setState({ openJobStatus: false });
  };

  render() {
    const { classes, t, ...props } = this.props;

    const {
      searching,
      colSortDirs,
      selectedJobId,
      data,
      anchorEl,
      openJobStatus,
    } = this.state;

    return (
      <Paper className={classes.root}>
        <div className="flex-container" style={{ marginBottom: 8 }}>
          <Typography variant="h6">
            {/* {t('tab:myStoppedJobStatusMonitor')} */}
            {t('tab:My Inactive Job Status Monitor')}
          </Typography>
          <StyledTooltip
            arrow
            placement="top"
            title={t('message:dashboardTooltip1')}
          >
            <Info
              style={{
                verticalAlign: 'text-bottom',
                width: '.75em',
                height: '.75em',
                color: '#bdbdbd',
                marginTop: 5,
                marginLeft: 8,
              }}
            />
          </StyledTooltip>
        </div>
        <div style={{ marginBottom: 8, color: '#505050' }}>
          <Typography variant="subtitle1">
            {' '}
            {t('tab:Total Count')}: {data.size}
          </Typography>
        </div>
        <Divider />
        <div className="flex-container align-justify">
          <div style={styles.half}>
            <DashboardTable
              data={data}
              onStatusChange={this.handleStatusChange}
              colSortDirs={colSortDirs}
              onSortChange={this.onSortChange}
              onScrollEnd={onScrollEnd}
              scrollLeft={status.scrollLeft}
              scrollTop={status.scrollTop}
              columns={columns}
              t={t}
            />
            {searching && <Loading style={styles.mask} />}
          </div>
        </div>
        <Popover
          open={openJobStatus}
          anchorEl={anchorEl}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          onClose={this.handleClosePop}
        >
          <JobStatus
            {...props}
            jobId={selectedJobId}
            onClose={this.handleClosePop}
            fetchData={this.fetchData}
          />
        </Popover>
      </Paper>
    );
  }
}

MyDBCandidates.propTypes = {
  t: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {
    myDBCandidates: state.model.dashboard.toList(),
    //   applicationList: applicationSelector(state, applicationId)
  };
};

export default connect(mapStateToProps)(withStyles(styles)(MyDBCandidates));

const applicationStatus = {
  Applied: 1,
  Qualified: 2,
  Internal_Rejected: 3,
  Called_Candidate: 4,
  Meet_Candidate_In_Person: 5,
  Submitted: 6,
  Client_Rejected: 7,
  Interview: 8,
  Shortlisted_By_Client: 9,

  Offered: 10,
  Offer_Rejected: 11,
  Offer_Accepted: 12,
  Started: 13,
  Candidate_Quit: 14,
};

function sortData(data, sort) {
  sort = Object.keys(sort || {}).map((key) => [key, sort[key]])[0] || ['id'];

  if (sort[0] === 'status') {
    return data.sortBy(
      (myCandidate) => myCandidate.get(sort[0]),
      (a, b) => {
        if (sort[1] === 'ASC') {
          return applicationStatus[a] - applicationStatus[b];
        } else {
          return applicationStatus[b] - applicationStatus[a];
        }
      }
    );
  } else {
    return data.sortBy(
      (myCandidate) => myCandidate.get(sort[0]),
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
}
