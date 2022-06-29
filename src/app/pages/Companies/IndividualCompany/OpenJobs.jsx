import React from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import * as jobActions from '../../../actions/jobActions';
import {
  makeCancelable,
  sortList,
  getIndexList,
} from '../../../../utils/index';
import { makeGetJobList } from '../../../selectors/jobSelectors';
import { getDBMyJobCountDetails } from '../../../../apn-sdk';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

import FilterIcon from '@material-ui/icons/FilterList';

import Loading from '../../../components/particial/Loading';
import JobTable from '../../../components/Tables/JobTable';
import JobCreateButton from '../../Jobs/Create/CreateButton';
import CountDetailDialog from '../../Dashboard/MyJob/CountDetailDialog';
let status = {};

function onScrollEnd(scrollLeft, scrollTop) {
  status.scrollLeft = scrollLeft;
  status.scrollTop = scrollTop;
}

const statusMapping = {
  subs: 'Submitted',
  interviews: 'Interview',
  starts: 'Started',
  // applied: { status: 'Applied', relatedToMe: false },
  // submitted: { status: 'Submitted', relatedToMe: false },
  // interview: { status: 'Interview', relatedToMe: false },
  // offered: { status: 'Offered', relatedToMe: false },
};

const columns = [
  {
    colName: 'jobTitle',
    colWidth: 200,
    flexGrow: 3,
    col: 'title',
    type: 'link',
    fixed: true,
    sortable: true,
  },
  {
    colName: 'postingTime',
    colWidth: 160,
    col: 'postingTime',
    type: 'date',
    sortable: true,
    disableSearch: true,
  },
  {
    colName: 'status',
    colWidth: 120,
    flexGrow: 1,
    col: 'status',
    type: 'enum',
    sortable: false,
    disableSearch: true,
  },
  {
    colName: 'type',
    colWidth: 120,
    flexGrow: 1,
    col: 'jobType',
    type: 'enum',
    sortable: true,
  },
  {
    colName: 'city',
    colWidth: 120,
    flexGrow: 2,
    col: 'locations',
    type: 'locations',
    sortable: true,
  },
  {
    colName: 'Job Id',
    colWidth: 130,
    flexGrow: 1,
    col: 'id',
  },
  {
    colName: 'Sum of Submitted to Client',
    colWidth: 250,
    flexGrow: 1,
    type: 'applicationCountCell',
    col: 'subs',
    disableSearch: true,
  },
  {
    colName: 'Sum of Interview',
    colWidth: 150,
    flexGrow: 1,
    type: 'applicationCountCell',
    col: 'interviews',
    disableSearch: true,
  },
  {
    colName: 'Sum of on Board',
    colWidth: 150,
    flexGrow: 1,
    type: 'applicationCountCell',
    col: 'starts',
    disableSearch: true,
  },
];

class RecentJobList extends React.PureComponent {
  constructor(props) {
    super();
    this.fTimer = setTimeout(() => {
      this.setState({ show: true });
    }, 850);

    this.state = {
      filteredJobIndex: getIndexList(
        props.jobList,
        status.filters,
        status.colSortDirs
      ),
      filters: status.filters || Immutable.Map(),
      filterOpen: status.filterOpen || false,
      colSortDirs: status.colSortDirs || {},
      detailData: Immutable.List(),
    };
  }

  componentWillUnmount() {
    clearTimeout(this.fTimer);
    status.filters = this.state.filters;
    status.filterOpen = this.state.filterOpen;
    status.colSortDirs = this.state.colSortDirs;
  }

  static getDerivedStateFromProps(props, state) {
    const filteredJobIndex = getIndexList(
      props.jobList,
      state.filters,
      state.colSortDirs
    );
    if (!filteredJobIndex.equals(state.filteredJobIndex)) {
      return { filteredJobIndex };
    }
    return null;
  }

