import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import withStyles from '@material-ui/core/styles/withStyles';

import { Table, Column, Cell } from 'fixed-data-table-2';
import ReactTooltip from 'react-tooltip';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';

import HeaderCell from './TableCell/HeaderCell';

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
    colName: 'employee',
    colWidth: 200,
    flexGrow: 3,
    col: 'talentName',
    fixed: true,
  },
  {
    colName: 'company',
    colWidth: 160,
    flexGrow: 3,
    col: 'company',
  },

  {
    colName: 'positionType',
    colWidth: 130,
    flexGrow: 1,
    col: 'positionType',
  },
  {
    colName: 'receivedAmount',
    colWidth: 150,
    flexGrow: 2,
    col: 'receivedAmount',
    type: 'number',
  },
  {
    colName: 'commission',
    colWidth: 150,
    flexGrow: 2,
    col: 'commission',
    type: 'number',
  },
  {
    colName: 'rolePercentage',
    colWidth: 280,
    flexGrow: 2,
    col: 'rolePercentage',
  },
  {
    colName: 'otherTeamMembers',
    colWidth: 200,
    flexGrow: 2,
    col: 'otherTeamMembers',
  },
  {
    colName: 'startDate',
    colWidth: 160,
    flexGrow: 1,
    col: 'startDate',
  },
  {
    colName: 'jobTitle',
    colWidth: 340,
    flexGrow: 1,
    col: 'jobTitle',
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
  const id = data.getIn([rowIndex, 'talentName']);
  if (!id) {
    if (column.col === 'talentName' && loadMore) {
      setTimeout(() => loadMore(rowIndex));
    }

    return <Cell {...otherprops}>loading...</Cell>;
  }
  // console.log('[**********updating cell***********]',data.toJS());

  if (column.type === 'number') {
    let number = Number(data.getIn([rowIndex, column.col]));

    return (
      <Cell {...otherprops} style={cellStyle}>
        {number ? number.toLocaleString() : ''}
      </Cell>
    );
  }
  if (column.col === 'positionType') {
    const text = data.getIn([rowIndex, 'positionType']);
    return (
      <Cell {...otherprops} style={cellStyle}>
        {text ? text.toLowerCase().replace('_', ' ') : ''}
      </Cell>
    );
  } else {
    const text = data.getIn([rowIndex, column.col]);
    return (
      <Cell {...otherprops} style={cellStyle} data-tip={text}>
        {text}
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
