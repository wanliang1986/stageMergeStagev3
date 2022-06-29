import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import withStyles from '@material-ui/core/styles/withStyles';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { List } from 'immutable';

import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import IconButton from '@material-ui/core/IconButton';
import Checkbox from '@material-ui/core/Checkbox';
import { Table, Column, Cell } from 'fixed-data-table-2';
import ReactTooltip from 'react-tooltip';

import EditIcon from '@material-ui/icons/Edit';

import HeaderCell from './TableCell/HeaderCell';
import DateCell from './TableCell/DateCell';
import Typography from '@material-ui/core/Typography';
import ToolTip from '@material-ui/core/Tooltip';

import {
  style,
  HEADER_HEIGHT,
  ROW_HEIGHT,
  HEADER_WITHFILTER_HEIGHT,
} from './params';

const AdminNameCell = ({ rowIndex, data, col, onEdit, onView, ...props }) => {
  const id = data.getIn([rowIndex, 'id']);
  let selectData = data.get(rowIndex);
  const getAdminNames = (selectData) => {
    let arr =
      selectData.admin &&
      selectData.admin.map((item, index) => {
        return item.firstName + ' ' + item.lastName;
      });
    if (arr) {
      return arr.join(',');
    }
  };

  if (id) {
    return (
      <ToolTip placement="top" arrow title={getAdminNames(selectData)}>
        <Cell {...props} style={{ position: 'relative' }}>
          {getAdminNames(selectData)}
        </Cell>
      </ToolTip>
    );
  }
  return <Cell {...props}>{''}</Cell>;
};
const NameLinkCell = ({ rowIndex, data, col, onEdit, onView, ...props }) => {
  const id = data.getIn([rowIndex, 'id']);
  let selectData = data.get(rowIndex);
  if (id) {
    return (
      <Cell {...props} style={{ position: 'relative' }}>
        <Link to={`/tenantAdminPortal/detail/${id}`} className="candidate-link">
          {selectData.name}
        </Link>
      </Cell>
    );
  }
  return <Cell {...props}>{''}</Cell>;
};
const EmailCell = ({ rowIndex, data, col, onEdit, onView, ...props }) => {
  const id = data.getIn([rowIndex, 'id']);
  let selectData = data.get(rowIndex);
  const getEmails = (selectData) => {
    let arr =
      selectData.admin &&
      selectData.admin.map((item, index) => {
        return item.email;
      });
    if (arr) {
      return arr;
    } else {
      return [];
    }
  };
  const getEmailsToolTip = (selectData) => {
    let arr = getEmails(selectData);
    if (arr && arr.length > 0) {
      return (
        <>
          {arr.map((item, index) => {
            return <div>{item}</div>;
          })}
        </>
      );
    } else {
      return '';
    }
  };

  if (id) {
    return (
      <ToolTip placement="top-start" arrow title={getEmailsToolTip(selectData)}>
        <Cell {...props} style={{ position: 'relative' }}>
          {getEmails(selectData).map((item, index) => {
            return <div>{item}</div>;
          })}
        </Cell>
      </ToolTip>
    );
  }
  return <Cell {...props}>{''}</Cell>;
};
const TextCell = ({
  rowIndex,
  data,
  col,
  onEdit,
  disableTooltip,
  ...props
}) => {
  const id = data.getIn([rowIndex, 'id']);
  if (id) {
    let text = data.getIn([rowIndex, col]);
    return (
      <Cell {...props}>
        <div
          style={{
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            textTransform: 'none',
            width: props.width - 26,
          }}
          data-tip={!disableTooltip ? text : null}
        >
          {text}
        </div>
      </Cell>
    );
  }
  return <Cell {...props}>loading...</Cell>;
};

const Highlight = ({ rowIndex, data, col, onStatusChange, ...props }) => {
  const id = data.getIn([rowIndex, 'id']);
  const editAuthority = data.getIn([rowIndex, 'editAuthority']);
  const selectData = data.get(rowIndex);
  if (id) {
    const text = data.getIn([rowIndex, col]);
    return (
      <Cell {...props}>
        <div
          className="overflow_ellipsis_1"
          style={{
            width: props.width - 50,
            textTransform: 'none',
          }}
        >
          <div
            style={
              editAuthority === true
                ? {
                    minWidth: '100px',
                    backgroundColor: '#e1e1e1',
                    borderRadius: '10px',
                    paddingLeft: '10px',
                    fontSize: '14px',
                  }
                : {
                    minWidth: '100px',
                    backgroundColor: '#e1e1e1',
                    borderRadius: '10px',
                    paddingLeft: '10px',
                    fontSize: '14px',
                  }
            }
          >
            {text === 1 ? 'Active' : 'Inactive'}
            <span>
              {onStatusChange && (
                <IconButton
                  style={{ padding: 2, position: 'absolute', right: 40 }}
                  onClick={(e) => onStatusChange(e, selectData)}
                  color="primary"
                >
                  <EditIcon
                    style={{ color: '#8E8E8E', fontSize: '17px' }}
                    fontSize="small"
                  />
                </IconButton>
              )}
            </span>
          </div>
        </div>
      </Cell>
    );
  }
  return <Cell {...props}>loading...</Cell>;
};

