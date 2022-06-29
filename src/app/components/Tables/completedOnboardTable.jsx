import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Tooltip from '@material-ui/core/Tooltip';
import AutoSizer from '../../../lib/auto-sizer';
import Checkbox from '@material-ui/core/Checkbox';
import { Table, Column, Cell } from 'fixed-data-table-2';
import ReactTooltip from 'react-tooltip';
import PrimaryButton from '../../components/particial/PrimaryButton';
import HeaderCell from './TableCell/HeaderCell';
import moment from 'moment-timezone';
import { style, HEADER_HEIGHT, ROW_HEIGHT } from './params';

const NameCell = ({ rowIndex, data, col, ...props }) => {
  const id = data[rowIndex].id;
  if (id) {
    const documentName = data[rowIndex].documentName;
    return (
      <Cell {...props}>
        <Tooltip title={documentName} arrow placement="top">
          <div
            className="overflow_ellipsis_1"
            style={{ width: props.width - 26 }}
            onClick={() => {
              // this.props.history.push();
            }}
          >
            {documentName}
          </div>
        </Tooltip>
      </Cell>
    );
  }
  return <Cell {...props}>Loading...</Cell>;
};

const StatusCell = ({ rowIndex, data, col, ...props }) => {
  const approvalStatus = data[rowIndex].approvalStatus;
  const actionRequired = data[rowIndex].actionRequired;
  const lastApprovalDate = data[rowIndex].lastApprovalDate
    ? moment(data[rowIndex].lastApprovalDate).format('MM/DD/YYYY HH:mm A')
    : null;
  const lastApprovalBy = data[rowIndex].lastApprovalBy;
  if (data[rowIndex].id) {
    let status = approvalStatus.toLowerCase();
    switch (approvalStatus) {
      case 'PENDING':
      case 'MISSING':
        return (
          <Cell {...props} style={{ textTransform: 'capitalize' }}>
            <Tooltip title={'Missing'} placement="top" arrow>
              <span>{status}</span>
            </Tooltip>
          </Cell>
        );
      case 'REJECTED':
        return (
          <Cell {...props} style={{ textTransform: 'capitalize' }}>
            <Tooltip
              title={`Rejected ${`by ${lastApprovalBy} on ${lastApprovalDate}`}`}
              placement="top"
              arrow
            >
              <div>
                {status}
                <span style={{ marginRight: 4, marginLeft: 4 }}>
                  by {lastApprovalBy}
                </span>
                on <span style={{ marginLeft: 4 }}>{lastApprovalDate}</span>
              </div>
            </Tooltip>
          </Cell>
        );
      case 'ACCEPTED':
        return (
          <Cell {...props} style={{ textTransform: 'capitalize' }}>
            <Tooltip
              title={`Accepted ${
                actionRequired !== 'READ_ONLY'
                  ? `by ${lastApprovalBy} on ${lastApprovalDate}`
                  : ''
              }`}
              placement="top"
              arrow
            >
              <div>
                {status}
                {actionRequired !== 'READ_ONLY' && (
                  <span>
                    <span style={{ marginRight: 4, marginLeft: 4 }}>
                      by {lastApprovalBy}
                    </span>
                    on<span style={{ marginLeft: 4 }}>{lastApprovalDate}</span>
                  </span>
                )}
              </div>
            </Tooltip>
          </Cell>
        );
      case 'DELETED':
        return (
          <Cell {...props} style={{ textTransform: 'capitalize' }}>
            <Tooltip
              title={`Deleted by ${lastApprovalBy} on ${lastApprovalDate}`}
              placement="top"
              arrow
            >
              <div>
                {status}
                <span style={{ marginRight: 4, marginLeft: 4 }}>
                  by {lastApprovalBy}
                </span>
                on<span style={{ marginLeft: 4 }}>{lastApprovalDate}</span>
              </div>
            </Tooltip>
          </Cell>
        );

      default:
        return (
          <Cell {...props} style={{ textTransform: 'capitalize' }}>
            <Tooltip title={status} placement="top" arrow>
              <span>{status}</span>
            </Tooltip>
          </Cell>
        );
    }
  } else {
    return <Cell {...props}>Loading...</Cell>;
  }
};

const DateCell = ({ rowIndex, data, col, ...props }) => {
  if (data[rowIndex].id) {
    const assignedOnDate = data[rowIndex].assignedOnDate
      ? moment(data[rowIndex].assignedOnDate).format('MM/DD/YYYY HH:mm A')
      : null;
    return (
      <Cell {...props}>
        <div
          className="overflow_ellipsis_1"
          style={{ width: props.width - 26 }}
        >
          {assignedOnDate}
        </div>
      </Cell>
    );
  }
  return <Cell {...props}>Loading...</Cell>;
};

