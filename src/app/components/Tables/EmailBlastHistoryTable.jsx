import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import withStyles from '@material-ui/core/styles/withStyles';
import format from 'date-fns/format';
import IconButton from '@material-ui/core/IconButton';
import Checkbox from '@material-ui/core/Checkbox';
import { Table, Column, Cell } from 'fixed-data-table-2';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';

import EditIcon from '@material-ui/icons/Edit';
import ActionDelete from '@material-ui/icons/Delete';

import HeaderCell from './TableCell/HeaderCell';
import TextCell from './TableCell/TextCell';
import { jobDateFormat } from '../../../utils';
import ReactTooltip from 'react-tooltip';

import {
  style,
  HEADER_HEIGHT,
  ROW_HEIGHT,
  HEADER_WITHFILTER_HEIGHT,
} from './params';
import LinkButton from '../particial/LinkButton';
import { jobType, templateTypes2 } from '../../constants/formOptions';

const NameButtonCell = ({
  rowIndex,
  data,
  col,
  onViewEmailHistory,
  templateList,
  ...props
}) => {
  const id = data.getIn([rowIndex, 'id']);
  const success = data.getIn([rowIndex, 'success']);

  if (id) {
    const text = data.getIn([rowIndex, col]);
    if (success) {
      return (
        <Cell {...props}>
          <div
            className="overflow_ellipsis_1"
            style={{ width: props.width - 26 }}
          >
            <LinkButton
              onClick={() => onViewEmailHistory(templateList.get(rowIndex))}
            >
              {text}
            </LinkButton>
          </div>
        </Cell>
      );
    } else {
      return (
        <Cell {...props}>
          <div
            className="overflow_ellipsis_1"
            style={{ width: props.width - 26 }}
          >
            {text}
          </div>
        </Cell>
      );
    }
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
            {text}
          </LinkButton>
        </div>
      </Cell>
    );
  }
  return <Cell {...props}>loading...</Cell>;
};

const TosCell = ({ rowIndex, data, col, ...props }) => {
  const id = data.getIn([rowIndex, 'id']);

  if (id) {
    const nameList = data.getIn([rowIndex, col]).toJS();
    const text = nameList.reduce((acc, ele, index) => {
      if (index === nameList.length - 1) {
        return acc + ele.name;
      } else {
        return acc + ele.name + ', ';
      }
    }, '');

    // console.log('???', id, col, text);
    return (
      <Cell {...props}>
        <div
          className="overflow_ellipsis_1"
          title={text}
          data-tip={text}
          style={{ width: props.width - 26 }}
        >
          {text}
        </div>
      </Cell>
    );
  }
  return <Cell {...props}>Loading...</Cell>;
};

// APN_INJECTION_FAILURE
// APN_INJECTION_SUCCESS
// INJECTION
// SPAM_COMPLAINT
// OUT_OF_BAND
// POLICY_REJECTION
// DELAY
// GENERATION_FAILURE
// GENERATION_REJECTION
// LIST_UNSUBSCRIBE
// LINK_UNSUBSCRIBE

const StatsCell = ({ rowIndex, data, col, ...props }) => {
  const id = data.getIn([rowIndex, 'id']);
  const count = data.getIn([rowIndex, col]);
  if (id) {
    return (
      <Cell {...props}>
        <div
          className="overflow_ellipsis_1"
          title={count}
          style={{ width: props.width - 26 }}
        >
          {count}
        </div>
      </Cell>
    );
  }
  return <Cell {...props}>Loading...</Cell>;
};

const StatusCell = ({ rowIndex, data, col, ...props }) => {
  const id = data.getIn([rowIndex, 'id']);

  if (id) {
    const text = data.getIn([rowIndex, col]).toLowerCase();
    const date = data.getIn([rowIndex, 'timestamp']);

    return (
      <Cell {...props}>
        <div
          className="overflow_ellipsis_1"
          style={{ width: props.width - 26 }}
        >
          {text !== 'scheduled' && date
            ? text
            : `${text} for ${new Date(date).toLocaleDateString()} ${new Date(
                date
              ).toLocaleTimeString()}`}
        </div>
      </Cell>
    );
  }
  return <Cell {...props}>Loading...</Cell>;
};

const DateCell = ({ rowIndex, data, col, ...props }) => {
  const id = data.getIn([rowIndex, 'id']);
  if (id) {
    const status = data.getIn([rowIndex, 'status']);
    const text = data.getIn([rowIndex, col]);

    if (status !== 'SENT') {
      return (
        <Cell {...props}>
          <div
            className="overflow_ellipsis_1"
            style={{
              width: props.width - 26,
            }}
          >
            -
          </div>
        </Cell>
      );
    } else {
      return (
        <Cell {...props}>
          <div
            className="overflow_ellipsis_1"
            style={{
              width: props.width - 26,
            }}
          >
            {text ? jobDateFormat(text) : 'N/A'}
          </div>
        </Cell>
      );
    }
  }
  return <Cell {...props}>loading...</Cell>;
};

const StatusDetailCell = ({ rowIndex, data, col, ...props }) => {
  const text = data.getIn([rowIndex, col]);
  return (
    <Cell {...props}>
      <div className="overflow_ellipsis_1" style={{ width: props.width - 26 }}>
        {text}
      </div>
    </Cell>
  );
};

const TemplateCell = ({
  type,
  onViewEmailHistory,
  templateList,
  openSendEmailForm,
  ...props
}) => {
  switch (type) {
    case 'nameButton':
      return (
        <NameButtonCell
          onViewEmailHistory={onViewEmailHistory}
          templateList={templateList}
          {...props}
        />
      );
    case 'enum':
      return <EnumCell {...props} />;
    case 'tos':
      return <TosCell {...props} />;
    case 'stats':
      return <StatsCell {...props} />;
    case 'status':
      return <StatusCell {...props} />;
    case 'date':
      return <DateCell {...props} />;
    case 'sendEmail':
      return <SendEmailCell openSendEmailForm={openSendEmailForm} {...props} />;
    case 'statusDetail':
      return <StatusDetailCell {...props} />;
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
  componentDidMount() {
    ReactTooltip.rebuild();
  }
  componentDidUpdate() {
    ReactTooltip.rebuild();
  }

  componentDidUpdate() {
    ReactTooltip.rebuild();
  }

  render() {
    const {
      templateList,
      classes,
      onViewEmailHistory,
      onResend,
      onDelete,
      filterOpen,
      filters,
      onFilter,
      onSortChange,
      colSortDirs,
      onScrollEnd,
      columns,
      selected,
      onSelect,
      noAction,
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
            onScrollEnd={(...props) => {
              if (onScrollEnd) {
                onScrollEnd(...props);
              }
              ReactTooltip.rebuild();
            }}
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
                    type={column.type}
                    col={column.col}
                    style={style.displayCell}
                    onViewEmailHistory={onViewEmailHistory}
                    templateList={templateList}
                  />
                }
                width={column.colWidth}
                flexGrow={column.flexGrow}
                fixed={column.fixed}
              />
            ))}

            {!noAction && (
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
                        {onViewEmailHistory && (
                          <span
                            onClick={() => onViewEmailHistory(datum)}
                            style={{ cursor: 'pointer' }}
                          >
                            View
                          </span>
                        )}
                        {onResend && (
                          <span
                            onClick={() => onResend(rowIndex)}
                            // style={{ padding: 4 }}
                          >
                            Send
                          </span>
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
                width={100}
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
