import React, { Component } from 'react';
import { withStyles } from '@material-ui/core';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import PrimaryButton from '../../../../components/particial/PrimaryButton';
import Loading from '../../../../components/particial/Loading';
import CompletedOnboardTable from '../../../../components/Tables/completedOnboardTable';
import Dialog from '@material-ui/core/Dialog';
import {
  getCompletedList,
  DownloadCompleted,
  handleRemind,
  completedAction,
} from '../../../../../apn-sdk/onBoarding';
import { showErrorMessage } from '../../../../actions';
import AlertDialog from '../../../../components/particial/AlertDialog';
import RejectDialog from './rejectDialog';
import S3LinkDialog from './s3LinkDialog';
import { getIndexList, sortList } from '../../../../../utils/index';
let status = {};

const styles = {
  root: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
  },
  title: {
    display: 'flex',
    justifyContent: 'space-between;',
    marginBottom: 10,
  },
  RemindBtn: {
    
    fontSize: '14px',
    color: '#505050',
    cursor: 'pointer',
  },
};

const columns = [
  {
    colName: 'Document',
    colWidth: 160,
    flexGrow: 2,
    col: 'documentName',
    fixed: true,
    type: 'name',
    sortable: true,
  },
  {
    colName: 'Status',
    colWidth: 300,
    flexGrow: 2,
    col: 'approvalStatus',
    type: 'Status',
    fixed: true,
    sortable: true,
  },
  {
    colName: 'Assigned On',
    colWidth: 220,
    flexGrow: 2,
    type: 'date',
    col: 'assignedOnDate',
    fixed: true,
    sortable: true,
  },
  {
    colName: 'Activity',
    colWidth: 360,
    flexGrow: 2,
    col: 'Activity',
    type: 'Activity',
    fixed: true,
  },
  {
    colName: 'Action',
    colWidth: 360,
    flexGrow: 2,
    col: 'Action',
    type: 'Action',
    fixed: true,
  },
];

const handleDownload = (response, filename) => {
  const linkElement = document.createElement('a');
  try {
    const blob = new Blob([response], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = window.URL.createObjectURL(blob);
    linkElement.setAttribute('href', url);
    linkElement.setAttribute('download', filename);
    const clickEvent = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: false,
    });
    linkElement.dispatchEvent(clickEvent);
  } catch (ex) {
    console.log(ex);
  }
};

