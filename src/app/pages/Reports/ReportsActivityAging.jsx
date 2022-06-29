import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import {
  getPipelineReportByDetailsExcel,
  getPipelineReportByDetails,
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
    colName: 'candidate',
    colWidth: 200,
    col: 'talentName',
    type: 'talentNameLink',
    fixed: true,
  },
  {
    colName: 'Sourcer',
    colWidth: 150,
    flexGrow: 1,
    col: 'appliedBy',
  },

  {
    colName: 'company',
    colWidth: 160,
    flexGrow: 2,
    col: 'company',
  },
  {
    colName: 'jobTitle',
    colWidth: 200,
    col: 'title',
  },
  {
    colName: 'Current Status',
    colWidth: 170,
    col: 'latestActivityStatusDesc',
  },
  {
    colName: 'memo',
    colWidth: 200,
    flexGrow: 1,
    col: 'applicationMemo',
  },
  {
    colName: 'Last Updated By',
    colWidth: 150,
    flexGrow: 1,
    col: 'latestActivityUpdatedBy',
  },
  {
    colName: 'Last Updated At',
    colWidth: 160,
    flexGrow: 1,
    col: 'latestActivityDate',
  },
  {
    colName: 'Job Status',
    colWidth: 120,
    flexGrow: 1,
    col: 'status',
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
    col: 'jobRef',
  },
  {
    colName: 'hiringManager',
    colWidth: 140,
    flexGrow: 1,
    col: 'hiringManager',
  },
];

class ReportsActivityAging extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.getReportData();
  }

  getReportData = () => {
    const { activityId } = this.props;
    // console.log('activities', activityId);
    getPipelineReportByDetails({ activity_id: activityId })
      .then((data) => {
        // console.log('@@@@response', data);
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

    const { activityId } = this.props;
    getPipelineReportByDetailsExcel({ activity_id: activityId }).finally(() => {
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

ReportsActivityAging.propTypes = {
  t: PropTypes.func.isRequired,
};

export default connect()(ReportsActivityAging);
