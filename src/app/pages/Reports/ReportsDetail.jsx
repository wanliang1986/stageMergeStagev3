import React from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import * as ActionTypes from '../../constants/actionTypes';
import moment from 'moment-timezone';
import {
  getMonthTrendReportExcel,
  getCompanyTrendReportExcel,
  getMonthTrendReportData,
  getCompanyTrendReportData,
  getCompanyListData,
} from '../../../apn-sdk';

import { Redirect } from 'react-router-dom';

import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';

import MonthSelectorButton from '../../components/particial/MonthSelector';
import PotentialButton from '../../components/particial/PotentialButton';
import ReportTableSummary from '../../components/Tables/ReportTableSummary';
import ReportsJob from './ReportsJob';
import ReportsActivity from './ReportsActivity';
import FormSelect from '../../components/particial/FormSelect';

import JobAnalyticsByCompany from './Job/JobAnalyticsByCompany';
import JobAnalyticsByRecruiter from './Job/JobAnalyticsByRecruiter';
import JobDetails from './Job';
import PipelineAnalyticsByRecruiter from './Pipeline/PipelineAnalyticsByRecruiter';
import PipelineAnalyticsBySourcer from './Pipeline/PipelineAnalyticsBySourcer';
import PipelineAnalyticsByCompany from './Pipeline/PipelineAnalyticsByCompany';
import PipelineDetails from './Pipeline';

import JobChart from './Graph/JobChart2';
import PipeChartAM from './Graph/PipeChartAM';
import PipeChartClient from './Graph/PipeChartClient';
import SourcerChartAM from './Graph/SourcerChartAM';
import SourcerChartClient from './Graph/SourcerChartClient';
import SourcerPipelineChart2 from './Graph/SourcerPipelineChart2';
import PipelineChartByUpdatedDate from './Graph/PipelineChartByUpdatedDate';
import RecruiterPipelineChart from './Graph/RecruiterPipelineChart';

import WeekReportResource from './WeekReport/WeekReport';
import WeekReportCommonSearch from './WeekReport/WeekReportCommonSearch';
import AgingReport from './WeekReport/AgingReport';
import WeekReportLinkedIn from './WeekReport/WeekReportLinkedIn';
import LinkedinMap from './WeekReport/LinkedinMap';

import StoppedJob from './Stopped/StoppedJob';
import StoppedCandidate from './Stopped/StoppedCandidate';
import ActiveJobsAndTalents from './Stopped/ActiveJobsAndTalents';

import BDReport from './BDReport';

// sales
//  fte
import FTESalesReportMonthly from './Sales/FTESalesReportMonthly';
import FTESalesReportQuarterly from './Sales/FTESalesReportQuarterly';
import FTESalesReportYearly from './Sales/FTESalesReportYearly';
import FTENewOfferReportWeekly from './Sales/FTENewOfferReportWeekly';

// contract
import ContractSalesReportMonthly from './Sales/ContractSalesReportMonthly';
import ContractSalesReportQuarterly from './Sales/ContractSalesReportQuarterly';
import ContractSalesReportYearly from './Sales/ContractSalesReportYearly';
import ContractNewOfferReportWeekly from './Sales/ContractNewOfferReportWeekly';
const columns = {
  trendMonth: [
    {
      colName: 'company',
      colWidth: 200,
      col: 'company',
    },
    {
      colName: 'hirePerMonth',
      colWidth: 200,
      col: 'hire',
    },
    {
      colName: 'termPerMonth',
      colWidth: 200,
      col: 'terminate',
    },
    {
      colName: 'netAddPerMonth',
      colWidth: 200,
      col: 'netAdd',
      flexGrow: 1,
    },
  ],
  trendCompany: [
    {
      colName: 'month',
      colWidth: 200,
      col: 'dataMonth',
    },
    {
      colName: 'hirePerMonth',
      colWidth: 200,
      col: 'hire',
    },
    {
      colName: 'termPerMonth',
      colWidth: 200,
      col: 'terminate',
    },
    {
      colName: 'netAddPerMonth',
      colWidth: 200,
      col: 'netAdd',
      flexGrow: 1,
    },
  ],
  activityDetail: [
    {
      colName: 'dateIssued',
      colWidth: 120,
      col: 'dateIssued',
      type: 'date',
    },
    {
      colName: 'jobTitle',
      colWidth: 200,
      col: 'title',
    },
    {
      colName: 'company',
      colWidth: 160,
      flexGrow: 2,
      col: 'company',
    },
    {
      colName: 'code',
      colWidth: 180,
      flexGrow: 1,
      col: 'code',
    },
    {
      colName: 'priority',
      colWidth: 120,
      col: 'priority',
    },
    {
      colName: 'status',
      colWidth: 120,
      flexGrow: 1,
      col: 'status',
    },
    {
      colName: 'division',
      colWidth: 120,
      col: 'division',
    },
    {
      colName: 'type',
      colWidth: 120,
      col: 'type',
    },

    {
      colName: 'openings',
      colWidth: 120,
      flexGrow: 1,
      col: 'openings',
    },
    {
      colName: 'hiringManager',
      colWidth: 140,
      flexGrow: 1,
      col: 'hiringManager',
    },

    {
      colName: 'minimumPayRate',
      colWidth: 90,
      col: 'payRateFrom',
    },
    {
      colName: 'maximumPayRate',
      colWidth: 90,
      col: 'payRateTo',
    },
    {
      colName: 'minimumBillRate',
      colWidth: 90,
      col: 'billRateFrom',
    },
    {
      colName: 'maximumBillRate',
      colWidth: 90,
      col: 'billRateTo',
    },

    {
      colName: 'street',
      colWidth: 220,
      flexGrow: 2,
      col: 'address',
    },
    {
      colName: 'city',
      colWidth: 160,
      flexGrow: 2,
      col: 'city',
    },
    {
      colName: 'province',
      colWidth: 90,
      flexGrow: 2,
      col: 'state',
    },
    {
      colName: 'zipcode',
      colWidth: 120,
      col: 'zipCode',
    },

    {
      colName: 'primaryRecruiter',
      colWidth: 200,
      flexGrow: 1,
      col: 'primaryRecruiter',
    },
    {
      colName: 'primarySale',
      colWidth: 200,
      flexGrow: 1,
      col: 'primarySales',
    },

    {
      colName: 'candidate',
      colWidth: 200,
      col: 'talentName',
    },
    {
      colName: 'submitDate',
      colWidth: 200,
      col: 'submitDate',
    },

    {
      colName: 'interviewDate',
      colWidth: 200,
      col: 'interviewDate',
    },

    {
      colName: 'hireDate',
      colWidth: 200,
      col: 'hireDate',
    },

    {
      colName: 'submitBy',
      colWidth: 200,
      col: 'submitBy',
    },
    {
      colName: 'submitMemo',
      colWidth: 200,
      col: 'submitMemo',
    },
    {
      colName: 'interviewBy',
      colWidth: 200,
      col: 'interviewBy',
    },
    {
      colName: 'interviewMemo',
      colWidth: 200,
      col: 'interviewMemo',
    },
    {
      colName: 'hireBy',
      colWidth: 200,
      col: 'hireBy',
    },
    {
      colName: 'hireMemo',
      colWidth: 200,
      col: 'hireMemo',
    },
  ],
};

