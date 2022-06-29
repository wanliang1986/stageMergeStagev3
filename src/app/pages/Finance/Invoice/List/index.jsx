import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as invoiceActions from '../../../../actions/invoiceActions';
import { withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Immutable from 'immutable';
import getInvoiceList, {
  getQuery,
} from '../../../../selectors/invoiceSelector';

import { customEncodeURIComponent, getNewFilters } from '../../../../../utils';
import zhCN from 'rsuite/lib/IntlProvider/locales/zh_CN';
import enUS from 'rsuite/lib/IntlProvider/locales/en_US';
import { DateRangePicker } from 'rsuite';
import dateFns from 'date-fns';

import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Popover from '@material-ui/core/Popover';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import ArrowDropDown from '@material-ui/icons/ArrowDropDown';

import PrimaryButton from '../../../../components/particial/PrimaryButton';
import InvoiceTable from '../../../../components/Tables/InvoiceTable';
import Loading from '../../../../components/particial/Loading';

const TRANSFORM_ORIGIN = { horizontal: 'left', vertical: 'top' };
const ANCHOR_ORIGIN = { horizontal: 'left', vertical: 'bottom' };
let status = { filterOpen: true };
function onScrollEnd(scrollLeft, scrollTop) {
  status.scrollLeft = scrollLeft;
  status.scrollTop = scrollTop;
}
const COUNT_PER_PAGE = 20;
const isLoading = {};

const styles = {
  container: {
    overflow: 'hidden',
    position: 'relative',
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
};
class InvoiceList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filters: Immutable.Map(props.query.filters),
      // filterOpen: status.filterOpen || false,
      selected: Immutable.Set(),
      firstLoad: true,
      voidOpen: false,
      readyToVoidInvoices: { void: [], nonVoid: [], paid: [] },
    };
  }

  componentDidMount() {
    console.timeEnd('all invoices');
    const { searchStr, sortStr, advancedSearch } = this._getSearchStr(
      this.props.query
    );

    this.fetchInvoiceList(
      0,
      status.count || COUNT_PER_PAGE,
      searchStr,
      sortStr,
      advancedSearch
    );
  }

  componentWillUnmount(): void {
    // status.filterOpen = this.state.filterOpen;
    status.count = this.props.invoiceList.size;
  }

  fetchInvoiceList = (page, size, searchStr, sortStr, advancedSearch) => {
    this.props.dispatch(
      invoiceActions.searchAllInvoiceList(
        page,
        size,
        searchStr,
        sortStr,
        advancedSearch
      )
    );
  };

  loadMore = (rowIndex) => {
    const page = Math.floor(rowIndex / COUNT_PER_PAGE);
    if (isLoading[page]) {
      return;
    }
    isLoading[page] = true;
    const { searchStr, sortStr, advancedSearch } = this._getSearchStr(
      this.props.query
    );
    this.props
      .dispatch(
        invoiceActions.loadMoreAllInvoiceList(
          page,
          COUNT_PER_PAGE,
          searchStr,
          sortStr,
          advancedSearch
        )
      )
      .then(() => (isLoading[page] = false));
  };

  _getSearchStr({ filters, sort }) {
    console.log(filters);
    let excludeKeys = [
      'range',
      'invoiceType',
      'status',
      'invoiceNo',
      'fromDate',
      'toDate',
    ];
    let searchStr = Object.keys(filters)
      .map((key) =>
        !excludeKeys.includes(key)
          ? `${key}:${customEncodeURIComponent(filters[key])}`
          : ''
      )
      .filter((f) => f)
      .join();
    let sortStr = Object.keys(sort)
      .map((key) => `${key},${sort[key]}`)
      .join();
    let advancedSearch = filters.invoiceNo
      ? `&invoiceNo=${filters.invoiceNo}`
      : '';
    if (filters.status) {
      console.log(filters.status);
      advancedSearch += '&status=' + filters.status.split(',').join('&status=');
    } else {
      advancedSearch +=
        '&status=' +
        [
          'PAID',
          'UNPAID',
          'OVERDUE',
          'STARTUP_FEE_PAID_USED',
          'STARTUP_FEE_PAID_UNUSED',
          'STARTUP_FEE_UNPAID_UNUSED',
        ].join('&status=');
    }
    if (filters.invoiceType) {
      advancedSearch += `&invoiceType=${filters.invoiceType}`;
    }
    if (filters.range) {
      advancedSearch += `&fromDate=${dateFns.format(
        new Date(filters.range.from),
        'YYYY-MM-DD'
      )}&toDate=${dateFns.format(new Date(filters.range.to), 'YYYY-MM-DD')}`;
    }

    return {
      searchStr,
      sortStr,
      advancedSearch,
    };
  }

  static getDerivedStateFromProps(props, state) {
    const newFilters = Immutable.Map(props.query.filters);
    if (!newFilters.equals(state.filters)) {
      return { filters: newFilters };
    }
    return null;
  }

  onFilter = (input) => {
    const filters = getNewFilters(input, this.state.filters);

    if (filters) {
      this._onSearch({
        filters: filters.toJSON(),
        sort: this.props.query.sort,
        size: COUNT_PER_PAGE,
      });
    }
  };

  onSortChange = (columnKey, sortDir) => {
    const sort = sortDir ? { [columnKey]: sortDir } : {};
    let filters = this.props.query.filters;
    this._onSearch({ filters, sort, size: this.props.invoiceList.size });
  };

  _onSearch = (query) => {
    const { history, location } = this.props;
    history.replace(
      '?tab=invoices',
      Object.assign({}, location.state, { invoiceAll: query })
    );
    const { searchStr, sortStr, advancedSearch } = this._getSearchStr(query);
    this.fetchInvoiceList(0, query.size, searchStr, sortStr, advancedSearch);
  };

  onSelect = (id) => {
    let selected = this.state.selected;
    if (selected.includes(id)) {
      selected = selected.delete(id);
    } else {
      selected = selected.add(id);
    }
    this.setState({ selected });
  };

  //handle create
  handleClick = (e) => {
    this.setState({ anchorEl: e.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleNav = (path) => {
    this.props.history.push(`/finance/invoices/create/${path}`);
  };
  //handle create end

  handleRangeChange = (range) => {
    const newFilters = this.state.filters.set(
      'range',
      range.length
        ? {
            from: range[0].toISOString(),
            to: dateFns.endOfDay(range[1]).toISOString(),
          }
        : null
    );
    this._onSearch({
      filters: newFilters.toJSON(),
      sort: this.props.query.sort,
      size: COUNT_PER_PAGE,
    });
  };

  render() {
    const { t, i18n, classes, total, query, ids, searching, invoiceList } =
      this.props;

    if (!ids) {
      return <Loading />;
    }

    const { anchorEl, filters } = this.state;
    const range = filters.get('range');
    const count = total > invoiceList.size ? invoiceList.size + 1 : total;
    const isZH = i18n.language.match('zh');

    return (
      <>
        {/*// className="flex-child-auto flex-container flex-dir-column"*/}

        <div>
          <div
            className="flex-container align-middle item-padding align-justify"
            style={{ height: 56 }}
          >
            <div className="item-padding">
              <PrimaryButton
                style={{ minWidth: 100 }}
                onClick={this.handleClick}
              >
                {t('action:create')}
                <ArrowDropDown style={{ marginRight: -8 }} />
              </PrimaryButton>
              <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                transformOrigin={TRANSFORM_ORIGIN}
                anchorOrigin={ANCHOR_ORIGIN}
                onClose={this.handleClose}
                elevation={2}
              >
                <List style={{ width: 200 }}>
                  <ListItem button onClick={() => this.handleNav('fte')}>
                    <ListItemText primary={t('common:FTE Invoice')} />
                  </ListItem>
                  <ListItem button onClick={() => this.handleNav('startupfee')}>
                    <ListItemText primary={t('common:Startup Fee Invoice')} />
                  </ListItem>
                </List>
              </Popover>
            </div>

            <div className="horizontal-layout align-middle">
              <Typography variant="subtitle2">Invoice Date</Typography>
              <DateRangePicker
                placement="bottomEnd"
                value={range ? [new Date(range.from), new Date(range.to)] : []}
                ranges={[
                  {
                    label: 'This Month',
                    value: [
                      dateFns.startOfMonth(new Date()),
                      dateFns.endOfMonth(new Date()),
                    ],
                  },
                  {
                    label: 'This Quarter',
                    value: [
                      dateFns.startOfQuarter(new Date()),
                      dateFns.endOfQuarter(new Date()),
                    ],
                  },
                  {
                    label: 'This Year',
                    value: [
                      dateFns.startOfYear(new Date()),
                      dateFns.endOfYear(new Date()),
                    ],
                  },
                ]}
                // disabledDate={date => dateFns.isAfter(date, new Date())}
                // size='md'
                block
                onChange={this.handleRangeChange}
                placeholder={t('message:selectDateRange')}
                locale={isZH ? zhCN.DateRangePicker : enUS.DateRangePicker}
              />
            </div>
          </div>
          <Divider />
        </div>

        <div className={clsx('flex-child-auto', classes.container)}>
          <InvoiceTable
            invoiceList={invoiceList}
            count={count}
            filterOpen={true}
            loadMore={this.loadMore}
            onFilter={this.onFilter}
            colSortDirs={query.sort}
            onSortChange={this.onSortChange}
            // columns={columns}
            scrollLeft={status.scrollLeft}
            scrollTop={status.scrollTop}
            onScrollEnd={onScrollEnd}
            filters={this.state.filters}
            onSelect={this.onSelect}
            selected={this.state.selected}
          />
          {searching && (
            <div className={clsx('flex-container', classes.mask)}>
              <Loading />
            </div>
          )}
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  const ids = state.controller.searchInvoices.all.ids;
  const total = state.controller.searchInvoices.all.total;
  const searching = state.controller.searchInvoices.all.isFetching;
  return {
    total,
    ids,
    searching,
    query: JSON.parse(getQuery(state, 'all')),
    invoiceList: getInvoiceList(state, 'all'),
  };
};

export default connect(mapStateToProps)(withStyles(styles)(InvoiceList));
