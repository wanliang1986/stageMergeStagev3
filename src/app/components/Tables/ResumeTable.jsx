import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { Link } from 'react-router-dom';
import withStyles from '@material-ui/core/styles/withStyles';
import ReactTooltip from 'react-tooltip';

import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import { Table, Column, Cell } from 'fixed-data-table-2';
import IconButton from '@material-ui/core/IconButton';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';

import DeleteIcon from '@material-ui/icons/Delete';

import HeaderCell from './TableCell/HeaderCell';
import TextCell from './TableCell/TextCell';
import DateTimeCell from './TableCell/DateTimeCell';

import {
  style,
  HEADER_HEIGHT,
  ROW_HEIGHT,
  HEADER_WITHFILTER_HEIGHT,
} from './params';
import { withTranslation } from 'react-i18next';

const NameLinkCell = ({ rowIndex, data, col, loadMore, ...props }) => {
  const id = data.getIn([rowIndex, 'id']);
  const uuid = data.getIn([rowIndex, 'uuid']);
  const note = data.getIn([rowIndex, 'note']);
  let index = note.indexOf('Talent is already exists');
  let talentId = null;
  if (index !== -1) {
    let _index = note.indexOf(':');
    talentId = note.substring(_index + 2, note.length);
  }
  if (id) {
    return (
      <Cell {...props}>
        <div
          className="overflow_ellipsis_1"
          style={{ width: props.width - 26 }}
        >
          {talentId ? (
            <Link
              to={`candidates/detail/${talentId}`}
              className="candidate-link"
            >
              {data.getIn([rowIndex, col])}
            </Link>
          ) : (
            <Link
              to={`/candidates/review/${uuid}/${id}`}
              className="candidate-link"
            >
              {data.getIn([rowIndex, col])}
            </Link>
          )}
        </div>
      </Cell>
    );
  } else {
    if (loadMore) {
      setTimeout(() => loadMore(rowIndex));
    }
  }
  return <Cell {...props}>loading...</Cell>;
};

const SourceCell = ({ rowIndex, data, col, ...props }) => {
  const id = data.getIn([rowIndex, 'id']);
  if (id) {
    const hotList = data.getIn([rowIndex, 'hotList']);
    const single = data.getIn([rowIndex, 'single']);

    return (
      <Cell {...props}>
        <div
          className="overflow_ellipsis_1"
          style={{ width: props.width - 26 }}
        >
          {hotList ? (
            <Typography>
              Hotlist -{' '}
              <Link to={`/candidates?tab=hotlist&hotlist=${hotList.id}`}>
                {hotList.title}
              </Link>
            </Typography>
          ) : single ? (
            props.t('tab:Single Upload Resume')
          ) : (
            props.t('tab:Bulk Upload ResumeFrame')
          )}
        </div>
      </Cell>
    );
  }

  return <Cell {...props}>loading...</Cell>;
};

const NoteCell = ({ rowIndex, data, col, ...props }) => {
  const id = data.getIn([rowIndex, 'id']);
  if (id) {
    const talentId = data.getIn([rowIndex, 'talentId']);
    if (!talentId) {
      return <TextCell rowIndex={rowIndex} data={data} col={col} {...props} />;
    }
    let text = data.getIn([rowIndex, col]);
    return (
      <Cell {...props}>
        <div
          className="overflow_ellipsis_1"
          style={{ width: props.width - 26, textTransform: 'none' }}
          data-tip={text}
        >
          <Link to={`/candidates/detail/${talentId}`}>Talent</Link> is already
          exists. TalentId: {talentId}
        </div>
      </Cell>
    );
  }

  return <Cell {...props}>loading...</Cell>;
};

const ParseRecordCell = ({ type, loadMore, ...props }) => {
  switch (type) {
    case 'link':
      return <NameLinkCell {...props} loadMore={loadMore} />;
    case 'source':
      return <SourceCell {...props} />;
    case 'date':
      return <DateTimeCell {...props} />;
    case 'note':
      return <NoteCell {...props} />;
    default:
      return <TextCell {...props} />;
  }
};

class ResumeTable extends React.Component {
  componentDidMount() {
    ReactTooltip.rebuild();
  }

  componentDidUpdate() {
    ReactTooltip.rebuild();
  }

  render() {
    const {
      classes,
      parseRecordList,
      loadMore,
      selected,
      onSelect,
      onSelectAll,
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
      onDelete,
      onSelectResume,
      selectedRecords,
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
              rowsCount={count || parseRecordList.size}
              width={width || window.innerWidth}
              height={height || window.innerHeight}
              onScrollEnd={onScrollEnd}
              scrollLeft={scrollLeft || 0}
              scrollTop={scrollTop || 0}
              onRowClick={(e, rowIndex) => {
                onSelectResume && onSelectResume(parseRecordList.get(rowIndex));
              }}
              rowClassNameGetter={(rowIndex) => {
                if (parseRecordList.indexOf(selectedRecords) === rowIndex) {
                  return 'selected';
                }
              }}
            >
              {selected && (
                <Column
                  header={
                    <Cell style={style.headerCell}>
                      {onSelectAll && (
                        <div style={{ paddingLeft: 7 }}>
                          <Checkbox
                            className={classes.checkbox}
                            checked={
                              parseRecordList.size === selected.size &&
                              parseRecordList.size !== 0
                            }
                            indeterminate={
                              parseRecordList.size !== selected.size &&
                              selected.size !== 0
                            }
                            onChange={onSelectAll}
                            color="primary"
                          />
                          <br />
                          {filterOpen && <br />}
                        </div>
                      )}
                    </Cell>
                  }
                  cell={({ rowIndex, ...props }) => {
                    const id = parseRecordList.getIn([rowIndex, 'id']);
                    const isSelected = selected && selected.includes(id);
                    return (
                      <Cell {...props} onClick={(e) => e.stopPropagation()}>
                        <div
                          className="flex-container align-spaced"
                          style={style.actionContainer}
                        >
                          <div style={style.checkboxContainer}>
                            <Checkbox
                              className={classes.checkbox}
                              checked={isSelected}
                              onChange={() => onSelect(id)}
                              disabled={!id}
                              color="primary"
                            />
                          </div>
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
                    <ParseRecordCell
                      loadMore={loadMore}
                      data={parseRecordList}
                      col={column.col}
                      type={column.type}
                      style={style.displayCell}
                      t={this.props.t}
                    />
                  }
                  width={column.colWidth}
                  flexGrow={column.flexGrow}
                  fixed={column.fixed}
                />
              ))}
              {onDelete && (
                <Column
                  cell={({ rowIndex, ...props }) => {
                    const id = parseRecordList.getIn([rowIndex, 'id']);
                    return (
                      <Cell {...props} onClick={(e) => e.stopPropagation()}>
                        <IconButton
                          onClick={() => onDelete(id)}
                          style={{ padding: 4 }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Cell>
                    );
                  }}
                  width={48}
                />
              )}
            </Table>
          </React.Fragment>
        )}
      </AutoSizer>
    );
  }
}

ResumeTable.propTypes = {
  parseRecordList: PropTypes.instanceOf(Immutable.List).isRequired,
};

export default withTranslation('tab')(withStyles(style)(ResumeTable));
