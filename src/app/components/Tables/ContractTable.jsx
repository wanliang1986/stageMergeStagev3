import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import withStyles from '@material-ui/core/styles/withStyles';
import clsx from 'clsx';
import { List } from 'immutable';

import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import IconButton from '@material-ui/core/IconButton';
import Checkbox from '@material-ui/core/Checkbox';
import { Table, Column, Cell } from 'fixed-data-table-2';
import ReactTooltip from 'react-tooltip';

import EditIcon from '@material-ui/icons/Edit';

import HeaderCell from './TableCell/HeaderCell';
import LinkButton from './../particial/LinkButton';
import ViewContract from '@material-ui/icons/RemoveRedEye';
import DeleteIcon from '@material-ui/icons/Delete';
import moment from 'moment-timezone';

import {
  style,
  HEADER_HEIGHT,
  ROW_HEIGHT,
  HEADER_WITHFILTER_HEIGHT,
} from './params';

const FileCell = ({ rowIndex, data, col, onEdit, onView, ...props }) => {
  const id = data.getIn([rowIndex, 'id']);

  if (id) {
    const text = data.getIn([rowIndex, col]);
    // const auth = data.getIn([rowIndex, 'editAuthority']);

    return (
      <Cell {...props} style={{ position: 'relative' }}>
        {/* {auth && ( */}
        <IconButton
          onClick={() => onView(id)}
          style={{
            padding: 4,
            position: 'absolute',
            right: '0px',
            top: '6px',
          }}
          data-tip={'Preview Contract'}
        >
          <ViewContract />
        </IconButton>
        {/* )} */}

        <div
          className="overflow_ellipsis_1"
          title={text}
          style={{ width: props.width - 36, position: 'relative' }}
        >
          {text}
        </div>
      </Cell>
    );
  }
  return <Cell {...props}>Loading...</Cell>;
};
const contractTypeList = [
  { type: '', value: '' },
  { type: 'FTE', value: 'FULL_TIME_EMPLOYMENT' },
  { type: 'Contracting', value: 'CONTRACTING' },
  { type: 'Payroll', value: 'PAYROLL' },
  { type: 'Campus Recruiting', value: 'CAMPUS_RECRUITING' },
  {
    type: 'Recruitment Process Outsourcing (RPO)',
    value: 'RECRUITMENT_PROCESS_OUTSOURCING',
  },
  { type: 'Internship', value: 'INTERNSHIP' },
  { type: 'Others', value: 'OTHERS' },
  { type: 'General Staffing (Contract)', value: 'GENERAL_STAFFING' },
  { type: 'General Recruiting (FTE)', value: 'GENERAL_RECRUITING' },
];
const TypeCell = ({
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
    text = contractTypeList.find((ele) => ele.value === text).type;

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

const SigneesCell = ({ rowIndex, data, col, onEdit, ...props }) => {
  const id = data.getIn([rowIndex, 'id']);

  if (id) {
    const nameList = data.getIn([rowIndex, col]).toJS();
    const text = nameList.reduce((acc, ele, index) => {
      if (index === nameList.length - 1) {
        return acc + ele.lastName + ' ' + ele.firstName;
      } else {
        return acc + ele.lastName + ' ' + ele.firstName + ', ';
      }
    }, '');

    // console.log('???', id, col, text);
    return (
      <Cell {...props}>
        <div
          className="overflow_ellipsis_1"
          title={text}
          data-tip={text}
          style={{ width: props.width - 26 }}
        >
          {text}
        </div>
      </Cell>
    );
  }
  return <Cell {...props}>Loading...</Cell>;
};

const Highlight = ({ rowIndex, data, col, onStatusChange, ...props }) => {
  const id = data.getIn([rowIndex, 'id']);
  const editAuthority = data.getIn([rowIndex, 'editAuthority']);

  const selectData = data.get(rowIndex);
  if (id) {
    const text = data.getIn([rowIndex, col]);
    const greenStatus = ['open', 'reopened'];
    const yellowStatus = ['onhold', 'offer_made', 'filled'];
    let loweredText = text.toLowerCase();

    return (
      <Cell {...props}>
        <div
          className="overflow_ellipsis_1"
          style={{
            width: props.width - 26,
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
                  }
                : {
                    minWidth: '100px',
                    backgroundColor: '#e1e1e1',
                    borderRadius: '10px',
                    paddingLeft: '10px',
                    textAlign: 'center',
                  }
            }
          >
            {text === 'VALID' ? 'Active' : 'Obsolete'}
            {editAuthority === true ? (
              <span>
                {onStatusChange && (
                  <IconButton
                    style={{ padding: 2, position: 'absolute', right: 20 }}
                    onClick={(e) => onStatusChange(e, selectData)}
                    color="primary"
                  >
                    <EditIcon style={{ color: '#8E8E8E' }} fontSize="small" />
                  </IconButton>
                )}
              </span>
            ) : null}
          </div>
        </div>
      </Cell>
    );
  }
  return <Cell {...props}>loading...</Cell>;
};

const DateCell = ({ rowIndex, data, col, onStatusChange, ...props }) => {
  const id = data.getIn([rowIndex, 'id']);
  const date = data.getIn([rowIndex, col]);
  if (id) {
    return <Cell {...props}>{moment(date).format('YYYY-MM-DD')}</Cell>;
  }
  return <Cell {...props}>loading...</Cell>;
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
    case 'file':
      return <FileCell onView={onView} {...props} />;
    case 'signees':
      return <SigneesCell {...props} />;
    case 'contractType':
      return <TypeCell {...props} />;
    case 'date':
      return props.col === 'status' ? (
        <Highlight onStatusChange={onStatusChange} {...props} />
      ) : (
        <DateCell {...props} disableTooltip={true} />
      );
    // <TextCell {...props} disableTooltip={true} />;

    default:
      return <TextCell {...props} />;
  }
};

class ClientsTable extends React.Component {
  componentDidMount() {
    ReactTooltip.rebuild();
  }

  render() {
    const {
      contractList,
      classes,
      onEdit,
      onView,
      onDelete,
      filters,
      filterOpen,
      onFilter,
      onSortChange,
      colSortDirs,
      columns,
      onStatusChange,
    } = this.props;

    // console.log(':::', contractList.toJS());
    return (
      <AutoSizer>
        {({ width, height }) => (
          <React.Fragment>
            <Table
              rowsCount={contractList.size}
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
                      filterOpen={filterOpen}
                      filters={filters}
                      onFilter={onFilter}
                      onSortChange={onSortChange}
                      sortDir={colSortDirs && colSortDirs[column.col]}
                    />
                  }
                  cell={
                    <ContractCell
                      data={contractList}
                      type={column.type}
                      col={column.col}
                      onStatusChange={onStatusChange}
                      style={style.displayCell}
                      onEdit={onEdit}
                      onView={onView}
                    />
                  }
                  width={column.colWidth}
                  flexGrow={column.flexGrow}
                  fixed={column.fixed}
                />
              ))}
              <Column
                header={
                  <Cell style={style.headerCell}>
                    <div style={style.headerText}>
                      Action
                      {filterOpen && <br />}
                    </div>
                  </Cell>
                }
                cell={({ rowIndex, ...props }) => {
                  const datum = contractList.get(rowIndex);
                  return (
                    <Cell {...props}>
                      <div
                        className="flex-container align-spaced"
                        style={{ position: 'relative', left: -6 }}
                      >
                        {datum.get('editAuthority') && (
                          <>
                            <IconButton
                              onClick={() => onEdit(datum.get('id'))}
                              style={{ padding: 4 }}
                            >
                              <EditIcon />
                            </IconButton>
                          </>
                        )}

                        {/* {datum.get('delAuthority') && (
                          <IconButton
                            onClick={() => onDelete(datum.get('id'))}
                            style={{ padding: 4 }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        )} */}
                      </div>
                    </Cell>
                  );
                }}
                allowCellsRecycling={true}
                width={100}
                //fixedRight={true}
              />
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

export default withStyles(style)(ClientsTable);
