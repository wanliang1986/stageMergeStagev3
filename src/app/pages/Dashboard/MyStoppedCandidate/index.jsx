import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import memoizeOne from 'memoize-one';
import { getStoppedTalentList } from '../../../../apn-sdk/dashboard';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Tooltip from '@material-ui/core/Tooltip';
import Info from '@material-ui/icons/Info';

import Loading from '../../../components/particial/Loading';
import DashboardTable from '../Tables/DashboardTable';
import BulkUpdateStatus from './BulkUpdateStatus';
import dateFns from 'date-fns';

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
  container: {
    overflow: 'hidden',
    position: 'relative',
    height: 240,
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
    colName: 'candidateName',
    colWidth: 150,
    col: 'fullName',
    type: 'candidateName',
    fixed: true,
    sortable: true,
  },
  {
    colName: 'jobTitle',
    colWidth: 140,
    col: 'jobTitle',
    type: 'candidateJob',
    flexGrow: 1,
    sortable: true,
  },
  {
    colName: 'company',
    colWidth: 100,
    col: 'company',
    sortable: true,
  },

  {
    colName: 'status',
    colWidth: 160,
    col: 'status',
    type: 'enum',
    flexGrow: 1,
    sortable: true,
  },
  // {
  //   colName: 'Last Updated At',
  //   colWidth: 140,
  //   flexGrow: 1,
  //   col: 'lastModifiedDate',
  //   sortable: true,
  //   type: 'date',
  //   disableSearch: true
  // }
];

function onScrollEnd(scrollLeft, scrollTop) {
  status.scrollLeft = scrollLeft;
  status.scrollTop = scrollTop;
}

class MyStoppedCandidates extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searching: false,
      data: Immutable.List(),
      originData: Immutable.List(),
      colSortDirs: {},
      selectedApplicationId: null,
      selectedJobId: null,
      syncDashboard: props.syncDashboard,
      range: status.range || [],
      selected: Immutable.Set(),
    };
    this.chart = React.createRef();
  }

  componentDidMount() {
    this.fetchData();
  }

  // componentWillUnmount() {
  //     this.fetchTask.cancel();
  // }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.syncDashboard !== prevProps.syncDashboard &&
      this.props.syncDashboard
    ) {
      this.fetchData();
    }
  }

  fetchData = (response) => {
    if (response) {
      console.log(
        'all',
        response.length,
        'success',
        response.filter((e) => e).length
      );
    }
    this.setState({ searching: true });
    getStoppedTalentList().then((res) => {
      // console.log('res', res);
      const originData = Immutable.fromJS(res.response);
      this.setState({
        searching: false,
        originData,
        data: this._getData(originData, this.state.range),
      });
    });
  };

  onSortChange = (columnKey, sortDir) => {
    const sort = sortDir ? { [columnKey]: sortDir } : {};
    this.setState({ colSortDirs: sort, data: sortData(this.state.data, sort) });
  };

  onSelect = (id) => {
    let selected = this.state.selected;
    if (selected.includes(id)) {
      selected = selected.delete(id);
    } else {
      selected = selected.add(id);
    }
    this.setState({ selected });
  };

  onMultiSelect = (ids, add) => {
    const { selected } = this.state;
    if (add) {
      this.setState({ selected: selected.union(ids) });
    } else {
      this.setState({ selected: selected.subtract(ids) });
    }
  };

  handleSelect = (selected) => {
    this.setState({ selected });
  };

  handleRangeChange = (range) => {
    this.setState({ range, data: this._getData(this.state.originData, range) });
  };

  _getData = (originData, range) => {
    if (range && range[0] && range[1]) {
      return originData.filter(
        (d) =>
          dateFns.isAfter(d.get('lastModifiedDate'), range[0]) &&
          dateFns.isBefore(d.get('lastModifiedDate'), range[1])
      );
    } else {
      return originData;
    }
  };

  render() {
    const { classes, t, ...props } = this.props;

    const { searching, colSortDirs, data, selected, range } = this.state;
    const filteredSelected = getFilteredSelected(selected, data);

    return (
      <Paper className={classes.root}>
        <div
          className="flex-container"
          style={{ marginBottom: 6, marginTop: -2 }}
        >
          <Typography variant="h6">
            {/* {t('tab:myStoppedCandidatesMonitor')} */}
            My Inactive Candidate Status Monitor
          </Typography>
          <StyledTooltip
            arrow
            placement="top"
            title={t('message:dashboardTooltip2')}
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

        <BulkUpdateStatus
          t={t}
          {...props}
          loading={searching}
          data={data}
          range={this.state.range}
          onRangeChange={this.handleRangeChange}
          selected={filteredSelected}
          fetchData={this.fetchData}
          handleSelect={this.handleSelect}
        />

        <Divider />
        <div className="flex-container align-justify">
          <div style={styles.half}>
            <DashboardTable
              data={data}
              selected={filteredSelected}
              onSelect={this.onSelect}
              onMultiSelect={this.onMultiSelect}
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
      </Paper>
    );
  }
}

MyStoppedCandidates.propTypes = {
  t: PropTypes.func.isRequired,
};

export default connect()(withStyles(styles)(MyStoppedCandidates));

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

const getFilteredSelected = memoizeOne((selected, list) => {
  return selected.intersect(list.map((v) => v.get('id')));
});