const queries = {
  trendMonth: getMonthTrendReportData,
  trendCompany: getCompanyTrendReportData,
};

const downloads = {
  trendMonth: getMonthTrendReportExcel,
  trendCompany: getCompanyTrendReportExcel,
};

const headers = {
  trendMonth: 'trendMonthReport',
  trendCompany: 'trendCompanyReport',
  activityDetail: 'activityDetailReport',
};

const reportTypes = {
  5: 'trendMonth',
  6: 'trendCompany',
  9: 'activityDetail',
};

class ReportsDetail extends React.PureComponent {
  constructor(props) {
    super();
    this.fTimer = setTimeout(() => {
      this.setState({ show: true });
    }, 850);

    this.state = {
      dataList: Immutable.List(),
      type: reportTypes[props.reportId],
      trendMonth: moment().format('YYYY-MM'),
      trendCompany: '',
      companyList: [],
    };
  }

  componentDidMount() {
    const { type } = this.state;
    if (type) {
      this.getReportData(type)();
      getCompanyListData().then((companyList) =>
        this.setState({ companyList })
      );
    }
  }

  componentWillUnmount() {
    if (this.fTimer) {
      clearTimeout(this.fTimer);
    }
  }

  handleMonthChange = (month) => {
    const { type, jobType } = this.state;
    this.setState({ [type]: month });
    queries[type](month, jobType).then((data) => {
      this.setState({
        dataList: Immutable.fromJS(data),
      });
    });
  };

  handleCompanyChange = (e) => {
    const company = e.target.value;
    queries[this.state.type](company).then((data) => {
      this.setState({
        trendCompany: company,
        dataList: Immutable.fromJS(data),
      });
    });
  };

  getReportData = (type) => (e) => {
    queries[type] &&
      queries[type](this.state[type]).then((data) => {
        this.setState({
          type,
          dataList: Immutable.fromJS(data),
        });
      });
  };

  downloadReportExcel = (type) => (e) => {
    const { dispatch } = this.props;

    downloads[type](this.state[type]).catch(() =>
      dispatch({
        type: ActionTypes.ADD_MESSAGE,
        message: {
          type: 'error',
          message: 'There is no data to download.',
        },
      })
    );
  };

