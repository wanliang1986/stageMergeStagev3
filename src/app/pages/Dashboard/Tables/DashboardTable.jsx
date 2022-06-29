import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import withStyles from '@material-ui/core/styles/withStyles';
import moment from 'moment-timezone';
import { makeStyles } from '@material-ui/core/styles';
import { getInvoiceDetailList } from '../../../../apn-sdk/invoice';

import { Table, Column, Cell } from 'fixed-data-table-2';
import ReactTooltip from 'react-tooltip';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import Popover from '@material-ui/core/Popover';
import Tooltip from '@material-ui/core/Tooltip';
import { Link } from 'react-router-dom';
import Edit from '@material-ui/icons/Edit';
import { jobStatus } from '../../../constants//formOptions';
import HeaderCell from './TableCell2/HeaderCell2';
import TextCell from './TableCell2/TextCell';
import DateCell from './TableCell2/DateCell';
import FooterCell from './TableCell2/FooterCell';
import PaymentDetail from '../MyFinance/PaymentDetail';
import DashbaordChangeStatus from '../../../components/applications/Buttons/DashbaordChangeStatus';
import {
  currency as currencyOptions,
  currency,
} from '../../../constants/formOptions';
import {
  styles,
  HEADER_HEIGHT,
  ROW_HEIGHT,
  HEADER_WITHFILTER_HEIGHT,
} from './params';

// import hot from './assets/dashboard_hot.jpg';
import Checkbox from '@material-ui/core/Checkbox';

const TitleCell = ({ rowIndex, data, col, ...props }) => {
  const id = data.getIn([rowIndex, 'id']);
  if (id) {
    const text = data.getIn([rowIndex, col]);
    return (
      <Cell {...props}>
        <div className="overflow_ellipsis_1" title={text}>
          {text}
        </div>
      </Cell>
    );
  }
  return <Cell {...props}>Loading...</Cell>;
};

const JobCell = ({ rowIndex, data, col, ...props }) => {
  const id = data.getIn([rowIndex, 'id']);
  if (id) {
    const text = data.getIn([rowIndex, col]);
    return (
      <Cell {...props}>
        <div
          className="overflow_ellipsis_1"
          title={text}
          data-tip={`#${id} - ${text}`}
        >
          #{id} - {text}
        </div>
      </Cell>
    );
  }
  return <Cell {...props}>Loading...</Cell>;
};

const CandidateJob = ({ rowIndex, data, col, ...props }) => {
  const id = data.getIn([rowIndex, 'jobId']);
  if (id) {
    const text = data.getIn([rowIndex, col]);
    return (
      <Cell {...props}>
        <div className="overflow_ellipsis_1" title={text} data-tip={text}>
          {text}
        </div>
      </Cell>
    );
  }
  return <Cell {...props}>Loading...</Cell>;
};

const CandidateNameCell = ({ rowIndex, data, col, ...props }) => {
  const id = data.getIn([rowIndex, 'talentId']);
  if (id) {
    const text = data.getIn([rowIndex, col]);
    return (
      <Link to={`/candidates/detail/${id}`} className="candidate-link">
        <Cell {...props}>
          <div className="overflow_ellipsis_1" title={text} data-tip={text}>
            {text}
          </div>
        </Cell>
      </Link>
    );
  }
  return <Cell {...props}>Loading...</Cell>;
};

const JobHotCell = ({ rowIndex, data, col, ...props }) => {
  const id = data.getIn([rowIndex, 'id']);
  if (id) {
    const text = data.getIn([rowIndex, col]);
    const priority = data.getIn([rowIndex, 'priority']);
    return (
      <Link className="job-link" to={`/jobs/detail/${id}`}>
        <Cell {...props}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div
              className="overflow_ellipsis_1"
              title={text}
              style={{ maxWidth: props.width - 36 }}
              data-tip={`#${id} - ${text}`}
            >
              #{id} - {text}
            </div>
            {priority === 'Urgent' && (
              <img
                src={'./assets/dashboard_hot.jpg'}
                width="16px"
                height="16px"
                alt="hotjob"
              />
            )}
          </div>
        </Cell>
      </Link>
    );
  }
  return <Cell {...props}>Loading...</Cell>;
};

