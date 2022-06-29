import React from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import * as ActionTypes from '../../../constants/actionTypes';
import moment from 'moment-timezone';
import {
  makeCancelable,
  sortList,
  getIndexList,
} from '../../../../utils/index';
import { withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import {
  getWeekReportCommonSearch,
  getWeekReportCommonSearchExcel,
} from '../../../../apn-sdk/index';

import DateRangePicker from 'react-dates/esm/components/DateRangePicker';

import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

import PotentialButton from '../../../components/particial/PotentialButton';
import ReportTableSummary from '../../../components/Tables/ReportTableSummary';
import FormReactSelectContainer from '../../../components/particial/FormReactSelectContainer';
import Loading from '../../../components/particial/Loading';

import { styles } from '../params';

const columns = [
  {
    colName: 'Recruiter',
    colWidth: 175,
    col: 'username',
    sortable: true,
  },
  {
    colName: 'Search Count',
    colWidth: 185,
    col: 'totalCnt',
    sortable: true,
  },
];

class WeekReport extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      dataList: Immutable.List(),
      from: moment().startOf('week').hours(12),
      to: moment().startOf('day').hours(12),
      focusedInput: null,

      loading: true,

      filteredIndex: Immutable.List(),
      colSortDirs: {},
    };

    this.filteredList = Immutable.List();
  }

  componentDidMount() {
    const { from, to } = this.state;
    this.fetchData(from, to);
  }

  fetchData = (from, to, blockTimerPromise = Promise.resolve()) => {
    const from_date = moment(from).hours(0).utc().format();
    const to_date = moment(to).hours(0).utc().format();

    this.candidateTask = makeCancelable(
      getWeekReportCommonSearch({
        from_date,
        to_date,
        tenant_id: this.props.tenantId,
      })
    );
    this.candidateTask.promise
      .then((data) => {
        const { colSortDirs } = this.state;
        const dataList = Immutable.fromJS(data);
        let filteredIndex = getIndexList(dataList);
        const columnKey = Object.keys(colSortDirs)[0];
        if (columnKey) {
          const preIndex = filteredIndex.pop();
          let sortDir = colSortDirs[columnKey];
          filteredIndex = sortList(preIndex, dataList, columnKey, sortDir).push(
            preIndex.size
          );
        }

        blockTimerPromise.then(() =>
          this.setState({ loading: false, dataList, filteredIndex })
        );
      })
      .catch((reason) => {
        if (reason.isCanceled) {
          console.log('isCanceled');
        } else {
          console.log(reason);
          this.setState({ loading: false });
        }
      });
  };

  downloadData = () => {
    this.setState({ generating: true });

    const { from, to } = this.state;
    const { dispatch } = this.props;
    const from_date = moment(from).hours(0).utc().format();
    const to_date = moment(to).hours(0).utc().format();
    getWeekReportCommonSearchExcel({
      from_date,
      to_date,
      tenant_id: this.props.tenantId,
    })
      .catch(() =>
        dispatch({
          type: ActionTypes.ADD_MESSAGE,
          message: {
            type: 'error',
            message: 'There is no data to download.',
          },
        })
      )
      .finally(() => {
        this.setState({ generating: false });
      });
  };

  handleDateRangeChange = ({ startDate: from, endDate: to }) => {
    this.setState({ from, to });

    if (from && to) {
      this.fetchData(from, to, this._blockTimer());
    }
  };

  _blockTimer = (time = 400) => {
    clearTimeout(this.bTimer);
    this.setState({ loading: true });
    return new Promise((resolve) => {
      this.bTimer = setTimeout(resolve, time);
    });
  };

  onSortChange = (columnKey, sortDir) => {
    const { filteredIndex, dataList } = this.state;
    let indexList;
    indexList = sortDir
      ? sortList(filteredIndex, dataList, columnKey, sortDir)
      : getIndexList(dataList);

    this.setState({
      filteredIndex: indexList,
      colSortDirs: {
        [columnKey]: sortDir,
      },
    });
  };

  validateDate = (a) => a.isAfter(moment().startOf('day').hours(12));

  handleFocusChange = (focusedInput) => this.setState({ focusedInput });

  render() {
    const { t, classes } = this.props;
    const { dataList, from, to, loading, filteredIndex, colSortDirs } =
      this.state;

    const filteredList = filteredIndex.map((index) => dataList.get(index));
    if (!this.filteredList.equals(filteredList)) {
      this.filteredList = filteredList;
    }

    return (
      <Paper
        className={clsx(
          'flex-child-auto flex-container flex-dir-column',
          classes.root
        )}
      >
        <div>
          <Typography variant="h5" className="item-padding">
            {t('message:Common Search Usage')}
          </Typography>

          <div
            className={clsx('horizontal-layout align-bottom', classes.actions)}
          >
            <div style={{ zIndex: 111 }}>
              <div>
                <FormReactSelectContainer label={t('field:Date')} />
                <DateRangePicker
                  startDate={from} // momentPropTypes.momentObj or null,
                  startDateId="your_unique_start_date_id" // PropTypes.string.isRequired,
                  endDate={to} // momentPropTypes.momentObj or null,
                  endDateId="your_unique_end_date_id" // PropTypes.string.isRequired,
                  onDatesChange={this.handleDateRangeChange} // PropTypes.func.isRequired,
                  focusedInput={this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
                  onFocusChange={this.handleFocusChange} // PropTypes.func.isRequired,
                  small={true}
                  isOutsideRange={this.validateDate}
                  displayFormat="MM/DD/YYYY"
                />
              </div>
            </div>

            <div className="flex-child-auto" />

            <div className={classes.wrapper}>
              <PotentialButton
                onClick={this.downloadData}
                disabled={this.state.generating}
              >
                {t('common:download')}
              </PotentialButton>
              {this.state.generating && (
                <CircularProgress
                  size={24}
                  className={classes.buttonProgress}
                />
              )}
            </div>
          </div>
        </div>

        <Divider />
        <div className={clsx('flex-child-auto', classes.contentContainer)}>
          {loading ? (
            <div
              className={clsx(
                'flex-container flex-dir-column',
                classes.contentMask
              )}
            >
              <Loading />
            </div>
          ) : (
            <ReportTableSummary
              dataList={this.filteredList}
              columns={columns}
              onClickJob={this.handleClickJobCount}
              onClickActivity={this.handleClickActivityCount}
              colSortDirs={colSortDirs}
              onSortChange={this.onSortChange}
            />
          )}
        </div>
      </Paper>
    );
  }
}

WeekReport.propTypes = {
  t: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {
    tenantId: state.controller.currentUser.get('tenantId'),
  };
};

export default withTranslation(['tab', 'action', 'field', 'message'])(
  connect(mapStateToProps)(withStyles(styles)(WeekReport))
);
