import React from 'react';
import parseRecordSelector from '../../../selectors/parseRecordSelector';
import { connect } from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';
import { getIndexList, makeCancelable, sortList } from '../../../../utils';
import { asyncPool } from '../../../../utils/asyncPool';
import {
  deleteParseRecord,
  getMyParseRecords,
} from '../../../actions/talentActions';
import Immutable from 'immutable';
import clsx from 'clsx';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import Dialog from '@material-ui/core/Dialog';

import AlertError from '@material-ui/icons/Error';
import ResumeTable from '../../../components/Tables/ResumeTable';
import Loading from '../../../components/particial/Loading';
// import Paper from '@material-ui/core/Paper';
// import ResumeFrame from '../../../components/particial/ResumeFrame/LoadableResumeFrame';
import IconButton from '@material-ui/core/IconButton';
// import CloseIcon from '@material-ui/icons/Close';
import PrimaryButton from '../../../components/particial/PrimaryButton';
import RefreshIcon from '@material-ui/icons/Sync';
import Divider from '@material-ui/core/Divider';
import { showErrorMessage } from '../../../actions';
import { Trans } from 'react-i18next';
import AlertDialog from '../../../components/particial/AlertDialog';

const columns = [
  {
    colName: 'fileName',
    colWidth: 200,
    flexGrow: 2,
    col: 'originalFileName',
    type: 'link',
    sortable: true,
    fixed: true,
  },
  {
    colName: 'Uploaded From',
    colWidth: 220,
    flexGrow: 2,
    col: 'hotList',
    type: 'source',
    disableSearch: true,
  },
  // {
  //   colName: 'OCRText',
  //   colWidth: 160,
  //   flexGrow: 2,
  //   col: 'originalText',
  //   sortable: true
  // },
  {
    colName: 'note',
    colWidth: 160,
    flexGrow: 3,
    col: 'note',
  },
  {
    colName: 'createdAt',
    colWidth: 160,
    col: 'createdDate',
    type: 'date',
    sortable: true,
    disableSearch: true,
  },
];
const status = {};
const styles = {
  flash: {
    animation: 'flash .8s linear infinite',
  },
  resumePreview: {
    position: 'absolute',
    height: '80vh',
    right: 0,
    bottom: 0,
    width: 600,
    margin: 12,
    zIndex: 1,
  },
  wrapper: {
    position: 'relative',
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
};

function onScrollEnd(scrollLeft, scrollTop) {
  status.scrollLeft = scrollLeft;
  status.scrollTop = scrollTop;
}

class ErrorResumes extends React.Component {
  constructor(props) {
    super(props);
    this.fTimer = setTimeout(() => {
      this.setState({ show: true });
    }, 850);

    this.state = {
      indexList: getIndexList(
        props.parseRecordList,
        status.filters,
        status.colSortDirs
      ),
      filters: status.filters || Immutable.Map(),
      filterOpen: status.filterOpen || false,
      colSortDirs: status.colSortDirs || {},
      selected: Immutable.Set(),

      processing: false,

      show: false,
      loading: true,
      openDialog: false,

      flashing: false,
    };
  }

  static getDerivedStateFromProps(props, state) {
    const indexList = getIndexList(
      props.parseRecordList,
      state.filters,
      state.colSortDirs
    );

    if (!indexList.equals(state.indexList)) {
      return { indexList };
    }
    return null;
  }

  componentDidMount() {
    console.timeEnd('ErrorResumes');
    this.fetchData();
  }

  componentDidUpdate(prevProps) {
    console.timeEnd('ErrorResumes');
    if (prevProps.parseRecordList.size < this.props.parseRecordList.size) {
      this.setState({ flashing: true });
      clearTimeout(this.flashTimer);
      this.flashTimer = setTimeout(() => {
        this.setState({ flashing: false });
      }, 1600);
    }
  }

  componentWillUnmount() {
    this.recordTask.cancel();
    clearTimeout(this.fTimer);
    clearTimeout(this.flashTimer);
    status.filters = this.state.filters;
    status.filterOpen = this.state.filterOpen;
    status.colSortDirs = this.state.colSortDirs;
  }

  fetchData = () => {
    this.recordTask = makeCancelable(this.props.dispatch(getMyParseRecords()));
    return this.recordTask.promise
      .then(() => this.setState({ loading: false }))
      .catch((reason) => {
        if (reason.isCanceled) {
          console.log('isCanceled');
        } else {
          console.log(reason);
          this.setState({ loading: false });
        }
      });
  };

  handleRefresh = (e) => {
    this.setState({ loading: true });
    this.fetchData();
  };

  handleDelete = (recordId) => {
    this.props.dispatch(deleteParseRecord(recordId));
  };

  handleBulkDelete = () => {
    this.setState({
      bulkDelete: () => {
        this.setState({ processing: true });
        const { parseRecordList, dispatch } = this.props;
        const { selected, indexList } = this.state;
        const filteredParseRecordList = indexList.map((index) =>
          parseRecordList.get(index)
        );
        const filteredSelected = selected
          .intersect(
            filteredParseRecordList.map((parseRecord) => parseRecord.get('id'))
          )
          .toJS();

        asyncPool(1, filteredSelected, (el) => {
          return dispatch(deleteParseRecord(el)).catch((err) =>
            dispatch(showErrorMessage(err))
          );
        }).finally(() =>
          this.setState({ processing: false, bulkDelete: null })
        );
      },
    });
  };

  handleCancelBulkDelete = () => {
    this.setState({ bulkDelete: null });
  };

  onSelect = (id) => {
    let selected = this.state.selected;
    if (!selected.includes(id)) {
      this.setState({
        selected: selected.add(id),
      });
    } else {
      this.setState({
        selected: selected.remove(id),
      });
    }
  };

  onSelectAll = () => {
    const { selected, indexList } = this.state;
    const { parseRecordList } = this.props;
    const filteredParseRecordList = indexList.map((index) =>
      parseRecordList.get(index)
    );
    const parseRecordIds = filteredParseRecordList.map((parseRecord) =>
      parseRecord.get('id')
    );
    const filteredSelected = selected.intersect(parseRecordIds);

    if (filteredSelected.size === parseRecordIds.size) {
      this.setState({ selected: selected.subtract(filteredSelected) });
    } else {
      this.setState({ selected: selected.union(parseRecordIds) });
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
      indexList: getIndexList(
        this.props.parseRecordList,
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
          this.props.parseRecordList,
          columnKey,
          sortDir
        )
      : getIndexList(this.props.parseRecordList, this.state.filters);

    this.setState({
      indexList: filteredIndex,
      colSortDirs: {
        [columnKey]: sortDir,
      },
    });
  };

  render() {
    console.time('ErrorResumes');
    const { parseRecordList, classes, t } = this.props;
    const {
      flashing,
      loading,
      openDialog,
      show,
      selected,
      indexList,
      colSortDirs,
      filters,
      processing,
      bulkDelete,
    } = this.state;
    const filteredParseRecordList = indexList.map((index) =>
      parseRecordList.get(index)
    );
    const filteredSelected = selected.intersect(
      filteredParseRecordList.map((parseRecord) => parseRecord.get('id'))
    );
    return (
      <>
        {parseRecordList.size > 0 && (
          <div className="item-padding">
            <Tooltip
              title={
                'An error occured during the process of creating candidates. You need to manually edit these candidates under [Error resumes] to finish creating these candidates.'
              }
              placement="bottom-end"
              arrow
            >
              <Button
                onClick={() => this.setState({ openDialog: true })}
                variant="outlined"
                color="secondary"
                style={{ borderRadius: 30 }}
                startIcon={<AlertError />}
                size="small"
                className={clsx({ [classes.flash]: flashing })}
              >
                {parseRecordList.size.toLocaleString()} {'Error Resumes'}
              </Button>
            </Tooltip>
          </div>
        )}

        <Dialog
          open={openDialog}
          onClose={() => this.setState({ openDialog: false })}
          fullWidth
          maxWidth="md"
          disableEnforceFocus
        >
          {show ? (
            <>
              <div
                className="horizontal-layout align-middle item-padding"
                style={{ height: 56 }}
              >
                <Typography variant="h6">{'Error Resume'}</Typography>
                <div className="flex-child-auto" />

                <div className="item-padding">
                  <div
                    className={classes.wrapper}
                    ref={(el) => (this.anchorEl = el)}
                  >
                    <PrimaryButton
                      onClick={this.handleBulkDelete}
                      disabled={!filteredSelected.size}
                      processing={processing}
                      style={{ width: 160 }}
                      size="small"
                    >
                      {t('action:bulkDelete')}
                    </PrimaryButton>
                  </div>
                </div>
                <Tooltip title={t('action:refresh')} disableFocusListener>
                  <IconButton onClick={this.handleRefresh} size="small">
                    <RefreshIcon className={loading ? 'my-spin' : ''} />
                  </IconButton>
                </Tooltip>
              </div>
              <Divider />
              <div
                className="flex-child-auto"
                style={{ overflow: 'hidden', height: 600 }}
              >
                <ResumeTable
                  parseRecordList={filteredParseRecordList}
                  selected={filteredSelected}
                  onSelect={this.onSelect}
                  onSelectAll={this.onSelectAll}
                  filterOpen={true}
                  colSortDirs={colSortDirs}
                  filters={filters}
                  onSortChange={this.onSortChange}
                  onFilter={this.onFilter}
                  onScrollEnd={onScrollEnd}
                  scrollLeft={status.scrollLeft}
                  scrollTop={status.scrollTop}
                  onDelete={this.handleDelete}
                  columns={columns}
                />
              </div>
              <Divider />
              <div className="container-padding">
                <PrimaryButton
                  onClick={() => this.setState({ openDialog: false })}
                >
                  {t('action:close')}
                </PrimaryButton>
              </div>
            </>
          ) : (
            <Loading />
          )}
        </Dialog>

        <AlertDialog
          onOK={bulkDelete}
          onCancel={this.handleCancelBulkDelete}
          title={t('common:deleteResume')}
          content={'Are you sure you want to delete selected resumes?'}
          okLabel={t('action:confirm')}
          cancelLabel={t('action:cancel')}
        />
      </>
    );
  }
}

function mapStoreStateToProps(state) {
  return {
    parseRecordList: parseRecordSelector(state),
  };
}

export default connect(mapStoreStateToProps)(withStyles(styles)(ErrorResumes));
