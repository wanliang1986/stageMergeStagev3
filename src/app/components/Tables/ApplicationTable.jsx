import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { getApplicationStatusLabel } from './../../constants/formOptions';
import withStyles from '@material-ui/core/styles/withStyles';

import { Link } from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import Checkbox from '@material-ui/core/Checkbox';

import { Table, Column, Cell } from 'fixed-data-table-2';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';

import EditIcon from '@material-ui/icons/Edit';
import ActionDelete from '@material-ui/icons/Delete';
import { AssignCandidateIcon } from '../Icons';

import HeaderCell from './TableCell/HeaderCell';
import DateCell2 from './TableCell/DateCell2';
import DateCellTooltip from './TableCell/DateCellTooltip';
import DateCellTooltipList from './TableCell/DateCellTooltipList';
import TextCell2 from './TableCell/TextCell2';
import LinkButton from './../particial/LinkButton';
import ApplicationChangeStatus from '../applications/Buttons/ChangeStatus';
import Tooltip from '@material-ui/core/Tooltip';

import {
  style,
  HEADER_HEIGHT,
  ROW_HEIGHT_2,
  HEADER_WITHFILTER_HEIGHT,
} from './params';

const NameLinkCell = ({ rowIndex, data, col, ...props }) => {
  const id = data.getIn([rowIndex, 'id']);
  if (id) {
    return (
      <Cell {...props}>
        <div
          className="overflow_ellipsis_1"
          title={data.getIn([rowIndex, col])}
          style={{ width: props.width - 26, fontWeight: 500 }}
        >
          <Link
            to={`/candidates/detail/${data.getIn([rowIndex, 'talentId'])}`}
            className="candidate-link"
          >
            {data.getIn([rowIndex, col])}
          </Link>
        </div>
        {data.getIn([rowIndex, 'email']) && (
          <div
            className="overflow_ellipsis_1"
            title={data.getIn([rowIndex, 'email'])}
            style={{
              textTransform: 'none',
              width: props.width - 26,
            }}
          >
            {data.getIn([rowIndex, 'email'])}&nbsp;
          </div>
        )}
      </Cell>
    );
  }

  return <Cell {...props}>loading...</Cell>;
};

const StatusCell = ({ rowIndex, data, col, t, ...props }) => {
  const id = data.getIn([rowIndex, 'id']);
  if (id) {
    const item = data.get(rowIndex);
    return (
      <Cell {...props}>
        <ApplicationChangeStatus t={t} application={item} />
        <br />
        <br />
      </Cell>
    );
  }
  return <Cell {...props}>loading...</Cell>;
};

const ScoreCell = ({ rowIndex, data, col, onCustomScoreClick, ...props }) => {
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
            width: col === 'customScore' && onCustomScoreClick ? 80 : 70,
            position: 'relative',
          }}
        >
          {score.toFixed()}
          {col === 'customScore' && onCustomScoreClick && (
            <IconButton
              style={{ padding: 2, position: 'absolute', right: 6 }}
              onClick={(e) => onCustomScoreClick(e, data.get(rowIndex))}
            >
              <EditIcon htmlColor="white" style={{ fontSize: 16 }} />
            </IconButton>
          )}
        </div>
        <br />
      </Cell>
    );
  }
  return <Cell {...props}>loading...</Cell>;
};

const RecruiterNames = ({
  rowIndex,
  data,
  col,
  onCustomScoreClick,
  ...props
}) => {
  const id = data.getIn([rowIndex, 'id']);
  if (id) {
    const user =
      data.getIn([rowIndex, 'ipgKpiUsers']) ||
      data.getIn([rowIndex, 'kpiUsers']);

    const userNameArr =
      user &&
      user.map((x) => {
        return `${x.getIn(['user', 'firstName'])} ${x.getIn([
          'user',
          'lastName',
        ])}`;
      });
    const userNames = userNameArr && userNameArr.toJS();
    // const recruiterNames =
    //   data.getIn([rowIndex, col]) && data.getIn([rowIndex, col]).toJS();
    return (
      <Cell {...props}>
        <div
          className="overflow_ellipsis_1"
          data-tip={userNames}
          style={{ width: props.width - 26 }}
        >
          {userNames && (
            <Tooltip
              title={
                <React.Fragment>
                  {userNames.map((item) => (
                    <p
                      style={{
                        fontSize: 15,
                        marginBottom: '3px',
                        marginTop: '3px',
                      }}
                    >
                      {item}
                    </p>
                  ))}
                </React.Fragment>
              }
              placement="top"
            >
              <span>{userNames[0]}</span>
            </Tooltip>
          )}
        </div>
      </Cell>
    );
  }
  return <Cell {...props}>loading...</Cell>;
};

