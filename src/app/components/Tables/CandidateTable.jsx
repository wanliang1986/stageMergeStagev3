import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { Link } from 'react-router-dom';
import withStyles from '@material-ui/core/styles/withStyles';
import { externalUrl } from '../../../utils';

import ReactTooltip from 'react-tooltip';

// import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import AutoSizer from '../../../lib/auto-sizer';
import IconButton from '@material-ui/core/IconButton';
import { Table, Column, Cell } from 'fixed-data-table-2';
import Checkbox from '@material-ui/core/Checkbox';

import DeleteIcon from '@material-ui/icons/Delete';
import StarBorder from '@material-ui/icons/StarBorder';
import Star from '@material-ui/icons/Star';
import { WorkNum, AssignJobIcon } from './../Icons';

import HeaderCell from './TableCell/HeaderCell';
import TextCell from './TableCell/TextCell';
import DateTimeCell from './TableCell/DateTimeCell';
import LinkButton from './../particial/LinkButton';

import {
  style,
  HEADER_HEIGHT,
  ROW_HEIGHT,
  HEADER_WITHFILTER_HEIGHT,
} from './params';

function formatFullName(firstName, lastName) {
  if (lastName[0].match(/[\uAC00-\uD7AF\u4E00-\u9FBF]+/g)) {
    return lastName + firstName;
  }
  return firstName + ' ' + lastName;
}

