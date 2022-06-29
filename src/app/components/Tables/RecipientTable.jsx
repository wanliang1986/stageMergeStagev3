import React from 'react';
import PropTypes from 'prop-types';
import { formatUserName } from './../../../utils';
import withStyles from '@material-ui/core/styles/withStyles';
import Immutable from 'immutable';

import { Table, Column, Cell } from 'fixed-data-table-2';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import ReactTooltip from 'react-tooltip';
import IconButton from '@material-ui/core/IconButton';
import Switch from '@material-ui/core/Switch';
import DeleteIcon from '@material-ui/icons/Delete';

import HeaderCell from './TableCell/HeaderCell';
import TextCell from './TableCell/TextCell';
import DateTimeCell from './TableCell/DateTimeCell';
import CheckCell from './TableCell/CheckCell';
import SelectionCell from './TableCell/SelectionCell';
import LinkButton from './../particial/LinkButton';

import {
  style,
  HEADER_HEIGHT,
  HEADER_WITHFILTER_HEIGHT,
  ROW_HEIGHT,
} from './params';

const permissions = {
  Owner: 'Owner',
  Apply_Candidate: 'Recruiter',
  Admin: 'P.Recruiter',
  // Edit: 'Edit',
};
const styles = {
  switchRoot: {
    left: -10,
  },
  switchBase: {
    height: '100%',
  },
};

class NameCell extends React.PureComponent {
  render() {
    const { rowIndex, data, col, ...props } = this.props;
    const id = data.getIn([rowIndex, 'id']);
    if (id) {
      const text = formatUserName(data.get(rowIndex));
      const permissionSet =
        data.getIn([rowIndex, 'permissionSet']) || Immutable.List();
      return (
        <Cell {...props}>
          <div
            className="overflow_ellipsis_1"
            data-tip={text}
            style={{ width: props.width - 26 }}
          >
            {text}
            {/*{data.getIn([rowIndex, 'isMe']) && ' (Me)'}*/}
            {permissionSet.includes('Owner') && ' (AM)'}
            {permissionSet.includes('Admin') && ' (PR)'}
          </div>
        </Cell>
      );
    }
    return <Cell {...props}>Loading...</Cell>;
  }
}

const NameButtonCell = ({ rowIndex, data, col, onEdit, ...props }) => {
  const id = data.getIn([rowIndex, 'id']);

  if (id) {
    const text = formatUserName(data.get(rowIndex));
    return (
      <Cell {...props}>
        <div
          className="overflow_ellipsis_1"
          title={text}
          style={{ width: props.width - 26 }}
        >
          <LinkButton onClick={() => onEdit(rowIndex)}>
            {text}
            {data.getIn([rowIndex, 'me']) && ' (Me)'}
          </LinkButton>
        </div>
      </Cell>
    );
  }
  return <Cell {...props}>Loading...</Cell>;
};

const PermissionCell = ({ rowIndex, data, col, ...props }) => {
  const id = data.getIn([rowIndex, 'id']);
  if (id) {
    const permission = data.getIn([rowIndex, col]);
    return (
      <Cell title={permissions[permission]} {...props}>
        <div
          className="overflow_ellipsis_1"
          style={{ width: props.width - 26 }}
        >
          {permissions[permission]}
        </div>
      </Cell>
    );
  }
  return <Cell {...props}>Loading...</Cell>;
};

const ActiveCell = withStyles(styles)(
  ({ rowIndex, data, col, onActiveChange, classes, ...props }) => {
    const user = data.get(rowIndex);
    return (
      <Cell {...props}>
        <Switch
          checked={user.get(col)}
          onChange={() => onActiveChange(user)}
          color="primary"
          classes={{
            root: classes.switchRoot,
            switchBase: classes.switchBase,
          }}
          disabled={!onActiveChange}
        />
      </Cell>
    );
  }
);

const TableCell = ({
  type,
  onActiveChange,
  onRoleChange,
  onEdit,
  ...props
}) => {
  switch (type) {
    case 'name':
      return <NameCell {...props} />;
    case 'nameButton':
      return onEdit ? (
        <NameButtonCell onEdit={onEdit} {...props} />
      ) : (
        <NameCell {...props} />
      );
    case 'role':
      return <CheckCell onChange={onRoleChange} {...props} />;
    case 'permission':
      return <PermissionCell {...props} />;
    case 'active':
      return <CheckCell isSwitch onChange={onActiveChange} {...props} />;
    case 'date':
      return <DateTimeCell {...props} />;
    default:
      return <TextCell {...props} />;
  }
};

class UserTable extends React.PureComponent {
  componentDidMount() {
    ReactTooltip.rebuild();
  }

  componentDidUpdate() {
    ReactTooltip.rebuild();
  }

  isSelected = (id) => this.props.selected && this.props.selected.includes(id);

  render() {
    const {
      dataList,
      selected,
      onSelect,
      onSelectAll,
      onEdit,
      classes,
      onFilter,
      filters,
      filterOpen,
      onSortChange,
      colSortDirs,
      onDelete,
      columns,
      onRoleChange,
      onActiveChange,
      onScrollEnd,
      scrollLeft,
      scrollTop,
    } = this.props;

    return (
      <AutoSizer>
        {({ width, height }) => (
          <React.Fragment>
            <Table
              rowsCount={dataList.size}
              rowHeight={ROW_HEIGHT}
              headerHeight={
                filterOpen ? HEADER_WITHFILTER_HEIGHT : HEADER_HEIGHT
              }
              width={width}
              height={height}
              onScrollEnd={(...props) => {
                if (onScrollEnd) {
                  onScrollEnd(...props);
                }
                ReactTooltip.rebuild();
              }}
              scrollLeft={scrollLeft || 0}
              scrollTop={scrollTop || 0}
            >
              {selected && (
                <Column
                  header={<Cell style={style.headerCell} />}
                  cell={
                    <SelectionCell
                      isSelected={this.isSelected}
                      onSelect={onSelect}
                      dataList={dataList}
                    />
                  }
                  fixed
                  width={53}
                />
              )}

              {columns.map((column, index) => {
                return (
                  <Column
                    key={index}
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
                      <TableCell
                        data={dataList}
                        col={column.col}
                        type={column.type}
                        style={style.displayCell}
                        onActiveChange={onActiveChange}
                        onRoleChange={onRoleChange}
                        onEdit={onEdit}
                      />
                    }
                    flexGrow={column.flexGrow}
                    fixed={column.fixed}
                    width={column.colWidth}
                  />
                );
              })}
              {onDelete && (
                <Column
                  cell={({ rowIndex, ...props }) => {
                    const id = dataList.getIn([rowIndex, 'id']);
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
            </Table>
          </React.Fragment>
        )}
      </AutoSizer>
    );
  }
}

UserTable.propTypes = {
  dataList: PropTypes.object.isRequired,
  isSelected: PropTypes.func,
};

export default withStyles(style)(UserTable);
