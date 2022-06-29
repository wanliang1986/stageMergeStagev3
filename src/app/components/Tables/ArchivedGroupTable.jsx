import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import withStyles from '@material-ui/core/styles/withStyles';

import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import IconButton from '@material-ui/core/IconButton';
import Checkbox from '@material-ui/core/Checkbox';
import { Table, Column, Cell } from 'fixed-data-table-2';
import ReactTooltip from 'react-tooltip';
import { Link } from 'react-router-dom';

import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

import HeaderCell from './TableCell/HeaderCell';
import DateCell from './TableCell/DateCell';
import TextCell from './TableCell/TextCell';

import {
  style,
  HEADER_HEIGHT,
  ROW_HEIGHT,
  HEADER_WITHFILTER_HEIGHT,
} from './params';

const NameLinkCell = ({ rowIndex, data, col, ...props }) => {
  const id = data.getIn([rowIndex, 'id']);
  if (id) {
    return (
      <Cell {...props}>
        <div
          className="overflow_ellipsis_1"
          style={{ width: props.width - 26 }}
        >
          <Link to={`/emailblast/detail/${id}`} className="candidate-link">
            {data.getIn([rowIndex, col])}
          </Link>
        </div>
      </Cell>
    );
  }

  return <Cell {...props}>loading...</Cell>;
};

const StatusCell = ({ rowIndex, data, col, ...props }) => {
  const id = data.getIn([rowIndex, 'id']);
  if (id) {
    const value = data.getIn([rowIndex, col]);
    const text = value ? 'active' : 'inactive';
    return <Cell {...props}>{text}</Cell>;
  }
  return <Cell {...props}>loading...</Cell>;
};

const ClientCell = ({ type, ...props }) => {
  switch (type) {
    case 'link':
      return <NameLinkCell {...props} />;
    case 'bool':
      return <StatusCell {...props} />;
    case 'date':
      return <DateCell {...props} />;

    default:
      return <TextCell {...props} />;
  }
};

class HotListsTable extends React.Component {
  componentDidMount() {
    ReactTooltip.rebuild();
  }

  render() {
    const {
      hotListList,
      classes,
      onEdit,
      onDelete,
      filters,
      filterOpen,
      onFilter,
      onSortChange,
      colSortDirs,
      columns,
      selected,
      onSelect,
      onArchive,
      t,
    } = this.props;

    return (
      <AutoSizer>
        {({ width, height }) => (
          <React.Fragment>
            <Table
              rowsCount={hotListList.size}
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
                    <ClientCell
                      data={hotListList}
                      type={column.type}
                      col={column.col}
                      style={style.displayCell}
                    />
                  }
                  width={column.colWidth}
                  flexGrow={column.flexGrow}
                  fixed={column.fixed}
                />
              ))}
              {onArchive && (
                <Column
                  header={
                    <Cell style={style.headerCell}>
                      <div style={style.headerText}>
                        {t('field:action')}
                        <br />
                        {filterOpen && <br />}
                      </div>
                    </Cell>
                  }
                  cell={({ rowIndex, ...props }) => {
                    const id = hotListList.getIn([rowIndex, 'id']);
                    return (
                      <Cell {...props}>
                        <div
                          className="flex-container align-spaced"
                          style={{ position: 'relative', left: -6 }}
                        >
                          <IconButton onClick={() => onArchive(id)}>
                            <img
                              src={'./assets/baseline_unarchive.png'}
                              width="20px"
                              height="20px"
                            />
                          </IconButton>
                        </div>
                      </Cell>
                    );
                  }}
                  allowCellsRecycling={true}
                  width={100}
                />
              )}
            </Table>
          </React.Fragment>
        )}
      </AutoSizer>
    );
  }
}

HotListsTable.propTypes = {
  hotListList: PropTypes.instanceOf(Immutable.List),
  onArchive: PropTypes.func,
};

export default withStyles(style)(HotListsTable);
