import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { Link, Prompt } from 'react-router-dom';
import Stepper from '@material-ui/core/Stepper';
import Divider from '@material-ui/core/Divider';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import PrimaryButton from './particial/PrimaryButton';
import SubmitToClient from './newApplication/submitToClient';
import SubmitToInterview from './newApplication/submitToInterview';
import SubmitToOffer from './newApplication/submitToOffer';
import SubmitToPerformance from './newApplication/submitToPerformance';
import SubmitToOnBoard from './newApplication/submitToOnboard';
import Grow from '@material-ui/core/Grow';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import Paper from '@material-ui/core/Paper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import Typography from '@material-ui/core/Typography';
import moment from 'moment-timezone';
import {
  userTypeForCommission as userTypeOptions,
  currency as currencyOptions,
  payRateUnitTypes,
  ApplicationRejected,
} from '../constants/formOptions';
import FeeItemizations from './newApplication/form/feeItemizations';
import FeeItemizationsFte from './newApplication/form/feeItemizationsFte';
import SubmitToJobDetail from './newApplication/component/DetailJob';
import SubmitClientDetail from './newApplication/component/DetailClient';
import SubmitInterviewDetail from './newApplication/component/DetailInterview';
import SubmitOfferDetail from './newApplication/component/DetailOffer';
import SubmitOfferAcceptDetail from './newApplication/component/DetailOfferAccept';
import SubmitOnBoardDetail from './newApplication/component/DetailOnBoard';
import EliminateDetail from './newApplication/component/DetailEliminate';
import SubmitCommissionDetail from './newApplication/component/DetailOfferCommission';
import Eliminate from './newApplication/form/eliminate';
import { updateCancelElimanateApplication } from '../actions/applicationActions';
import { getActiveStartListByTalent } from '../selectors/startSelector';
import { showErrorMessage } from '../actions';

const Steps = ['推荐至职位', '推荐至客户', '面试', 'Offer', '业绩分配', '入职'];
const IPGSteps = [
  '推荐至职位',
  '推荐至客户',
  '面试',
  'Offer',
  '接受Offer',
  '入职',
];

const styles = {
  root: {
    width: '100%',
  },
  flexBtn: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  projectName: {
    height: 32,
  },
  projectNum: {
    backgroundColor: 'rgba(24,144,255,0.05)',
    color: '#1890ff',
    border: '1px solid #1890ff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 32,
    width: 32,
  },
  processBtn: {
    minWidth: 280,
  },
  eliminateBtn: {
    minWidth: 140,
    color: '#ef4529',
    border: '1px solid #ef4529 !important',
  },
  processTime: {
    color: 'rgba(0,0,0,0.3)',
    cursor: 'pointer',
  },
  eliminateTitle: {
    color: '#ef4529',
    marginBottom: 10,
  },
  eliminateBg: {
    marginTop: 20,
    backgroundColor: '#f5f5f5',
    padding: '8px 10px',
  },
  marginTitle: {
    marginRight: 30,
  },
};