const ActivityCell = ({ rowIndex, openS3linkDialog, data, col, ...props }) => {
  const operationStatus = data[rowIndex].operationStatus;
  const lastOperationDate = data[rowIndex].lastOperationDate
    ? moment(data[rowIndex].lastOperationDate).format('MM/DD/YYYY HH:mm A')
    : null;
  const lastOperationBy = data[rowIndex].lastOperationBy;
  const documentName = data[rowIndex].documentName;
  const documentNameUploaded = data[rowIndex].documentNameUploaded?.substring(
    0,
    data[rowIndex].documentNameUploaded.lastIndexOf('.')
  );
  const item = data[rowIndex];
  if (data[rowIndex].id) {
    let status = operationStatus?.toLowerCase();
    switch (operationStatus) {
      case 'READ':
        return (
          <Cell {...props}>
            <Tooltip
              title={`Last Read ${lastOperationDate}`}
              placement="top"
              arrow
            >
              <div
                style={{
                  maxWidth: 340,
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                }}
              >
                Last{' '}
                <span
                  style={{
                    textTransform: 'capitalize',
                    marginRight: 4,
                    marginLeft: 4,
                  }}
                >
                  {status}
                </span>
                <span style={{ marginLeft: 4 }}>{lastOperationDate}</span>
              </div>
            </Tooltip>
          </Cell>
        );
      case 'MARK_AS_COMPLETED':
        return (
          <Cell {...props}>
            <Tooltip
              title={`Mark as Complete by ${lastOperationBy} ${lastOperationDate}`}
              placement="top"
              arrow
            >
              <div
                style={{
                  maxWidth: 340,
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                }}
              >
                Mark as Complete by
                <span style={{ marginRight: 4, marginLeft: 4 }}>
                  {lastOperationBy}
                </span>
                <span style={{ marginLeft: 4 }}>{lastOperationDate}</span>
              </div>
            </Tooltip>
          </Cell>
        );
      case 'REWORKED':
        return (
          <Cell {...props}>
            <Tooltip
              title={`Redid this item by ${lastOperationBy} ${lastOperationDate}`}
              placement="top"
              arrow
            >
              <div
                style={{
                  maxWidth: 340,
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                }}
              >
                Redid this item by
                <span style={{ marginRight: 4, marginLeft: 4 }}>
                  {lastOperationBy}
                </span>
                <span style={{ marginLeft: 4 }}>{lastOperationDate}</span>
              </div>
            </Tooltip>
          </Cell>
        );
      case 'UPLOADED':
        return (
          <Cell {...props}>
            <Tooltip
              title={`Uploaded ${documentNameUploaded} by ${lastOperationBy} ${lastOperationDate}`}
              placement="top"
              arrow
            >
              <div
                style={{
                  maxWidth: 340,
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                }}
              >
                Uploaded
                <span
                  style={{
                    marginLeft: 4,
                    marginRight: 4,
                    color: '#3598dc',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    openS3linkDialog(item);
                  }}
                >
                  {documentNameUploaded}
                </span>
                by
                <span style={{ marginRight: 4, marginLeft: 4 }}>
                  {lastOperationBy}
                </span>
                <span style={{ marginLeft: 4 }}>{lastOperationDate}</span>
              </div>
            </Tooltip>
          </Cell>
        );
      case 'COMPLETE_AND_SIGNED':
        return (
          <Cell {...props}>
            <Tooltip
              title={`Complete And Signed ${documentName} by ${lastOperationBy} ${lastOperationDate}`}
              placement="top"
              arrow
            >
              <div
                style={{
                  maxWidth: 340,
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                }}
              >
                <span style={{ textTransform: 'capitalize', marginRight: 4 }}>
                  Complete And Signed
                </span>
                <span
                  style={{
                    marginRight: 4,
                    color: '#3598dc',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    openS3linkDialog(item);
                  }}
                >
                  {documentName}
                </span>
                by
                <span style={{ marginRight: 4, marginLeft: 4 }}>
                  {lastOperationBy}
                </span>
                <span style={{ marginLeft: 4 }}>{lastOperationDate}</span>
              </div>
            </Tooltip>
          </Cell>
        );

      default:
        return <Cell {...props} style={{ textTransform: 'capitalize' }}></Cell>;
    }
  } else {
    return <Cell {...props}>Loading...</Cell>;
  }
};

