import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { getStoppedJobReportDetail } from '../../../../apn-sdk/index';

import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

import ReportTableSummary from '../../../components/Tables/ReportTableSummary';
import Loading from '../../../components/particial/Loading';
import { sortList, getIndexList } from '../../../../utils/index';

const columns = [
  {
    colName: 'jobTitle',
    colWidth: 200,
    col: 'jobTitle',
    flexGrow: 1,
    fixed: true,
    sortable: true,
  },
  {
    colName: 'jobID',
    colWidth: 100,
    col: 'id',
    sortable: true,
  },
  {
    colName: 'type',
    colWidth: 120,
    type: 'jobType',
    col: 'jobType',
    sortable: true,
  },
  {
    colName: 'company',
    colWidth: 160,
    col: 'company',
    flexGrow: 1,
    sortable: true,
  },
  {
    colName: 'lastUpdatedAt',
    colWidth: 150,
    col: 'lastModifiedDate',
    type: 'date',
    sortable: true,
  },
  {
    colName: 'postingDate',
    colWidth: 130,
    col: 'postingTime',
    type: 'date',
    sortable: true,
  },
];

class ReportsJob extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      filteredIndex: Immutable.List(),
      colSortDirs: {},
    };

    this.filteredList = Immutable.List();
  }

  componentDidMount() {
    this.getReportData();
  }

  getReportData = () => {
    const { amId } = this.props;
    getStoppedJobReportDetail(amId)
      .then((res) => {
        const dataList = Immutable.fromJS(res);
        let filteredIndex = getIndexList(dataList);
        this.setState({
          dataList,
          filteredIndex,
        });
      })
      .catch(() => {
        this.setState({
          dataList: Immutable.List(),
        });
      });
  };

  onSortChange = (columnKey, sortDir) => {
    const { filteredIndex, dataList } = this.state;
    const preIndex = filteredIndex;

    let indexList;
    indexList = sortDir
      ? sortList(preIndex, dataList, columnKey, sortDir)
      : getIndexList(dataList);

    this.setState({
      filteredIndex: indexList,
      colSortDirs: {
        [columnKey]: sortDir,
      },
    });
  };

  render() {
    const { onRequestClose, am, t } = this.props;
    const { dataList, filteredIndex, colSortDirs } = this.state;

    const filteredList = filteredIndex.map((index) => dataList.get(index));
    if (!this.filteredList.equals(filteredList)) {
      this.filteredList = filteredList;
    }

    if (!dataList) {
      return <Loading />;
    }
    return (
      <div
        className="flex-child-auto flex-container flex-dir-column"
        style={{ overflow: 'hidden' }}
      >
        <div style={{ position: 'relative' }}>
          <Typography variant="h6" style={{ marginBottom: '20px' }}>
            {am}
          </Typography>
        </div>

        <div style={{ marginBottom: 0 }}>
          <Divider />
        </div>
        <div
          className="flex-child-auto"
          style={{ height: 500, overflow: 'hidden' }}
        >
          <ReportTableSummary
            dataList={this.filteredList}
            columns={columns}
            colSortDirs={colSortDirs}
            onSortChange={this.onSortChange}
          />
        </div>
      </div>
    );
  }
}

ReportsJob.propTypes = {
  t: PropTypes.func.isRequired,
};

export default connect()(ReportsJob);
