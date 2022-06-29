import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import withStyles from '@material-ui/core/styles/withStyles';

import { Table, Column, Cell } from 'fixed-data-table-2';
import ReactTooltip from 'react-tooltip';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';

import TeamMemberTooltip from '../../pages/Finance/Commission/TeamMemberTooltip';
import HeaderCell from './TableCell/HeaderCell';

import {
  style,
  HEADER_HEIGHT,
  ROW_HEIGHT,
  HEADER_WITHFILTER_HEIGHT
} from './params';

const currencyMap = {
  USD: '$',
  CNY: '¥',
  null: '',
  undefined: ''
};

const columns = [
  {
    colName: 'employee',
    colWidth: 200,
    flexGrow: 3,
    col: 'talentName',
    fixed: true,
    sortable: true
  },
  {
    colName: 'jobTitle',
    colWidth: 340,
    flexGrow: 1,
    col: 'jobTitle',
    sortable: true
  },
  {
    colName: 'company',
    colWidth: 160,
    flexGrow: 1,
    col: 'company',
    sortable: true
  },

  {
    colName: 'grossMargin',
    colWidth: 150,
    flexGrow: 2,
    col: 'grossMargin',
    type: 'money',
    sortable: true,
    disableSearch: true
  },
  {
    colName: 'receivedAmount',
    colWidth: 150,
    flexGrow: 2,
    col: 'receivedAmount',
    type: 'money',
    sortable: true,
    disableSearch: true
  },

  {
    colName: 'teamMember',
    colWidth: 220,
    flexGrow: 2,
    col: 'teamMember'
  },
  {
    colName: 'startDate',
    colWidth: 160,
    col: 'startDate',
    type: 'date',
    sortable: true,
    disableSearch: true
  }
];

const cellStyle = {
  fontSize: 15,
  color: '#505050',
  textTransform: 'capitalize',
  paddingLeft: 4
};

const CommissionCell = props => {
  const { data, rowIndex, column, loadMore, ...otherprops } = props;
  const id = data.getIn([rowIndex, 'id']);
  if (!id) {
    if (column.col === 'talentName') {
      setTimeout(() => loadMore(rowIndex));
    }

    return <Cell {...otherprops}>loading...</Cell>;
  }

  if (column.col === 'teamMember') {
    const startCommissions = data.getIn([rowIndex, 'startCommissions']);
    return (
      <Cell {...otherprops} style={cellStyle}>
        <TeamMemberTooltip commissions={startCommissions} key={id}>
          {startCommissions
            .map(c => c.get('userFullName'))
            .toSet()
            .toList()
            .join()}
        </TeamMemberTooltip>
      </Cell>
    );
  }

  if (column.col === 'grossMargin' || column.col === 'receivedAmount') {
    return (
      <Cell {...otherprops} style={cellStyle}>
        {`${currencyMap[data.getIn([rowIndex, 'currency'])]}${data
          .getIn([rowIndex, column.col])
          .toLocaleString()}`}
      </Cell>
    );
  }

  if (column.col === 'jobTitle' && data.getIn([rowIndex, 'jobId'])) {
    const title = `#${data.getIn([rowIndex, 'jobId'])} - ${data.getIn([
      rowIndex,
      column.col
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
      )
    };
  }

  componentDidMount() {
    ReactTooltip.rebuild();
  }

  _onColumnResizeEndCallback = (newColumnWidth, columnKey) => {
    this.setState(({ columnWidths }) => ({
      columnWidths: {
        ...columnWidths,
        [columnKey]: newColumnWidth
      }
    }));
  };

  render() {
    const {
      loadMore,
      count,
      commissionList,
      filterOpen,
      onFilter,
      onSortChange,
      colSortDirs = {},
      onScrollEnd,
      scrollLeft,
      scrollTop,
      filters
    } = this.props;

    // console.log('[Invoice Table Data]', commissionList.toJS());

    return (
      <AutoSizer>
        {({ width, height }) => (
          <React.Fragment>
            <Table
              rowHeight={ROW_HEIGHT}
              headerHeight={
                filterOpen ? HEADER_WITHFILTER_HEIGHT : HEADER_HEIGHT
              }
              rowsCount={count || commissionList.size}
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
              {columns.map((column, index) => {
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
                        style={style.headerCell}
                      />
                    }
                    cell={
                      <CommissionCell
                        data={commissionList}
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
  commissionList: PropTypes.instanceOf(Immutable.List).isRequired
};

export default withStyles(style)(InvoiceTable);
