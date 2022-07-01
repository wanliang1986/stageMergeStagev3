import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Immutable from 'immutable';
import withStyles from '@material-ui/core/styles/withStyles';
import { currency } from '../../constants/formOptions';

import { Table, Column, Cell } from 'fixed-data-table-2';
import ReactTooltip from 'react-tooltip';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';

import HeaderCell from './TableCell/HeaderCell';
import HeaderMultiEnumCell from './TableCell/HeaderMultiEnumCell';
import HeaderDivisionCell from './TableCell/HeaderDivisionCell';

import Checkbox from '@material-ui/core/Checkbox';

import {
  style,
  HEADER_HEIGHT,
  ROW_HEIGHT,
  HEADER_WITHFILTER_HEIGHT,
} from './params';

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
const currencyMap = currency.reduce(
  (res, c) => {
    res[c.value] = c.label;
    return res;
  },
  {
    null: '',
    undefined: '',
  }
);

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
    type: 'multiEnum',
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
    type: 'division',
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

const InvoiceCell = (props) => {
  const { data, rowIndex, column, loadMore, ...otherprops } = props;
  const id = data.getIn([rowIndex, 'id']);
  if (!id) {
    if (column.col === 'invoiceNo') {
      setTimeout(() => loadMore(rowIndex));
    }

    return <Cell {...otherprops}>loading...</Cell>;
  }
  // console.log('[**********updating cell***********]',data.toJS());
  if (column.col === 'invoiceNo') {
    return (
      <Link
        to={`/finance/invoices/detail/${data.getIn([
          rowIndex,
          'invoiceNo',
        ])}#${data.getIn([rowIndex, 'subInvoiceNo'])}`}
      >
        <Cell {...otherprops} style={cellStyle}>
          {data.getIn([rowIndex, 'subInvoiceNo'])}
        </Cell>
      </Link>
    );
  }
  if (column.col === 'dueAmount') {
    return (
      <Cell {...otherprops} style={cellStyle}>
        {`${currencyMap[data.getIn([rowIndex, 'currency'])]}${data
          .getIn([rowIndex, 'dueAmount'])
          .toLocaleString()}`}
      </Cell>
    );
  }
  if (column.col === 'status') {
    return (
      <Cell {...otherprops} style={cellStyle}>
        {statusMap[data.getIn([rowIndex, 'status'])]}
      </Cell>
    );
  }
  if (column.col === 'invoiceType') {
    return (
      <Cell {...otherprops} style={cellStyle}>
        {invoiceTypeMap[data.getIn([rowIndex, 'invoiceType'])]}
      </Cell>
    );
  }
  if (column.col === 'divisionId') {
    return (
      <Cell {...otherprops} style={cellStyle}>
        {data.getIn([rowIndex, 'divisionName'])}
      </Cell>
    );
  }
  if (column.col === 'jobTitle' && data.getIn([rowIndex, 'jobId'])) {
    const title = `#${data.getIn([rowIndex, 'jobId'])} - ${data.getIn([
      rowIndex,
      column.col,
    ])}`;
    return (
      <Cell {...otherprops} style={cellStyle}>
        {title}
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

const InvoiceHeaderCell = ({ type, ...props }) => {
  switch (type) {
    case 'division':
      return <HeaderDivisionCell {...props} />;
    case 'multiEnum':
      return <HeaderMultiEnumCell {...props} />;
    default:
      return <HeaderCell {...props} />;
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
      invoiceList,
      filterOpen,
      onFilter,
      onSortChange,
      colSortDirs = {},
      onScrollEnd,
      scrollLeft,
      scrollTop,
      filters,

      selected,
      onSelect,
      classes,
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
              rowsCount={count || invoiceList.size}
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
              {
                <Column
                  header={<Cell style={style.headerCell} />}
                  cell={({ rowIndex, ...props }) => {
                    const id = invoiceList.getIn([rowIndex, 'id']);
                    const isSelected = selected && selected.includes(id);
                    // const isFavored = favoriteCandidates && favoriteCandidates.includes(id);
                    return (
                      <Cell {...props}>
                        <div
                          className="flex-container align-spaced"
                          style={style.actionContainer}
                        >
                          {
                            <div className={classes.checkboxContainer}>
                              <Checkbox
                                className={classes.checkbox}
                                color="primary"
                                checked={isSelected}
                                onChange={() => onSelect(id)}
                                disabled={!id}
                              />
                            </div>
                          }
                        </div>
                      </Cell>
                    );
                  }}
                  allowCellsRecycling={true}
                  fixed={true}
                  width={53}
                />
              }

              {columns.map((column, index) => {
                return (
                  <Column
                    key={index}
                    columnKey={column.col}
                    header={
                      <InvoiceHeaderCell
                        column={column}
                        type={column.type}
                        filterOpen={filterOpen}
                        filters={filters}
                        onFilter={onFilter}
                        onSortChange={onSortChange}
                        sortDir={colSortDirs && colSortDirs[column.col]}
                      />
                    }
                    cell={
                      <InvoiceCell
                        data={invoiceList}
                        column={column}
                        loadMore={loadMore}
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
  invoiceList: PropTypes.instanceOf(Immutable.List).isRequired,
};

export default withStyles(style)(InvoiceTable);
