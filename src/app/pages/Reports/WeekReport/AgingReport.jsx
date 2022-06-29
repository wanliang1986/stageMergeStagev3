import React from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
// import * as ActionTypes from './../../constants/actionTypes';
import moment from 'moment-timezone';
import {
  makeCancelable,
  sortList,
  getIndexList,
} from '../../../../utils/index';
import { withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import {
  getAgingReport,
  getAgingReportFilter,
} from '../../../../apn-sdk/report';

import DateRangePicker from 'react-dates/esm/components/DateRangePicker';
import Select from 'react-select';

import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';

import ReportTableSummary from '../../../components/Tables/ReportTableSummary';
import FormReactSelectContainer from '../../../components/particial/FormReactSelectContainer';
import Loading from '../../../components/particial/Loading';

import { styles, agingReportColumns as columns } from '../params';
import ReportsActivityAging from '../ReportsActivityAging';

class AgingReport extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      dataList: Immutable.List(),
      from: moment().startOf('month').hours(12),
      to: moment().startOf('day').hours(12),
      focusedInput: null,

      loading: true,

      selectedLastModifiedUser: '',
      selectedCompany: '',
      companyList: [{ value: '', label: 'All' }],
      lastModifiedUserList: [{ value: '', label: 'All' }],

      filteredIndex: Immutable.List(),
      colSortDirs: {},
    };

    this.filteredList = Immutable.List();
  }

  componentDidMount() {
    const { from, to } = this.state;
    this.fetchData(from, to);
    this.fetchFilters(from, to);
  }

  fetchData = (
    from,
    to,
    company,
    recruiter_id,
    blockTimerPromise = Promise.resolve()
  ) => {
    const from_date = moment(from).hours(0).utc().format();
    const to_date = moment(to).hours(0).utc().format();

    this.candidateTask = makeCancelable(
      getAgingReport({ from_date, to_date, company, recruiter_id })
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

  fetchFilters = (from, to) => {
    const from_date = moment(from).hours(0).utc().format();
    const to_date = moment(to).hours(0).utc().format();
    // console.log('!!!![date]', from_date, to_date);

    getAgingReportFilter({ from_date, to_date }).then(({ response }) => {
      // console.log('[????]', response);
      let responseCompanyList = response.companyList
        ? response.companyList
        : [];
      const companyList = [{ value: '', label: 'All' }].concat(
        responseCompanyList.map((ele) => {
          return {
            value: ele,
            label: ele,
          };
        })
      );

      const lastModifiedUserList = [
        {
          value: '',
          label: 'All',
        },
      ].concat(
        response.recruiterList.map((ele) => {
          const { id, firstName, lastName, username } = ele;
          return {
            value: id,
            label:
              firstName && lastName
                ? firstName.trim() + ' ' + lastName.trim()
                : username,
          };
        })
      );

      this.setState({
        companyList,
        lastModifiedUserList,
      });

      // console.log('filter', companyList, lastModifiedUserList);
    });
  };

  handleDateRangeChange = ({ startDate: from, endDate: to }) => {
    this.setState({ from, to });
    if (from && to) {
      const { selectedCompany, selectedLastModifiedUser } = this.state;
      console.log('date change', selectedCompany, selectedLastModifiedUser);
      this.fetchData(
        from,
        to,
        selectedCompany,
        selectedLastModifiedUser,
        this._blockTimer()
      );
      this.fetchFilters(from, to);
    }
  };

  handleLastModifiedUserMChange = (selectedLastModifiedUser) => {
    selectedLastModifiedUser = selectedLastModifiedUser || '';
    this.setState({ selectedLastModifiedUser });
    const { from, to, selectedCompany } = this.state;
    this.fetchData(
      from,
      to,
      selectedCompany,
      selectedLastModifiedUser,
      this._blockTimer()
    );
  };

  handleCompanyChange = (selectedCompany) => {
    selectedCompany = selectedCompany || '';
    this.setState({ selectedCompany });
    const { from, to, selectedLastModifiedUser } = this.state;
    this.fetchData(
      from,
      to,
      selectedCompany,
      selectedLastModifiedUser,
      this._blockTimer()
    );
  };

  handleClickActivityCount = ({
    activityId,
    company,
    recruiter,
    activityStatus,
  }) => {
    // console.log('[[activity]]', activityId, company, recruiter, activityStatus);
    const title = 'Aging Report';
    const { from, to } = this.state;
    const range = `presented between ${from.format(
      'MM/DD/YYYY'
    )} and ${to.format('MM/DD/YYYY')}`;
    this.setState({
      openActivityDetail: { activityId, title, range, activityStatus },
    });
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
    const preIndex = filteredIndex.pop();

    let indexList;
    indexList = sortDir
      ? sortList(preIndex, dataList, columnKey, sortDir).push(preIndex.size)
      : getIndexList(dataList);

    this.setState({
      filteredIndex: indexList,
      colSortDirs: {
        [columnKey]: sortDir,
      },
    });
  };

  handleCloseDialog = () => {
    this.setState({ openActivityDetail: null });
  };

  render() {
    const { t, classes } = this.props;
    const {
      dataList,
      from,
      to,
      selectedCompany,
      companyList,
      lastModifiedUserList,
      selectedLastModifiedUser,
      loading,
      openActivityDetail,
      filteredIndex,
      colSortDirs,
    } = this.state;

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
            {t('message:Aging Report')}
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
                  onFocusChange={(focusedInput) =>
                    this.setState({ focusedInput })
                  } // PropTypes.func.isRequired,
                  small={true}
                  isOutsideRange={(a) =>
                    a.isAfter(moment().startOf('day').hours(12))
                  }
                  displayFormat="MM/DD/YYYY"
                />
              </div>
            </div>
            <div>
              <div style={{ minWidth: 168, height: 53 }}>
                <FormReactSelectContainer label={t('field:Company')}>
                  <Select
                    value={selectedCompany}
                    options={companyList}
                    simpleValue
                    onChange={this.handleCompanyChange}
                    autoBlur={true}
                    clearable={false}
                  />
                </FormReactSelectContainer>
              </div>
            </div>
            <div>
              <div style={{ minWidth: 168, height: 53 }}>
                <FormReactSelectContainer label={t('field:Lastmodified User')}>
                  <Select
                    value={selectedLastModifiedUser}
                    options={lastModifiedUserList}
                    simpleValue
                    onChange={this.handleLastModifiedUserMChange}
                    autoBlur={true}
                    clearable={false}
                  />
                </FormReactSelectContainer>
              </div>
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
              onClickActivity={this.handleClickActivityCount}
              colSortDirs={colSortDirs}
              onSortChange={this.onSortChange}
            />
          )}
        </div>
        <Dialog
          open={!!openActivityDetail}
          onClose={this.handleCloseDialog}
          fullWidth
          maxWidth="md"
        >
          <ReportsActivityAging
            t={t}
            {...openActivityDetail}
            onRequestClose={this.handleCloseDialog}
          />
        </Dialog>
      </Paper>
    );
  }
}

AgingReport.propTypes = {
  t: PropTypes.func.isRequired,
};

export default withTranslation(['tab', 'action', 'field', 'message'])(
  connect()(withStyles(styles)(AgingReport))
);
