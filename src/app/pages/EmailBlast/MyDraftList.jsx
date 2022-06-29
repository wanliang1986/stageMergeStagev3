import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import Immutable from 'immutable';
import { draftList, deleteDraft } from '../../actions/emailAction';
import { makeCancelable, getIndexList, sortList } from '../../../utils/index';
import { showErrorMessage } from '../../actions';
import { ADD_SEND_EMAIL_REQUEST } from '../../constants/actionTypes';
import { SEND_EMAIL_TYPES } from '../../constants/formOptions';

import Paper from '@material-ui/core/Paper';

import EmailDraftTable from '../../components/Tables/EmailDraftTable';
import AlertDialog from '../../components/particial/AlertDialog';
import Loading from '../../components/particial/Loading';

const columns = [
  {
    colName: 'subject',
    colWidth: 240,
    flexGrow: 1,
    col: 'subject',
    type: 'sendEmail',
    sortable: true,
    disableSearch: true,
  },
  {
    colName: 'To (Email Blast Group)',
    colWidth: 240,
    flexGrow: 1,
    col: 'mailingLists',
    type: 'tos',
    sortable: true,
    disableSearch: true,
  },
  {
    colName: 'createdAt',
    colWidth: 120,
    flexGrow: 1,
    col: 'timestamp',
    type: 'date',
    sortable: true,
    disableSearch: true,
  },
];

let status = {};

function onScrollEnd(scrollLeft, scrollTop) {
  status.scrollLeft = scrollLeft;
  status.scrollTop = scrollTop;
}

class DraftList extends React.PureComponent {
  constructor(props) {
    super(props);
    console.log('pros', props);
    this.state = {
      indexList: Immutable.List(),
      filters: status.filters || Immutable.Map(),
      filterOpen: status.filterOpen || false,
      colSortDirs: status.colSortDirs || {},
      selected: null, // selected draft

      handleDeleteDraft: null,
      toSend: null,
      firstFetching: true,
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  static getDerivedStateFromProps(props, state) {
    const indexList = getIndexList(
      props.draftList,
      state.filters,
      state.colSortDirs
    );
    if (!indexList.equals(state.indexList)) {
      return { indexList };
    }
    return null;
  }

  componentWillUnmount() {
    this.task.cancel();
    status.filters = this.state.filters;
    status.filterOpen = this.state.filterOpen;
    status.colSortDirs = this.state.colSortDirs;
  }

  fetchData() {
    this.task = makeCancelable(this.props.dispatch(draftList()));
    this.task.promise
      .then((res) => this.setState({ firstFetching: false }))
      .catch((err) => {
        if (!err.isCanceled) {
          this.setState({ firstFetching: false });
          this.props.dispatch(showErrorMessage(err));
        }
      });
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
        this.props.draftList,
        filters,
        this.state.colSortDirs
      ),
    });
  };

  onSortChange = (columnKey, sortDir) => {
    let filteredIndex;

    filteredIndex = sortDir
      ? sortList(this.state.indexList, this.props.draftList, columnKey, sortDir)
      : getIndexList(this.props.draftList, this.state.filters);

    this.setState({
      indexList: filteredIndex,
      colSortDirs: {
        [columnKey]: sortDir,
      },
    });
  };

  openSendEmailForm = (toSend) => {
    console.log('called', toSend);
    this.setState({ toSend });
  };

  handleDelete = (draft) => {
    const { dispatch } = this.props;
    this.setState({
      handleDeleteDraft: () =>
        dispatch(deleteDraft(draft.get('id'))).then(this.handleCancelDelete),
    });
  };

  handleCancelDelete = () => {
    this.setState({
      handleDeleteDraft: null,
    });
  };

  handleSendEmailBlast = (toSend) => {
    const { t, dispatch, draftList } = this.props;
    const { indexList } = this.state;
    const filteredDraftList = indexList.map((index) => draftList.get(index));

    dispatch({
      type: ADD_SEND_EMAIL_REQUEST,
      request: {
        type: SEND_EMAIL_TYPES.SendEmailBlast,
        data: {
          emailListIds: filteredDraftList
            .get(toSend)
            .get('mailingLists')
            .map((ele) => ele.get('id'))
            .toJS()
            .join(','),
          toSend: filteredDraftList.get(toSend) || Immutable.Map(),
          fromDraft: true,
          t,
        },
      },
    });
  };

  render() {
    const { draftList, location, ...props } = this.props;
    const {
      filterOpen,
      indexList,
      colSortDirs,
      handleDeleteDraft,
      toSend,
      firstFetching,
    } = this.state;

    if (firstFetching) {
      return <Loading />;
    }

    const filteredDraftList = indexList.map((index) => draftList.get(index));

    return (
      <Paper
        key={location.key}
        className="flex-child-auto flex-container flex-dir-column"
      >
        <div className="flex-child-auto" style={{ overflow: 'hidden' }}>
          <EmailDraftTable
            columns={columns}
            templateList={filteredDraftList}
            onFilter={this.onFilter}
            filterOpen={filterOpen}
            colSortDirs={colSortDirs}
            onSortChange={this.onSortChange}
            onScrollEnd={onScrollEnd}
            scrollLeft={status.scrollLeft}
            scrollTop={status.scrollTop}
            filters={this.state.filters}
            onDelete={this.handleDelete}
            openSendEmailForm={this.handleSendEmailBlast}
          />
        </div>

        <AlertDialog
          onOK={handleDeleteDraft}
          onCancel={this.handleCancelDelete}
          title={props.t('common:Delete Draft')}
          content={'Are you sure you wish to delete this draft?'}
          okLabel={props.t('action:delete')}
          cancelLabel={props.t('action:cancel')}
        />
      </Paper>
    );
  }
}

DraftList.propTypes = {
  draftList: PropTypes.instanceOf(Immutable.List).isRequired,
  t: PropTypes.func.isRequired,
};

function mapStoreStateToProps(state) {
  return {
    draftList: state.model.emailDraft.toList(),
  };
}

export default withTranslation(['action', 'field', 'message'])(
  connect(mapStoreStateToProps)(DraftList)
);
