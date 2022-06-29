import React from 'react';
import { connect } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
// import DialogContentText from '@material-ui/core/DialogContentText';
import DashboardTable from '../Tables/DashboardTable';
import Divider from '@material-ui/core/Divider';

import PrimaryButton from '../../../components/particial/PrimaryButton';

const columns = [
  {
    colName: 'name',
    colWidth: 155,
    col: 'fullName',
    fixed: true,
    sortable: true,
  },
  {
    colName: 'email',
    colWidth: 180,
    col: 'email',
    // flexGrow: 1
  },
  {
    colName: 'phone',
    colWidth: 115,
    col: 'phone',
  },
  // {
  //   colName: 'sourcer',
  //   colWidth: 150,
  //   col: 'sourcer'
  // },
  {
    colName: 'date',
    colWidth: 100,
    type: 'date',
    col: 'lastModifiedDate',
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
  subs: 'Submitted to Client',
  mySubmitted: 'My Submitted to Client',
  interview: 'Interviews',
  interviews: 'Interviews',
  myInterview: 'My Interviews',
  offered: 'Offers',
  myOffered: 'My Offers',
  starts: 'On Board',
};

function CountDetailDialog(props) {
  console.log('[dis', props);
  return (
    <Dialog
      open={true}
      onClose={props.onClose}
      fullWidth={true}
      maxWidth={'sm'}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{map[props.status]}</DialogTitle>
      <DialogContent style={{ width: '100%', height: '300px' }}>
        <DashboardTable
          data={props.detailData}
          onScrollEnd={onScrollEnd}
          scrollLeft={status.scrollLeft}
          scrollTop={status.scrollTop}
          columns={columns}
          t={props.t}
        />
      </DialogContent>
      <Divider />
      <DialogActions>
        <PrimaryButton onClick={props.onClose}>
          {props.t('action:close')}
        </PrimaryButton>
      </DialogActions>
    </Dialog>
  );
}

export default connect()(CountDetailDialog);
