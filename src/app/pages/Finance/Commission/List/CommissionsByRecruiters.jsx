import React from 'react';
import { withStyles } from '@material-ui/core';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { getCommissionsByUsers } from '../../../../../apn-sdk/commission';
import {
  getIndexList,
  getNewFilters,
  makeCancelable,
  sortList,
} from '../../../../../utils';
import Immutable from 'immutable';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import zhCN from 'rsuite/lib/IntlProvider/locales/zh_CN';
import enUS from 'rsuite/lib/IntlProvider/locales/en_US';
import dateFns from 'date-fns';

import { DateRangePicker } from 'rsuite';
import Paper from '@material-ui/core/Paper';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import MuiLink from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import Divider from '@material-ui/core/Divider';

import NavigateNextIcon from '@material-ui/icons/NavigateNext';

import Loading from './../../../../components/particial/Loading';
import CommissionTable2 from '../../../../components/Tables/CommissionTable2';
import CommissionsByRecruiter from './CommissionsByRecruiter';

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
    display: 'flex',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    backgroundColor: 'rgba(240,240,240,.5)',
  },
};

const columns = [
  {
    colName: 'name',
    colWidth: 180,
    col: 'userName',
    sortable: true,
    fixed: true,
  },
  {
    colName: 'Related Employee',
    colWidth: 180,
    col: 'commissionIds',
    sortable: true,
    disableSearch: true,
  },
  {
    colName: 'Commission',
    colWidth: 180,
    col: 'commission',
    sortable: true,
    disableSearch: true,
  },
];

class CommissionsByRecruiters extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      filters: status.filters || Immutable.Map(),
      colSortDirs: status.colSortDirs || {},
      loading: true,
      range: status.range || [],
      openDetail: false,
    };
  }

  componentDidMount(): void {
    this.fetchData();
  }

  componentWillUnmount(): void {
    this.dataTask.cancel();
  }

  fetchData = () => {
    const fromDate =
      this.state.range[0] && dateFns.format(this.state.range[0], 'YYYY-MM-DD');
    const toDate =
      this.state.range[1] && dateFns.format(this.state.range[1], 'YYYY-MM-DD');

    this.dataTask = makeCancelable(getCommissionsByUsers({ fromDate, toDate }));
    this.dataTask.promise.then(({ response }) => {
      console.log(response);

      this.setState({
        loading: false,
        data: Immutable.fromJS(response),
        indexList: getIndexList(
          Immutable.fromJS(response.elements),
          this.state.filters,
          this.state.colSortDirs
        ),
      });
    });
  };

  onFilter = (input) => {
    const filters = getNewFilters(input, this.state.filters);
    if (filters) {
      console.log(filters.toJS());
      this.setState({
        filters,
        indexList: getIndexList(
          this.state.data.get('elements'),
          filters,
          this.state.colSortDirs
        ),
      });
    }
  };

  onSortChange = (columnKey, sortDir) => {
    let filteredIndex;

    console.log(sortDir);

    filteredIndex = sortDir
      ? sortList(
          this.state.indexList,
          this.state.data.get('elements'),
          columnKey,
          sortDir
        )
      : getIndexList(this.state.data.get('elements'), Immutable.Map());

    this.setState({
      indexList: filteredIndex,
      colSortDirs: {
        [columnKey]: sortDir,
      },
    });
  };

  handleCloseDialog = () => this.setState({ openDetail: false });

  handleRangeChange = (range) => {
    this.setState({ range, loading: true }, () => {
      status.range = range;
      this.fetchData();
    });
  };

  render() {
    const {
      data,
      colSortDirs,
      filters,
      indexList,
      selectedCommission,
      range,
      loading,
    } = this.state;
    if (!data) {
      return <Loading />;
    }
    console.log(data);
    const { t, classes, i18n } = this.props;
    const filteredList = indexList.map((index) =>
      data.getIn(['elements', index])
    );

    console.log(filteredList.toJS());

    const isZH = i18n.language.match('zh');

    return (
      <Paper className="flex-child-auto flex-container flex-dir-column">
        <div
          className="flex-container align-middle item-padding align-justify"
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
                {t('Commission by Recruiters')}
              </Typography>
            </Breadcrumbs>
          </div>

          <div className="horizontal-layout align-middle">
            <Typography variant="subtitle2">Hire Start Date</Typography>
            <DateRangePicker
              placement="bottomEnd"
              value={range}
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
              // size='md'
              block
              onChange={this.handleRangeChange}
              placeholder={t('message:selectDateRange')}
              locale={isZH ? zhCN.DateRangePicker : enUS.DateRangePicker}
            />
          </div>
        </div>
        <Divider />
        <div className={clsx('flex-child-auto', classes.container)}>
          <CommissionTable2
            dataList={filteredList}
            filterOpen={true}
            ownColumns={columns}
            colSortDirs={colSortDirs}
            onSortChange={this.onSortChange}
            filters={filters}
            onFilter={this.onFilter}
            onScrollEnd={onScrollEnd}
            scrollLeft={status.scrollLeft}
            scrollTop={status.scrollTop}
            onClickCommissionIds={(selectedCommission) =>
              this.setState({ selectedCommission, openDetail: true })
            }
          />
          {loading && (
            <div className={classes.mask}>
              <Loading />
            </div>
          )}
        </div>
        <Dialog
          open={this.state.openDetail}
          onClose={this.handleCloseDialog}
          fullWidth
          maxWidth="md"
        >
          <CommissionsByRecruiter
            commission={selectedCommission}
            onClose={this.handleCloseDialog}
          />
        </Dialog>
      </Paper>
    );
  }
}

export default withTranslation(['nav', 'tab', 'action', 'field', 'message'])(
  connect()(withStyles(styles)(CommissionsByRecruiters))
);