const NameLinkCell = ({ rowIndex, data, col, loadMore, ...props }) => {
  const id = data.getIn([rowIndex, 'id']);
  if (id) {
    let text = data.getIn([rowIndex, col]);
    const firstName = (data.getIn([rowIndex, 'firstName']) || '').trim();
    const lastName = (data.getIn([rowIndex, 'lastName']) || '').trim();
    if (firstName && lastName) {
      text = formatFullName(firstName, lastName);
    }
    // console.log(text, firstName, lastName, data.get(rowIndex).toJS());

    return (
      <Cell {...props}>
        <div
          className="overflow_ellipsis_1"
          title={text}
          style={{ width: props.width - 26 }}
        >
          {col !== 'id' ? (
            <Link to={`/candidates/detail/${id}`} className="candidate-link">
              {text}
            </Link>
          ) : (
            <Link to={`/candidates/review/${id}`} className="candidate-link">
              {text}
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

const NameNewPageCell = ({ rowIndex, data, col, loadMore, ...props }) => {
  const text = data.getIn([rowIndex, col]);
  return (
    <Cell {...props}>
      <div
        className="overflow_ellipsis_1"
        title={text}
        style={{ width: props.width - 26 }}
      >
        <a
          href={`/candidates/detail/${data.getIn([rowIndex, 'id'])}`}
          target="_blank"
          rel="noopener noreferrer"
          className="candidate-link"
        >
          {data.getIn([rowIndex, col])}
        </a>
      </div>
    </Cell>
  );
};

const ApplicationCell = ({ rowIndex, data, col, onApply, ...props }) => {
  const id = data.getIn([rowIndex, 'id']);
  const watchApplicationCount =
    data.getIn([rowIndex, 'watchApplicationCount']) || 0;
  if (id) {
    return (
      <Cell {...props}>
        <IconButton
          disabled={!watchApplicationCount}
          style={{ padding: 4 }}
          onClick={() => {
            if (onApply) {
              onApply(id);
            }
          }}
        >
          <WorkNum
            htmlColor={watchApplicationCount !== 0 ? '#2cc86e' : undefined}
            num={watchApplicationCount}
          />
        </IconButton>
      </Cell>
    );
  }
  return <Cell {...props}>loading...</Cell>;
};

const TalentCell = ({ type, loadMore, onApply, t, ...props }) => {
  switch (type) {
    case 'link':
      return <NameLinkCell {...props} loadMore={loadMore} />;
    case 'talentNameNewPageLink':
      return <NameNewPageCell {...props} />;
    case 'date':
      return <DateTimeCell {...props} />;
    case 'application':
      return <ApplicationCell {...props} onApply={onApply} />;
    case 'resume':
      return <ResumeCell t={t} {...props} />;
    default:
      return <TextCell {...props} />;
  }
};

const downloadResume = (resumelink, name) => {
  fetch(externalUrl(resumelink, true))
    .then(_handleResponseToBlob)
    .then(({ response }) => {
      handleDownload(response, name);
    });
};

function _handleResponseToBlob(response) {
  if (!response.ok) {
    return response
      .text()
      .then((text) => {
        return Promise.reject({
          status: response.status,
          message: text,
        });
      })
      .catch((err) => {
        throw response.status;
      });
  }
  return response
    .blob()
    .then((blob) => {
      return {
        response: blob,
      };
    })
    .catch((err) => {
      return 'OK';
    });
}

const handleDownload = (response, filename) => {
  console.log(response);

  var linkElement = document.createElement('a');
  try {
    var blob = new Blob([response], { type: response.type });
    var url = window.URL.createObjectURL(blob);
    linkElement.setAttribute('href', url);
    linkElement.setAttribute('download', filename);
    var clickEvent = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: false,
    });
    linkElement.dispatchEvent(clickEvent);
  } catch (ex) {
    console.log(ex);
  }
};

const ResumeCell = ({ rowIndex, data, t, ...props }) => {
  const id = data.getIn([rowIndex, 'id']);
  const resumelink = data.getIn([rowIndex, 'resume']);
  const resumeName = data.getIn([rowIndex, 'resumeName']);
  if (id) {
    return (
      <Cell {...props}>
        <div
          className="overflow_ellipsis_1"
          style={{ width: props.width - 26 }}
        >
          {
            <LinkButton
              onClick={() => downloadResume(resumelink, resumeName)}
              className="candidate-link"
            >
              {t('common:download')}
            </LinkButton>
          }
        </div>
      </Cell>
    );
  }

  return <Cell {...props}>loading...</Cell>;
};

class CandidateTable extends React.PureComponent {
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

  // UNSAFE_componentWillReceiveProps(nextProps) {
  //     console.log('nextProps', nextProps);
  //     if (nextProps !== this.props) {
  //         Object.keys(nextProps).forEach(key => {
  //             if (nextProps[key] !== this.props[key]) {
  //                 console.log('different key', key)
  //             }
  //         })
  //     }
  // }

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
      talentList,
      selected,
      onSelect,
      onSelectAll,
      onFavorite,
      favoriteCandidates,
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
      onApply,
      count,
      onDelete,
      isWatchList,
      t,
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
              rowsCount={count || talentList.size}
              width={width || window.innerWidth}
              height={height || window.innerHeight}
              rowClassNameGetter={(rowIndex) => {
                if (
                  selected &&
                  selected.includes(talentList.getIn([rowIndex, 'id']))
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
              {(favoriteCandidates || selected) && (
                <Column
                  header={
                    <Cell style={style.headerCell}>
                      {onSelectAll && (
                        <div style={{ paddingLeft: 7 }}>
                          <Checkbox
                            className={classes.checkbox}
                            color="primary"
                            checked={
                              talentList.size === selected.size &&
                              talentList.size !== 0
                            }
                            indeterminate={
                              talentList.size !== selected.size &&
                              selected.size !== 0
                            }
                            onChange={onSelectAll}
                          />
                          <br />
                          {filterOpen && <br />}
                        </div>
                      )}
                    </Cell>
                  }
                  cell={({ rowIndex, ...props }) => {
                    const id = talentList.getIn([rowIndex, 'id']);
                    const isSelected = selected && selected.includes(id);
                    const isFavored =
                      favoriteCandidates && favoriteCandidates.includes(id);
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
                          {favoriteCandidates && (
                            <div className={classes.checkboxContainer}>
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
                  allowCellsRecycling={true}
                  fixed={true}
                  width={selected && favoriteCandidates ? 90 : 55}
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
                    <TalentCell
                      loadMore={loadMore}
                      onApply={onApply}
                      data={talentList}
                      col={column.col}
                      type={column.type}
                      style={style.displayCell}
                      t={t}
                    />
                  }
                  width={this.state.columnWidths[column.col]}
                  flexGrow={column.flexGrow}
                  fixed={column.fixed}
                  isResizable={true}
                />
              ))}
              {onDelete && (
                <Column
                  cell={({ rowIndex, ...props }) => {
                    const id = talentList.getIn([rowIndex, 'id']);
                    return (
                      <Cell {...props}>
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
              {onApply && !isWatchList && (
                <Column
                  cell={({ rowIndex, ...props }) => {
                    const id = talentList.getIn([rowIndex, 'id']);
                    return (
                      <Cell {...props}>
                        <IconButton
                          style={{ padding: 4 }}
                          onClick={() => onApply(id)}
                          color="primary"
                        >
                          <AssignJobIcon />
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

CandidateTable.propTypes = {
  talentList: PropTypes.instanceOf(Immutable.List).isRequired,
};

export default withStyles(style)(CandidateTable);