class ApplicationStepper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeStep: 1,
      open: false,
      clientFormOpen: false,
      interviewFormOpen: false,
      offerFormOpen: false,
      resultFormOpen: false,
      onboardFormOpen: false,
      rejectedFormOpen: false,
      rejectedStatus: null,
      processing: false,
      feeOpen: false,
      feeOpenFte: false,
    };
  }

  // 取流程的label
  getApplicationLabel = (position) => {
    let str = '提交至职位';
    if (position === 'SUBMIT_TO_CLIENT') {
      str = '推荐至客户';
    } else if (position === 'INTERVIEW') {
      str = '面试';
    } else if (position === 'OFFER') {
      str = 'Offer';
    } else if (position === 'OFFER_ACCEPT') {
      str = '接受offer';
    } else if (position === 'COMMISSION') {
      str = '业绩分配';
    } else if (position === 'ON_BOARD') {
      str = '入职';
    } else if (position === 'ELIMINATE') {
      str = '已淘汰';
    }
    return str;
  };

  componentDidMount() {
    const { dispatch, application } = this.props;
    let nodeTypeArr = application
      .get('talentRecruitmentProcessNodes')
      .toJS()
      .filter((item) => item.nodeStatus === 'ACTIVE');
    let nodeTypeLastArr = application
      .get('talentRecruitmentProcessNodes')
      .toJS()
      .filter((item) => item.nodeType === 'ON_BOARD');
    let nodeTypeEliminateArr = application
      .get('talentRecruitmentProcessNodes')
      .toJS()
      .filter((item) => item.nodeStatus === 'ELIMINATED');
    let nodeType;
    // nodeTypeArr存在代表还有流程状态没走完，不存在则代表走完所有流程，在入职阶段
    if (nodeTypeEliminateArr && nodeTypeEliminateArr.length > 0) {
      nodeType = nodeTypeEliminateArr[0].nodeType;
    } else if (nodeTypeArr && nodeTypeArr.length > 0) {
      nodeType = nodeTypeArr[0].nodeType;
    } else {
      nodeType = nodeTypeLastArr[0].nodeType;
    }
    switch (nodeType) {
      case 'SUBMIT_TO_JOB':
        this.changeActiveStep(1);
        break;
      case 'SUBMIT_TO_CLIENT':
        this.changeActiveStep(2);
        break;
      case 'INTERVIEW':
        this.changeActiveStep(3);
        break;
      case 'OFFER':
        this.changeActiveStep(4);
        break;
      case 'OFFER_ACCEPT':
      case 'COMMISSION':
        this.changeActiveStep(5);
        break;
      case 'ON_BOARD':
        this.changeActiveStep(6);
        break;
    }
    this.handleNextBtn();
  }

  handleNext = (e) => {
    e.stopPropagation();
    const { activeStep } = this.state;
    if (activeStep === 1) {
      this.setState({
        clientFormOpen: true,
      });
    } else if (activeStep === 2) {
      this.setState({
        interviewFormOpen: true,
      });
    } else if (activeStep === 3) {
      this.setState({
        offerFormOpen: true,
      });
    } else if (activeStep === 4) {
      this.setState({
        resultFormOpen: true,
      });
    } else if (activeStep === 5 || activeStep === 6) {
      this.setState({
        onboardFormOpen: true,
      });
    }
  };

  changeActiveStep = (num) => {
    this.setState({
      activeStep: num,
    });
  };

  handleClose = (key) => () => {
    this.setState({ [key]: false });
    // 清空面试轮次信息
    this.props.dispatch({
      type: 'EDIT_INTERVIEW_INDEX',
      payload: null,
    });
    this.props.dispatch({
      type: 'APPLICATION_EDITFLAG',
      payload: false,
    });
  };

  handleNextBtn = (versionsFlag) => {
    let str = '推荐至客户';
    const { activeStep } = this.state;
    if (activeStep === 1) {
      str = '推荐至客户';
    } else if (activeStep === 2) {
      str = '面试';
    } else if (activeStep === 3) {
      str = 'Offer';
    } else if (activeStep === 4) {
      if (versionsFlag) {
        str = '业绩分配';
      } else {
        str = '接受offer';
      }
    } else if (activeStep === 5) {
      str = '入职';
    } else if (activeStep === 6) {
      str = '更新入职信息';
    }
    return str;
  };

  handOpenFee = (key, value) => {
    this.setState({ [key]: value });
  };

  handleOpenEditDialog = (key) => () => {
    this.setState({ [key]: true });
  };
  // 获取拒绝状态的label
  getRejectedLabel = (commision) => {
    let str = ApplicationRejected.filter((item) => item.value === commision);
    str = str[0] ? str[0].label : 'N/A';
    return str;
  };

  // 拒绝候选人
  eleminateTalent = (item) => {
    this.setState({
      rejectedFormOpen: true,
      rejectedStatus: item.value,
    });
  };

  // 取消淘汰该候选人
  cancelEliminate = () => {
    const { dispatch, application } = this.props;
    this.setState({
      processing: true,
    });
    dispatch(
      updateCancelElimanateApplication(
        application.getIn(['submitToJob', 'talentRecruitmentProcessId'])
      )
    )
      .then((newApplication) => {
        // cancelAddActivity();
        // dispatch(
        //   updateDashboardApplStatus(newApplication.id, newApplication.status)
        // );
        this.setState({
          processing: false,
        });
        dispatch({ type: 'UPDATE_DB_DATA' });
      })
      .catch((err) => {
        this.setState({
          processing: false,
        });
        dispatch(showErrorMessage(err));
      });
  };

  render() {
    const {
      activeStep,
      clientFormOpen,
      interviewFormOpen,
      offerFormOpen,
      resultFormOpen,
      onboardFormOpen,
      rejectedFormOpen,
      anchorEl,
      open,
      processing,
      interviewAnchorEl,
      interviewOpen,
      feeOpen,
      feeOpenFte,
    } = this.state;
    const { classes, t, application, job, candidate, hasActiveStart } =
      this.props;
    const InterviewArr = application.get('interviews')
      ? application.get('interviews').toJS()
      : [];
    const talentRecruitmentProcessNodes = application.get(
      'talentRecruitmentProcessNodes'
    )
      ? application.get('talentRecruitmentProcessNodes').toJS()
      : [];
    // 获取是在哪一步淘汰候选人
    let RejectedArr =
      talentRecruitmentProcessNodes &&
      talentRecruitmentProcessNodes.filter((item) => {
        return item.nodeStatus === 'ELIMINATED';
      });
    const versionsFlag = application
      .get('talentRecruitmentProcessNodes')
      .toJS()
      .some((x) => {
        return x.nodeType === 'COMMISSION';
      });
    return (
      <div className={classes.root} key={application.get('id')}>
        {/* 区分是否被淘汰 */}
        {application.get('eliminate').size !== 0 ? (
          <div className={classes.eliminateBg}>
            <Typography className={classes.eliminateTitle}>
              {'已淘汰 - '}
              {this.getRejectedLabel(
                application.getIn(['eliminate', 'reason'])
              )}
            </Typography>
            <div className={classes.flexBtn}>
              <div className="row expanded small-8">
                <div className={classes.marginTitle}>
                  <Typography>{'原因'}</Typography>
                </div>
                <div>
                  <Typography>
                    {application.getIn(['eliminate', 'note'])}
                  </Typography>
                </div>
              </div>
              <div
                className="columns small-4"
                style={{ display: 'flex', justifyContent: 'flex-end' }}
              >
                <PrimaryButton
                  processing={processing}
                  onClick={this.cancelEliminate}
                  disabled={!!hasActiveStart}
                  style={
                    !hasActiveStart
                      ? {
                          cursor: 'pointer',
                          color: '#1890ff',
                          textAlign: 'right',
                          backgroundColor: '#f5f5f5',
                        }
                      : {
                          textAlign: 'right',
                          backgroundColor: '#f5f5f5',
                        }
                  }
                >
                  {'取消淘汰'}
                </PrimaryButton>
              </div>
            </div>
            <div className="row expanded small-8">
              <div className={classes.marginTitle}>
                <Typography>{'阶段'}</Typography>
              </div>
              <div>
                <Typography>
                  {RejectedArr &&
                    this.getApplicationLabel(RejectedArr[0].nodeType)}
                </Typography>
              </div>
            </div>
          </div>
        ) : (
          <>
            <Stepper activeStep={activeStep} alternativeLabel>
              {versionsFlag
                ? Steps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))
                : IPGSteps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
            </Stepper>
            <div className={classes.flexBtn}>
              {/* 面试阶段可以多轮 */}
              {activeStep === 3 &&
              application.get('interviews') &&
              application.get('interviews').size < 12 ? (
                <>
                  <ButtonGroup
                    disableElevation
                    variant="contained"
                    aria-label="split button"
                  >
                    <PrimaryButton
                      className={classes.processBtn}
                      onClick={this.handleNext}
                    >
                      {'下一步：'}
                      {this.handleNextBtn(versionsFlag)}
                    </PrimaryButton>
                    <Button
                      variant="outlined"
                      size="small"
                      aria-label="select merge strategy"
                      aria-haspopup="menu"
                      onClick={(e) =>
                        this.setState({
                          interviewAnchorEl: e.currentTarget.parentElement,
                          interviewOpen: true,
                        })
                      }
                    >
                      <ArrowDropDownIcon fontSize="small" />
                    </Button>
                  </ButtonGroup>
                </>
              ) : (
                <PrimaryButton
                  onClick={this.handleNext}
                  className={classes.processBtn}
                  disabled={activeStep === 5 && hasActiveStart}
                >
                  {'下一步：'}
                  {this.handleNextBtn(versionsFlag)}
                </PrimaryButton>
              )}

              <ButtonGroup
                disableElevation
                variant="contained"
                aria-label="split button"
              >
                <Button
                  variant="outlined"
                  className={classes.eliminateBtn}
                  onClick={(e) =>
                    this.setState({
                      anchorEl: e.currentTarget.parentElement,
                      open: true,
                    })
                  }
                >
                  {'淘汰'}
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  style={{
                    padding: '0 4px',
                    minWidth: 0,
                    color: '#ef4529',
                    border: '1px solid #ef4529',
                  }}
                  aria-label="select merge strategy"
                  aria-haspopup="menu"
                  onClick={(e) =>
                    this.setState({
                      anchorEl: e.currentTarget.parentElement,
                      open: true,
                    })
                  }
                >
                  <ArrowDropDownIcon fontSize="small" />
                </Button>
              </ButtonGroup>
              <Popper
                open={open}
                anchorEl={anchorEl}
                transition
                placement={'bottom-start'}
              >
                {({ TransitionProps, placement }) => (
                  <Grow {...TransitionProps}>
                    <Paper elevation={2}>
                      <ClickAwayListener
                        onClickAway={() => this.setState({ open: false })}
                      >
                        <MenuList dense disablePadding style={{ width: 200 }}>
                          {ApplicationRejected.map((item) => {
                            return (
                              <MenuItem
                                onClick={() => {
                                  this.eleminateTalent(item);
                                }}
                                key={item.label}
                              >
                                {item.label}
                              </MenuItem>
                            );
                          })}
                        </MenuList>
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                )}
              </Popper>
              <Popper
                open={interviewOpen}
                anchorEl={interviewAnchorEl}
                transition
                placement={'bottom-end'}
              >
                {({ TransitionProps, placement }) => (
                  <Grow {...TransitionProps}>
                    <Paper elevation={2}>
                      <ClickAwayListener
                        onClickAway={() =>
                          this.setState({ interviewOpen: false })
                        }
                      >
                        <MenuList
                          dense
                          disablePadding
                          style={{
                            width: 280,
                            height: 36,
                            display: 'flex',
                            justifyContent: 'center',
                          }}
                        >
                          <MenuItem
                            onClick={() => {
                              this.setState({
                                interviewFormOpen: true,
                              });
                            }}
                            style={{ width: '100%' }}
                          >
                            {'面试'}
                          </MenuItem>
                        </MenuList>
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                )}
              </Popper>
            </div>
          </>
        )}

        <ButtonGroup
          aria-label="small outlined button group"
          style={{ width: '100%', marginTop: 14, marginBottom: 14 }}
        >
          <Button style={{ width: '100%' }}>
            <MailOutlineIcon fontSize="small" />
            &nbsp;{'邮件候选人'}
          </Button>
        </ButtonGroup>

        <Typography style={{ fontWeight: 600, margin: '12px auto' }}>
          {'流程事件'}
        </Typography>

        <EliminateDetail application={application} />

        <SubmitOnBoardDetail
          application={application}
          handleOpenEditDialog={this.handleOpenEditDialog('onboardFormOpen')}
        />

        <SubmitOfferAcceptDetail
          application={application}
          handleOpenEditDialog={this.handleOpenEditDialog('resultFormOpen')}
        />

        <SubmitCommissionDetail
          application={application}
          handleOpenEditDialog={this.handleOpenEditDialog('resultFormOpen')}
        />

        <SubmitOfferDetail
          application={application}
          handleOpenEditDialog={this.handleOpenEditDialog('offerFormOpen')}
        />
        {InterviewArr &&
          InterviewArr.map((item, index) => {
            return (
              <SubmitInterviewDetail
                item={item}
                application={application}
                index={index}
                handleOpenEditDialog={this.handleOpenEditDialog(
                  'interviewFormOpen'
                )}
              />
            );
          })}
        <SubmitClientDetail
          application={application}
          handleOpenEditDialog={this.handleOpenEditDialog('clientFormOpen')}
        />
        <SubmitToJobDetail application={application} />

        {/* 流程弹出框表单 */}
        {/* 提交至客户 */}
        <Dialog open={clientFormOpen} fullWidth maxWidth="md">
          <SubmitToClient
            handleRequestClose={this.handleClose('clientFormOpen')}
            changeActiveStep={this.changeActiveStep}
            application={application}
            t={t}
          />
        </Dialog>
        {/* 面试 */}
        <Dialog open={interviewFormOpen} fullWidth maxWidth="md">
          <SubmitToInterview
            handleRequestClose={this.handleClose('interviewFormOpen')}
            changeActiveStep={this.changeActiveStep}
            application={application}
            t={t}
          />
        </Dialog>
        {/* offer */}
        <Dialog open={offerFormOpen} fullWidth maxWidth="md">
          <SubmitToOffer
            handleRequestClose={this.handleClose('offerFormOpen')}
            changeActiveStep={this.changeActiveStep}
            handOpenFee={this.handOpenFee}
            application={application}
            t={t}
          />
        </Dialog>
        {/* 业绩分配 */}
        <Dialog open={resultFormOpen} fullWidth maxWidth="md">
          <SubmitToPerformance
            handleRequestClose={this.handleClose('resultFormOpen')}
            changeActiveStep={this.changeActiveStep}
            handOpenFee={this.handOpenFee}
            application={application}
            t={t}
          />
        </Dialog>
        {/* 入职 */}
        <Dialog open={onboardFormOpen} fullWidth maxWidth="md">
          <SubmitToOnBoard
            handleRequestClose={this.handleClose('onboardFormOpen')}
            changeActiveStep={this.changeActiveStep}
            application={application}
            t={t}
          />
        </Dialog>
        {/* 淘汰 */}
        <Dialog open={rejectedFormOpen} fullWidth maxWidth="md">
          <Eliminate
            handleRequestClose={this.handleClose('rejectedFormOpen')}
            application={application}
            rejectedStatus={this.state.rejectedStatus}
            t={t}
          />
        </Dialog>

        {/* 生成收费明细  通用*/}
        <Dialog open={feeOpen} fullWidth maxWidth="md">
          <FeeItemizations
            handleRequestClose={this.handleClose('feeOpen')}
            application={application}
            t={t}
          />
        </Dialog>

        {/* 生成收费明细  FTE*/}
        <Dialog open={feeOpenFte} fullWidth maxWidth="md">
          <FeeItemizationsFte
            handleRequestClose={this.handleClose('feeOpenFte')}
            application={application}
            t={t}
          />
        </Dialog>
      </div>
    );
  }
}

const mapStateToProps = (state, { application }) => {
  return {
    job: state.model.jobs.get(String(application.get('jobId'))),
    candidate: state.model.talents.get(String(application.get('talentId'))),
    hasActiveStart: getActiveStartListByTalent(
      state,
      String(application.get('talentId'))
    ).size,
  };
};

export default connect(mapStateToProps)(withStyles(styles)(ApplicationStepper));