const MonthlyCredits = ({ rowIndex, data, col, onStatusChange, ...props }) => {
  const id = data.getIn([rowIndex, 'id']);
  const monthlyCredit = data.getIn([rowIndex, 'monthlyCredit'])
    ? data.getIn([rowIndex, 'monthlyCredit'])
    : 0;
  const monthlyUsedCredit = data.getIn([rowIndex, 'monthlyUsedCredit'])
    ? data.getIn([rowIndex, 'monthlyUsedCredit'])
    : 0;
  return <Cell>{monthlyUsedCredit + '/' + monthlyCredit}</Cell>;
};

const BulkCredits = ({ rowIndex, data, col, onStatusChange, ...props }) => {
  const id = data.getIn([rowIndex, 'id']);
  const monthlyCredit = data.getIn([rowIndex, 'bulkCredit'])
    ? data.getIn([rowIndex, 'bulkCredit'])
    : 0;
  const monthlyUsedCredit = data.getIn([rowIndex, 'bulkUsedCredit'])
    ? data.getIn([rowIndex, 'bulkUsedCredit'])
    : 0;
  return <Cell>{monthlyUsedCredit + '/' + monthlyCredit}</Cell>;
};

const ContractCell = ({
  type,
  candidateClick,
  onEdit,
  onStatusChange,
  onView,
  ...props
}) => {
  switch (type) {
    case 'status':
      return props.col === 'status' ? (
        <Highlight onStatusChange={onStatusChange} {...props} />
      ) : (
        <TextCell {...props} disableTooltip={true} />
      );
    case 'date':
      return <DateCell {...props} />;
    case 'adminName':
      return <AdminNameCell {...props} />;
    case 'link':
      return <NameLinkCell {...props} />;
    case 'email':
      return <EmailCell {...props} />;
    case 'monthlyCredits':
      return <MonthlyCredits {...props} />;
    case 'bulkCredits':
      return <BulkCredits {...props} />;
    default:
      return <TextCell {...props} />;
  }
};

const columns = [
  {
    colName: 'Tenant Name',
    colWidth: 160,
    flexGrow: 3,
    col: 'name',
    type: 'link',
    fixed: true,
    // sortable: true,
  },
  {
    colName: 'Status',
    colWidth: 160,
    col: 'status',
    type: 'status',
    // sortable: true,
    // disableSearch: true,
  },
  {
    colName: 'APN Pro Monthly Credits',
    colWidth: 220,
    // col: 'status',
    type: 'monthlyCredits',
    // sortable: true,
    // disableSearch: true,
  },
  {
    colName: 'APN Pro Bulk Credits',
    colWidth: 200,
    type: 'bulkCredits',
    // sortable: true,
    // disableSearch: true,
  },
  {
    colName: 'Create At',
    colWidth: 120,
    flexGrow: 1,
    col: 'createdDate',
    type: 'date',
    // sortable: true,
  },
  {
    colName: 'Admin Name',
    colWidth: 120,
    flexGrow: 1,
    type: 'adminName',
    // sortable: true,
  },
  {
    colName: 'Admin Email',
    colWidth: 120,
    flexGrow: 2,
    type: 'email',
    sortable: true,
  },
];

class TenantAdminportalTable extends React.Component {
  componentDidMount() {
    ReactTooltip.rebuild();
  }

  render() {
    const {
      tenantList,
      classes,
      onEdit,
      onView,
      onDelete,
      filters,
      filterOpen,
      onFilter,
      onSortChange,
      colSortDirs,
      onStatusChange,
    } = this.props;

    // console.log(':::', contractList.toJS());
    if (tenantList.size === 0) {
      return (
        <div className="flex-child-auto container-padding">
          <Typography variant="h5">There is no record</Typography>
        </div>
      );
    }
    return (
      <AutoSizer>
        {({ width, height }) => (
          <React.Fragment>
            <Table
              rowsCount={tenantList.size}
              rowHeight={ROW_HEIGHT}
              headerHeight={
                filterOpen ? HEADER_WITHFILTER_HEIGHT : HEADER_HEIGHT
              }
              width={width || window.innerWidth}
              height={height || window.innerHeight}
              onScrollEnd={() => ReactTooltip.rebuild()}
            >
              {columns.map((column, index) => (
                <Column
                  key={index}
                  allowCellsRecycling={true}
                  header={
                    <HeaderCell
                      column={column}
                      // filterOpen={filterOpen}
                      // filters={filters}
                      // onFilter={onFilter}
                      // onSortChange={onSortChange}
                      // sortDir={colSortDirs && colSortDirs[column.col]}
                    />
                  }
                  cell={
                    <ContractCell
                      data={tenantList}
                      type={column.type}
                      col={column.col}
                      onStatusChange={onStatusChange}
                      style={style.displayCell}
                      // onEdit={onEdit}
                      // onView={onView}
                    />
                  }
                  width={column.colWidth}
                  flexGrow={column.flexGrow}
                  fixed={column.fixed}
                />
              ))}
            </Table>
          </React.Fragment>
        )}
      </AutoSizer>
    );
  }
}

// ClientsTable.propTypes = {
//     contractList: PropTypes.instanceOf(Immutable.List).isRequired,
//     onEdit: PropTypes.func.isRequired,
//     onCandidateClick: PropTypes.func.isRequired
// };

export default withStyles(style)(TenantAdminportalTable);
