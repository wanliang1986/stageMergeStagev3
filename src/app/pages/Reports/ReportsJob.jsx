import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import {
  getJobReportByDetails,
  getJobReportByDetailsExcel,
} from '../../../apn-sdk/index';

import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import ReportTableSummary from '../../components/Tables/ReportTableSummary';
import Loading from '../../components/particial/Loading';
import PotentialButton from '../../components/particial/PotentialButton';

const columns = [
  {
    colName: 'Date Posted',
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
    colName: 'Job Id',
    colWidth: 180,
    flexGrow: 1,
    col: 'jobId',
  },
  {
    colName: 'Client Job Code',
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
    type: 'jobType',
    col: 'type',
  },

  {
    colName: 'company',
    colWidth: 160,
    flexGrow: 2,
    col: 'company',
  },
  {
    colName: 'clientContact',
    colWidth: 140,
    flexGrow: 1,
    col: 'hiringManager',
  },
  {
    colName: 'minimumPayRate',
    colWidth: 90,
    col: 'minimumPayRate',
  },
  {
    colName: 'maximumPayRate',
    colWidth: 90,
    col: 'maximumPayRate',
  },
  {
    colName: 'minimumBillRate',
    colWidth: 90,
    col: 'minimumBillRate',
  },
  {
    colName: 'maximumBillRate',
    colWidth: 90,
    col: 'maximumBillRate',
  },

  {
    colName: 'ratePer',
    colWidth: 90,
    col: 'unitType',
  },

  {
    colName: 'startDate',
    colWidth: 120,
    col: 'startDate',
  },
  {
    colName: 'endDate',
    colWidth: 120,
    col: 'endDate',
  },
  //   {
  //     colName: 'street',
  //     colWidth: 220,
  //     flexGrow: 2,
  //     col: 'address',
  //   },
  //   {
  //     colName: 'city',
  //     colWidth: 160,
  //     flexGrow: 2,
  //     col: 'city',
  //   },
  {
    colName: 'Location',
    colWidth: 160,
    flexGrow: 2,
    col: 'jobLocations',
    type: 'location',
  },
  //   {
  //     colName: 'province',
  //     colWidth: 90,
  //     flexGrow: 2,
  //     col: 'state',
  //   },
  //   {
  //     colName: 'zipcode',
  //     colWidth: 120,
  //     col: 'zipCode',
  //   },

  {
    colName: 'openings',
    colWidth: 120,
    flexGrow: 1,
    col: 'openingCount',
  },
  {
    colName: 'maxSubmittal',
    colWidth: 120,
    flexGrow: 1,
    col: 'maxSubmittals',
  },
  {
    colName: 'skills',
    colWidth: 200,
    flexGrow: 1,
    col: 'requiredSkills',
    type: 'skills',
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
    colName: 'divisionOfPrimarySale',
    colWidth: 200,
    flexGrow: 1,
    col: 'divisionOfPrimarySales',
  },

  {
    colName: 'Sum of Submitted to Client',
    colWidth: 150,
    flexGrow: 1,
    col: 'submittedCount',
  },
  {
    colName: 'Sum of Interview',
    colWidth: 120,
    flexGrow: 1,
    col: 'interviewCount',
  },
  {
    colName: 'Sum of On boarded',
    colWidth: 120,
    flexGrow: 1,
    col: 'startedCount',
  },
  {
    colName: 'lastActivityDate',
    colWidth: 180,
    flexGrow: 1,
    col: 'lastActivityDate',
  },
  {
    colName: 'suppliersCompany',
    colWidth: 180,
    flexGrow: 1,
    col: 'suppliersCompany',
  },

  {
    colName: 'noSubmittal',
    colWidth: 140,
    flexGrow: 1,
    col: 'noSubmittals',
  },
  {
    colName: 'noSubmittalsWithin48Hours',
    colWidth: 180,
    flexGrow: 1,
    col: 'noSubmittalsWithin48Hours',
  },
];

class ReportsJob extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.getReportData();
  }

  getReportData = () => {
    const { jobId } = this.props;
    console.log(this.props);
    getJobReportByDetails({ jobId })
      .then((data) => {
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
        this.setState({
          dataList: Immutable.fromJS(data),
        });
      })
      .catch(() => {
        this.setState({
          dataList: Immutable.List(),
        });
      });
  };

  downloadReportData = () => {
    this.setState({ generating: true });

    const { jobId } = this.props;
    getJobReportByDetailsExcel({ jobId }).finally(() => {
      this.setState({ generating: false });
    });
  };

  render() {
    const { onRequestClose, title, range, t } = this.props;
    const { dataList } = this.state;
    if (!dataList) {
      return <Loading />;
    }
    return (
      <div
        className="flex-child-auto flex-container flex-dir-column"
        style={{ overflow: 'hidden' }}
      >
        <div style={{ position: 'relative' }}>
          <Typography variant="subtitle2">
            {title} <br />
            {range} <br />
          </Typography>
          <div style={{ padding: 5 }}>
            <PotentialButton
              onClick={this.downloadReportData}
              processing={this.state.generating}
            >
              {t('common:download')}
            </PotentialButton>
          </div>
          <div style={{ position: 'absolute', right: 0, top: 0 }}>
            <IconButton onClick={onRequestClose}>
              <CloseIcon />
            </IconButton>
          </div>
        </div>

        <div style={{ marginBottom: 0 }}>
          <Divider />
        </div>
        <div
          className="flex-child-auto"
          style={{ height: 900, overflow: 'hidden' }}
        >
          <ReportTableSummary dataList={dataList} columns={columns} />
        </div>
      </div>
    );
  }
}

ReportsJob.propTypes = {
  t: PropTypes.func.isRequired,
};

export default connect()(ReportsJob);
