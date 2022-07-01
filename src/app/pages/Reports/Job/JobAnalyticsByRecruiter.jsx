import React from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { makeCancelable, sortList, getIndexList } from '../../../../utils';
import { withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import {
  getAllDivisionListByTenantId,
  getReportJobUser,
  getReportJobUserExcel,
  getTeamList,
  getJobCountries,
} from '../../../../apn-sdk';
import { countryList } from '../../../constants/formOptions';
import zhCN from 'rsuite/lib/IntlProvider/locales/zh_CN';
import enUS from 'rsuite/lib/IntlProvider/locales/en_US';
import dateFns from 'date-fns';

import { DateRangePicker } from 'rsuite';
import Select from 'react-select';

import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';

import PotentialButton from '../../../components/particial/PotentialButton';
import ReportTableSummary from '../../../components/Tables/ReportTableSummary';
import ReportsJob from '../ReportsJob';
import ReportsActivity from '../ReportsActivity';
import FormReactSelectContainer from '../../../components/particial/FormReactSelectContainer';
import Loading from '../../../components/particial/Loading';
import CustomToggleButton from '../../../components/particial/CustomToggleButton';

import { styles, jobPipielineByRecruiterColumns as columns } from '../params';
import { showErrorMessage } from '../../../actions';

const ranges = [
  {
    label: 'This Month',
    value: [dateFns.startOfMonth(new Date()), dateFns.endOfToday()],
  },
  {
    label: 'Last 3 Months',
    value: [
      dateFns.addMonths(dateFns.startOfToday(), -3),
      dateFns.endOfToday(),
    ],
  },
  {
    label: 'Year to Date',
    value: [dateFns.startOfYear(new Date()), dateFns.endOfToday()],
  },
];
const status = {};
class Reports extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      range: status.range || [
        dateFns.startOfMonth(new Date()),
        dateFns.endOfToday(),
      ],

      selectedDivision: '',
      divisionOptions: [{ value: '', label: 'All' }],

      selectedTeam: '',
      teamOptions: [{ value: '', label: 'All' }],

      selectedJobCountry: '',
      countryOptions: [{ value: '', label: 'All' }].concat(countryList),

      loading: true,
      dataList: Immutable.List(),
      filteredIndex: Immutable.List(),
      colSortDirs: { openingCount: 'DESC' },
    };

    this.filteredList = Immutable.List();
  }

  componentDidMount() {
    this.fetchData();
    this.fetchGroupOptions();
  }

  componentWillUnmount(): void {
    this.task.cancel();
    status.range = this.state.range;
  }

  fetchGroupOptions = () => {
    Promise.all([
      getTeamList().catch((err) => ({ response: [] })),
      getAllDivisionListByTenantId().catch((err) => ({ response: [] })),
      getJobCountries().catch((err) => ({ response: [] })),
    ]).then(
      ([
        { response: teams },
        { response: divisions },
        { response: jobCountries },
      ]) => {
        // console.log(teams, divisions);
        this.setState({
          teamOptions: [{ value: '', label: 'All' }].concat(
            teams.map((team) => {
              team.value = `${team.id}`;
              team.label = `${team.name}`;
              return team;
            })
          ),
          divisionOptions: [{ value: '', label: 'All' }].concat(
            divisions.map((division) => {
              division.value = `${division.id}`;
              division.label = division.name;
              return division;
            })
          ),
          countryOptions: [{ value: '', label: 'All' }].concat(
            jobCountries
              .filter((el) => el)
              .map((value) => ({
                value,
                label: value,
              }))
          ),
        });
      }
    );
  };

  fetchData = (blockTimerPromise = Promise.resolve()) => {
    const { range, selectedJobCountry, selectedTeam, selectedDivision } =
      this.state;
    if (this.task) {
      this.task.cancel();
    }
    const fromDate = range[0].toISOString();
    const toDate = range[1].toISOString();

    this.task = makeCancelable(
      getReportJobUser({
        fromDate,
        toDate,
        jobCountry: selectedJobCountry,
        teamId: selectedTeam,
        divisionId: selectedDivision,
      })
    );
    this.task.promise
      .then((data) => {
        const { colSortDirs } = this.state;
        const footerData = data.find((el) => el.userName === 'Grand Total');
        const dataList = Immutable.fromJS(
          data.filter((el) => el !== footerData)
        );
        let filteredIndex = getIndexList(dataList);
        const columnKey = Object.keys(colSortDirs)[0];
        if (columnKey) {
          let sortDir = colSortDirs[columnKey];
          filteredIndex = sortList(filteredIndex, dataList, columnKey, sortDir);
        }

        blockTimerPromise.then(() =>
          this.setState({
            loading: false,
            dataList,
            filteredIndex,
            footerData: Immutable.Map(footerData),
          })
        );
      })
      .catch((err) => {
        if (!err.isCanceled) {
          this.props.dispatch(showErrorMessage(err));
          this.setState({ loading: false });
        }
      });
  };

  downloadData = () => {
    this.setState({ generating: true });

    const {
      range,
      selectedJobCountry,
      selectedTeam,
      selectedDivision,
      allOpenJobs,
    } = this.state;
    const { dispatch } = this.props;
    const fromDate = range[0].toISOString();
    const toDate = range[1].toISOString();

    getReportJobUserExcel({
      fromDate,
      toDate,
      jobCountry: selectedJobCountry,
      teamId: selectedTeam,
      divisionId: selectedDivision,
    })
      .catch((err) => dispatch(showErrorMessage(err)))
      .finally(() => {
        this.setState({ generating: false });
      });
  };

  handleDateRangeChange = (range) => {
    range[1] = dateFns.endOfDay(range[1]);
    this.setState({ range }, () => {
      status.range = this.state.range;
      this.fetchData(this._blockTimer());
    });
  };

  handleJobCountryChange = (selectedJobCountry) => {
    selectedJobCountry = selectedJobCountry || '';
    if (selectedJobCountry !== this.state.selectedJobCountry) {
      this.setState({ selectedJobCountry }, () => {
        this.fetchData(this._blockTimer());
      });
    }
  };

  handleTeamChange = (selectedTeam) => {
    selectedTeam = selectedTeam || '';
    if (selectedTeam !== this.state.selectedTeam) {
      this.setState({ selectedTeam, selectedDivision: '' }, () => {
        this.fetchData(this._blockTimer());
      });
    }
  };

  handleDivisionChange = (selectedDivision) => {
    selectedDivision = selectedDivision || '';
    if (selectedDivision !== this.state.selectedDivision) {
      this.setState({ selectedDivision, selectedTeam: '' }, () => {
        this.fetchData(this._blockTimer());
      });
    }
  };

  handleClickJobCount = ({ jobId, company, recruiter }) => {
    const title = `Jobs of ${company || ''} ${recruiter || ''}`;
    const { range } = this.state;
    const rangeStr = `posted between ${dateFns.format(
      range[0],
      'MM/DD/YYYY'
    )} and ${dateFns.format(range[1], 'MM/DD/YYYY')}`;

    this.setState({ openJobDetail: { jobId, title, range: rangeStr } });
  };

  handleClickActivityCount = ({
    activityId,
    company,
    recruiter,
    activityStatus,
  }) => {
    const title = `Pipeline Details of Jobs of ${company || ''} ${
      recruiter || ''
    }`;
    const { range } = this.state;
    const rangeStr = `posted between ${dateFns.format(
      range[0],
      'MM/DD/YYYY'
    )} and ${dateFns.format(range[1], 'MM/DD/YYYY')}`;
    this.setState({
      openActivityDetail: {
        activityId,
        title,
        range: rangeStr,
        activityStatus,
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

  onSortChange = (columnKey, sortDir) => {
    const { filteredIndex, dataList } = this.state;
    const indexList = sortDir
      ? sortList(filteredIndex, dataList, columnKey, sortDir)
      : getIndexList(dataList);

    this.setState({
      filteredIndex: indexList,
      colSortDirs: {
        [columnKey]: sortDir,
      },
    });
  };

  handleCloseDialog = () => {
    this.setState({
      openJobDetail: null,
      openActivityDetail: null,
    });
  };

  render() {
    const { t, i18n, classes, userRole } = this.props;
    const isZH = i18n.language.match('zh');
    const {
      dataList,
      range,
      selectedTeam,
      teamOptions,
      selectedDivision,
      divisionOptions,
      selectedJobCountry,
      countryOptions,
      loading,
      filteredIndex,
      colSortDirs,
      openJobDetail,
      openActivityDetail,
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
          <div className={classes.actionsContainer}>
            <Typography variant="h5">
              {t('message:Job Analytics by User(AM)')}
            </Typography>
            <PotentialButton
              onClick={this.downloadData}
              processing={this.state.generating}
            >
              {t('common:download')}
            </PotentialButton>
          </div>
          <Divider />

          <div
            className={clsx('horizontal-layout align-bottom', classes.actions)}
          >
            <div>
              <FormReactSelectContainer label={t('field:Posting Date')}>
                <DateRangePicker
                  value={range}
                  ranges={ranges}
                  cleanable={false}
                  toggleComponentClass={CustomToggleButton}
                  size="md"
                  style={{ height: 32 }}
                  block
                  onChange={this.handleDateRangeChange}
                  placeholder={t('message:selectDateRange')}
                  locale={isZH ? zhCN.DateRangePicker : enUS.DateRangePicker}
                />
              </FormReactSelectContainer>
            </div>

            <div>
              <div style={{ minWidth: 168, height: 53 }}>
                <FormReactSelectContainer label={t('field:Job Country')}>
                  <Select
                    value={selectedJobCountry}
                    options={countryOptions}
                    simpleValue
                    onChange={this.handleJobCountryChange}
                    autoBlur
                    clearable={false}
                  />
                </FormReactSelectContainer>
              </div>
            </div>

            {userRole === 'admin' && (
              <>
                <div>
                  <div style={{ minWidth: 228, height: 53 }}>
                    <FormReactSelectContainer label={t('field:Office')}>
                      <Select
                        value={selectedDivision}
                        options={divisionOptions}
                        simpleValue
                        onChange={this.handleDivisionChange}
                        autoBlur
                        clearable={false}
                      />
                    </FormReactSelectContainer>
                  </div>
                </div>

                <div>
                  <div style={{ minWidth: 168, height: 53 }}>
                    <FormReactSelectContainer label={t('field:Team')}>
                      <Select
                        value={selectedTeam}
                        options={teamOptions}
                        onChange={this.handleTeamChange}
                        simpleValue
                        autoBlur
                        clearable={false}
                      />
                    </FormReactSelectContainer>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <Divider />
        <div className={clsx('flex-child-auto', classes.contentContainer)}>
          <ReportTableSummary
            dataList={this.filteredList}
            columns={columns}
            onClickJob={this.handleClickJobCount}
            onClickActivity={this.handleClickActivityCount}
            colSortDirs={colSortDirs}
            onSortChange={this.onSortChange}
            footerData={this.state.footerData}
          />
          {loading && (
            <div
              className={clsx(
                'flex-container flex-dir-column',
                classes.contentMask
              )}
            >
              <Loading />
            </div>
          )}
        </div>

        <Dialog
          open={!!openJobDetail}
          onClose={this.handleCloseDialog}
          fullWidth
          maxWidth="md"
        >
          {!!openJobDetail && (
            <ReportsJob
              t={t}
              {...openJobDetail}
              onRequestClose={this.handleCloseDialog}
            />
          )}
        </Dialog>
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
function mapStateToProps(state) {
  let userRole = 'normal';
  const authorities = state.controller.currentUser.get('authorities');
  if (authorities) {
    if (
      authorities.includes(Immutable.Map({ name: 'ROLE_PRIMARY_RECRUITER' }))
    ) {
      userRole = 'leader';
    }
    if (
      authorities.includes(Immutable.Map({ name: 'PRIVILEGE_REPORT' })) ||
      authorities.includes(Immutable.Map({ name: 'ROLE_TENANT_ADMIN' }))
    ) {
      userRole = 'admin';
    }
  }
  return {
    userRole,
  };
}

export default withTranslation(['tab', 'action', 'field', 'message'])(
  connect(mapStateToProps)(withStyles(styles)(Reports))
);
