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
  getPipelineReportByCompany,
  getPipelineReportByCompanyExcel,
  getPipelineReportByCompanyFilters,
  getJobCountries,
  getUserCountries,
} from '../../../../apn-sdk/index';
import { countryList } from '../../../constants/formOptions';

import { DateRangePicker } from 'rsuite';
import Select from 'react-select';

import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';

import PotentialButton from '../../../components/particial/PotentialButton';
import ReportTableSummary from '../../../components/Tables/ReportTableSummary';
import ReportsActivity from '../ReportsActivity';
import FormReactSelectContainer from '../../../components/particial/FormReactSelectContainer';
import Loading from '../../../components/particial/Loading';

import CustomToggleButton from '../../../components/particial/CustomToggleButton';
import zhCN from 'rsuite/lib/IntlProvider/locales/zh_CN';
import enUS from 'rsuite/lib/IntlProvider/locales/en_US';
import dateFns from 'date-fns';
import { getRanges } from '../../../../utils';
import {
  styles,
  statusMap,
  pipelineByCompnayColumns as columns,
} from '../params';

class Reports extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      dataList: Immutable.List(),
      range: [dateFns.startOfWeek(new Date()), dateFns.endOfToday()],
      focusedInput: null,

      selectedRecruiter: '',
      recruiterOptions: [{ value: '', label: 'All' }],
      selectedUserCountry: '',
      countryOptions: [{ value: '', label: 'All' }],
      userOptions: [{ value: '', label: 'All' }],
      selectedJobCountry: '',

      loading: true,

      filteredIndex: Immutable.List(),
      colSortDirs: {},
    };

    this.filteredList = Immutable.List();
  }

  componentDidMount() {
    this.fetchData();
    this.fetchFilters();
    this.getJobCountriesList();
    this.getUserCountriesList();
  }

  getJobCountriesList = () => {
    getJobCountries().then((res) => {
      let arr = res.response.map((item, index) => {
        return { value: item, label: item };
      });
      this.setState({
        countryOptions: this.state.countryOptions.concat(arr),
      });
    });
  };
  getUserCountriesList = () => {
    getUserCountries().then((res) => {
      let arr = res.response.map((item, index) => {
        return { value: item, label: item };
      });
      this.setState({
        userOptions: this.state.userOptions.concat(arr),
      });
    });
  };

  fetchData = (
    selectedRecruiter,
    selectedUserCountry,
    selectedJobCountry,
    blockTimerPromise = Promise.resolve()
  ) => {
    const { range } = this.state;
    range[1] = dateFns.endOfDay(range[1]);
    const from_date = range[0].toISOString();
    const to_date = range[1].toISOString();
    this.candidateTask = makeCancelable(
      getPipelineReportByCompany({
        from_date,
        to_date,
        selectedRecruiter,
        selectedUserCountry,
        selectedJobCountry,
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
    const { range } = this.state;
    range[1] = dateFns.endOfDay(range[1]);
    const from_date = range[0].toISOString();
    const to_date = range[1].toISOString();
    const { dispatch } = this.props;

    this.setState({ generating: true });
    getPipelineReportByCompanyExcel({ from_date, to_date })
      .catch(() =>
        dispatch({
          type: ActionTypes.ADD_MESSAGE,
          message: {
            type: 'error',
            message: 'There is no data to download.',
          },
        })
      )
      .finally(() => this.setState({ generating: false }));
  };

  fetchFilters = () => {
    const { range } = this.state;
    range[1] = dateFns.endOfDay(range[1]);
    const from_date = range[0].toISOString();
    const to_date = range[1].toISOString();
    const { dispatch } = this.props;
    getPipelineReportByCompanyFilters({
      from_date,
      to_date,
    }).then((filters) => {
      this.setState({
        recruiterOptions: [{ value: '', label: 'All' }].concat(
          (filters.recruiterList || []).map((u) => ({
            value: u.id,
            label: this._formatUserName(u),
          }))
        ),
      });
    });
  };

  handleDateRangeChange = (range) => {
    const { selectedRecruiter, selectedUserCountry, selectedJobCountry } =
      this.state;
    this.setState({ range }, () => {
      this.fetchData(
        selectedRecruiter,
        selectedUserCountry,
        selectedJobCountry,
        this._blockTimer()
      );
      this.fetchFilters();
    });
  };

  handleRecruiterChange = (selectedRecruiter) => {
    selectedRecruiter = selectedRecruiter || '';
    this.setState({ selectedRecruiter });
    const { selectedUserCountry, selectedJobCountry } = this.state;
    this.fetchData(
      selectedRecruiter,
      selectedUserCountry,
      selectedJobCountry,
      this._blockTimer()
    );
  };

  handleUserCountryChange = (selectedUserCountry) => {
    selectedUserCountry = selectedUserCountry || '';
    this.setState({ selectedUserCountry });
    const { selectedRecruiter, selectedJobCountry } = this.state;
    this.fetchData(
      selectedRecruiter,
      selectedUserCountry,
      selectedJobCountry,
      this._blockTimer()
    );
  };

  handleJobCountryChange = (selectedJobCountry) => {
    selectedJobCountry = selectedJobCountry || '';
    this.setState({ selectedJobCountry });
    const { selectedRecruiter, selectedUserCountry } = this.state;
    this.fetchData(
      selectedRecruiter,
      selectedUserCountry,
      selectedJobCountry,
      this._blockTimer()
    );
  };

  handleClickActivityCount = ({
    activityId,
    company,
    recruiter,
    activityStatus,
  }) => {
    const title = `Pipeline(${statusMap[activityStatus]}) Details of ${
      company || ''
    } ${recruiter || ''}`;
    const { range } = this.state;
    let start = moment(range[0]);
    let end = moment(range[1]);
    const html = `presented between ${start.format(
      'MM/DD/YYYY'
    )} and ${end.format('MM/DD/YYYY')}`;
    this.setState({
      openActivityDetail: { activityId, title, range: html, activityStatus },
    });
  };

  _blockTimer = (time = 400) => {
    clearTimeout(this.bTimer);
    this.setState({ loading: true });
    return new Promise((resolve) => {
      this.bTimer = setTimeout(resolve, time);
    });
  };

  _formatUserName = (user) => {
    if (!user) {
      return '';
    }
    return user.firstName && user.lastName
      ? user.firstName + ' ' + user.lastName
      : user.username;
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
    const { t, classes, i18n } = this.props;
    const {
      dataList,
      selectedRecruiter,
      recruiterOptions,
      selectedUserCountry,
      selectedJobCountry,
      countryOptions,
      loading,
      openActivityDetail,
      filteredIndex,
      colSortDirs,
      userOptions,
      range,
    } = this.state;
    const isZH = i18n.language.match('zh');
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
            {t('message:Pipeline Analytics by Company')}
          </Typography>

          <div
            className={clsx('horizontal-layout align-bottom', classes.actions)}
          >
            <div style={{ zIndex: 111 }}>
              <div>
                <FormReactSelectContainer
                  label={t('field:Pipeline Presented Date')}
                />
                <DateRangePicker
                  value={range}
                  ranges={getRanges(t)}
                  cleanable={false}
                  toggleComponentClass={CustomToggleButton}
                  size="md"
                  style={{ height: 32 }}
                  block
                  onChange={this.handleDateRangeChange}
                  placeholder={t('message:selectDateRange')}
                  locale={isZH ? zhCN.DateRangePicker : enUS.DateRangePicker}
                />
              </div>
            </div>
            <div>
              <div style={{ minWidth: 168, height: 53 }}>
                <FormReactSelectContainer label={t('field:Recruiter')}>
                  <Select
                    value={selectedRecruiter}
                    options={recruiterOptions}
                    simpleValue
                    onChange={this.handleRecruiterChange}
                    autoBlur={true}
                    searchable={false}
                    clearable={false}
                  />
                </FormReactSelectContainer>
              </div>
            </div>
            <div>
              <div style={{ minWidth: 168, height: 53 }}>
                <FormReactSelectContainer label={t('field:Job country')}>
                  <Select
                    value={selectedJobCountry}
                    options={countryOptions}
                    simpleValue
                    onChange={this.handleJobCountryChange}
                    autoBlur={true}
                    // searchable={false}
                    clearable={false}
                  />
                </FormReactSelectContainer>
              </div>
            </div>

            <div>
              <div style={{ minWidth: 168, height: 53 }}>
                <FormReactSelectContainer label={t('field:User Country')}>
                  <Select
                    value={selectedUserCountry}
                    options={userOptions}
                    simpleValue
                    onChange={this.handleUserCountryChange}
                    autoBlur={true}
                    // searchable={false}
                    clearable={false}
                  />
                </FormReactSelectContainer>
              </div>
            </div>

            <div className="flex-child-auto" />
            <PotentialButton
              onClick={this.downloadData}
              processing={this.state.generating}
            >
              {t('common:download')}
            </PotentialButton>
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
          <ReportsActivity
            t={t}
            {...openActivityDetail}
            onRequestClose={this.handleCloseDialog}
          />
        </Dialog>
      </Paper>
    );
  }
}

Reports.propTypes = {
  t: PropTypes.func.isRequired,
};

export default withTranslation(['tab', 'action', 'field', 'message'])(
  connect()(withStyles(styles)(Reports))
);
