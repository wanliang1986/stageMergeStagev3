import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Immutable from 'immutable';

import { Prompt } from 'react-router';
import { makeGetJobList } from '../../selectors/jobSelectors';

import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

import SecondaryButton from '../../components/particial/SecondaryButton';
import PrimaryButton from '../../components/particial/PrimaryButton';
import JobTable from '../../components/Tables/JobTable';
import Loading from '../../components/particial/Loading';
import { makeCancelable, sortList, getIndexList } from '../../../utils';

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
    sortable: true,
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
    colName: 'locations',
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
const status = {};
function onScrollEnd(scrollLeft, scrollTop) {
  status.scrollLeft = scrollLeft;
  status.scrollTop = scrollTop;
}

const styles = {
  container: {
    overflow: 'hidden',
    position: 'relative',
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
};

class AssignJobs extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      filteredJobIndex: getIndexList(
        props.jobList,
        status.filters,
        status.colSortDirs
      ),
      selected: Immutable.Set(),
      filters: Immutable.Map(),
      colSortDirs: {},
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

  onSelect = (id) => {
    let selected = this.state.selected;
    if (selected.includes(id)) {
      selected = selected.delete(id);
    } else {
      selected = selected.add(id);
    }

    this.setState({ selected });
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

  handleClose = () => {
    this.props.onClose();
    status.colSortDirs = {};
  };
  handleSave = () => {
    const { onSave, jobList } = this.props;
    const { selected } = this.state;
    const filteredSelected = selected.intersect(
      jobList.map((el) => el.get('id'))
    );
    onSave(filteredSelected);
    status.colSortDirs = {};
  };

  render() {
    const { jobIds, total, jobList, t, searching } = this.props;
    const { selected, filters, colSortDirs, filteredJobIndex } = this.state;

    if (!jobIds) {
      return <Loading />;
    }
    const filteredSelected = selected.intersect(
      jobList.map((el) => el.get('id'))
    );

    const count = total > jobList.size ? jobList.size + 1 : total;
    const filteredJobList = filteredJobIndex.map((index) => jobList.get(index));
    return (
      <div
        className="flex-child-auto flex-container flex-dir-column vertical-layout"
        style={{ overflow: 'hidden', padding: 24 }}
      >
        <Prompt
          message={(location) => t('message:prompt') + location.pathname}
        />

        <div>
          <Typography variant="h5">{t('common:assginUsersToJobs')}</Typography>
        </div>

        <div style={{ marginLeft: -24, marginRight: -24, marginBottom: 0 }}>
          <Divider />
        </div>

        <div
          className="flex-child-auto"
          style={{
            marginLeft: -24,
            marginRight: -24,
            height: 900,
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {jobIds ? (
            <>
              <JobTable
                jobList={filteredJobList}
                count={count}
                ownColumns={columns}
                // loadMore={this.loadMore}
                selected={filteredSelected}
                onSelect={this.onSelect}
                single={true}
                filterOpen={true}
                filters={filters}
                onFilter={this.onFilter}
                colSortDirs={colSortDirs}
                onSortChange={this.onSortChange}
                onScrollEnd={onScrollEnd}
                scrollLeft={status.scrollLeft}
                scrollTop={status.scrollTop}
              />
              {searching && <Loading style={styles.mask} />}
            </>
          ) : (
            <Loading />
          )}
        </div>

        <div>
          <div className="horizontal-layout">
            <SecondaryButton onClick={this.handleClose}>
              {t('action:cancel')}
            </SecondaryButton>
            <PrimaryButton
              disabled={filteredSelected.size === 0}
              processing={this.props.assigning}
              onClick={this.handleSave}
            >
              {t('action:save')}
            </PrimaryButton>
          </div>
        </div>
      </div>
    );
  }
}

AssignJobs.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};
const jobSelectors = makeGetJobList();

function mapStoreStateToProps(state) {
  const jobIds = state.controller.searchJobs.my.ids;
  const total = state.controller.searchJobs.my.total;
  const searching = state.controller.searchJobs.my.isFetching;

  return {
    jobIds,
    searching,
    jobList: jobSelectors(state, 'my'),
    total,
  };
}

export default connect(mapStoreStateToProps)(AssignJobs);
