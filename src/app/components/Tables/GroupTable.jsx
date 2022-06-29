import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import withStyles from '@material-ui/core/styles/withStyles';
import ReactTooltip from 'react-tooltip';
import { formatUserName, formatFullName } from '../../../utils';

import IconButton from '@material-ui/core/IconButton';
// import Checkbox from '@material-ui/core/Checkbox';
import { Table, Column, Cell } from 'fixed-data-table-2';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';

import EditIcon from '@material-ui/icons/Edit';
import ActionDelete from '@material-ui/icons/Delete';

import HeaderCell from './TableCell/HeaderCell';
import TextCell from './TableCell/TextCell';
import DateCell from './TableCell/DateCell';
import TeamMemberTooltip2 from '../../pages/Tenants/TeamMemberTooltip2';
import { withTranslation } from 'react-i18next';
import {
  style,
  HEADER_HEIGHT,
  ROW_HEIGHT,
  HEADER_WITHFILTER_HEIGHT,
} from './params';

const EnumCell = ({ rowIndex, data, col, t, classes, ...props }) => {
  const id = data.getIn([rowIndex, 'id']);
  if (id) {
    const text = data.getIn([rowIndex, col]);
    return (
      <Cell {...props}>
        <div
          className="overflow_ellipsis_1"
          style={{
            width: props.width - 26,
            textTransform: 'none',
          }}
        >
          {t('common:' + text)}
        </div>
      </Cell>
    );
  }
  return <Cell {...props}>loading...</Cell>;
};

const NameButtonCell = ({ rowIndex, data, col, onEdit, classes, ...props }) => {
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
          <button
            className={classes.buttonLink}
            onClick={() => onEdit(rowIndex)}
          >
            {text}
          </button>
        </div>
      </Cell>
    );
  }
  return <Cell {...props}>Loading...</Cell>;
};

const TeamMembersCell = ({ rowIndex, data, col, t, classes, ...props }) => {
  const id = data.getIn([rowIndex, 'id']);
  if (id) {
    const users = data.getIn([rowIndex, col]);
    const text =
      users &&
      users
        .map(formatUserName)
        .filter((e) => e)
        .join(', ');
    return (
      <Cell {...props}>
        <div
          className="overflow_ellipsis_1"
          style={{
            width: props.width - 26,
            textTransform: 'none',
          }}
          title={text}
        >
          <TeamMemberTooltip2 users={users} key={id}>
            {text}
          </TeamMemberTooltip2>
        </div>
      </Cell>
    );
  }
  return <Cell {...props}>loading...</Cell>;
};

const TeamLeader = ({ rowIndex, data, col, t, classes, ...props }) => {
  const id = data.getIn([rowIndex, 'id']);
  const leaderUserId = data.getIn([rowIndex, 'leaderUserId']);
  if (id) {
    const users = data.getIn([rowIndex, col]);
    const text =
      users &&
      users
        .map((item, index) => {
          if (item.get('userId') === leaderUserId) {
            const firstName = item.get('firstName');
            const lastName = item.get('lastName');
            const username = item.get('username');
            return firstName && lastName
              ? formatFullName(firstName.trim(), lastName.trim())
              : username;
          }
        })
        .filter((e) => e)
        .join(', ');
    return (
      <Cell {...props}>
        <div
          className="overflow_ellipsis_1"
          style={{
            width: props.width - 26,
            textTransform: 'none',
          }}
          title={text}
        >
          {text}
        </div>
      </Cell>
    );
  }
  return <Cell {...props}>loading...</Cell>;
};

const TemplateCell = ({ type, onEdit, t, ...props }) => {
  switch (type) {
    case 'enum':
      return <EnumCell t={t} {...props} />;
    case 'date':
      return <DateCell {...props} />;
    case 'list':
      return <TeamMembersCell t={t} {...props} />;
    case 'leader':
      return <TeamLeader t={t} {...props} />;
    case 'nameButton':
      return onEdit ? (
        <NameButtonCell onEdit={onEdit} {...props} />
      ) : (
        <TextCell {...props} />
      );

    default:
      return <TextCell {...props} />;
  }
};

class GroupTable extends React.PureComponent {
  state = {
    scrollLeft: 0,
  };

  componentDidMount() {
    ReactTooltip.rebuild();
  }

  render() {
    const {
      groupList,
      classes,
      t,
      onEdit,
      onDelete,
      filterOpen,
      filters,
      onFilter,
      onSortChange,
      colSortDirs,
      columns,
      selected,
      onSelect,
    } = this.props;

    return (
      <AutoSizer>
        {({ width, height }) => (
          <React.Fragment>
            <Table
              rowsCount={groupList.size}
              rowHeight={ROW_HEIGHT}
              headerHeight={
                filterOpen ? HEADER_WITHFILTER_HEIGHT : HEADER_HEIGHT
              }
              width={width || window.innerWidth}
              height={height || window.innerHeight}
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
                      t={t}
                    />
                  }
                  cell={
                    <TemplateCell
                      data={groupList}
                      type={column.type}
                      col={column.col}
                      style={style.displayCell}
                      onEdit={onEdit}
                      t={t}
                      classes={classes}
                    />
                  }
                  width={column.colWidth}
                  flexGrow={column.flexGrow}
                  fixed={column.fixed}
                />
              ))}
              {onDelete && (
                <Column
                  header={
                    <Cell style={style.headerCell}>
                      <div
                        style={{ ...style.headerText, marginBottom: '20px' }}
                      >
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
                          {onEdit && (
                            <IconButton
                              onClick={() => onEdit(rowIndex)}
                              style={{ padding: 4 }}
                            >
                              <EditIcon />
                            </IconButton>
                          )}
                          {onDelete && (
                            <IconButton
                              onClick={() => onDelete(rowIndex)}
                              style={{ padding: 4 }}
                            >
                              <ActionDelete />
                            </IconButton>
                          )}
                        </div>
                      </Cell>
                    );
                  }}
                  allowCellsRecycling={true}
                  width={onEdit && onDelete ? 100 : 50}
                />
              )}
            </Table>
          </React.Fragment>
        )}
      </AutoSizer>
    );
  }
}

GroupTable.propTypes = {
  groupList: PropTypes.instanceOf(Immutable.List).isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  t: PropTypes.func.isRequired,
};

export default withTranslation('tab')(withStyles(style)(GroupTable));