  fetchFavoriteJobList = () => {
    this.favJobTask = makeCancelable(
      this.props.dispatch(jobActions.getFavoriteJobList())
    );
    this.favJobTask.promise.catch((reason) => {
      if (reason.isCanceled) {
        console.log('isCanceled');
      } else {
        console.log(reason);
      }
    });
  };

  onFavorite = (id) => {
    if (this.props.myFavJobIds.includes(id)) {
      this.props.dispatch(jobActions.deleteFavoriteJob([id]));
    } else {
      this.props.dispatch(jobActions.addFavoriteJob([id]));
    }
  };

  onFilter = (input) => {
    let filters = this.state.filters;

    let col = input.name;
    let query = input.value;
    if ((filters.get(col) || '') === query) {
      return;
    }
    if (!query) {
      filters = filters.remove(col);
    } else {
      filters = filters.set(col, query);
    }

    this.setState({
      filters,
      filteredJobIndex: getIndexList(
        this.props.jobList,
        filters,
        this.state.colSortDirs
      ),
    });
  };

  onSortChange = (columnKey, sortDir) => {
    let filteredIndex;

    filteredIndex = sortDir
      ? sortList(
          this.state.filteredJobIndex,
          this.props.jobList,
          columnKey,
          sortDir
        )
      : getIndexList(this.props.jobList, this.state.filters);

    this.setState({
      filteredJobIndex: filteredIndex,
      colSortDirs: {
        [columnKey]: sortDir,
      },
    });
  };
  handleFetchDetails = (jobId, status) => {
    this.setState({ selectedJobId: jobId, selectedStatus: status });
    console.log(jobId, status);
    const mappedStatus = statusMapping[status];

    if (jobId) {
      getDBMyJobCountDetails(jobId, mappedStatus, false).then((res) => {
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

  render() {
    const { jobIds, myFavJobIds, hideAction, jobList, t, ...props } =
      this.props;

    if (!jobIds) {
      return <Loading />;
    }
    if (jobIds.size === 0) {
      return (
        <div className="flex-child-auto container-padding">
          <Typography variant="h5">{t('message:noJobs')}</Typography>
        </div>
      );
    }
    const {
      filterOpen,
      filteredJobIndex,
      colSortDirs,
      selectedStatus,
      selectedJobId,
      detailData,
    } = this.state;
    const filteredJobList = filteredJobIndex.map((index) => jobList.get(index));

    return (
      <div className="flex-child-auto flex-container flex-dir-column">
        <div>
          <div
            className="flex-container align-middle item-padding"
            style={{ height: 56 }}
          >
            <JobCreateButton t={t} {...props} />

            <IconButton
              onClick={() => this.setState({ filterOpen: !filterOpen })}
              color={filterOpen ? 'primary' : 'default'}
            >
              <FilterIcon />
            </IconButton>
          </div>
          <Divider />
        </div>
        {this.state.show ? (
          <div className="flex-child-auto" style={{ overflow: 'hidden' }}>
            <JobTable
              ownColumns={columns}
              jobList={filteredJobList}
              myFavJobIds={myFavJobIds}
              onFavorite={this.onFavorite}
              onFilter={this.onFilter}
              filterOpen={filterOpen}
              colSortDirs={colSortDirs}
              onSortChange={this.onSortChange}
              handleFetchDetails={this.handleFetchDetails}
              onScrollEnd={onScrollEnd}
              scrollLeft={status.scrollLeft}
              scrollTop={status.scrollTop}
              filters={this.state.filters}
            />
          </div>
        ) : (
          <Loading />
        )}

        {selectedJobId && (
          <CountDetailDialog
            t={t}
            onClose={this.closeCountDetailDialog}
            status={selectedStatus}
            detailData={detailData}
          />
        )}
      </div>
    );
  }
}

const jobSelectors = makeGetJobList();

function mapStoreStateToProps(state) {
  const jobIds = state.controller.searchJobs.byCompany.ids;
  return {
    jobIds,
    jobList: jobSelectors(state, 'byCompany'),
  };
}

export default connect(mapStoreStateToProps)(RecentJobList);
