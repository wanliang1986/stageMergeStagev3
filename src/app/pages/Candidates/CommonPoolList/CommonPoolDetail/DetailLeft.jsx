import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Scrollbars from 'react-custom-scrollbars';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Dialog from '@material-ui/core/Dialog';
import * as ActionTypes from '../../../../constants/actionTypes';

import { Link } from 'react-router-dom';
import CandidateQualification from './Qualification';
import CandidateContacts from './Contacts';

class CandidateTabs extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      selectedTab: 0,
    };
  }
  render() {
    return (
      <Paper
        className="flex-child-auto flex-container flex-dir-column"
        style={{ overflow: 'hidden', height: '100%' }}
      >
        <Tabs variant="fullWidth" indicatorColor="primary" textColor="primary">
          <div
            style={{
              width: '204px',
              textAlign: 'center',
              height: '100%',
              lineHeight: '47px',
              borderBottom: '3px solid #3598dc',
              color: '#3598dc',
              fontSize: '14px',
            }}
          >
            Qualifications
          </div>
        </Tabs>
        <Scrollbars>
          <CandidateQualification />
        </Scrollbars>
      </Paper>
    );
  }
}
// 点击unlock购买(解锁)弹出框
const UnlockDialog = (props) => {
  const { addUnlock } = props;
  const [open, setOpen] = useState(true);
  console.log('props.userBulkCredit', props.userBulkCredit);
  return (
    <div>
      <Dialog open={open}>
        <div
          style={{
            width: 421,
            height: 183,
            padding: '26px 24px 17px 24px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              marginBottom: '12px',
            }}
          >
            <div
              style={{
                fontSize: 16,
                color: '#505050',
                fontWeight: 500,
                marginBottom: '22px',
              }}
            >
              You’ve successfully unlock talent contact!
            </div>
            <div
              style={{ fontSize: 14, color: '#3398dc', marginBottom: '22px' }}
            >
              Credit balance: {props.userBulkCredit && props.userBulkCredit}{' '}
              Credit
            </div>
          </div>
          <span
            style={{
              width: '107px',
              height: '33px',
              lineHeight: '33px',
              borderRadius: '4px',
              border: 'solid 1px #3398dc',
              display: 'inline-block',
              textAlign: 'center',
              color: '#fff',
              marginRight: '8px',
              cursor: 'pointer',
              backgroundColor: '#3398dc',
            }}
            onClick={() => addUnlock(false)}
          >
            Close
          </span>
        </div>
      </Dialog>
    </div>
  );
};
// 点击添加到candidates弹框
const AddCandidates = (props) => {
  const { addUnlock, changeAddFlag } = props;
  const [open, setOpen] = useState(true);
  return (
    <div>
      <Dialog open={open}>
        <div
          style={{
            width: 421,
            height: 183,
            padding: '26px 24px 17px 24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div
              style={{
                fontSize: 16,
                color: '#505050',
                fontWeight: 500,
                marginBottom: '22px',
              }}
            >
              Successfully added to “My Candidates”!
            </div>
            <div style={{ fontSize: 14, color: '#505050' }}>
              Now you can check this candidate in “My Candidates” list and edit
              this candidate
            </div>
          </div>
          <div>
            <span
              style={{
                width: '107px',
                height: '33px',
                lineHeight: '33px',
                borderRadius: '4px',
                border: 'solid 1px #3398dc',
                display: 'inline-block',
                textAlign: 'center',
                color: '#3398dc',
                marginRight: '8px',
                cursor: 'pointer',
              }}
              onClick={() => {
                setOpen(false);
                changeAddFlag(false);
              }}
              // onClick={() => addUnlock(false)}
            >
              Close
            </span>
            <span
              style={{
                width: '166px',
                height: '33px',
                lineHeight: '33px',
                borderRadius: '4px',
                border: 'solid 1px #3398dc',
                display: 'inline-block',
                textAlign: 'center',

                marginRight: '8px',
                cursor: 'pointer',
                backgroundColor: '#3398dc',
              }}
            >
              <Link
                style={{ color: '#fff' }}
                to={`/candidates/edit/${props.candidatesid}`}
              >
                Edit Candidate
              </Link>
            </span>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

// 余额不足提示框
const LinkedInSorryDialog = (props) => {
  const { setClose, useListdata } = props;
  const [open, setOpen] = useState(true);

  return (
    <div>
      <Dialog open={open}>
        <div
          style={{ width: 421, height: 200, padding: '26px 24px 14px 24px' }}
        >
          <div
            style={{
              fontSize: 16,
              color: '#505050',
              fontWeight: 500,
              marginBottom: '12px',
            }}
          >
            You don't have enough credit to unlock talent contact
          </div>
          <div style={{ fontSize: 14, color: '#3398dc', marginBottom: '22px' }}>
            Credit balance: 0 Credit
          </div>
          <div style={{ fontSize: 14, color: '#505050', marginBottom: '12px' }}>
            Please contact the administrator to get more credit
          </div>
          <span
            style={{
              width: '107px',
              height: '33px',
              lineHeight: '33px',
              borderRadius: '4px',
              border: 'solid 1px #3398dc',
              display: 'inline-block',
              textAlign: 'center',
              color: '#fff',
              background: '#3398dc',
              cursor: 'pointer',
            }}
            onClick={() => setClose(false)}
          >
            Close
          </span>
        </div>
      </Dialog>
    </div>
  );
};
class CandidateLeft extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      unlockStatus: false,
      addCandidateStatus: false,
      userBulkCredit: '',
      candidatesId: '',
      unlockSorryStatus: false,
      addFlag: true,
    };
  }
  addUnlock = () => {
    this.setState(
      {
        unlockStatus: false,
      },
      console.log(this.state)
    );
  };
  setClose = () => {
    this.setState(
      {
        unlockSorryStatus: false,
      },
      console.log(this.state)
    );
  };
  // 余额不足弹出框的状态
  ChildSorryClick = (data) => {
    this.setState({
      unlockSorryStatus: data,
    });
  };
  // 子组件传来控制弹出框的状态
  onClicksss = (data) => {
    console.log('我是子组件传的', data);
    this.setState({
      unlockStatus: data,
    });
  };
  // 子组件传的金额
  childMoney = (data) => {
    console.log('我是子组件传的金额', data);
    this.setState({
      userBulkCredit: data,
    });
  };
  // 子组件传的id(跳转candidates时候用的)
  candidatesJumpId = (candidatesid) => {
    console.log('我是子组件传的candidatesid', candidatesid);
    this.setState({
      candidatesid: candidatesid,
    });
  };
  // 控制candidate弹框的状态
  addCandidatesStatu = (addCandidateStatus) => {
    console.log('addCandidateStatus', addCandidateStatus);
    this.setState({
      addCandidateStatus: addCandidateStatus,
    });
  };
  RequeryData = (data) => {
    console.log('我是添加后的状态============', data);
    const { dispatch } = this.props;
    dispatch({
      type: ActionTypes.ADD_REPLACE_STATUS,
      payload: data,
    });
  };
  changeAddFlag = (addFlag) => {
    this.setState({
      addFlag,
    });
  };
  render() {
    const {
      unlockStatus,
      userBulkCredit,
      candidatesid,
      addCandidateStatus,
      unlockSorryStatus,
      addFlag,
    } = this.state;
    console.log('state中的addCandidateStatus', addCandidateStatus);
    return (
      <div
        className="flex-child-auto flex-container flex-dir-column vertical-layout"
        style={{ userSelect: 'text' }}
      >
        <CandidateContacts
          childClick={this.onClicksss}
          childMoney={this.childMoney}
          candidatesJumpId={this.candidatesJumpId}
          addCandidatesStatu={this.addCandidatesStatu}
          ChildSorryClick={this.ChildSorryClick}
          RequeryData={this.RequeryData}
          addFlag={addFlag}
        />
        <CandidateTabs />
        {unlockStatus && (
          <UnlockDialog
            userBulkCredit={userBulkCredit}
            addUnlock={this.addUnlock}
          />
        )}
        {unlockSorryStatus && <LinkedInSorryDialog setClose={this.setClose} />}
        {addCandidateStatus && (
          <AddCandidates
            candidatesid={candidatesid}
            changeAddFlag={this.changeAddFlag}
          />
        )}
      </div>
    );
  }
}

// CandidateLeft.prototypes = {
//   candidateId: PropTypes.string.isRequired,
// };

const mapStateToProps = (state) => {
  // console.log(state.controller.newCandidateJob.toJS());
  // return {
  //   userBulkCredit: state.controller.newCandidateJob.toJS().userMoney,
  // };
};

export default connect(mapStateToProps)(CandidateLeft);
