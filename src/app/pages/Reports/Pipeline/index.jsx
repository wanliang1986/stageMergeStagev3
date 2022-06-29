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
import {
  getPipelineReportByDetails,
  getPipelineReportByDetailsExcel,
  getPipelineReportByDetailsFilters,
  getJobCountries,
  getUserCountries,
} from '../../../../apn-sdk/index';
import { withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { countryList } from '../../../constants/formOptions';

import { DateRangePicker } from 'rsuite';
import Select from 'react-select';

import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

import PotentialButton from '../../../components/particial/PotentialButton';
import ReportTableSummary from '../../../components/Tables/ReportTableSummary';
import FormReactSelectContainer from '../../../components/particial/FormReactSelectContainer';
import Loading from '../../../components/particial/Loading';

import { styles, pipelineDetailColumns as columns } from '../params';
import CustomToggleButton from '../../../components/particial/CustomToggleButton';
import zhCN from 'rsuite/lib/IntlProvider/locales/zh_CN';
import enUS from 'rsuite/lib/IntlProvider/locales/en_US';
import dateFns from 'date-fns';
import { getRanges } from '../../../../utils';

class PipelineDetails extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      dataList: Immutable.List(),
      range: [dateFns.startOfWeek(new Date()), dateFns.endOfToday()],
      focusedInput: null,

      selectedCompany: '',
      companyOptions: [{ value: '', label: 'All' }],
      selectedRecruiter: '',
      recruiterOptions: [{ value: '', label: 'All' }],
      selectedUserCountry: '',
      countryOptions: [{ value: '', label: 'All' }],
      userOptions: [{ value: '', label: 'All' }],
      selectedJobCountry: '',

      filteredIndex: Immutable.List(),
      colSortDirs: {},

      loading: true,
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
    selectedCompany,
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
      getPipelineReportByDetails({
        from_date,
        to_date,
        selectedCompany,
        selectedRecruiter,
        selectedUserCountry,
        selectedJobCountry,
      })
    );
    this.candidateTask.promise
      .then((data) => {
        const { colSortDirs } = this.state;
        data.map((item) => {
          if (item.additionalInformation) {
            let list = JSON.parse(item.additionalInformation);
            if (list.salaryRange) {
              list.minimumPayRate = list.salaryRange.gte;
              list.maximumPayRate = list.salaryRange.lte;
            } else {
              list.minimumPayRate = '-';
              list.maximumPayRate = '-';
            }
            if (list.billRange) {
              list.minimumBillRate = list.billRange.gte;
              list.maximumBillRate = list.billRange.lte;
            } else {
              list.minimumBillRate = '-';
              list.maximumBillRate = '-';
            }
            item = Object.assign(item, list);
          }
        });
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

  fetchFilters = () => {
    const { range } = this.state;
    range[1] = dateFns.endOfDay(range[1]);
    const from_date = range[0].toISOString();
    const to_date = range[1].toISOString();
    getPipelineReportByDetailsFilters({ from_date, to_date }).then(
      (filters) => {
        this.setState({
          companyOptions: [{ value: '', label: 'All' }].concat(
            (filters.companyList || [])
              .sort((a, b) => (a > b) - (a < b))
              .map((option) => ({ value: option, label: option }))
          ),

          recruiterOptions: [{ value: '', label: 'All' }].concat(
            (filters.recruiterList || [])
              .map((u) => ({ value: u.id, label: this._formatUserName(u) }))
              .sort((a, b) => (a.label > b.label) - (a.label < b.label))
          ),
        });
      }
    );
  };

  downloadData = () => {
    this.setState({ generating: true });
    const { range } = this.state;
    range[1] = dateFns.endOfDay(range[1]);
    const from_date = range[0].toISOString();
    const to_date = range[1].toISOString();
    getPipelineReportByDetailsExcel({ from_date, to_date })
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

  handleDateRangeChange = (range) => {
    const {
      selectedCompany,
      selectedRecruiter,
      selectedUserCountry,
      selectedJobCountry,
    } = this.state;
    this.setState({ range }, () => {
      this.fetchData(
        selectedCompany,
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
    const { range, selectedCompany, selectedUserCountry, selectedJobCountry } =
      this.state;
    this.fetchData(
      selectedCompany,
      selectedRecruiter,
      selectedUserCountry,
      selectedJobCountry,
      this._blockTimer()
    );
  };

  handleCompanyChange = (selectedCompany) => {
    selectedCompany = selectedCompany || '';
    this.setState({ selectedCompany });
    const { selectedRecruiter, selectedUserCountry, selectedJobCountry } =
      this.state;
    this.fetchData(
      selectedCompany,
      selectedRecruiter,
      selectedUserCountry,
      selectedJobCountry,
      this._blockTimer()
    );
  };

  handleUserCountryChange = (selectedUserCountry) => {
    selectedUserCountry = selectedUserCountry || '';
    this.setState({ selectedUserCountry });
    const { selectedCompany, selectedRecruiter, selectedJobCountry } =
      this.state;
    this.fetchData(
      selectedCompany,
      selectedRecruiter,
      selectedUserCountry,
      selectedJobCountry,
      this._blockTimer()
    );
  };

  handleJobCountryChange = (selectedJobCountry) => {
    selectedJobCountry = selectedJobCountry || '';
    this.setState({ selectedJobCountry });
    const { selectedCompany, selectedRecruiter, selectedUserCountry } =
      this.state;
    this.fetchData(
      selectedCompany,
      selectedRecruiter,
      selectedUserCountry,
      selectedJobCountry,
      this._blockTimer()
    );
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

  render() {
    const { t, classes, i18n } = this.props;
    const {
      dataList,
      filteredIndex,
      colSortDirs,
      selectedCompany,
      companyOptions,
      selectedRecruiter,
      recruiterOptions,
      selectedUserCountry,
      selectedJobCountry,
      countryOptions,
      userOptions,
      loading,
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
            {t('message:Pipeline Analytics Details')}
          </Typography>

          <div
            className={clsx('horizontal-layout align-bottom', classes.actions)}
          >
            <div style={{ zIndex: 111 }}>
              <div>
                <FormReactSelectContainer
                  label={t('field:Status Updated Date')}
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
                <FormReactSelectContainer label={t('field:Client Company')}>
                  <Select
                    value={selectedCompany}
                    options={companyOptions}
                    simpleValue
                    onChange={this.handleCompanyChange}
                    autoBlur={true}
                    // searchable={false}
                    clearable={false}
                    // menuContainerStyle={{width:100}}
                    menuStyle={{ maxHeight: '50vh' }}
                  />
                </FormReactSelectContainer>
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
                    // searchable={false}
                    clearable={false}
                    menuStyle={{ maxHeight: '50vh' }}
                  />
                </FormReactSelectContainer>
              </div>
            </div>
            <div>
              <div style={{ minWidth: 168, height: 53 }}>
                <FormReactSelectContainer label={t('field:Job Country')}>
                  <Select
                    value={selectedJobCountry}
                    options={countryOptions}
                    simpleValue
                    onChange={this.handleJobCountryChange}
                    autoBlur={true}
                    searchable={false}
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
                    searchable={false}
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
              colSortDirs={colSortDirs}
              onSortChange={this.onSortChange}
            />
          )}
        </div>
      </Paper>
    );
  }
}

PipelineDetails.propTypes = {
  t: PropTypes.func.isRequired,
};

export default withTranslation(['tab', 'action', 'field', 'message'])(
  connect()(withStyles(styles)(PipelineDetails))
);
