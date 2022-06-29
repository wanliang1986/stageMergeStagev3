import React from 'react';
import * as ActionTypes from '../../../../constants/actionTypes';
import * as Colors from '../../../../styles/Colors';
import * as apnSDK from '../../../../../apn-sdk';

import { withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import moment from 'moment-timezone';
import { connect } from 'react-redux';
import { externalUrl, formatUserName } from '../../../../../utils';
import { changeSearchFlag } from '../../../../actions/newCandidate';
import { addUnlock } from '../../../../actions/newCandidate';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import ButtonBase from '@material-ui/core/ButtonBase';
import Avatar from '@material-ui/core/Avatar';
import Paper from '@material-ui/core/Paper';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar';
import Person from '@material-ui/icons/Person';
import EditIcon from '@material-ui/icons/Edit';
import Mail from '@material-ui/icons/Mail';
import Phone from '@material-ui/icons/Phone';
import Error from '@material-ui/icons/Error';
import JobIcon from '@material-ui/icons/Work';
import HotlistIcon from '@material-ui/icons/Whatshot';
import Message from '@material-ui/icons/Message';
import HomeIcon from '@material-ui/icons/Home';
import AddBoxIcon from '@material-ui/icons/AddBox';
import LockIcon from '@material-ui/icons/Lock';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import { WeChat, LinkedIn, Facebook } from '../../../../components/Icons';

const styles = {
  root: {
    padding: 12,
    position: 'relative',
    '& .MuiSnackbar-root .MuiPaper-root': {
      backgroundColor: 'red',
      color: 'white',
    },
  },
  avatar: {
    backgroundColor: Colors.SILVER,
    color: Colors.GRAY,
    width: 80,
    height: 80,
    marginRight: 16,
  },
  avatarIcon: {
    fontSize: 50,
  },

  largeIcon: {
    // width: 28, height: 28
  },
  iconButton: {
    padding: 6,
  },
  itemContainer: {
    display: 'flex',
    alignItems: 'center',
    marginTop: 4,
    '&:first-child': {
      marginTop: 4,
    },
    '& > *:first-child': {
      fontSize: 20,
      marginRight: 8,
    },
  },
  error: {
    color: 'red',
  },
  workStatus: {
    color: '#3398dc',
    backgroundColor: 'rgba(51, 152, 220,0.2)',
    padding: '2px 16px 2px 12px',
    fontSize: 12,
    borderRadius: '12px',
    lineHeight: '24px',
  },
};

class CandidateContacts extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      jobOpen: false,
      hotlistOpen: false,
      loadError: false,
      openJobList: false,
      phoneCallOpen: false,
      unLockStatu: true,
      addCandidateStatu: true,
      addStatu: false,
      unLockSorryStatu: true,
      open: false,
      errmsg: '',
    };
  }
  // 点击添加图标添加到candidates
  addMyCandidates = () => {
    const {
      dispatch,
      commonPoolDetailData,
      creditTransactionId,
      candidatesJumpId,
      addCandidatesStatu,
      RequeryData,
      commonPoolStatus,
    } = this.props;

    // commonPoolDetailData.creditTransactionId = creditTransactionId;
    return apnSDK
      .commonPoolAddCandidates(commonPoolDetailData)
      .then((res) => {
        if (res) {
          let { response } = res;
          // RequeryData(response);
          console.log('我是添加candidates的接口', res);
          candidatesJumpId(response.id);
          addCandidatesStatu(this.state.addCandidateStatu);
          RequeryData(response.purchased);
          dispatch({
            type: ActionTypes.ADD_REPLACE_STATUS,
            payload: false,
          });
          // let obj = {
          //   emailStatus: commonPoolStatus,
          //   id: commonPoolDetailData.esId,
          // };
          return apnSDK
            .getCommonDetail(encodeURIComponent(commonPoolDetailData.esId))
            .then((res) => {
              console.log('重新查询详情数据成功后的res======', res);
              let { response } = res;
              // RequeryData(response);
            });
        }
      })
      .catch((err) => {
        console.log(err);
        this.setState({
          open: true,
          errmsg: err.message,
        });
        setTimeout(() => {
          this.setState({
            open: false,
          });
        }, 2000);
      });
  };
  // 点击购买图标
  unlockPurchase = () => {
    const {
      dispatch,
      commonPoolDetailData,
      childClick,
      childMoney,
      ChildSorryClick,
      commonPoolStatus,
    } = this.props;
    let unlockObj = {
      // emailStatus: commonPoolStatus,
      profileId: commonPoolDetailData.esId,
    };

    return apnSDK
      .commonPoolAddUnlock(unlockObj)
      .then((res) => {
        if (res) {
          let { response } = res;
          this.setState({
            addStatu: true,
          });
          // 保存id，点击candidates的时候需要用到这个id
          dispatch({
            type: ActionTypes.CREDIT_TRAN_SACTION_ID,
            payload: response.id,
          });
          dispatch({
            type: ActionTypes.ADD_REPLACE_STATUS,
            payload: true,
          });
          // dispatch(addUnlock(commonPoolDetailData.esId));
          childClick(this.state.unLockStatu); //呼出弹框
          // 查询余额
          return apnSDK.getUserAccount().then((res) => {
            if (res) {
              let { response } = res;
              // 余额传到父组件渲染弹框中
              let bulkCredit =
                response.monthlyCredit +
                response.bulkCredit -
                response.usedBulkCredit -
                response.usedMonthlyCredit;
              childMoney(bulkCredit);
              // let obj = {
              //   emailStatus: commonPoolStatus,
              //   id: commonPoolDetailData.esId,
              // };
              // 成功时重新查询详情数据
              return apnSDK
                .getCommonDetail(encodeURIComponent(commonPoolDetailData.esId))
                .then((res) => {
                  console.log('重新查询详情数据成功后的res======', res);
                  if (res) {
                    let { response } = res;
                    dispatch({
                      type: ActionTypes.COMMON_POOL_DETAIL,
                      payload: response,
                    });
                  }
                });
            }
          });
        }
      })
      .catch((err) => {
        ChildSorryClick(this.state.unLockSorryStatu);
      });
  };
  componentWillMount() {
    // if (
    //   this.props.commonPoolDetailData &&
    //   this.props.commonPoolDetailData.purchased
    // ) {
    //   this.props.dispatch({
    //     type: ActionTypes.ADD_REPLACE_STATUS,
    //     payload: true,
    //   });
    // } else {
    //   this.props.dispatch({
    //     type: ActionTypes.ADD_REPLACE_STATUS,
    //     payload: false,
    //   });
    // }
  }
  // componentWillUnmount() {
  //   this.props.dispatch({
  //     type: ActionTypes.ADD_REPLACE_STATUS,
  //     payload: false,
  //   });
  // }
  // 点击linkeIn链接跳转
  JumpLinkeIn = (item) => {
    const { commonPoolDetailData } = this.props;
    if (commonPoolDetailData && commonPoolDetailData.purchased) {
      const w = window.open('about:blank');
      w.location.href = item.details;
    }
  };
  render() {
    const {
      classes,
      commonPoolDetailData,
      detailTenlentId,
      detailFlag,
      creditTransactionId,
      addFlag,
    } = this.props;
    const { addStatu, open, errmsg } = this.state;
    let phoneArr = [];
    let phoneText = [];
    let emailArr = [];
    let emailText = [];
    let linkedArr = [];
    commonPoolDetailData &&
      commonPoolDetailData.contacts &&
      commonPoolDetailData.contacts.map((val) => {
        if (val.type === 'PHONE') {
          phoneArr.push(val.contact);
        }
        if (val.type === 'EMAIL') {
          emailArr.push(val.contact);
        }
        if (val.type === 'LINKEDIN') {
          linkedArr.push(val);
        }
      });

    emailText.push(emailArr.join(','));
    phoneText.push(phoneArr.join(','));
    return (
      <Paper className={classes.root}>
        <div className="flex-container">
          <div className="">
            <Avatar className={classes.avatar}>
              <Person className={classes.avatarIcon} />
            </Avatar>
          </div>
          <div
            className="flex-child-auto flex-dir-column"
            style={{ overflow: 'hidden' }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Typography
                variant="h6"
                style={{ textTransform: 'capitalize', marginRight: '16px' }}
              >
                {commonPoolDetailData && commonPoolDetailData.fullName}
              </Typography>
              <Typography>
                <span style={{ marginRight: '5px' }}>
                  {commonPoolDetailData && commonPoolDetailData.purchased ? (
                    commonPoolDetailData.id ? (
                      <AddBoxIcon
                        style={{ color: '#a0a0a0', cursor: 'pointer' }}
                      ></AddBoxIcon>
                    ) : addFlag ? (
                      <Tooltip title={'Add to “My Candidates”'}>
                        <AddBoxIcon
                          onClick={this.addMyCandidates}
                          style={{ color: '#3598dc', cursor: 'pointer' }}
                        ></AddBoxIcon>
                      </Tooltip>
                    ) : (
                      <AddBoxIcon
                        style={{ color: '#a0a0a0', cursor: 'pointer' }}
                      ></AddBoxIcon>
                    )
                  ) : (
                    <AddBoxIcon
                      style={{ color: '#a0a0a0', cursor: 'pointer' }}
                    ></AddBoxIcon>
                  )}
                </span>
                <span>
                  {commonPoolDetailData && commonPoolDetailData.purchased ? (
                    <LockOpenIcon
                      style={{ color: '#a0a0a0', cursor: 'pointer' }}
                    ></LockOpenIcon>
                  ) : (
                    <Tooltip title={'Unlock Talent Contact 1 Credit Cost'}>
                      <LockIcon
                        onClick={this.unlockPurchase}
                        style={{ color: '#3598dc', cursor: 'pointer' }}
                      ></LockIcon>
                    </Tooltip>
                  )}
                </span>
              </Typography>
            </div>
            <div className={classes.itemContainer}>
              <Mail />
              {emailText &&
                emailText.map((item) => {
                  return (
                    <div style={{ width: '85%' }}>
                      <Tooltip title={item}>
                        <Typography
                          style={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {item}
                        </Typography>
                      </Tooltip>
                    </div>
                  );
                })}
            </div>
            <div className={classes.itemContainer}>
              <Phone />
              {phoneText &&
                phoneText.map((item) => {
                  return (
                    <div style={{ width: '85%' }}>
                      <Tooltip title={item}>
                        <Typography
                          style={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {item}
                        </Typography>
                      </Tooltip>
                    </div>
                  );
                })}
            </div>
            <div>
              {linkedArr &&
                linkedArr.map((item) => {
                  return (
                    <div
                      className={classes.itemContainer}
                      style={{ width: '85%' }}
                    >
                      <LinkedIn
                        style={{
                          width: 16,
                          verticalAlign: 'middle',
                          marginLeft: '2px',
                        }}
                        htmlColor={'#0d77b7'}
                      />
                      <Tooltip title={item.contact}>
                        <Typography
                          style={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            cursor: 'pointer',
                          }}
                          onClick={() => this.JumpLinkeIn(item)}
                        >
                          {item.contact}
                        </Typography>
                      </Tooltip>
                      &nbsp;&nbsp;
                    </div>
                  );
                })}
            </div>
            {/* {commonPoolDetailData &&
              commonPoolDetailData.contacts.map((item) => {
                if (item.type === 'PHONE') {
                  return (
                    <div
                      className={classes.itemContainer}
                      style={{ width: '85%' }}
                    >
                      <Phone />
                      <Tooltip title={item.contact}>
                        <Typography
                          style={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {item.contact}
                        </Typography>
                      </Tooltip>
                      &nbsp;&nbsp;
                    </div>
                  );
                }
                
                if (item.type === 'EMAIL') {
                  return (
                    <div
                      className={classes.itemContainer}
                      style={{ width: '85%' }}
                    >
                      <Mail />
                      <Tooltip title={item.contact}>
                        <Typography
                          style={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {item.contact}
                        </Typography>
                      </Tooltip>
                      &nbsp;&nbsp;
                    </div>
                  );
                }
                if (item.type === 'LINKEDIN') {
                  return (
                    <div
                      className={classes.itemContainer}
                      style={{ width: '85%' }}
                    >
                      <LinkedIn
                        style={{ width: 16, verticalAlign: 'middle' }}
                        htmlColor={'#0d77b7'}
                      />
                      <Tooltip title={item.contact}>
                        <Typography
                          style={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            cursor: 'pointer',
                          }}
                          onClick={() => this.JumpLinkeIn(item)}
                        >
                          {item.contact}
                        </Typography>
                      </Tooltip>
                      &nbsp;&nbsp;
                    </div>
                  );
                }
              })} */}
          </div>
          <Snackbar open={open} message={errmsg} />
        </div>
      </Paper>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    commonPoolDetailData:
      state.controller.newCandidateJob.toJS().commonPoolDetail &&
      state.controller.newCandidateJob.toJS().commonPoolDetail,
    creditTransactionId:
      state.controller.newCandidateJob.toJS().creditTransactionId,
    detailTenlentId:
      state.controller.newCandidateJob.toJS().addCommonPoolDataTelentId,
    commonPoolStatus:
      state.controller.newCandidateJob.toJS().addCommonPoolEmailStatus,
    detailFlag: state.controller.newCandidateJob.toJS().statusFlag,
  };
};

export default connect(mapStateToProps)(withStyles(styles)(CandidateContacts));
