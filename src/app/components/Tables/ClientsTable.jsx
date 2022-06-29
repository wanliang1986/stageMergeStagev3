import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import withStyles from '@material-ui/core/styles/withStyles';

import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import IconButton from '@material-ui/core/IconButton';
import Checkbox from '@material-ui/core/Checkbox';
import { Table, Column, Cell } from 'fixed-data-table-2';
import ReactTooltip from 'react-tooltip';

import EditIcon from '@material-ui/icons/Edit';
import PersonIcon from '@material-ui/icons/Person';
import HeaderCell from './TableCell/HeaderCell';
import DateCell from './TableCell/DateCell';
import TextCell from './TableCell/TextCell';
import LinkButton from './../particial/LinkButton';
import { withTranslation } from 'react-i18next';
import {
  style,
  HEADER_HEIGHT,
  ROW_HEIGHT,
  HEADER_WITHFILTER_HEIGHT,
} from './params';

const NameButtonCell = ({ rowIndex, data, col, onEdit, ...props }) => {
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
          <LinkButton onClick={() => onEdit(rowIndex)}>{text}</LinkButton>
        </div>
      </Cell>
    );
  }
  return <Cell {...props}>Loading...</Cell>;
};

const CandidateCell = ({ rowIndex, data, col, onClick, ...props }) => {
  let id = data.getIn([rowIndex, 'id']);
  if (id) {
    let txt = data.getIn([rowIndex, col]);

    return (
      <Cell {...props}>
        <div
          className="overflow_ellipsis_1"
          style={{ width: props.width - 60 }}
        >
          <LinkButton className="status-link" onClick={() => onClick(id)}>
            {txt}
          </LinkButton>
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
    const text = value ? `${props.t('common:Active')}` : 'inactive';
    return <Cell {...props}>{text}</Cell>;
  }
  return <Cell {...props}>loading...</Cell>;
};

const ClientCell = ({ type, candidateClick, onEdit, ...props }) => {
  switch (type) {
    case 'nameButton':
      return <NameButtonCell onEdit={onEdit} {...props} />;
    case 'bool':
      return <StatusCell {...props} />;
    case 'date':
      return <DateCell {...props} />;
    case 'candidates':
      return <CandidateCell {...props} onClick={candidateClick} />;
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
      clientList,
      classes,
      onEdit,
      filters,
      filterOpen,
      onFilter,
      onSortChange,
      colSortDirs,
      columns,
      selected,
      onSelect,
      onSelectAll,
      onCandidateClick,
      onPreson,
      approverStatus,
      t,
    } = this.props;

    return (
      <AutoSizer>
        {({ width, height }) => (
          <React.Fragment>
            <Table
              rowsCount={clientList.size}
              rowHeight={ROW_HEIGHT}
              headerHeight={
                filterOpen ? HEADER_WITHFILTER_HEIGHT : HEADER_HEIGHT
              }
              width={width || window.innerWidth}
              height={height || window.innerHeight}
              onScrollEnd={() => ReactTooltip.rebuild()}
            >
              {selected && (
                <Column
                  header={
                    <Cell style={style.headerCell}>
                      {onSelectAll && (
                        <div style={{ paddingLeft: 7 }}>
                          <Checkbox
                            className={classes.checkbox}
                            color="primary"
                            checked={
                              clientList.size === selected.size &&
                              clientList.size !== 0
                            }
                            indeterminate={
                              clientList.size !== selected.size &&
                              selected.size !== 0
                            }
                            onChange={onSelectAll}
                          />
                          <br />
                          {/* {filterOpen && <br />} */}
                        </div>
                      )}
                    </Cell>
                  }
                  cell={({ rowIndex, ...props }) => {
                    const id = clientList.getIn([rowIndex, 'id']);
                    const isSelected = selected.includes(id);

                    return (
                      <Cell {...props}>
                        <div className="flex-container align-right">
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
                  fixed={true}
                  width={53}
                />
              )}

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
                      data={clientList}
                      type={column.type}
                      col={column.col}
                      style={style.displayCell}
                      candidateClick={onCandidateClick}
                      onEdit={onEdit}
                      t={t}
                    />
                  }
                  width={column.colWidth}
                  flexGrow={column.flexGrow}
                  fixed={column.fixed}
                />
              ))}
              {onEdit && (
                <Column
                  header={
                    <Cell style={style.headerCell}>
                      <div style={style.headerText}>
                        {t('tab:Action')}
                        {filterOpen && <br />}
                      </div>
                    </Cell>
                  }
                  cell={({ rowIndex, ...props }) => {
                    return (
                      <Cell {...props}>
                        <div
                          className="flex-container align-spaced"
                          style={{ position: 'relative', left: -6 }}
                        >
                          {approverStatus ? (
                            clientList.toJS()[rowIndex].active ? (
                              <IconButton
                                onClick={() => onPreson(rowIndex)}
                                style={{ padding: 4 }}
                              >
                                <PersonIcon style={{ color: '#3398dc' }} />
                              </IconButton>
                            ) : (
                              <IconButton
                                // onClick={() => onPreson(rowIndex)}
                                style={{ padding: 4 }}
                              >
                                <PersonIcon />
                              </IconButton>
                            )
                          ) : null}
                          {/* {clientList.toJS()[rowIndex].active ? (
                            <IconButton
                              onClick={() => onPreson(rowIndex)}
                              style={{ padding: 4 }}
                            >
                              <PersonIcon style={{ color: '#3398dc' }} />
                            </IconButton>
                          ) : (
                            <IconButton
                              // onClick={() => onPreson(rowIndex)}
                              style={{ padding: 4 }}
                            >
                              <PersonIcon />
                            </IconButton>
                          )} */}

                          <IconButton
                            onClick={() => onEdit(rowIndex)}
                            style={{ padding: 4 }}
                          >
                            <EditIcon style={{ color: '#3398dc' }} />
                          </IconButton>
                        </div>
                      </Cell>
                    );
                  }}
                  allowCellsRecycling={true}
                  width={70}
                />
              )}
            </Table>
          </React.Fragment>
        )}
      </AutoSizer>
    );
  }
}

ClientsTable.propTypes = {
  clientList: PropTypes.instanceOf(Immutable.List).isRequired,
  onEdit: PropTypes.func.isRequired,
  onCandidateClick: PropTypes.func.isRequired,
};

export default withTranslation('tab')(withStyles(style)(ClientsTable));
