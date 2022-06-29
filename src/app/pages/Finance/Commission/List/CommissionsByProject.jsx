import React from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import zhCN from 'rsuite/lib/IntlProvider/locales/zh_CN';
import enUS from 'rsuite/lib/IntlProvider/locales/en_US';
import { withStyles } from '@material-ui/core';
import dateFns from 'date-fns';
import { customEncodeURIComponent, getNewFilters } from '../../../../../utils';
import Immutable from 'immutable';
import {
  searchAllCommissionList,
  loadMoreAllCommissionList,
} from '../../../../actions/commissionActions';
import clsx from 'clsx';
import getCommissionList, {
  getQuery,
} from '../../../../selectors/commissionSelector';

import { Link } from 'react-router-dom';
import { DateRangePicker } from 'rsuite';

import Divider from '@material-ui/core/Divider';
import Dialog from '@material-ui/core/Dialog';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Paper from '@material-ui/core/Paper';
import MuiLink from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';

import NavigateNextIcon from '@material-ui/icons/NavigateNext';

import PrimaryButton from '../../../../components/particial/PrimaryButton';
import CreateStart from './../Create';
import Loading from '../../../../components/particial/Loading';
import CommissionTable from '../../../../components/Tables/CommissionTable';

const COUNT_PER_PAGE = 20;
const isLoading = {};
let status = { filterOpen: true };
function onScrollEnd(scrollLeft, scrollTop) {
  status.scrollLeft = scrollLeft;
  status.scrollTop = scrollTop;
}
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
class CommissionsByProject extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      range: [],
      openCreate: false,
    };
  }

  componentDidMount() {
    console.timeEnd('all invoices');
    const { sortStr, advancedSearch } = this._getSearchStr(this.props.query);

    this.fetchCommissionList(
      0,
      status.count || COUNT_PER_PAGE,
      sortStr,
      advancedSearch
    );
  }

  static getDerivedStateFromProps(props, state) {
    const newFilters = Immutable.Map(props.query.filters);
    if (!newFilters.equals(state.filters)) {
      return { filters: newFilters };
    }
    return null;
  }

  componentWillUnmount(): void {
    // status.filterOpen = this.state.filterOpen;
    status.count = this.props.commissionList.size;
  }

  handleRangeChange = (range) => {
    this.setState({ range });

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

  loadMore = (rowIndex) => {
    const page = Math.floor(rowIndex / COUNT_PER_PAGE);
    if (isLoading[page]) {
      return;
    }
    isLoading[page] = true;
    const { sortStr, advancedSearch } = this._getSearchStr(this.props.query);
    this.props
      .dispatch(
        loadMoreAllCommissionList(page, COUNT_PER_PAGE, sortStr, advancedSearch)
      )
      .then(() => (isLoading[page] = false));
  };

  _getSearchStr({ filters, sort }) {
    console.log(filters);
    let sortStr = Object.keys(sort)
      .map((key) => `${key},${sort[key]}`)
      .join();

    let advancedSearch = '';

    if (filters.talentName) {
      advancedSearch += `&talentName=${customEncodeURIComponent(
        filters.talentName
      )}`;
    }
    if (filters.teamMember) {
      advancedSearch += `&teamMember=${customEncodeURIComponent(
        filters.teamMember
      )}`;
    }
    if (filters.jobTitle) {
      advancedSearch += `&jobTitle=${customEncodeURIComponent(
        filters.jobTitle
      )}`;
    }
    if (filters.company) {
      advancedSearch += `&company=${customEncodeURIComponent(filters.company)}`;
    }
    if (filters.range) {
      advancedSearch += `&fromDate=${dateFns.format(
        new Date(filters.range.from),
        'YYYY-MM-DD'
      )}&toDate=${dateFns.format(new Date(filters.range.to), 'YYYY-MM-DD')}`;
    }

    return {
      sortStr,
      advancedSearch,
    };
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
    this._onSearch({ filters, sort, size: this.props.commissionList.size });
  };

  _onSearch = (query) => {
    const { history, location } = this.props;
    history.replace(
      '?',
      Object.assign({}, location.state, { commissionAll: query })
    );
    const { sortStr, advancedSearch } = this._getSearchStr(query);
    this.fetchCommissionList(0, query.size, sortStr, advancedSearch);
  };

  fetchCommissionList = (page, size, sortStr, advancedSearch) => {
    this.props.dispatch(
      searchAllCommissionList(page, size, sortStr, advancedSearch)
    );
  };

  handleClose = (reload) => {
    if (reload) {
      const { sortStr, advancedSearch } = this._getSearchStr(this.props.query);

      this.fetchCommissionList(
        0,
        status.count || COUNT_PER_PAGE,
        sortStr,
        advancedSearch
      );
    }
    this.setState({ openCreate: false });
  };

  render() {
    const { filters, openCreate, searching } = this.state;
    const { t, i18n, classes, total, commissionList, query } = this.props;
    const isZH = i18n.language.match('zh');
    const range = filters.get('range');
    const count = total > commissionList.size ? commissionList.size + 1 : total;
    return (
      <Paper className="flex-child-auto flex-container flex-dir-column">
        <div
          className="flex-container align-middle item-padding"
          style={{ height: 46, flexShrink: 0 }}
        >
          <div className="item-padding">
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
              <MuiLink
                color="textPrimary"
                component={Link}
                to={'/finance/commissions'}
                className={'flex-container align-middle'}
              >
                {t('nav:commission')}
              </MuiLink>
              <Typography color="inherit">
                {t('tab:Commission by Projects')}
              </Typography>
            </Breadcrumbs>
          </div>
        </div>
        <div
          className="flex-container align-middle item-padding align-justify"
          style={{ height: 56, flexShrink: 0 }}
        >
          <div className="item-padding">
            <PrimaryButton
              style={{ minWidth: 120 }}
              onClick={() => this.setState({ openCreate: true })}
            >
              {t('action:create')}
            </PrimaryButton>
          </div>

          <div className="horizontal-layout align-middle">
            <Typography variant="subtitle2">
              {t('tab:Hire Start Date')}
            </Typography>
            <DateRangePicker
              placement="bottomEnd"
              value={range ? [new Date(range.from), new Date(range.to)] : []}
              ranges={[
                {
                  label: t('tab:This Month'),
                  value: [
                    dateFns.startOfMonth(new Date()),
                    dateFns.endOfMonth(new Date()),
                  ],
                },
                {
                  label: t('tab:This Quarter'),
                  value: [
                    dateFns.startOfQuarter(new Date()),
                    dateFns.endOfQuarter(new Date()),
                  ],
                },
                {
                  label: t('tab:This Year'),
                  value: [
                    dateFns.startOfYear(new Date()),
                    dateFns.endOfYear(new Date()),
                  ],
                },
              ]}
              // size='md'
              block
              onChange={this.handleRangeChange}
              placeholder={t('message:selectDateRange')}
              locale={isZH ? zhCN.DateRangePicker : enUS.DateRangePicker}
            />
          </div>
        </div>
        <Divider component="div" />

        <div className={clsx('flex-child-auto', classes.container)}>
          <CommissionTable
            commissionList={commissionList}
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
          />

          {searching && (
            <div className={clsx('flex-container', classes.mask)}>
              <Loading />
            </div>
          )}
        </div>

        <Dialog open={openCreate} fullWidth maxWidth="md">
          <CreateStart t={t} onClose={this.handleClose} />
        </Dialog>
      </Paper>
    );
  }
}
const mapStateToProps = (state) => {
  const ids = state.controller.searchCommissions.all.ids;
  const total = state.controller.searchCommissions.all.total;
  const searching = state.controller.searchCommissions.all.isFetching;
  return {
    total,
    ids,
    searching,
    query: JSON.parse(getQuery(state, 'all')),
    commissionList: getCommissionList(state, 'all'),
  };
};

export default withTranslation(['nav', 'tab', 'action', 'field', 'message'])(
  connect(mapStateToProps)(withStyles(styles)(CommissionsByProject))
);
