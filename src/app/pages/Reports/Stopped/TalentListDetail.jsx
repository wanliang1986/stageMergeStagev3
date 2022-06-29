import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { getTalentListByIds } from '../../../../apn-sdk/index';

import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

import ReportTableSummary from '../../../components/Tables/ReportTableSummary';
import Loading from '../../../components/particial/Loading';
import { sortList, getIndexList } from '../../../../utils/index';

const columns = [
  {
    colName: 'candidateName',
    colWidth: 160,
    col: 'fullName',
    type: 'talentNameLink',
    sortable: true,
    fixed: true,
  },
  {
    colName: 'talentID',
    colWidth: 140,
    col: 'id',
    sortable: true,
  },
  {
    colName: 'jobTitle',
    colWidth: 200,
    col: 'title',
    flexGrow: 1,
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
];

class TalentListDetail extends React.PureComponent {
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
    const { talentIds } = this.props;
    getTalentListByIds(talentIds)
      .then((res) => {
        const dataList = Immutable.fromJS(
          res.map((el) => {
            el.talentId = el.id;
            return el;
          })
        );
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
    const { userName, t } = this.props;
    const { dataList, filteredIndex, colSortDirs } = this.state;

    const filteredList = filteredIndex.map((index) => dataList.get(index));
    if (!this.filteredList.equals(filteredList)) {
      this.filteredList = filteredList;
    }

    if (!dataList) {
      return (
        <div
          className="flex-child-auto flex-container"
          style={{ height: 500, overflow: 'hidden' }}
        >
          <Loading />
        </div>
      );
    }
    return (
      <>
        <Typography
          variant="h6"
          className="container-padding"
          style={{ textTransform: 'capitalize' }}
        >
          {userName}
        </Typography>

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
      </>
    );
  }
}

TalentListDetail.propTypes = {
  t: PropTypes.func.isRequired,
};

export default connect()(TalentListDetail);
