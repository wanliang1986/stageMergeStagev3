import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import Immutable from 'immutable';
import { getMyDraftList } from '../../../selectors/templateSelector';
import { getMyEmailBlastHistoryList } from '../../../../apn-sdk/email';

import Dialog from '@material-ui/core/Dialog';
import Paper from '@material-ui/core/Paper';

import EmailBlastHistoryTable from '../../../components/Tables/EmailBlastHistoryTable';
import StatsDetailDialog from './StatsDetailDialog';
import DraggablePaperComponent from '../../../components/particial/DraggablePaperComponent';
import Loading from '../../../components/particial/Loading';
import { emailHistoryStatus } from '../../../constants/formOptions';

const columns = [
  {
    colName: 'subject',
    colWidth: 240,
    flexGrow: 1,
    type: 'nameButton',
    col: 'subject',
  },
  {
    colName: 'Sent Time',
    colWidth: 160,
    col: 'timestamp',
    type: 'date',
    sortable: true,
    disableSearch: true,
  },
  {
    colName: 'Delivered',
    colWidth: 140,
    flexGrow: 1,
    col: 'success',
    type: 'stats',
    sortable: true,
    disableSearch: true,
  },
  {
    colName: 'Opens',
    colWidth: 140,
    flexGrow: 1,
    col: 'opens',
    type: 'stats',
    sortable: true,
    disableSearch: true,
  },
  {
    colName: 'Clicks',
    colWidth: 140,
    flexGrow: 1,
    col: 'clicks',
    type: 'stats',
    sortable: true,
    disableSearch: true,
  },
  // {
  //   colName: 'Bounces',
  //   colWidth: 140,
  //   flexGrow: 1,
  //   col: 'bounces',
  //   type: 'stats',
  //   sortable: true,
  //   disableSearch: true
  // },
  // {
  //   colName: 'Unopens',
  //   colWidth: 140,
  //   flexGrow: 1,
  //   col: 'unOpens',
  //   type: 'stats',
  //   sortable: true,
  //   disableSearch: true
  // }
];

let status = {};

function onScrollEnd(scrollLeft, scrollTop) {
  status.scrollLeft = scrollLeft;
  status.scrollTop = scrollTop;
}

function sortData(data, sort) {
  sort = Object.keys(sort || {}).map((key) => [key, sort[key]])[0] || ['id'];

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

class TemplateList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      filterOpen: true,
      colSortDirs: status.colSortDirs || {},
      dataAll: Immutable.List(),
      dataShow: Immutable.List(),
      selected: null, // selected template
      deleteSelected: null,

      handleDeleteTemplate: null,
      sent: null,
      firstFetching: false,
      filters: Immutable.Map(),
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  componentWillUnmount() {
    // this.templateTask.cancel();
    status.filters = this.state.filters;
    status.filterOpen = this.state.filterOpen;
    status.colSortDirs = this.state.colSortDirs;
  }

  fetchData() {
    this.setState({ firstFetching: true });
    getMyEmailBlastHistoryList().then((res) => {
      // console.log('res', res.response);

      const stats = res.response.map((history) => {
        let success = 0;
        let opens = 0;
        let clicks = 0;
        let bounces = 0;

        history.stats.forEach((ele, i) => {
          if (emailHistoryStatus.success.indexOf(ele.status) !== -1) {
            success += ele.count;
          }
          if (emailHistoryStatus.opens.indexOf(ele.status) !== -1) {
            opens += ele.count;
          }
          if (emailHistoryStatus.clicks.indexOf(ele.status) !== -1) {
            clicks += ele.count;
          }
          if (emailHistoryStatus.bounces.indexOf(ele.status) !== -1) {
            bounces += ele.count;
          }
        });

        history.success = success;
        history.opens = opens;
        history.clicks = clicks;
        history.bounces = bounces;
        return history;
      });

      this.setState({
        dataAll: Immutable.fromJS(stats),
        dataShow: Immutable.fromJS(stats),
        firstFetching: false,
      });
    });
  }

  onSortChange = (columnKey, sortDir) => {
    const sort = sortDir ? { [columnKey]: sortDir } : {};
    this.setState({
      colSortDirs: sort,
      dataShow: sortData(this.state.dataShow, sort),
    });
  };

  onFilter = (input) => {
    let filters = this.state.filters;
    let col = input.name;
    let query = input.value;

    let dataShow = this.state.dataAll;

    if (filters.get(col) === query) {
      return;
    }
    if (!query) {
      filters = filters.remove(col);
    } else {
      filters = filters.set(col, query);
    }

    // console.log('filters',filters.toJS(),query);
    filters.mapEntries(([k, v]) => {
      // console.log('ll',k,v);
      if (k === 'status') {
        dataShow = dataShow.filter((ele) => ele.get('status') === v);
      }
      if (k === 'subject') {
        const reg = new RegExp(v, 'i');
        dataShow = dataShow.filter((ele) => reg.test(ele.get('subject')));
      }
    });

    this.setState({
      dataShow,
      filters,
    });
  };

  onViewEmailHistory = (sent) => {
    // console.log('called', sent);
    this.setState({ sent });
  };

  handleClose = () => this.setState({ sent: null });

  render() {
    const { templateList, location, t, noAction, ...props } = this.props;
    const {
      filterOpen,
      indexList,
      colSortDirs,
      selected,
      handleDeleteTemplate,
      sent,
      dataShow,
      firstFetching,
    } = this.state;

    if (firstFetching) {
      return <Loading />;
    }
    return (
      <Paper
        key={location.key}
        className="flex-child-auto flex-container flex-dir-column"
      >
        <div className="flex-child-auto" style={{ overflow: 'hidden' }}>
          <EmailBlastHistoryTable
            columns={columns}
            templateList={dataShow}
            onFilter={this.onFilter}
            filterOpen={filterOpen}
            colSortDirs={colSortDirs}
            onSortChange={this.onSortChange}
            onScrollEnd={onScrollEnd}
            scrollLeft={status.scrollLeft}
            scrollTop={status.scrollTop}
            filters={this.state.filters}
            // onDelete={this.handleDelete}
            onViewEmailHistory={this.onViewEmailHistory}
            // onResend={this.onResend}
            noAction={noAction}
          />
        </div>

        {sent !== null && (
          <Dialog
            open={true}
            maxWidth="md"
            fullWidth
            PaperComponent={DraggablePaperComponent}
            disableEnforceFocus
          >
            <StatsDetailDialog
              {...props}
              sent={sent}
              onClose={this.handleClose}
              t={t}
            />
          </Dialog>
        )}
      </Paper>
    );
  }
}

TemplateList.propTypes = {
  templateList: PropTypes.instanceOf(Immutable.List).isRequired,
  t: PropTypes.func.isRequired,
};

function mapStoreStateToProps(state) {
  return {
    templateList: getMyDraftList(state),
  };
}

export default withTranslation(['action', 'field', 'message'])(
  connect(mapStoreStateToProps)(TemplateList)
);
