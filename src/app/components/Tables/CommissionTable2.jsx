import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Immutable from 'immutable';
import withStyles from '@material-ui/core/styles/withStyles';

import { Table, Column, Cell } from 'fixed-data-table-2';
import ReactTooltip from 'react-tooltip';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';

import HeaderCell from './TableCell/HeaderCell';

import Checkbox from '@material-ui/core/Checkbox';

import {
  style,
  HEADER_HEIGHT,
  ROW_HEIGHT,
  HEADER_WITHFILTER_HEIGHT,
} from './params';
import LinkButton from '../particial/LinkButton';

const statusMap = {
  PAID: 'Paid',
  UNPAID: 'Unpaid',
  OVERDUE: 'Expired',
  STARTUP_FEE_PAID_USED: 'Paid - Used',
  STARTUP_FEE_PAID_UNUSED: 'Paid - Unused',
  STARTUP_FEE_UNPAID_UNUSED: 'Unpaid - Unused',
  VOID: 'Void',
};
const invoiceTypeMap = {
  FTE: 'FTE',
  STARTUP_FEE: 'Startup Fee',
};
const currencyMap = {
  USD: '$',
  CNY: '¥',
  null: '',
  undefined: '',
};

const columns = [
  {
    colName: 'Invoice Number',
    colWidth: 200,
    flexGrow: 3,
    col: 'invoiceNo',
    type: 'link',
    fixed: true,
    sortable: true,
  },
  {
    colName: 'Invoice Date',
    colWidth: 160,
    col: 'invoiceDate',
    type: 'date',
    sortable: true,
    disableSearch: true,
  },
  {
    colName: 'Due Date',
    colWidth: 160,
    col: 'dueDate',
    type: 'date',
    sortable: true,
    disableSearch: true,
  },

  {
    colName: 'Type',
    colWidth: 130,
    flexGrow: 1,
    col: 'invoiceType',
    type: 'enum',
    sortable: true,
  },

  {
    colName: 'Employee Name',
    colWidth: 220,
    flexGrow: 1,
    col: 'talentName',
    sortable: true,
  },

  {
    colName: 'Status',
    colWidth: 180,
    flexGrow: 2,
    col: 'status',
    type: 'enum',
    sortable: false,
  },

  {
    colName: 'Invoice Amount',
    colWidth: 150,
    flexGrow: 2,
    col: 'dueAmount',
    sortable: true,
    disableSearch: true,
  },

  {
    colName: 'Billing Company',
    colWidth: 160,
    flexGrow: 1,
    col: 'customerName',
    sortable: true,
  },
  {
    colName: 'Job Title',
    colWidth: 340,
    flexGrow: 1,
    col: 'jobTitle',
    sortable: true,
  },

  {
    colName: 'Division',
    colWidth: 220,
    flexGrow: 1,
    col: 'divisionId',
    sortable: true,
  },
];

const cellStyle = {
  fontSize: 15,
  color: '#505050',
  textTransform: 'capitalize',
  paddingLeft: 4,
};

const CommissionCell2 = (props) => {
  const {
    data,
    rowIndex,
    column,
    loadMore,
    onClickCommissionIds,
    ...otherprops
  } = props;
  const id = data.getIn([rowIndex, 'userId']);
  if (!id) {
    if (column.col === 'userName' && loadMore) {
      setTimeout(() => loadMore(rowIndex));
    }

    return <Cell {...otherprops}>loading...</Cell>;
  }
  // console.log('[**********updating cell***********]',data.toJS());

  if (column.col === 'commissionIds') {
    let commissionIds = data.getIn([rowIndex, column.col]);

    return (
      <Cell {...otherprops} style={cellStyle}>
        {onClickCommissionIds ? (
          <LinkButton
            onClick={() => onClickCommissionIds(data.get(rowIndex))}
            className="status-link"
          >
            {JSON.parse(commissionIds).length}
          </LinkButton>
        ) : (
          <div> {JSON.parse(commissionIds).length}</div>
        )}
      </Cell>
    );
  }
  if (column.col === 'commission') {
    return (
      <Cell {...otherprops} style={cellStyle}>
        {data.getIn([rowIndex, 'commission'])}
      </Cell>
    );
  } else {
    return (
      <Cell {...otherprops} style={cellStyle}>
        {data.getIn([rowIndex, column.col])}
      </Cell>
    );
  }
};

class InvoiceTable extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      columnWidths: (props.ownColumns || columns).reduce(
        (columnWidths, column) => {
          columnWidths[column.col] = column.colWidth;
          return columnWidths;
        },
        {}
      ),
    };
  }

  componentDidMount() {
    ReactTooltip.rebuild();
  }

  _onColumnResizeEndCallback = (newColumnWidth, columnKey) => {
    this.setState(({ columnWidths }) => ({
      columnWidths: {
        ...columnWidths,
        [columnKey]: newColumnWidth,
      },
    }));
  };

  render() {
    const {
      loadMore,
      count,
      dataList,
      filterOpen,
      onFilter,
      onSortChange,
      colSortDirs = {},
      onScrollEnd,
      scrollLeft,
      scrollTop,
      filters,
      ownColumns,
      onClickCommissionIds,
    } = this.props;

    // console.log('[Invoice Table Data]', invoiceList.toJS());

    return (
      <AutoSizer>
        {({ width, height }) => (
          <React.Fragment>
            <Table
              rowHeight={ROW_HEIGHT}
              headerHeight={
                filterOpen ? HEADER_WITHFILTER_HEIGHT : HEADER_HEIGHT
              }
              rowsCount={count || dataList.size}
              width={width || window.innerWidth}
              height={height || window.innerHeight}
              // rowClassNameGetter={rowIndex => {
              //     if (selected && selected.includes(jobList.getIn([rowIndex, 'id']))) {
              //         return 'selected';
              //     }
              // }}
              onScrollEnd={(...props) => {
                if (onScrollEnd) {
                  onScrollEnd(...props);
                }
                ReactTooltip.rebuild();
              }}
              scrollLeft={scrollLeft || 0}
              scrollTop={scrollTop || 0}
              onColumnResizeEndCallback={this._onColumnResizeEndCallback}
              isColumnResizing={false}
            >
              {(ownColumns || columns).map((column, index) => {
                return (
                  <Column
                    key={index}
                    columnKey={column.col}
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
                      <CommissionCell2
                        data={dataList}
                        column={column}
                        loadMore={loadMore}
                        onClickCommissionIds={onClickCommissionIds}
                      />
                    }
                    width={this.state.columnWidths[column.col]}
                    flexGrow={column.flexGrow}
                    fixed={column.fixed}
                    allowCellsRecycling={true}
                    pureRendering={true}
                    isResizable={true}
                  />
                );
              })}
            </Table>
          </React.Fragment>
        )}
      </AutoSizer>
    );
  }
}

InvoiceTable.propTypes = {
  dataList: PropTypes.instanceOf(Immutable.List).isRequired,
};

export default withStyles(style)(InvoiceTable);
