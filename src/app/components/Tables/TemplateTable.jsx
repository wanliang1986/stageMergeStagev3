import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import withStyles from '@material-ui/core/styles/withStyles';

import IconButton from '@material-ui/core/IconButton';
import Checkbox from '@material-ui/core/Checkbox';
import Tooltip from '@material-ui/core/Tooltip';
import { Table, Column, Cell } from 'fixed-data-table-2';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';

import EditIcon from '@material-ui/icons/Edit';
import ActionDelete from '@material-ui/icons/Delete';
import ActionClone from '@material-ui/icons/FileCopy';

import HeaderCell from './TableCell/HeaderCell';
import TextCell from './TableCell/TextCell';
import DateCell from './TableCell/DateCell';

import {
  style,
  HEADER_HEIGHT,
  ROW_HEIGHT,
  HEADER_WITHFILTER_HEIGHT,
} from './params';
import LinkButton from '../particial/LinkButton';
import { jobType, templateTypes2 } from '../../constants/formOptions';

const NameButtonCell = ({ rowIndex, data, col, onEdit, ...props }) => {
  const id = data.getIn([rowIndex, 'id']);

  if (id) {
    const text = data.getIn([rowIndex, col]) || 'Untitled';
    return (
      <Cell {...props}>
        <div
          className="overflow_ellipsis_1"
          title={text}
          style={{ width: props.width - 26 }}
        >
          {onEdit ? (
            <LinkButton onClick={() => onEdit(rowIndex)}>{text}</LinkButton>
          ) : (
            { text }
          )}
        </div>
      </Cell>
    );
  }
  return <Cell {...props}>Loading...</Cell>;
};

const EnumCell = ({ rowIndex, data, col, ...props }) => {
  const id = data.getIn([rowIndex, 'id']);
  if (id) {
    let text = data.getIn([rowIndex, col]);
    if (col === 'type') {
      const type = templateTypes2.find(({ value }) => value === text);
      text = type ? type.label : text || 'N/A';
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

const SendEmailCell = ({
  rowIndex,
  data,
  col,
  openSendEmailForm,
  ...props
}) => {
  const id = data.getIn([rowIndex, 'id']);
  if (id) {
    let text = data.getIn([rowIndex, col]);
    return (
      <Cell {...props}>
        <div
          className="overflow_ellipsis_1"
          style={{
            width: props.width - 26,
            textTransform: 'none',
          }}
        >
          <LinkButton onClick={() => openSendEmailForm(rowIndex)}>
            {text ? text : 'No Subject'}
          </LinkButton>
        </div>
      </Cell>
    );
  }
  return <Cell {...props}>loading...</Cell>;
};

const TemplateCell = ({ type, onEdit, openSendEmailForm, ...props }) => {
  switch (type) {
    case 'nameButton':
      return <NameButtonCell {...props} onEdit={onEdit} />;
    case 'enum':
      return <EnumCell {...props} />;

    case 'date':
      return <DateCell {...props} />;
    case 'sendEmail':
      return <SendEmailCell openSendEmailForm={openSendEmailForm} {...props} />;
    default:
      return <TextCell {...props} />;
  }
};

class TemplateTable extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      scrollLeft: 0,
    };
  }

  render() {
    const {
      templateList,
      classes,
      onEdit,
      onDelete,
      filterOpen,
      filters,
      onFilter,
      onSortChange,
      colSortDirs,
      onClone,
      columns,
      selected,
      onSelect,
      openSendEmailForm,
    } = this.props;

    return (
      <AutoSizer>
        {({ width, height }) => (
          <Table
            rowsCount={templateList.size}
            rowHeight={ROW_HEIGHT}
            headerHeight={filterOpen ? HEADER_WITHFILTER_HEIGHT : HEADER_HEIGHT}
            width={width || window.innerWidth}
            height={height || window.innerHeight}
          >
            {selected && (
              <Column
                cell={({ rowIndex, ...props }) => {
                  const id = templateList.getIn([rowIndex, 'id']);
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
                  <TemplateCell
                    data={templateList}
                    onEdit={onEdit}
                    type={column.type}
                    col={column.col}
                    style={style.displayCell}
                    openSendEmailForm={openSendEmailForm}
                  />
                }
                width={column.colWidth}
                flexGrow={column.flexGrow}
                fixed={column.fixed}
              />
            ))}
            {(onEdit || onDelete || onClone) && (
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
                  const datum = templateList.get(rowIndex);
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
                        {onClone && (
                          <IconButton
                            onClick={() => onClone(rowIndex)}
                            style={{ padding: 4 }}
                          >
                            <ActionClone />
                          </IconButton>
                        )}
                        {onDelete && (
                          <IconButton
                            onClick={() => onDelete(datum)}
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
                width={
                  Boolean(onEdit) * 50 +
                  Boolean(onDelete) * 50 +
                  Boolean(onClone) * 50
                }
                //fixedRight={true}
              />
            )}
          </Table>
        )}
      </AutoSizer>
    );
  }
}

TemplateTable.propTypes = {
  templateList: PropTypes.instanceOf(Immutable.List).isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};

export default withStyles(style)(TemplateTable);