const ApplicationCell = ({ type, onCustomScoreClick, t, ...props }) => {
  switch (type) {
    case 'link':
      return <NameLinkCell {...props} />;
    case 'enum':
      return <StatusCell t={t} {...props} />;
    case 'score':
      return <ScoreCell onCustomScoreClick={onCustomScoreClick} {...props} />;
    case 'date':
      return <DateCell2 {...props} />;
    case 'tooltip':
      return <DateCellTooltip {...props} />;
    case 'tooltipList':
      return <DateCellTooltipList {...props} />;
    case 'recruiterNames':
      return <RecruiterNames {...props} />;
    default:
      return <TextCell2 {...props} />;
  }
};

class ApplicationTable extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      scrollLeft: 0,
    };
  }

  render() {
    const {
      classes,
      applicationList,
      onCustomScoreClick,
      onApply,
      onDelete,
      filterOpen,
      filters,
      onFilter,
      onSortChange,
      colSortDirs,
      columns,
      selected,
      onSelect,
      notifications,
      t,
    } = this.props;

    console.log('table', applicationList.toJS());
    return (
      <AutoSizer>
        {({ width, height }) => (
          <Table
            rowsCount={applicationList.size}
            rowHeight={ROW_HEIGHT_2}
            headerHeight={filterOpen ? HEADER_WITHFILTER_HEIGHT : HEADER_HEIGHT}
            width={width || window.innerWidth}
            height={height || window.innerHeight}
            rowClassNameGetter={(rowIndex) => {
              if (
                notifications &&
                notifications.get(applicationList.getIn([rowIndex, 'id']))
              ) {
                return 'notify-update';
              }
            }}
          >
            {selected && (
              <Column
                cell={({ rowIndex, ...props }) => {
                  const id = applicationList.getIn([rowIndex, 'id']);
                  const isSelected = selected.includes(id);

                  return (
                    <Cell {...props}>
                      <div className="flex-container align-right">
                        <div className={classes.checkboxContainer}>
                          <Checkbox
                            className={classes.checkbox}
                            color="primary"
                            checked={isSelected}
                            onChange={() => onSelect(id)}
                            disabled={!id}
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
                    mode={this.props.mode}
                    column={column}
                    filterOpen={filterOpen}
                    filters={filters}
                    onFilter={onFilter}
                    onSortChange={onSortChange}
                    sortDir={colSortDirs && colSortDirs[column.col]}
                  />
                }
                cell={
                  <ApplicationCell
                    onCustomScoreClick={onCustomScoreClick}
                    data={applicationList}
                    type={column.type}
                    col={column.col}
                    style={style.displayCell}
                    t={t}
                  />
                }
                width={column.colWidth}
                flexGrow={column.flexGrow}
                fixed={column.fixed}
              />
            ))}
            {(onApply || onDelete) && (
              <Column
                header={
                  <Cell style={style.headerCell}>
                    <div style={style.headerText}>
                      Action
                      {filterOpen && <br />}
                    </div>
                  </Cell>
                }
                cell={({ rowIndex, ...props }) => {
                  const datum = applicationList.get(rowIndex);
                  return (
                    <Cell {...props}>
                      <div
                        className="flex-container align-spaced"
                        style={{ position: 'relative', left: -6, top: -4 }}
                      >
                        {onApply && (
                          <IconButton
                            style={{ padding: 4 }}
                            onClick={() => onApply(datum)}
                          >
                            <AssignCandidateIcon />
                          </IconButton>
                        )}
                        {onDelete && (
                          <IconButton
                            style={{ padding: 4 }}
                            onClick={() => onDelete(datum)}
                          >
                            <ActionDelete />
                          </IconButton>
                        )}
                      </div>
                    </Cell>
                  );
                }}
                allowCellsRecycling={true}
                width={onApply && onDelete ? 120 : 70}
              />
            )}
          </Table>
        )}
      </AutoSizer>
    );
  }
}

ApplicationTable.propTypes = {
  applicationList: PropTypes.instanceOf(Immutable.List).isRequired,
  onApply: PropTypes.func,
  onDelete: PropTypes.func,
  onCustomScoreClick: PropTypes.func,
  notifications: PropTypes.instanceOf(Immutable.Map),
};

export default withStyles(style)(ApplicationTable);
