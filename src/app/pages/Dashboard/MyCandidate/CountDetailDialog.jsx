import React from 'react';
import { connect } from 'react-redux';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
// import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';

import DashboardTable from '../Tables/DashboardTable';
import PrimaryButton from '../../../components/particial/PrimaryButton';

const columns = [
  {
    colName: 'name',
    colWidth: 140,
    col: 'fullName',
    type: 'candidateName',
    fixed: true,
    sortable: true,
    disableSearch: true,
  },
  {
    colName: 'jobTitle',
    colWidth: 140,
    col: 'jobTitle',
    type: 'candidateJob',
    flexGrow: 1,
    sortable: true,
    disableSearch: true,
  },
  {
    colName: 'company',
    colWidth: 100,
    col: 'company',
    sortable: true,
    disableSearch: true,
  },

  // {
  //   colName: 'status',
  //   colWidth: 110,
  //   col: 'status',
  //   type: 'enum',
  //   flexGrow: 1,
  //   sortable: true
  // },
  // {
  //   colName: 'Last Updated By',
  //   colWidth: 150,
  //   flexGrow: 1,
  //   col: 'latestActivityUpdatedBy',
  //   sortable: true
  // },
  {
    colName: 'Last Updated At',
    colWidth: 70,
    flexGrow: 1,
    col: 'lastModifiedDate',
    sortable: true,
    type: 'date',
    disableSearch: true,
  },
];
const columns_onBoarded = [
  {
    colName: 'name',
    colWidth: 140,
    col: 'fullName',
    type: 'candidateName',
    fixed: true,
    sortable: true,
    disableSearch: true,
  },
  {
    colName: 'jobTitle',
    colWidth: 140,
    col: 'jobTitle',
    type: 'candidateJob',
    flexGrow: 1,
    sortable: true,
    disableSearch: true,
  },
  {
    colName: 'company',
    colWidth: 100,
    col: 'company',
    sortable: true,
    disableSearch: true,
  },

  {
    colName: 'GM',
    colWidth: 110,
    col: 'totalBillAmount',
    type: 'GM',
    flexGrow: 1,
    sortable: true,
  },
  // {
  //   colName: 'Last Updated By',
  //   colWidth: 150,
  //   flexGrow: 1,
  //   col: 'latestActivityUpdatedBy',
  //   sortable: true
  // },
  {
    colName: 'Last Updated At',
    colWidth: 70,
    flexGrow: 1,
    col: 'lastModifiedDate',
    sortable: true,
    type: 'date',
    disableSearch: true,
  },
];

let status = {};
function onScrollEnd(scrollLeft, scrollTop) {
  status.scrollLeft = scrollLeft;
  status.scrollTop = scrollTop;
}

const map = {
  applied: 'Submitted to AM',
  myApplied: 'My Submitted to AM',
  submitted: 'Submitted to Client',
  mySubmitted: 'My Submitted to Client',
  interview: 'Interviews',
  myInterview: 'My Interviews',
  offered: 'Offers',
  myOffered: 'My Offers',
};

function sortData(data, sort, columnKey) {
  sort = Object.keys(sort || {}).map((key) => [key, sort[key]])[0] || ['id'];

  const sorted = data.sortBy(
    (myCandidate) => myCandidate.get(sort[0]),
    (a, b) => {
      if (
        columnKey === 'Name' ||
        columnKey === 'company' ||
        columnKey === 'jobTitle'
      ) {
        return a.localeCompare(b, 'zh-CN');
      }
      if (a < b) {
        return -((sort[1] === 'ASC') - 0.5);
      }
      if (a > b) {
        return (sort[1] === 'ASC') - 0.5;
      }
      if (a === b) {
        return 0;
      }
    }
  );
  return sorted;
}

class CountDetailDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      colSortDirs: {},
      data: this.props.detailData,
    };
  }

  // static getDerivedStateFromProps(props, state) {
  //   if (!state.data.equals(props.detailData)) {
  //     return { data:props.detailData };
  //   }
  //   return null;
  // }

  onSortChange = (columnKey, sortDir) => {
    const sort = sortDir ? { [columnKey]: sortDir } : {};
    this.setState({
      colSortDirs: sort,
      data: sortData(this.state.data, sort, columnKey),
    });
  };

  render() {
    const { onClose, chosenStatus, t } = this.props;
    return (
      <Dialog
        open={true}
        onClose={onClose}
        fullWidth={true}
        maxWidth={'md'}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{chosenStatus}</DialogTitle>
        <DialogContent style={{ width: '100%', height: '300px' }}>
          <DashboardTable
            data={this.state.data}
            colSortDirs={this.state.colSortDirs}
            onSortChange={this.onSortChange}
            onScrollEnd={onScrollEnd}
            scrollLeft={status.scrollLeft}
            scrollTop={status.scrollTop}
            columns={
              chosenStatus !== 'On Boarded' ? columns : columns_onBoarded
            }
            t={t}
          />
        </DialogContent>
        <Divider />
        <DialogActions>
          <PrimaryButton onClick={onClose}>{t('action:close')}</PrimaryButton>
        </DialogActions>
      </Dialog>
    );
  }
}

export default connect()(CountDetailDialog);
