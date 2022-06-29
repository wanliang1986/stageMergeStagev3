import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Immutable from 'immutable';
import withStyles from '@material-ui/core/styles/withStyles';
import { jobType, jobStatus } from '../../constants/formOptions';

import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';

import StarBorder from '@material-ui/icons/StarBorder';
import Star from '@material-ui/icons/Star';
import EditIcon from '@material-ui/icons/Edit';

import { Table, Column, Cell } from 'fixed-data-table-2';
import ReactTooltip from 'react-tooltip';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';

import HeaderCell from './TableCell/HeaderCell';
import TextCell from './TableCell/TextCell';
import DateCell from './TableCell/DateCell';

import {
  style,
  HEADER_HEIGHT,
  ROW_HEIGHT,
  HEADER_WITHFILTER_HEIGHT,
} from './params';

const TitleCell = ({ rowIndex, data, col, loadMore, ...props }) => {
  const id = data.getIn([rowIndex, 'id']);
  if (id) {
    const text = data.getIn([rowIndex, col]);
    return (
      <Cell {...props}>
        <div
          className="overflow_ellipsis_1"
          title={text}
          style={{ width: props.width - 26 }}
        >
          <Link className="job-link" to={`/jobs/detail/${id}`}>
            {text}
          </Link>
        </div>
      </Cell>
    );
  } else {
    setTimeout(() => loadMore(rowIndex));
  }
  return <Cell {...props}>Loading...</Cell>;
};

const EnumCell = ({ rowIndex, data, col, ...props }) => {
  const id = data.getIn([rowIndex, 'id']);
  if (id) {
    let text = data.getIn([rowIndex, col]);
    if (col === 'jobType') {
      const type = jobType.find(({ value }) => value === text);
      text = type ? type.label : text;
    }
    return (
      <Cell {...props}>
        <div
          className="overflow_ellipsis_1"
          style={{
            width: props.width - 26,
            textTransform: 'none',
          }}
        >
          {text}
        </div>
      </Cell>
    );
  }
  return <Cell {...props}>loading...</Cell>;
};

const getColor = (status) => {
  switch (status) {
    case 'OPEN':
      return '#3398DC';
    case 'REOPENED':
      return '#21B66E';
    case 'FILLED':
      return '#F56D50';
    case 'CLOSED':
    case 'CANCELLED':
      return '#BDBDBD';
    case 'ONHOLD':
      return '#FDAB29';
    default:
      return '#3398DC';
  }
};

const Highlight = ({ rowIndex, data, col, onStatusChange, ...props }) => {
  const id = data.getIn([rowIndex, 'id']);
  if (id) {
    const text = data.getIn([rowIndex, col]);
    let _text = jobStatus.find(({ value }) => value === text);
    return (
      <Cell {...props}>
        <div
          className="overflow_ellipsis_1"
          style={{
            width: props.width - 26,
            textTransform: 'none',
          }}
        >
          {text && text !== 'NO_STATUS' ? (
            <span
              style={{
                padding: '1px 8px',
                borderRadius: '10.5px',
                color: '#fff',
                backgroundColor: getColor(text),
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                justifyContent: 'center',
                textTransform: 'capitalize',
              }}
            >
              {_text.label}
            </span>
          ) : (
            ''
          )}

          {onStatusChange && text !== 'NO_STATUS' && (
            <IconButton
              style={{ padding: 2, position: 'absolute', right: 6 }}
              onClick={(e) => onStatusChange(e, id)}
              color="primary"
            >
              <EditIcon fontSize="small" />
            </IconButton>
          )}
        </div>
      </Cell>
    );
  }
  return <Cell {...props}>loading...</Cell>;
};

