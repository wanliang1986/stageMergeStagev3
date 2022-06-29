import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import moment from 'moment-timezone';
import { getMyInvoiceList } from '../../../../apn-sdk/dashboard';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import DashboardTable from '../Tables/DashboardTable';
import Loading from '../../../components/particial/Loading';

import Piechart from './Piechart';

import { currency as currencyOptions } from '../../../constants/formOptions';

const currencyLabels = currencyOptions.reduce((res, v) => {
  res[v.value] = v.label;
  return res;
}, {});
const styles = {
  root: {
    padding: '14px 24px',
  },
  half: {
    flex: '0 0 1336px',
    overflow: 'hidden',
    position: 'relative',
    height: 300,
  },
  mask: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    backgroundColor: 'rgba(240,240,240,.5)',
  },
  columns: {
    padding: '0 8px',
    flex: 1,
  },
};
let status = {};

const columns = [
  {
    colName: 'invoiceNumber',
    colWidth: 160,
    col: 'subInvoiceNo',
    type: 'invoiceReminder',
    fixed: true,
    sortable: true,
  },

  {
    colName: 'employeeName',
    colWidth: 160,
    flexGrow: 1,
    col: 'talentName',
    sortable: true,
  },

  {
    colName: 'billingCompany',
    colWidth: 140,
    flexGrow: 1,
    col: 'customerName',
    sortable: true,
  },

  {
    colName: 'jobTitle',
    colWidth: 160,
    flexGrow: 1,
    col: 'jobTitle',
    sortable: true,
  },
  {
    colName: 'status',
    colWidth: 100,
    col: 'status',
    type: 'invoiceStatus',
    sortable: false,
  },
  {
    colName: 'invoiceDate',
    colWidth: 140,
    col: 'invoiceDate',
    type: 'date',
    sortable: true,
    disableSearch: true,
  },
  {
    colName: 'invoiceAmount',
    colWidth: 200,
    col: 'dueAmount',
    type: 'money',
    sortable: true,
    disableSearch: true,
  },
  {
    colName: 'dueDate',
    colWidth: 140,
    col: 'dueDate',
    type: 'date',
    sortable: true,
    disableSearch: true,
  },
];

function onScrollEnd(scrollLeft, scrollTop) {
  status.scrollLeft = scrollLeft;
  status.scrollTop = scrollTop;
}

const COUNT_PER_PAGE = 50;
const isLoading = {};

class MyDBFinance extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentQuarter: false,
      searching: false,
      data: Immutable.List(),
      totalNumOfInvoices: 0,
      page: 0,
      footerData: Immutable.Map(),
      piechart: [
        { paid: 0, unpaid: 0, overdue: 0 },
        { paid: 0, unpaid: 0, overdue: 0 },
      ],
    };
  }

  componentDidMount() {
    const lastYear = moment().subtract(1, 'year').format('YYYY-MM-DD');
    this.fetchData(0, COUNT_PER_PAGE, lastYear);
  }

  // componentWillUnmount() {
  //     this.fetchTask.cancel();
  // }

  fetchData = (page, size, from = '') => {
    this.setState({ searching: true });

    return getMyInvoiceList(page, size, from).then((res) => {
      const invoices = res.response.elements;
      const currencyAmounts = res.response.currencyAmounts;

      const tableData = invoices
        ? Immutable.fromJS(invoices).toList()
        : Immutable.List();
      const summary =
        currencyAmounts &&
        currencyAmounts.map(
          ({ currency, totalAmount, totalOverdueAmount, totalPaidAmount }) => ({
            currency,
            paid: totalPaidAmount,
            unpaid: totalAmount - totalPaidAmount,
            overdue: totalOverdueAmount,
          })
        );

      const dueAmount =
        currencyAmounts &&
        currencyAmounts
          .map(
            ({ currency, totalAmount }) =>
              `${currencyLabels[currency] || ''}${totalAmount.toLocaleString()}`
          )
          .join(' | ');
      console.log(summary, dueAmount);
      this.setState({
        piechart: summary,
        totalNumOfInvoices: parseInt(res.headers.get('pagination-count'), 10),
        footerData: Immutable.Map({
          subInvoiceNo: 'Total',
          dueAmount: dueAmount,
        }),
        searching: false,
        data: tableData,
      });
    });
  };

  loadMore = (rowIndex) => {
    const page = Math.floor(rowIndex / COUNT_PER_PAGE);
    if (isLoading[page]) {
      return;
    }
    isLoading[page] = true;
    this.setState({ page });
    console.log('load more', page, COUNT_PER_PAGE);
    getMyInvoiceList(page, COUNT_PER_PAGE).then((res) => {
      isLoading[page] = false;
      const curData = this.state.data;
      this.setState({ data: curData.concat(res.response.elements) });
    });
  };

  handlecurrentQuarterChange = (e) => {
    this.setState({ currentQuarter: e.target.checked });

    const from = e.target.checked
      ? moment().startOf('quarter').format('YYYY-MM-DD')
      : '';

    console.log('from', from);
    this.fetchData(0, COUNT_PER_PAGE, from);
  };

  render() {
    const { classes, t } = this.props;
    const {
      data,
      footerData,
      searching,
      colSortDirs,
      currentQuarter,
      piechart,
      totalNumOfInvoices,
      page,
    } = this.state;

    const count =
      totalNumOfInvoices > (page + 1) * COUNT_PER_PAGE
        ? (page + 1) * COUNT_PER_PAGE + 1
        : totalNumOfInvoices;

    return (
      <Paper className={classes.root}>
        <div
          className="flex-container align-justify"
          style={{ marginBottom: 12 }}
        >
          {/*todo://add i18n*/}
          <Typography variant="h6">{t('tab:My Billing')}</Typography>
          {/* <Link href="/invoices">More</Link> */}
        </div>
        <div
          className="flex-container align-justify"
          style={{ marginBottom: 12 }}
        >
          <div className="flex-container">
            {piechart &&
              piechart.map((pieChartData, index) => {
                return (
                  <Piechart
                    key={index}
                    pieChartData={pieChartData}
                    currency={pieChartData.currency}
                  />
                );
              })}
          </div>
          <FormControlLabel
            control={
              <Switch
                size="small"
                checked={currentQuarter}
                onChange={this.handlecurrentQuarterChange}
                value="checkedcurrentQuarter"
                color="primary"
              />
            }
            labelPlacement="start"
            label={t('action:currentQuarter')}
          />
        </div>
        <Divider />
        <div className="flex-container align-justify">
          <div style={styles.half}>
            <DashboardTable
              data={data}
              loadMore={this.loadMore}
              count={count}
              colSortDirs={colSortDirs}
              onSortChange={this.onSortChange}
              onScrollEnd={onScrollEnd}
              scrollLeft={status.scrollLeft}
              scrollTop={status.scrollTop}
              columns={columns}
              footerData={footerData}
              t={t}
              footerHeight={40}
              jobTable={true}
            />
            {searching && <Loading style={styles.mask} />}
          </div>
        </div>
      </Paper>
    );
  }
}

MyDBFinance.propTypes = {
  t: PropTypes.func.isRequired,
};

export default connect()(withStyles(styles)(MyDBFinance));
