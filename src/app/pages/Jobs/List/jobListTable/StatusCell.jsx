import React from 'react';
import { ADD_MESSAGE } from '../../../../constants/actionTypes';
import { connect } from 'react-redux';
import { changeStatus } from '../../../../../apn-sdk/newSearch';
import withStyles from '@material-ui/core/styles/withStyles';
import { jobStatus, ipgJobStatusObj } from '../../../../constants/formOptions';
import clsx from 'clsx';
import Popover from '@material-ui/core/Popover';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import EditIcon from '@material-ui/icons/Edit';

import Loading from '../../../../components/particial/Loading';

import MyDialog from '../../../../components/Dialog/myDialog';
import * as apnSDK from '../../../../../apn-sdk';
import { showErrorMessage } from '../../../../actions';
const statusLabels = jobStatus.reduce((res, v) => {
  res[v.value] = v.label;
  return res;
}, {});
const style = {
  title: {
    display: 'block',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  loading: {
    '& .root': {
      padding: 0,
      height: '30px !important',
    },
    '& .MuiCircularProgress-root': {
      height: '30px !important',
      width: '30px !important',
    },
    '& .container-padding': {
      height: '30px !important',
    },
  },
  statusBtn: {
    padding: '1px 4px',
    borderRadius: '10.5px',
    color: '#fff',
    // backgroundColor: '#3398dc',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    width: 100,
    margin: 'auto',
    marginTop: '8px',
  },
};
class StatusCell extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      anchorEl: null,
      status: props.data && props.data.status,
      loading: false,

      // about ipg job
      showIpgJobConfirm: false,
      checkedStatus: null,
    };
  }

  handleClosePop = () => {
    this.setState({
      open: false,
      anchorEl: null,
    });
  };

  handleOpen = (e) => {
    this.setState({
      open: true,
      anchorEl: e.currentTarget,
    });
  };

  changeJobStatus = (value, type) => {
    const { status } = this.state;
    this.setState({
      status: value,
      open: false,
      anchorEl: null,
      loading: true,
    });

    changeStatus(this.props.data.id, value)
      .then((res) => {
        console.log('changeStatus_res::::', res);
        this.setState({
          status: value,
        });

        if (type === 'change_ipg_job_status') {
          // close ipg job 状态
          this.changeIpgJobStatus(value, res);
        } else {
          this.props.updateStatus(this.props.data.id, value);
        }
      })
      .catch((err) => {
        this.setState({
          status: status,
          open: false,
          anchorEl: null,
        });
        if (err?.message) {
          this.props.dispatch({
            type: ADD_MESSAGE,
            message: {
              message: err.message,
              type: 'error',
            },
          });
        }
      })
      .finally(() => {
        this.setState({
          showIpgJobConfirm: false,
          loading: false,
        });
      });
  };

  changeIpgJobStatus = (value, { response }) => {
    console.log('jobStatus::::', value);
    console.log('uptedJob::::', response);
    apnSDK
      .closeJob_Ipg(response.id)
      .then((res) => {
        // 关闭ipg job 成功后 需要去给AM发邮箱
        this.props.updateStatus(this.props.data.id, value);
        // console.log('关闭ipg job 成功后 需要去给AM发邮箱');
        this.ipgJobSendEmailToAm(response);
      })
      .catch((err) => {
        this.props.dispatch(showErrorMessage(err));
        throw err;
      });
  };

  ipgJobSendEmailToAm = (uptedJob) => {
    console.log('ipgJobSendEmailToAm::::', uptedJob);
    const from = this.props.currentUser.get('email');
    const AM_Index = uptedJob.assignedUsers?.findIndex(
      (user) => user.permission === 'AM'
    );
    const AM = uptedJob.assignedUsers[AM_Index];

    const to = AM?.email;
    const content = `
        <p>Hi ${AM?.firstName} ${AM?.lastName},</p>
        <p>${uptedJob.title}(${uptedJob.id}) has been taken down from IPG website job posting page because its status in APN has changed to CLOSE. If you wish to re-post this job, please go to job detail page in APN and change job status back to OPEN or REOPEN.</p>
        <p>Thank you,<br />APN Development Team</p>
    `;
    // console.log('from::::', from);
    // console.log('AM::::', AM);
    // console.log('to::::', to);
    // console.log('content:::', content);
    apnSDK.sendEmail(from, to, null, null, null, content, null).catch((err) => {
      this.props.dispatch(showErrorMessage(err));
    });
  };

  handleSelect = (value) => {
    const { published, title, id, type } = this.props.data;
    // 只有关闭ipg job close的时候 才会去触发confirm
    // 触发条件有4个
    // 1.当前的job类型为fte或者contract时
    // 2.当前的ipgjob 跟操作的ipg状态类型不同(OPEN,CLOSE)
    // 3.当前的ipgJob为open状态
    // 4.当前操作的ipgjob状态为close
    let newIpgJobStatus = ipgJobStatusObj[value];
    console.log(newIpgJobStatus);
    if (type === 'FULL_TIME' || type === 'CONTRACT') {
      if (published && newIpgJobStatus === 'CLOSE') {
        // 需要confirm
        // confirm('需要关闭ipg job');
        this.setState({
          checkedStatus: value,
          showIpgJobConfirm: true,
        });
      } else {
        // 不需要confirm 直接改变job status
        this.changeJobStatus(value, 'change_job_status');
      }
    }

    return;
  };

  ipgJobConfirm = () => {
    console.log('confirm ok =>  1. change job status 2.curl close ipgjob');
    this.changeJobStatus(this.state.checkedStatus, 'change_ipg_job_status');
  };
  getColor = () => {
    const { status } = this.state;
    switch (status) {
      case 'OPEN':
        return '#3398DC';
        break;
      case 'REOPENED':
        return '#21B66E';
        break;
      case 'FILLED':
        return '#F56D50';
        break;
      case 'CLOSED':
      case 'CANCELLED':
        return '#BDBDBD';
        break;
      case 'ONHOLD':
        return '#FDAB29';
        break;
      default:
        return '#3398DC';
        break;
    }
  };

  render() {
    const { classes, data } = this.props;
    const { anchorEl, open, status, loading, showIpgJobConfirm } = this.state;
    if (loading) {
      return (
        <div
          className={classes.loading}
          style={{ width: '100%', height: '30px' }}
        >
          <Loading />
        </div>
      );
    }
    if (!status) {
      return <span />;
    }
    return (
      <div>
        <div
          onClick={this.handleOpen}
          className={classes.statusBtn}
          style={{
            backgroundColor: this.getColor(),
          }}
        >
          <p style={{ marginRight: 4 }}>{statusLabels[status] || status}</p>
          <EditIcon style={{ color: '#fff', fontSize: 15 }} />
        </div>
        <Popover
          open={open}
          anchorEl={anchorEl}
          anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
          transformOrigin={{ horizontal: 'left', vertical: 'top' }}
          onClose={this.handleClosePop}
        >
          <MenuList dense>
            {jobStatus
              .filter((_item) => _item.value !== status && !_item.disabled)
              .map((item) => {
                return (
                  <MenuItem
                    dense
                    key={item.value}
                    onClick={() => this.handleSelect(item.value)}
                  >
                    {item.label}
                  </MenuItem>
                );
              })}
          </MenuList>
        </Popover>

        {/* change ipg job status dialog */}
        <MyDialog
          show={showIpgJobConfirm}
          modalTitle={'Job Status'}
          CancelBtnMsg={'Cancel'}
          SubmitBtnMsg={'Confirm'}
          CancelBtnShow={true}
          SubmitBtnShow={true}
          handleClose={() => this.setState({ showIpgJobConfirm: false })}
          primary={this.ipgJobConfirm}
        >
          <p style={{ width: 500 }}>
            This job is currently posted on IPG website. We will take down this
            job from IPG website once you change the job status.
          </p>
        </MyDialog>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    currentUser: state.controller.currentUser,
  };
};

export default connect(mapStateToProps)(withStyles(style)(StatusCell));