const ScoreCell = ({ rowIndex, data, col, ...props }) => {
  const id = data.getIn([rowIndex, 'id']);
  if (id) {
    const score = data.getIn([rowIndex, col]);
    let color = '#9e9e9e';
    if (score > 59) {
      color = '#f2b743';
    }
    if (score > 84) {
      color = '#2cc86e';
    }
    return (
      <Cell {...props}>
        <div
          style={{
            background: color,
            textAlign: 'center',
            borderRadius: 20,
            color: 'white',
            width: 70,
            position: 'relative',
          }}
        >
          {score.toFixed()}
        </div>
        <br />
      </Cell>
    );
  }
  return <Cell {...props}>loading...</Cell>;
};

const JobTypeCell = ({ rowIndex, data, col, ...props }) => {
  const id = data.getIn([rowIndex, 'id']);
  if (id) {
    const type = data.getIn([rowIndex, col]);
    const _type = jobType.find(({ value }) => value === type);
    return (
      <Cell {...props}>
        <div>{_type.label}</div>
      </Cell>
    );
  }
};

const LocationsCell = ({ rowIndex, data, col, ...props }) => {
  const id = data.getIn([rowIndex, 'id']);
  if (id) {
    const locations = (data.getIn([rowIndex, col]) || [])
      .map((item, index) => {
        return item.get('originDisplay');
      })
      .filter((item) => item);
    let html = Immutable.Set(locations).join(', ');
    return (
      <Cell {...props}>
        <div>{html}</div>
      </Cell>
    );
  }
};

const ApplicationCountCell = ({
  rowIndex,
  data,
  col,
  handleFetchDetails,
  ...props
}) => {
  const id = data.getIn([rowIndex, 'id']);
  if (id) {
    const text = data.getIn([rowIndex, col]);
    const status = col;
    if (text === null) {
      return (
        <Cell {...props}>
          <div className="overflow_ellipsis_1" title={text}>
            —
          </div>
        </Cell>
      );
    }
    if (text === 0) {
      return (
        <Cell {...props}>
          <div className="overflow_ellipsis_1" title={text}>
            {text}
          </div>
        </Cell>
      );
    }

    return (
      <Cell {...props}>
        <div
          className="overflow_ellipsis_1"
          style={{ cursor: 'pointer' }}
          title={text}
          onClick={() => handleFetchDetails(id, status)}
        >
          {text}
        </div>
      </Cell>
    );
  }
  return <Cell {...props}>Loading...</Cell>;
};

const JobCell = ({
  type,
  loadMore,
  onStatusChange,
  handleFetchDetails,
  ...props
}) => {
  switch (type) {
    // case 'id':
    //     return <IdCell {...props} />;
    case 'link':
      return <TitleCell {...props} loadMore={loadMore} />;
    case 'date':
      return <DateCell {...props} />;
    case 'score':
      return <ScoreCell {...props} />;
    case 'enum':
      return props.col === 'status' ? (
        <Highlight onStatusChange={onStatusChange} {...props} />
      ) : (
        <EnumCell {...props} />
      );
    case 'highlight':
      return <Highlight {...props} />;
    case 'type':
      return <JobTypeCell {...props} />;
    case 'applicationCountCell':
      return handleFetchDetails ? (
        <ApplicationCountCell
          handleFetchDetails={handleFetchDetails}
          {...props}
        />
      ) : (
        <TextCell {...props} />
      );
    case 'locations':
      return <LocationsCell {...props} />;
    default:
      return <TextCell {...props} />;
  }
};

