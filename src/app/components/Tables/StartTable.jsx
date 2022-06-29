import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import withStyles from '@material-ui/core/styles/withStyles';
import { getJobTypeLabel } from '../../constants/formOptions';
import ReactTooltip from 'react-tooltip';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import { Table, Column, Cell } from 'fixed-data-table-2';
import Checkbox from '@material-ui/core/Checkbox';

import HeaderCell from './TableCell/HeaderCell';
import TextCell from './TableCell/TextCell';
import DateCell from './TableCell/DateCell';

import {
  style,
  HEADER_HEIGHT,
  ROW_HEIGHT,
  HEADER_WITHFILTER_HEIGHT,
} from './params';

const NameCell = ({ rowIndex, data, col, loadMore, ...props }) => {
  const id = data.getIn([rowIndex, 'id']);
  if (id) {
    let text = data.getIn([rowIndex, col]);

    return (
      <Cell {...props}>
        <div
          className="overflow_ellipsis_1"
          title={text}
          style={{ width: props.width - 26 }}
        >
          {text}
        </div>
      </Cell>
    );
  } else {
    console.log(loadMore);
    if (loadMore) {
      setTimeout(() => loadMore(rowIndex));
    }
  }
  return <Cell {...props}>loading...</Cell>;
};

const TypeCell = ({ rowIndex, data, col, loadMore, ...props }) => {
  const id = data.getIn([rowIndex, 'id']);
  if (id) {
    let text = data.getIn([rowIndex, col]);

    return (
      <Cell {...props}>
        <div
          className="overflow_ellipsis_1"
          title={text}
          style={{ width: props.width - 26 }}
        >
          {getJobTypeLabel(text)}
        </div>
      </Cell>
    );
  } else {
    console.log(loadMore);
    if (loadMore) {
      setTimeout(() => loadMore(rowIndex));
    }
  }
  return <Cell {...props}>loading...</Cell>;
};

const StartCell = ({ type, loadMore, ...props }) => {
  switch (type) {
    case 'first':
      return <NameCell {...props} loadMore={loadMore} />;
    case 'date':
      return <DateCell {...props} />;
    case 'enum':
      return <TypeCell {...props} />;

    default:
      return <TextCell {...props} />;
  }
};

class StartTable extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      columnWidths: props.columns.reduce((columnWidths, column) => {
        columnWidths[column.col] = column.colWidth;
        return columnWidths;
      }, {}),
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
      classes,
      disabledList,
      startList,
      selected,
      onSelect,
      loadMore,
      filterOpen,
      onFilter,
      onSortChange,
      colSortDirs,
      onScrollEnd,
      scrollLeft,
      scrollTop,
      filters,
      columns,
      count,
    } = this.props;
    return (
      <AutoSizer>
        {({ width, height }) => (
          <React.Fragment>
            <Table
              rowHeight={ROW_HEIGHT}
              headerHeight={
                filterOpen ? HEADER_WITHFILTER_HEIGHT : HEADER_HEIGHT
              }
              rowsCount={count || startList.size}
              width={width || window.innerWidth}
              height={height || window.innerHeight}
              rowClassNameGetter={(rowIndex) => {
                if (
                  selected &&
                  selected.includes(startList.getIn([rowIndex, 'id']))
                ) {
                  return 'selected';
                }
              }}
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
              {selected && (
                <Column
                  header={<Cell style={style.headerCell} />}
                  cell={({ rowIndex, ...props }) => {
                    const id = startList.getIn([rowIndex, 'id']);
                    const isSelected = selected && selected.includes(id);
                    return (
                      <Cell {...props}>
                        <div
                          className="flex-container align-spaced"
                          style={style.actionContainer}
                        >
                          {selected && (
                            <div className={classes.checkboxContainer}>
                              <Checkbox
                                className={classes.checkbox}
                                color="primary"
                                checked={isSelected}
                                onChange={() => onSelect(id)}
                                disabled={
                                  !id ||
                                  (disabledList && disabledList.includes(id))
                                }
                              />
                            </div>
                          )}
                        </div>
                      </Cell>
                    );
                  }}
                  allowCellsRecycling={true}
                  fixed={true}
                  width={53}
                />
              )}
              {columns.map((column, index) => (
                <Column
                  key={index}
                  columnKey={column.col}
                  allowCellsRecycling={true}
                  header={
                    <HeaderCell
                      column={column}
                      filterOpen={filterOpen}
                      onFilter={onFilter}
                      onSortChange={onSortChange}
                      sortDir={colSortDirs && colSortDirs[column.col]}
                      filters={filters}
                    />
                  }
                  cell={
                    <StartCell
                      loadMore={loadMore}
                      data={startList}
                      col={column.col}
                      type={column.type}
                      style={style.displayCell}
                    />
                  }
                  width={this.state.columnWidths[column.col]}
                  flexGrow={column.flexGrow}
                  fixed={column.fixed}
                  isResizable={true}
                />
              ))}
            </Table>
          </React.Fragment>
        )}
      </AutoSizer>
    );
  }
}

StartTable.propTypes = {
  startList: PropTypes.instanceOf(Immutable.List).isRequired,
};

export default withStyles(style)(StartTable);