class Completed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      btnLoading: false,
      colSortDirs: {},
      completedList: [],
      selected: Immutable.Set(),
      handleDialog: null,
      indexList: Immutable.Map(),
      filters: status.filters || Immutable.Map(),
      colSortDirs: status.colSortDirs || {},
      newApplicationId: props.applicationId,
    };
  }

  componentDidMount() {
    this.getCompletedList();
  }

  static getDerivedStateFromProps(props, state) {
    const { applicationId } = props;
    if (state.newApplicationId !== applicationId) {
      return {
        newApplicationId: applicationId,
      };
    }
    return null;
  }

  componentDidUpdate(props) {
    if (props.applicationId !== this.props.applicationId) {
      this.setState({
        loading: false,
        btnLoading: false,
        colSortDirs: {},
        completedList: [],
        selected: Immutable.Set(),
        handleDialog: null,
        indexList: Immutable.Map(),
        filters: status.filters || Immutable.Map(),
        colSortDirs: status.colSortDirs || {},
      });
      this.getCompletedList();
    }
  }

  getCompletedList = () => {
    const { selected, completedList, filters, newApplicationId } = this.state;
    const selectIds = completedList.map((item) => item.id);
    const filteredSelected = selected.intersect(selectIds);
    this.setState({ loading: false });
    getCompletedList(newApplicationId)
      .then(({ response }) => {
        this.setState({
          loading: true,
          completedList: response,
          selected: selected.subtract(filteredSelected),
          indexList: getIndexList(Immutable.fromJS(response), filters, {}),
        });
      })
      .catch((err) => {
        this.setState({
          loading: true,
        });
        this.props.dispatch(showErrorMessage(err));
      });
  };

  onSortChange = (columnKey, sortDir) => {
    const { completedList } = this.state;
    let filteredIndex;
    filteredIndex = sortDir
      ? sortList(
          this.state.indexList,
          Immutable.fromJS(completedList),
          columnKey,
          sortDir
        )
      : getIndexList(Immutable.fromJS(completedList), this.state.filters);

    this.setState({
      indexList: filteredIndex,
      colSortDirs: {
        [columnKey]: sortDir,
      },
    });
  };

  onSelectAll = () => {
    const { selected, completedList } = this.state;
    const selectIds = completedList.map((item) => item.id);
    const filteredSelected = selected.intersect(selectIds);
    if (filteredSelected.size > 0) {
      this.setState({ selected: selected.subtract(filteredSelected) });
    } else {
      this.setState({ selected: selected.union(selectIds) });
    }
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

  activitySpliceData = (item) => {
    const lastOperationDate = item.lastOperationDate
      ? moment(item.lastOperationDate).format('MM/DD/YYYY HH:mm A')
      : null;
    const lastOperationBy = item.lastOperationBy;
    const documentName = item.documentName;
    const documentNameUploaded = item.documentNameUploaded;
    switch (item.operationStatus) {
      case 'READ':
        return `Last Read ${lastOperationDate}`;
      case 'MARK_AS_COMPLETED':
        return `Mark as Complete by ${lastOperationBy} ${lastOperationDate}`;
      case 'REWORKED':
        return `Redid this item by ${lastOperationBy} ${lastOperationDate}`;
      case 'UPLOADED':
        return `Uploaded ${documentNameUploaded} by ${lastOperationBy} ${lastOperationDate}`;
      case 'COMPLETE_AND_SIGNED':
        return `Complete and signed ${documentName} by ${lastOperationBy} ${lastOperationDate}`;
      default:
        return ``;
    }
  };

  statusSpliceData = (item) => {
    const status = item.approvalStatus.toLowerCase();
    const actionRequired = item.actionRequired;
    const lastApprovalDate = item.lastApprovalDate
      ? moment(item.lastApprovalDate).format('MM/DD/YYYY HH:mm A')
      : null;
    const lastApprovalBy = item.lastApprovalBy;
    switch (item.approvalStatus) {
      case 'PENDING':
        return `Pending`;
      case 'MISSING':
        return `Missing`;
      case 'REJECTED':
        return `Rejected ${`by ${lastApprovalBy} on ${lastApprovalDate}`}`;
      case 'ACCEPTED':
        return `Accepted ${
          actionRequired !== 'READ_ONLY'
            ? `by ${lastApprovalBy} on ${lastApprovalDate}`
            : ''
        }`;
      case 'DELETED':
        return `Deleted by ${lastApprovalBy} on ${lastApprovalDate}`;
      default:
        return `${status}`;
    }
  };

  Download = () => {
    const { selected, completedList, indexList, newApplicationId } = this.state;
    this.setState({ btnLoading: true, loading: false });
    let list = selected.toJS();
    const tableData = indexList
      .map((item) => Immutable.fromJS(completedList).get(item))
      .toJS();
    const tableList = tableData.filter((item) => list.includes(item.id));
    const tableArr = [];
    tableList.forEach((item) => {
      tableArr.push({
        documentSourceName: item.documentSourceName,
        approvalDetails: this.statusSpliceData(item),
        assignedOnDate: moment(item.assignedOnDate).format(
          'MM/DD/YYYY HH:mm A'
        ),
        operationDetails: this.activitySpliceData(item),
      });
    });
    const params = {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      documents: tableArr,
    };
    DownloadCompleted(params, newApplicationId)
      .then(({ response, headers }) => {
        let hearderFilename = decodeURI(headers.get('content-disposition'));
        let filename = hearderFilename.split('=')[1];
        handleDownload(response, filename);
        this.setState({ btnLoading: false, loading: true });
      })
      .catch((err) => {
        this.setState({ btnLoading: false, loading: true });
        this.props.dispatch(showErrorMessage(err));
      });
  };

  Remind = () => {
    const { btnLoading, completedList } = this.state;
    const { talents, pathId } = this.props;
    const { t } = this.props;
    if (btnLoading || completedList.length === 0) {
      return;
    }
    this.setState({
      dialogOkLabel: t('action:Send'),
      dialogCancelLabel: t('action:cancel'),
      dialogTitle: `Are you sure to send a reminder email to ${talents[pathId].fullName}?`,
      dialogContent:
        ' Once you confirmed, the system will automatically send an email to the candidate for missing documents.',
      handleDialog: () => {
        this.handleRemind();
        this.setState({
          handleDialog: null,
          dialogOkLabel: null,
          dialogCancelLabel: null,
          dialogTitle: null,
          dialogContent: null,
        });
      },
    });
  };

  handleRemind = () => {
    const { newApplicationId } = this.state;
    // this.setState({ btnLoading: true });
    handleRemind(newApplicationId)
      .then(({ response }) => {
        // this.setState({ btnLoading: false });
      })
      .catch((err) => {
        this.props.dispatch(showErrorMessage(err));
      });
  };

  completedAction = (item, type) => {
    const { t } = this.props;
    switch (type) {
      case 'Delete':
        this.setState({
          dialogOkLabel: t('action:Delete'),
          dialogCancelLabel: t('action:cancel'),
          dialogTitle: `Are you sure to delete ${item.documentName}?`,
          dialogContent:
            'Once you delete, the document will also deleted from candidate portal and it won’t recovery again.',
          handleDialog: () => {
            this.handleBtnClick(item, 'DELETED');
            this.setState({
              handleDialog: null,
              dialogOkLabel: null,
              dialogCancelLabel: null,
              dialogTitle: null,
              dialogContent: null,
            });
          },
        });
        break;
      case 'Accept':
        this.handleBtnClick(item, 'ACCEPTED');
        break;
      case 'Reject':
        this.setState({
          openRejectDialog: true,
          RejectItem: item,
        });
        break;
      default:
        break;
    }
  };

  handlReject = (item) => {
    let { RejectItem } = this.state;
    RejectItem.notes = item;
    this.handleBtnClick(RejectItem, 'REJECTED');
    this.setState({
      openRejectDialog: false,
      RejectItem: null,
    });
  };

  handleBtnClick = (item, type) => {
    const { newApplicationId } = this.state;
    this.setState({ loading: false });
    let params = {
      approveStatus: type,
      id: item.id,
      notes: item.notes,
      applicationId: newApplicationId,
    };
    completedAction(params)
      .then(({ response }) => {
        this.getCompletedList();
      })
      .catch((err) => {
        this.setState({
          loading: true,
        });
        this.props.dispatch(showErrorMessage(err));
      });
  };

  openS3linkDialog = (data) => {
    this.setState({
      openS3Link: true,
      s3Link: data,
    });
  };

  render() {
    const {
      loading,
      colSortDirs,
      selected,
      completedList,
      handleDialog,
      openRejectDialog,
      btnLoading,
      dialogTitle,
      dialogContent,
      dialogOkLabel,
      dialogCancelLabel,
      openS3Link,
      s3Link,
      indexList,
    } = this.state;
    const { classes, t } = this.props;

    let finalCompletedList = indexList
      .map((index) => Immutable.fromJS(completedList).get(index))
      .toJS();
    return (
      <div className={classes.root}>
        <div className={classes.title}>
          <PrimaryButton
            style={{ marginRight: 8 }}
            onClick={this.Download}
            size={'small'}
            disabled={selected.size === 0 || btnLoading}
            color={'default'}
            variant="outlined"
          >
            {'Download'}
          </PrimaryButton>
          <div
            className={classes.RemindBtn}
            onClick={this.Remind}
            style={{
              color: completedList.length === 0 ? '#00000042' : '#505050',
              cursor: completedList.length === 0 ? 'not-allowed' : 'pointer',
            }}
          >
            Remind Candidate
          </div>
        </div>

        {/* <div style={{ height: 283,overflow:'hidden',display:'flex',flex:'1' }}> */}
        {loading ? (
          <div
            className="flex-child-auto"
            style={{ overflow: 'hidden', position: 'relative' }}
          >
            <CompletedOnboardTable
              completedList={finalCompletedList}
              onSortChange={this.onSortChange}
              colSortDirs={colSortDirs}
              columns={columns}
              selected={selected}
              onSelect={this.onSelect}
              onSelectAll={this.onSelectAll}
              completedAction={this.completedAction}
              openS3linkDialog={this.openS3linkDialog}
            />
          </div>
        ) : (
          <Loading />
        )}
        {/* </div> */}

        <AlertDialog
          onOK={handleDialog}
          onCancel={() => {
            this.setState({
              handleDialog: null,
            });
          }}
          title={dialogTitle}
          content={<div>{dialogContent}</div>}
          okLabel={dialogOkLabel}
          cancelLabel={dialogCancelLabel}
        />

        <Dialog open={openRejectDialog} maxWidth="xs" fullWidth>
          <RejectDialog
            Save={this.handlReject}
            onClose={() => this.setState({ openRejectDialog: false })}
          />
        </Dialog>
        <Dialog open={openS3Link} maxWidth="lg" fullWidth>
          <S3LinkDialog
            previewSrc={s3Link}
            onClose={() => this.setState({ openS3Link: false })}
          />
        </Dialog>
      </div>
    );
  }
}

function mapStoreStateToProps(state, { match }) {
  const index = state.router.location.pathname.lastIndexOf('/');
  const pathId = state.router.location.pathname.substring(
    index + 1,
    state.router.location.pathname.length
  );
  return {
    pathId: pathId,
    talents: state.model.talents.toJS(),
    applications: state.relationModel.applications,
    applicationId: state.controller.openOnboarding.action.applicationId,
  };
}
export default connect(mapStoreStateToProps)(withStyles(styles)(Completed));