  render() {
    const { t, currentUserId, reportId } = this.props;
    const { type } = this.state;
    if (!currentUserId) {
      return null;
    }

    // console.log(reportId);
    if (reportId === '1') {
      return <JobAnalyticsByCompany />;
    }
    if (reportId === '2') {
      return <JobAnalyticsByRecruiter />;
    }
    if (reportId === '4') {
      return <JobDetails />;
    }
    if (reportId === '7') {
      return <PipelineAnalyticsByRecruiter t={t} />;
    }
    if (reportId === '17') {
      return <PipelineAnalyticsBySourcer />;
    }
    if (reportId === '8') {
      return <PipelineAnalyticsByCompany />;
    }
    if (reportId === '9') {
      return <PipelineDetails />;
    }

    if (reportId === '10') {
      return <PipeChartAM />;
    }

    if (reportId === '11') {
      return <PipeChartClient />;
    }

    if (reportId === '12') {
      return <JobChart />;
    }

    if (reportId === '15') {
      return <SourcerChartAM />;
    }

    if (reportId === '16') {
      return <SourcerChartClient />;
    }
    if (reportId === '36') {
      return <SourcerPipelineChart2 />;
    }
    if (reportId === '37') {
      return <RecruiterPipelineChart />;
    }
    if (reportId === '38') {
      return <PipelineChartByUpdatedDate />;
    }

    if (reportId === '41') {
      return <WeekReportResource />;
    }

    if (reportId === '42') {
      return <AgingReport />;
    }

    if (reportId === '43') {
      return <WeekReportCommonSearch />;
    }
    if (reportId === '45') {
      return <WeekReportLinkedIn />;
    }

    if (reportId === '46') {
      return <StoppedJob />;
    }

    if (reportId === '47') {
      return <StoppedCandidate />;
    }

    if (reportId === '48') {
      return <ActiveJobsAndTalents />;
    }

    if (reportId === '51') {
      return <BDReport />;
    }

    // add by bill
    if (reportId === '52') {
      return <FTESalesReportMonthly />;
    }
    if (reportId === '53') {
      return <FTESalesReportQuarterly />;
    }
    if (reportId === '54') {
      return <FTESalesReportYearly />;
    }
    if (reportId === '55') {
      return <FTENewOfferReportWeekly />;
    }
    if (reportId === '56') {
      return <ContractSalesReportMonthly />;
    }
    if (reportId === '57') {
      return <ContractNewOfferReportWeekly />;
    }

    if (reportId === '58') {
      return <ContractSalesReportQuarterly />;
    }
    if (reportId === '59') {
      return <ContractSalesReportYearly />;
    }
    if (reportId === '1001') {
      return <LinkedinMap />;
    }

    if (!type) {
      console.log('type', type);
      return <Redirect to={{ pathname: '/reports/nomatch' }} />;
    }
    return (
      <div
        className="flex-child-auto flex-container flex-dir-column"
        style={{ overflow: 'auto' }}
      >
        <div className="flex-child-grow flex-container align-center">
          <Paper
            className="flex-container flex-dir-column"
            style={{ maxWidth: 1200, width: '100%' }}
          >
            <div>
              <Typography variant="h5">
                {t('message:' + headers[this.state.type])}
              </Typography>

              <div
                className="horizontal-layout align-bottom"
                style={{
                  minHeight: 40,
                  padding: 8,
                }}
              >
                {this.state.type !== 'trendCompany' && (
                  <MonthSelectorButton
                    value={this.state[this.state.type]}
                    onChange={this.handleMonthChange}
                  />
                )}

                {this.state.type === 'trendCompany' && (
                  <FormSelect
                    label="Company"
                    value={this.state.trendCompany}
                    onChange={this.handleCompanyChange}
                    style={{ height: 32, width: 'unset', minWidth: 168 }}
                  >
                    <option value="">-- select --</option>
                    {this.state.companyList.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </FormSelect>
                )}
                <div className="flex-child-auto"></div>
                <PotentialButton
                  onClick={this.downloadReportExcel(this.state.type)}
                >
                  {t('common:download')}
                </PotentialButton>
              </div>
            </div>

            <Divider />
            <div className="flex-child-grow" style={{ minHeight: 500 }}>
              {this.state.type && this.state.show && (
                <ReportTableSummary
                  dataList={this.state.dataList}
                  columns={columns[this.state.type]}
                  onClickJob={this.handleClickJobCount}
                  onClickActivity={this.handleClickActivityCount}
                />
              )}
            </div>
          </Paper>
        </div>

        <Dialog
          open={!!this.state.openJobDetail}
          onClose={() => this.setState({ openJobDetail: null })}
          fullWidth
          maxWidth="md"
          // disableBackdropClick
          // disableEscapeKeyDown
        >
          {!!this.state.openJobDetail && (
            <ReportsJob
              t={t}
              {...this.state.openJobDetail}
              onRequestClose={() => this.setState({ openJobDetail: null })}
            />
          )}
        </Dialog>
        <Dialog
          open={!!this.state.openActivityDetail}
          onClose={() => this.setState({ openActivityDetail: null })}
          fullWidth
          maxWidth="md"
        >
          {!!this.state.openActivityDetail && (
            <ReportsActivity
              t={t}
              {...this.state.openActivityDetail}
              onRequestClose={() => this.setState({ openActivityDetail: null })}
            />
          )}
        </Dialog>
      </div>
    );
  }
}

ReportsDetail.propTypes = {
  t: PropTypes.func.isRequired,
};

function mapStoreStateToProps(state, { match }) {
  const currentUserId = state.controller.currentUser.get('id');
  return {
    currentUserId,
    reportId: match.params.reportId,
  };
}

export default withTranslation(['tab', 'action', 'field', 'message'])(
  connect(mapStoreStateToProps)(ReportsDetail)
);