const NumberCell = ({ rowIndex, data, col, handleFetchDetails, ...props }) => {
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

const EnumCell = ({ rowIndex, data, col, ...props }) => {
  const id = data.getIn([rowIndex, 'id']);
  if (id) {
    const text = data.getIn([rowIndex, col]);
    return (
      <Cell {...props}>
        <div className="overflow_ellipsis_1">{text}</div>
      </Cell>
    );
  }
  return <Cell {...props}>loading...</Cell>;
};

const currencyLabels = currencyOptions.reduce((res, v) => {
  res[v.value] = v.label;
  return res;
}, {});

const InvoiceReminderCell = ({ rowIndex, data, col, loadMore, ...props }) => {
  const id = data.getIn([rowIndex, 'id']);

  if (!id) {
    console.log('!!!', rowIndex);
    setTimeout(() => loadMore(rowIndex));
    return <Cell>loading...</Cell>;
  }

  if (id) {
    const text = data.getIn([rowIndex, col]);
    const dueDate = moment(data.getIn([rowIndex, 'dueDate']));
    const invoiceStatus = data.getIn([rowIndex, 'status']);

    const now = moment();
    let remind = false;
    if (dueDate < now.add(10, 'days') && invoiceStatus !== 'PAID')
      remind = true;

    return (
      <Link
        to={`/finance/invoices/detail/${data.getIn([
          rowIndex,
          'invoiceNo',
        ])}#${data.getIn([rowIndex, 'subInvoiceNo'])}`}
      >
        <Cell {...props}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div
              className="overflow_ellipsis_1"
              title={text}
              style={{ maxWidth: props.width - 36 }}
            >
              {text}
            </div>
            {remind && (
              <Tooltip title={`Due Date: ${dueDate.format('l')}`}>
                <img
                  src={'./assets/dashboard_reminder.jpg'}
                  width="16px"
                  height="16px"
                  alt="unpaid invoice"
                />
              </Tooltip>
            )}
          </div>
        </Cell>
      </Link>
    );
  }
  return <Cell {...props}>Loading...</Cell>;
};

const MoneyCell = ({ rowIndex, data, col, ...props }) => {
  const id = data.getIn([rowIndex, 'id']);
  if (id) {
    const currency = data.getIn([rowIndex, 'currency']);
    const money = data.getIn([rowIndex, col]);

    return (
      <Cell {...props}>
        <div className="overflow_ellipsis_1">
          {currencyLabels[currency]}
          {money ? money.toLocaleString() : 0}
        </div>
      </Cell>
    );
  }
  return <Cell {...props}>loading...</Cell>;
};

const Highlight = ({ rowIndex, data, col, t, ...props }) => {
  const id = data.getIn([rowIndex, 'id']);
  if (id) {
    return (
      <Cell {...props}>
        <div className="overflow_ellipsis_1">
          <DashbaordChangeStatus
            t={t}
            applicationId={id}
            status={data.getIn([rowIndex, 'status'])}
          />
        </div>
      </Cell>
    );
  }
  return <Cell {...props}>loading...</Cell>;
};

const useStyles = makeStyles((theme) => ({
  origin: {
    display: 'flex',
    cursor: 'pointer',
  },

  popover: {
    pointerEvents: 'none',
    borderRadius: '8px',
  },
  paper: {
    padding: theme.spacing(1),
  },
  cell: {
    textAlign: 'center',
    borderRadius: 10,
    color: 'white',
    display: 'inline',
    fontSize: 12,
    padding: '3px 5px',
    position: 'relative',
  },
}));

const InvoiceStatusCell = ({ rowIndex, data, col, ...props }) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [paymentData, setpaymentData] = React.useState({});

  const handlePopoverOpen = (event) => {
    const invoiceNo = data.getIn([rowIndex, 'invoiceNo']);
    const subInvoiceNo = data.getIn([rowIndex, 'subInvoiceNo']);
    getInvoiceDetailList(invoiceNo).then((res) => {
      const payment = res.response
        .filter((ele) => ele.subInvoiceNo === subInvoiceNo)
        .map((ele) => {
          return {
            activities: ele.activities
              .filter((ele) => ele.invoiceActivityType === 'PAYMENT')
              .map((ele) => ({
                paymentDate: ele.paymentDate,
                paidAmount: ele.paidAmount,
              })),
            currency: ele.currency,
          };
        });
      setpaymentData(payment[0]);
      console.log('pay', payment);
    });
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const id = data.getIn([rowIndex, 'id']);
  if (id) {
    const invoiceStatus = data.getIn([rowIndex, col]);
    let color = '#21b66e';
    if (invoiceStatus === 'UNPAID') {
      color = '#fdab29';
    }
    if (invoiceStatus === 'OVERDUE') {
      color = '#f56d50';
    }

    if (invoiceStatus === 'PAID') {
      return (
        <Cell {...props}>
          <div
            aria-owns={open ? 'mouse-over-popover' : undefined}
            aria-haspopup="true"
            onMouseEnter={handlePopoverOpen}
            onMouseLeave={handlePopoverClose}
            className={classes.cell}
            style={{ background: color, cursor: 'pointer' }}
          >
            {invoiceStatus}
          </div>
          <Popover
            id="mouse-over-popover"
            className={classes.popover}
            classes={{
              paper: classes.paper,
            }}
            open={open}
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            onClose={handlePopoverClose}
            disableRestoreFocus
          >
            <PaymentDetail data={paymentData} />
          </Popover>
        </Cell>
      );
    } else {
      return (
        <Cell {...props}>
          <div className={classes.cell} style={{ background: color }}>
            {invoiceStatus}
          </div>
        </Cell>
      );
    }
  }
  return <Cell {...props}>loading...</Cell>;
};

const GMCell = ({ rowIndex, data, col, ...props }) => {
  const id = data.getIn([rowIndex, 'id']);
  const gm = data.getIn([rowIndex, col]).toFixed(2);
  const thisCurrency = data.getIn([rowIndex, 'currency']);
  const _currency = currency.filter((item, index) => {
    return item.value === thisCurrency;
  })[0].label;
  if (id) {
    return (
      <Cell {...props}>
        <div className="overflow_ellipsis_1">
          {_currency} {gm}
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
      break;
    case 'REOPENED':
      return '#21B66E';
      break;
    case 'FILLED':
      return '#F56D50';
      break;
    case 'CLOSED':
    case 'CANCELLED':
      return '#BDBDBD';
      break;
    case 'ONHOLD':
      return '#FDAB29';
      break;
    default:
      return '#3398DC';
      break;
  }
};

const ChangeJobStatusCell = ({
  rowIndex,
  data,
  col,
  onStatusChange,
  ...props
}) => {
  const id = data.getIn([rowIndex, 'id']);
  if (id) {
    const text = data.getIn([rowIndex, col]);
    const statusLabels = jobStatus.reduce((res, v) => {
      res[v.value] = v.label;
      return res;
    }, {});
    return (
      <Cell {...props}>
        <div
          onClick={(e) => onStatusChange(e, id)}
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
          <span>{statusLabels[text] || text} </span>
          <Edit style={{ width: '.6em', height: '.6em', marginLeft: '3px' }} />
        </div>
      </Cell>
    );
  }
  return <Cell {...props}>loading...</Cell>;
};

const DashboardCell = ({
  type,
  handleFetchDetails,
  loadMore,
  onStatusChange,
  t,
  ...props
}) => {
  switch (type) {
    case 'candidateName':
      return <CandidateNameCell {...props} />;
    case 'link':
      return <TitleCell {...props} />;
    case 'job':
      return <JobCell {...props} />;
    case 'candidateJob':
      return <CandidateJob {...props} />;
    case 'jobHot':
      return <JobHotCell {...props} />;
    case 'date':
      return <DateCell {...props} />;
    case 'invoiceReminder':
      return <InvoiceReminderCell loadMore={loadMore} {...props} />;
    case 'money':
      return <MoneyCell {...props} />;
    case 'invoiceStatus':
      return <InvoiceStatusCell {...props} />;
    case 'number':
      return <NumberCell {...props} handleFetchDetails={handleFetchDetails} />;
    case 'enum':
      return props.col === 'status' ? (
        <Highlight {...props} t={t} />
      ) : (
        <EnumCell {...props} />
      );
    case 'changeJobStatus':
      return <ChangeJobStatusCell {...props} onStatusChange={onStatusChange} />;
    case 'GM':
      return <GMCell {...props} />;
    default:
      return <TextCell {...props} />;
  }
};

class DashboardTable extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      columnWidths: (props.columns || []).reduce((columnWidths, column) => {
        columnWidths[column.col] = column.colWidth;
        return columnWidths;
      }, {}),
    };
  }

  componentDidMount() {
    ReactTooltip.rebuild();
  }
  componentDidUpdate() {
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
      data,
      columns = [],
      footerData,
      footerHeight = 0,
      onSortChange,
      colSortDirs = {},
      onScrollEnd,
      scrollLeft,
      scrollTop,
      classes,
      t,
      onStatusChange,
      jobTable,
      handleFetchDetails,
      loadMore,
      count,
      filterOpen,
      onFilter,
      filters,
      selected,
      onSelect,
      onMultiSelect,
    } = this.props;

    // console.log('table', filterOpen);

    return (
      <AutoSizer style={{ touchAction: 'none' }}>
        {({ width, height }) => (
          <React.Fragment>
            <Table
              className={classes.inFocus}
              rowHeight={ROW_HEIGHT}
              headerHeight={
                filterOpen
                  ? HEADER_WITHFILTER_HEIGHT
                  : jobTable
                  ? 54
                  : HEADER_HEIGHT
              }
              rowsCount={count || data.size}
              width={width || window.innerWidth}
              height={height || window.innerHeight}
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
              footerHeight={footerHeight}
              showScrollbarX={false}
              showScrollbarY={true}
              keyboardScrollEnabled
              stopScrollPropagation
            >
              {selected && (
                <Column
                  cell={({ rowIndex, ...props }) => {
                    const id = data.getIn([rowIndex, 'id']);
                    const isSelected = selected && selected.includes(id);
                    return (
                      <Cell {...props} className={classes.dataCell}>
                        <div className={classes.checkboxContainer}>
                          <Checkbox
                            className={classes.checkbox}
                            color="primary"
                            checked={isSelected}
                            // onChange={() => onSelect(id)}
                            onClick={(e) => {
                              this.shiftKey = e.shiftKey;
                            }}
                            onChange={(e) => {
                              if (this.shiftKey && onMultiSelect) {
                                if (this.preIndex || this.preIndex === 0) {
                                  let startIndex, count;
                                  if (this.preIndex > rowIndex) {
                                    count = this.preIndex - rowIndex + 1;
                                    startIndex = rowIndex;
                                  } else {
                                    count = rowIndex - this.preIndex + 1;
                                    startIndex = this.preIndex;
                                  }
                                  const ids = Array.from(new Array(count)).map(
                                    (_, index) =>
                                      data.getIn([index + startIndex, 'id'])
                                  );
                                  onMultiSelect(ids, e.target.checked);
                                } else {
                                  onSelect(id);
                                }
                              } else {
                                onSelect(id);
                              }
                              this.preIndex = rowIndex;
                            }}
                            size="small"
                          />
                        </div>
                      </Cell>
                    );
                  }}
                  fixed={true}
                  width={36}
                />
              )}
              {columns.map((column, index) => (
                <Column
                  key={index}
                  columnKey={column.col}
                  header={
                    <HeaderCell
                      column={column}
                      onSortChange={onSortChange}
                      filterOpen={filterOpen}
                      sortDir={colSortDirs && colSortDirs[column.col]}
                      filters={filters}
                      onFilter={onFilter}
                      t={t}
                    />
                  }
                  cell={
                    <DashboardCell
                      data={data}
                      className={classes.dataCell}
                      col={column.col}
                      type={column.type}
                      onStatusChange={onStatusChange}
                      handleFetchDetails={handleFetchDetails}
                      loadMore={loadMore}
                      t={t}
                    />
                  }
                  footer={
                    <FooterCell
                      className={classes.footerCell}
                      data={footerData}
                      t={t}
                    />
                  }
                  width={this.state.columnWidths[column.col]}
                  flexGrow={column.flexGrow}
                  fixed={column.fixed}
                  allowCellsRecycling
                  pureRendering
                  isResizable
                />
              ))}
            </Table>
          </React.Fragment>
        )}
      </AutoSizer>
    );
  }
}

DashboardTable.propTypes = {
  data: PropTypes.instanceOf(Immutable.List).isRequired,
};

export default withStyles(styles)(DashboardTable);