const columns = [
  {
    colName: 'jobTitle',
    colWidth: 200,
    flexGrow: 3,
    col: 'title',
    type: 'link',
    fixed: true,
    sortable: true,
  },
  {
    colName: 'postingTime',
    colWidth: 160,
    col: 'postingTime',
    type: 'date',
    sortable: true,
    disableSearch: true,
  },
  {
    colName: 'status',
    colWidth: 120,
    flexGrow: 1,
    col: 'status',
    type: 'enum',
    sortable: true,
  },
  {
    colName: 'type',
    colWidth: 120,
    flexGrow: 1,
    col: 'type',
    type: 'jobType',
    sortable: true,
  },
  {
    colName: 'city',
    colWidth: 120,
    flexGrow: 2,
    col: 'locations',
    type: 'locations',
    sortable: true,
  },
  {
    colName: 'Job Id',
    colWidth: 130,
    flexGrow: 1,
    col: 'id',
  },
  {
    colName: 'Sum of Submitted to Client',
    colWidth: 250,
    flexGrow: 1,
    type: 'applicationCountCell',
    col: 'subs',
    disableSearch: true,
  },
  {
    colName: 'Sum of Interview',
    colWidth: 150,
    flexGrow: 1,
    type: 'applicationCountCell',
    col: 'interviews',
    disableSearch: true,
  },
  {
    colName: 'Sum of on Board',
    colWidth: 150,
    flexGrow: 1,
    type: 'applicationCountCell',
    col: 'starts',
    disableSearch: true,
  },
];

class JobTable extends React.PureComponent {
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
      jobList,
      myFavJobIds,
      selected,
      onFavorite,
      onSelect,
      loadMore,
      onStatusChange,
      handleFetchDetails,
      filterOpen,
      onFilter,
      onSortChange,
      colSortDirs = {},
      onScrollEnd,
      scrollLeft,
      scrollTop,
      filters,
      count,
      ownColumns,
      classes,
    } = this.props;
    // console.log(jobList.toJS());

    return (
      <AutoSizer style={{ touchAction: 'none' }}>
        {({ width, height }) => (
          <React.Fragment>
            <Table
              rowHeight={ROW_HEIGHT}
              headerHeight={
                filterOpen ? HEADER_WITHFILTER_HEIGHT : HEADER_HEIGHT
              }
              rowsCount={count || jobList.size}
              width={width || window.innerWidth}
              height={height || window.innerHeight}
              rowClassNameGetter={(rowIndex) => {
                if (
                  selected &&
                  selected.includes(jobList.getIn([rowIndex, 'id']))
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
              touchScrollEnabled
            >
              {(myFavJobIds || selected) && (
                <Column
                  cell={({ rowIndex, ...props }) => {
                    const id = jobList.getIn([rowIndex, 'id']);
                    const isSelected = selected && selected.includes(id);
                    const isFavored = myFavJobIds && myFavJobIds.includes(id);

                    return (
                      <Cell {...props}>
                        <div className="flex-container align-right">
                          {selected && (
                            <div style={style.checkboxContainer}>
                              <Checkbox
                                className={classes.checkbox}
                                checked={isSelected}
                                onChange={() => onSelect(id)}
                                disabled={!id}
                                color="primary"
                              />
                            </div>
                          )}
                          {myFavJobIds && (
                            <div style={style.checkboxContainer}>
                              <Checkbox
                                className={classes.checkbox}
                                checkedIcon={<Star />}
                                icon={<StarBorder />}
                                checked={isFavored}
                                onChange={() => onFavorite(id)}
                                disabled={!id}
                                classes={{
                                  root: classes.favoriteRoot,
                                  checked: classes.favoriteChecked,
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </Cell>
                    );
                  }}
                  fixed={true}
                  width={selected && myFavJobIds ? 90 : 53}
                />
              )}
              {(ownColumns || columns).map((column, index) => (
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
                    <JobCell
                      data={jobList}
                      col={column.col}
                      type={column.type}
                      loadMore={loadMore}
                      onStatusChange={onStatusChange}
                      handleFetchDetails={handleFetchDetails}
                      style={style.displayCell}
                    />
                  }
                  width={this.state.columnWidths[column.col]}
                  flexGrow={column.flexGrow}
                  fixed={column.fixed}
                  allowCellsRecycling={true}
                  pureRendering={true}
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

JobTable.propTypes = {
  jobList: PropTypes.instanceOf(Immutable.List).isRequired,
};

export default withStyles(style)(JobTable);
