import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import {
  getPipelineReportByDetailsExcel_V2,
  getPipelineReportByDetails_V2,
} from '../../../apn-sdk/index';

import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import ReportTableSummary from '../../components/Tables/ReportTableSummary3';
import Loading from '../../components/particial/Loading';

import GetAppIcon from '@material-ui/icons/GetApp';

import FilterIcon from '@material-ui/icons/FilterList';

import { sortList, getIndexList } from '../../../utils/index';

const activityStatusFilterObj = {
  applied: 'Applied',
  submitted: 'Submitted',
  offerAccepted: 'Offer_Accepted',
  interview: 'Interview',
  started: 'Started',
  offered: 'Offered',
};
const activityStatusOptions = [
  { value: 'applied', label: 'Submitted To AM' },
  { value: 'submitted', label: 'Submitted To Client' },
  { value: 'interview', label: 'Updated To Interview' },
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
      col: 'sourcer',
      sortable: true,
    },

    {
      colName: `Date of  ${option.label}`,
      colWidth: 260,
      col: 'activityCreatedDate',
      type: 'date',
      sortable: true,
      disableSearch: true,
    },

    {
      colName: 'Current Status',
      colWidth: 170,
      col: 'currentStatusDesc',
      filterKeyCol: 'currentStatus',
      sortable: true,
      type: 'enum',
    },

    {
      colName: 'company',
      colWidth: 160,
      flexGrow: 2,
      col: 'company',
      sortable: true,
      type: 'companyLink',
    },
    {
      colName: 'jobTitle',
      colWidth: 200,
      col: 'jobTitle',
      sortable: true,
      type: 'jobLink',
    },
    {
      colName: 'Job Id',
      colWidth: 180,
      flexGrow: 1,
      col: 'jobId',
      sortable: true,
    },
    {
      colName: 'Job Status',
      colWidth: 120,
      flexGrow: 1,
      col: 'jobStatus',
      sortable: true,
      type: 'enum',
    },

    {
      colName: 'Job Location',
      colWidth: 150,
      flexGrow: 1,
      col: 'jobLocation',
      type: 'jobLocation',
      sortable: true,
    },

    {
      colName: 'Last Updated By',
      colWidth: 175,
      flexGrow: 1,
      // col: `${option.value}By`,
      col: 'lastUpdatedAt',
      sortable: true,
      disableSearch: true,
    },

    {
      colName: 'Last Updated At',
      colWidth: 160,
      flexGrow: 1,
      // col: `${option.value}By`,
      col: 'lastUpdatedBy',
      sortable: true,
      disableSearch: true,
    },

    // {
    //   colName: 'memo',
    //   colWidth: 200,
    //   flexGrow: 1,
    //   col: 'applicationMemo',
    // },

    // {
    //   colName: 'Client Job Code',
    //   colWidth: 180,
    //   flexGrow: 1,
    //   col: 'jobRef',
    // },
    // {
    //   colName: 'hiringManager',
    //   colWidth: 140,
    //   flexGrow: 1,
    //   col: 'hiringManager',
    // },
  ];

  return res;
}, {});

const styles_inside = {
  downLoadIcon: {
    position: 'absolute',
    right: '2%',
    top: '10%',
    color: 'rgb(170, 177, 184)',
    fontSize: '25px',
    cursor: 'pointer',
  },
};
let status = {};
class ReportsActivity extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      filterOpen: false,
      colSortDirs: { null: 'null' },
      dataList: null,
      filteredIndex: Immutable.List(),

      filters: status.filters || Immutable.Map(),
    };

    this.filteredList = Immutable.List();
  }

  componentDidMount() {
    this.getReportData();
  }

  onFilter = (input) => {
    let filters = this.state.filters;
    let query = input.value;
    let col = input.name === 'currentStatusDesc' ? 'currentStatus' : input.name;

    if (filters.get(col) === query) {
      return;
    }
    if (!query) {
      filters = filters.remove(col);
    } else {
      filters = filters.set(col, query);
    }

    // console.log(filters.toJS());

    this.setState({
      filters,
      filteredIndex: getIndexList(
        this.state.dataList,
        filters,
        this.state.colSortDirs
      ),
    });
  };

  getReportData = () => {
    const { activityId, activityStatus } = this.props;
    console.log(activityStatus);
    getPipelineReportByDetails_V2({
      activity_id: activityId,
      activity_status: activityStatusFilterObj[activityStatus],
    })
      .then((data) => {
        let filteredIndex = getIndexList(Immutable.fromJS(data));

        let filteredData = this.filterData(data);

        this.setState({
          dataList: Immutable.fromJS(filteredData),
          filteredIndex,
        });
      })
      .catch(() => {
        this.setState({
          dataList: Immutable.List(),
        });
      });
  };

  filterData = (data) =>
    data.map((item) => ({
      ...item,
      // jobLocation: item.state + item.address,
    }));

  downloadReportData = () => {
    this.setState({ generating: true });

    const { activityId, activityStatus } = this.props;

    getPipelineReportByDetailsExcel_V2({
      activity_id: activityId,
      activity_status: activityStatusFilterObj[activityStatus],
    }).finally(() => {
      this.setState({ generating: false });
    });
  };

  // 排序
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

  render() {
    const { onRequestClose, title, range, activityStatus, t } = this.props;
    const { dataList, filterOpen, colSortDirs, filteredIndex } = this.state;

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
          <Typography variant="h5" style={{ margin: '20px 15px' }}>
            {title}
            {/* 过滤按钮 */}
            <IconButton
              onClick={() => {
                this.setState({
                  filterOpen: !this.state.filterOpen,
                });
              }}
            >
              <FilterIcon color={filterOpen ? 'primary' : 'default'} />
            </IconButton>
            <Typography>{range}</Typography>
          </Typography>

          <div style={{ position: 'absolute', right: 0, top: 0 }}>
            <IconButton onClick={onRequestClose}>
              <CloseIcon />
            </IconButton>
          </div>
        </div>
        {/* 下载按钮 */}
        <GetAppIcon
          style={styles_inside.downLoadIcon}
          onClick={this.downloadReportData}
        />
        {/* <div style={{ padding: 5 }}>
          <PotentialButton
            onClick={this.downloadReportData}
            processing={this.state.generating}
          >
            {t('common:download')}
          </PotentialButton>
        </div> */}

        <div
          className="flex-child-auto"
          style={{ height: 900, overflow: 'hidden', margin: '0 20px' }}
        >
          <ReportTableSummary
            onFilter={this.onFilter}
            filterOpen={filterOpen}
            dataList={this.filteredList}
            columns={columns[activityStatus || 'applied']}
            colSortDirs={colSortDirs}
            onSortChange={this.onSortChange}
          />
        </div>
      </div>
    );
  }
}

ReportsActivity.propTypes = {
  t: PropTypes.func.isRequired,
};

export default connect()(ReportsActivity);
