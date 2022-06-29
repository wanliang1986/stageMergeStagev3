import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { sortList, getIndexList } from '../../../../utils/index';
import Immutable from 'immutable';
import { getPipelineReportByDetails } from '../../../../apn-sdk/index';

import ReportTableSummary from '../../../components/Tables/ReportTableSummary';
import Loading from '../../../components/particial/Loading';

const styles = {
  root: {
    position: 'relative',
    height: '100%',

    '& $mask': {
      position: 'absolute',
      top: 0,
      right: 0,
      left: 0,
      bottom: 0,
      background: 'rgba(255,255,255,.2)',
      display: 'flex',
      flexDirection: 'column',
    },
  },
  mask: {},
};
const activityStatusOptions = [
  { value: 'applied', label: 'Submitted To AM' },
  { value: 'submitted', label: 'Submitted To Client' },
  { value: 'interview', label: 'Interview' },
  { value: 'offered', label: 'Offered by Client' },
  { value: 'offerAccepted', label: 'Offer Accepted' },
  { value: 'started', label: 'On boarded' },
];
const columns = activityStatusOptions.reduce((res, option) => {
  res[option.value] = [
    {
      colName: 'candidate',
      colWidth: 200,
      col: 'talentName',
      type: 'talentNameLink',
      fixed: true,
      sortable: true,
    },
    {
      colName: 'Sourcer',
      colWidth: 150,
      flexGrow: 1,
      col: 'appliedBy',
      sortable: true,
    },
    {
      colName: 'company',
      colWidth: 160,
      flexGrow: 2,
      col: 'company',
      sortable: true,
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
      sortable: true,
    },
    {
      colName: 'Last Updated By',
      colWidth: 150,
      flexGrow: 1,
      col: 'latestActivityUpdatedBy',
      sortable: true,
    },
    {
      colName: 'Last Updated At',
      colWidth: 160,
      flexGrow: 1,
      col: 'latestActivityDate',
      sortable: true,
    },
    {
      colName: `Date of ${option.label}`,
      colWidth: 160,
      col: `${option.value}Date`,
      type: 'date',
      sortable: true,
    },
    {
      colName: 'Job Status',
      colWidth: 120,
      flexGrow: 1,
      col: 'status',
      sortable: true,
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
      colName: 'hiringManager',
      colWidth: 140,
      flexGrow: 1,
      col: 'hiringManager',
      sortable: true,
    },
  ];

  return res;
}, {});

class Reports extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      dataList: Immutable.List(),
      loading: false,

      filteredIndex: Immutable.List(),
      colSortDirs: {},
    };

    this.filteredList = Immutable.List();
  }

  componentDidUpdate(preProps) {
    // load data by activityId
    // clean data when activityId is empty
    if (this.props.activityId) {
      if (this.props.activityId !== preProps.activityId) {
        this.getReportData(this.props.activityId);
      }
    } else {
      this.setState({
        filteredIndex: Immutable.List(),
      });
    }
  }

  getReportData = (activity_id) => {
    this.setState({ loading: true });
    getPipelineReportByDetails({ activity_id })
      .then((data) => {
        const { colSortDirs } = this.state;
        const dataList = Immutable.fromJS(data);
        let filteredIndex = getIndexList(dataList);
        const columnKey = Object.keys(colSortDirs)[0];
        if (columnKey) {
          let sortDir = colSortDirs[columnKey];
          filteredIndex = sortList(filteredIndex, dataList, columnKey, sortDir);
        }

        this.setState({
          dataList,
          filteredIndex,
          loading: false,
        });
      })
      .catch(() => {
        this.setState({
          loading: false,
          dataList: Immutable.List(),
        });
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

  render() {
    const { activityStatus, classes } = this.props;
    const { dataList, loading, filteredIndex, colSortDirs } = this.state;
    const filteredList = filteredIndex.map((index) => dataList.get(index));
    if (!this.filteredList.equals(filteredList)) {
      this.filteredList = filteredList;
    }

    return (
      <div className={classes.root}>
        <ReportTableSummary
          dataList={this.filteredList}
          columns={columns[activityStatus || 'applied']}
          colSortDirs={colSortDirs}
          onSortChange={this.onSortChange}
        />
        {loading && (
          <div className={classes.mask}>
            <Loading />
          </div>
        )}
      </div>
    );
  }
}

export default connect()(withStyles(styles)(Reports));
