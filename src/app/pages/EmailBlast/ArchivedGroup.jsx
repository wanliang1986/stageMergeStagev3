import React from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { getIndexList, sortList } from '../../../utils';
import {
  getMyEmailBlastList,
  deleteEmailBlast,
  changeEmailStatus,
} from '../../actions/emailAction';
import Immutable from 'immutable';
import PropTypes from 'prop-types';
import emailBlastSelector from '../../selectors/emailBlastSelector';
import { ADD_SEND_EMAIL_REQUEST } from '../../constants/actionTypes';
import { SEND_EMAIL_TYPES } from '../../constants/formOptions';

import Paper from '@material-ui/core/Paper';
import ArchivedGroupTable from '../../components/Tables/ArchivedGroupTable';
import AlertDialog from '../../components/particial/AlertDialog';

let status = {};
const columns = [
  {
    colName: 'name',
    colWidth: 160,
    flexGrow: 1,
    col: 'name',
    type: 'link',
    sortable: true,
  },
  {
    colName: 'recipientCount',
    colWidth: 160,
    flexGrow: 1,
    col: 'recipientCount',
    sortable: true,
    disableSearch: true,
  },
  {
    colName: 'sendCount',
    colWidth: 160,
    flexGrow: 1,
    col: 'sendCount',
    sortable: true,
    disableSearch: true,
  },
  {
    colName: 'Archived Date',
    colWidth: 160,
    flexGrow: 1,
    col: 'archivedDate',
    type: 'date',
    sortable: true,
    disableSearch: true,
  },
];

function onScrollEnd(scrollLeft, scrollTop) {
  status.scrollLeft = scrollLeft;
  status.scrollTop = scrollTop;
}

class ArchivedGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      indexList: getIndexList(
        props.emailBlastList,
        status.filters,
        status.colSortDirs
      ),
      filters: status.filters || Immutable.Map(),
      filterOpen: status.filterOpen || false,
      colSortDirs: status.colSortDirs || {},

      selected: null, // selected contact
      openForm: false,

      selectedIds: Immutable.Set(),
    };
  }

  componentDidMount() {
    // this.fetchData();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      nextProps.emailBlastList &&
      !nextProps.emailBlastList.equals(this.props.emailBlastList)
    ) {
      this.setState({
        indexList: getIndexList(
          nextProps.emailBlastList,
          this.state.filters,
          this.state.colSortDirs
        ),
      });
    }
  }

  fetchData() {
    this.props.dispatch(getMyEmailBlastList());
  }

  onFilter = (input) => {
    let filters = this.state.filters;

    let col = input.name;
    let query = input.value;
    if (filters.get(col) === query) {
      return;
    }
    if (!query) {
      filters = filters.remove(col);
    } else {
      filters = filters.set(col, query);
    }

    this.setState({
      filters,
      indexList: getIndexList(
        this.props.emailBlastList,
        filters,
        this.state.colSortDirs
      ),
    });
  };

  onSortChange = (columnKey, sortDir) => {
    let filteredIndex;

    filteredIndex = sortDir
      ? sortList(
          this.state.indexList,
          this.props.emailBlastList,
          columnKey,
          sortDir
        )
      : getIndexList(this.props.emailBlastList, this.state.filters);

    this.setState({
      indexList: filteredIndex,
      colSortDirs: {
        [columnKey]: sortDir,
      },
    });
  };

  onSelect = (id) => {
    let selectedIds = this.state.selectedIds;
    if (selectedIds.includes(id)) {
      selectedIds = selectedIds.delete(id);
    } else {
      selectedIds = selectedIds.add(id);
    }
    this.setState({ selectedIds });
  };

  checkAllBoxOnCheckHandler = () => {
    let { selectedIds, indexList } = this.state;
    let { emailBlastList } = this.props;
    const filteredIds = indexList.map((index) =>
      emailBlastList.getIn([index, 'id'])
    );
    const filteredSelected = selectedIds.intersect(filteredIds);

    if (filteredSelected.size === filteredIds.size) {
      this.setState({ selectedIds: selectedIds.subtract(filteredSelected) });
    } else {
      this.setState({ selectedIds: selectedIds.union(filteredIds) });
    }
  };

  handleEmailListUpsert = (selected) => {
    this.setState({ selected, openForm: true });
  };

  handleDeleteEmailBlast = (toDelete) => {
    const { dispatch } = this.props;
    this.setState({
      handleDeleteEmailBlast: () =>
        dispatch(deleteEmailBlast(toDelete)).then(
          this.handleCancelDeleteEmailBlast
        ),
    });
  };
  handleCancelDeleteEmailBlast = () => {
    this.setState({
      handleDeleteEmailBlast: null,
    });
  };
  handleArchiveEmail = (id) => {
    const { dispatch } = this.props;
    this.setState({
      handleArchiveEmail: () => {
        dispatch(changeEmailStatus(id, 'VALID')).then(
          this.handleCancelArchiveEmail(),
          this.fetchData()
        );
      },
    });
  };

  handleCancelArchiveEmail = () => {
    this.setState({
      handleArchiveEmail: null,
    });
  };

  handleSendEmailBlast = () => {
    const { t, dispatch, emailBlastList } = this.props;
    const { selectedIds, indexList } = this.state;

    const filteredEmailBlastList = indexList.map((index) =>
      emailBlastList.get(index)
    );
    const filteredSelected = selectedIds.intersect(
      filteredEmailBlastList.map((el) => el.get('id'))
    );

    dispatch({
      type: ADD_SEND_EMAIL_REQUEST,
      request: {
        type: SEND_EMAIL_TYPES.SendEmailBlast,
        data: {
          emailListIds: filteredSelected.join(),
          t,
        },
      },
    });
  };

  render() {
    const {
      emailBlastList,
      tReady,
      reportNS,
      defaultNS,
      i18nOptions,
      ...props
    } = this.props;

    const {
      filters,
      colSortDirs,
      selected,
      selectedIds,
      indexList,
      handleDeleteEmailBlast,
      handleArchiveEmail,
    } = this.state;

    const filteredEmailBlastList = indexList.map((index) =>
      emailBlastList.get(index)
    );
    const filteredSelected = selectedIds.intersect(
      filteredEmailBlastList.map((el) => el.get('id'))
    );

    return (
      <Paper className="flex-child-auto flex-container flex-dir-column">
        <div className="flex-child-auto" style={{ overflow: 'hidden' }}>
          <ArchivedGroupTable
            columns={columns}
            hotListList={filteredEmailBlastList}
            filters={filters}
            onFilter={this.onFilter}
            filterOpen={true}
            colSortDirs={colSortDirs}
            onSortChange={this.onSortChange}
            onScrollEnd={onScrollEnd}
            scrollLeft={status.scrollLeft}
            scrollTop={status.scrollTop}
            onArchive={this.handleArchiveEmail}
            t={props.t}
          />
        </div>
        <AlertDialog
          onOK={handleArchiveEmail}
          onCancel={this.handleCancelArchiveEmail}
          content={props.t('message:confirmValidEmailBlast')}
          okLabel={props.t('action:sumbit')}
          cancelLabel={props.t('action:cancel')}
        />
      </Paper>
    );
  }
}

ArchivedGroup.propTypes = {
  emailBlastList: PropTypes.instanceOf(Immutable.List),
};

function mapStoreStateToProps(state) {
  return {
    emailBlastList: emailBlastSelector(state).filter(
      (u) => u.get('status') === 'ARCHIVED'
    ),
  };
}

export default withTranslation(['action', 'message', 'field'])(
  connect(mapStoreStateToProps)(ArchivedGroup)
);