const ActionCell = ({ rowIndex, data, col, tableBtnOnClick, ...props }) => {
  const approvalStatus = data[rowIndex].approvalStatus;
  let item = data[rowIndex];
  if (data[rowIndex].id) {
    switch (approvalStatus) {
      case 'PENDING':
        return (
          <Cell {...props}>
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <PrimaryButton
                style={{ marginRight: 8 }}
                onClick={() => {
                  tableBtnOnClick(item, 'Delete');
                }}
                size={'small'}
                color={'default'}
                variant="outlined"
              >
                {'Delete'}
              </PrimaryButton>
              <PrimaryButton
                style={{ marginRight: 8 }}
                onClick={() => {
                  tableBtnOnClick(item, 'Accept');
                }}
                size={'small'}
                color={'default'}
                variant="outlined"
              >
                {'Accept'}
              </PrimaryButton>
              <PrimaryButton
                style={{ marginRight: 8 }}
                onClick={() => {
                  tableBtnOnClick(item, 'Reject');
                }}
                size={'small'}
                color={'default'}
                variant="outlined"
              >
                {'Reject'}
              </PrimaryButton>
            </div>
          </Cell>
        );

      case 'MISSING':
      case 'REJECTED':
      case 'ACCEPTED':
        return (
          <Cell {...props}>
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <PrimaryButton
                style={{ marginRight: 8 }}
                onClick={() => {
                  tableBtnOnClick(item, 'Delete');
                }}
                size={'small'}
                color={'default'}
                variant="outlined"
              >
                {'Delete'}
              </PrimaryButton>
            </div>
          </Cell>
        );

      case 'DELETED':
        return <Cell {...props}></Cell>;

      default:
        return <Cell {...props}></Cell>;
    }
  } else {
    return <Cell {...props}>Loading...</Cell>;
  }
};

const TableCell = ({ type, openS3linkDialog, completedAction, ...props }) => {
  switch (type) {
    case 'name':
      return <NameCell {...props} />;
    case 'Status':
      return <StatusCell {...props} />;
    case 'date':
      return <DateCell {...props} />;
    case 'Activity':
      return <ActivityCell openS3linkDialog={openS3linkDialog} {...props} />;
    case 'Action':
      return <ActionCell tableBtnOnClick={completedAction} {...props} />;
  }
};

class CompletedOnboardTable extends React.Component {
  componentDidMount() {
    ReactTooltip.rebuild();
  }

  render() {
    const {
      completedList,
      classes,
      onSortChange,
      colSortDirs,
      columns,
      selected,
      onSelect,
      onSelectAll,
      completedAction,
      openS3linkDialog,
    } = this.props;

    return (
      <AutoSizer>
        {({ width, height }) => (
          <React.Fragment>
            <Table
              rowsCount={completedList.length}
              rowHeight={60}
              headerHeight={HEADER_HEIGHT}
              width={width || window.innerWidth}
              height={height || window.innerHeight}
              onScrollEnd={() => ReactTooltip.rebuild()}
            >
              {selected && (
                <Column
                  header={
                    <Cell style={style.headerCell}>
                      {onSelectAll && (
                        <div style={{ paddingLeft: 13 }}>
                          <Checkbox
                            className={classes.checkbox}
                            color="primary"
                            checked={
                              completedList.length === selected.size &&
                              completedList.length !== 0
                            }
                            indeterminate={
                              completedList.length !== selected.size &&
                              selected.size !== 0
                            }
                            onChange={onSelectAll}
                          />
                          <br />
                        </div>
                      )}
                    </Cell>
                  }
                  cell={({ rowIndex, ...props }) => {
                    const id = completedList[rowIndex].id;
                    const isSelected = selected.includes(id);

                    return (
                      <Cell {...props}>
                        <div className="flex-container align-right">
                          <div style={style.checkboxContainer}>
                            <Checkbox
                              className={classes.checkbox}
                              checked={isSelected}
                              onChange={() => onSelect(id)}
                              color="primary"
                            />
                          </div>
                        </div>
                      </Cell>
                    );
                  }}
                  fixed={true}
                  width={53}
                />
              )}

              {columns.map((column, index) => (
                <Column
                  key={index}
                  allowCellsRecycling={true}
                  header={
                    <HeaderCell
                      column={column}
                      onSortChange={onSortChange}
                      sortDir={colSortDirs && colSortDirs[column.col]}
                    />
                  }
                  cell={
                    <TableCell
                      data={completedList}
                      type={column.type}
                      col={column.col}
                      style={style.displayCell}
                      completedAction={completedAction}
                      openS3linkDialog={openS3linkDialog}
                    />
                  }
                  width={column.colWidth}
                  flexGrow={column.flexGrow}
                  //   fixed={column.fixed}
                />
              ))}
            </Table>
          </React.Fragment>
        )}
      </AutoSizer>
    );
  }
}

export default withStyles(style)(CompletedOnboardTable);
