import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { getJob } from '../actions/jobActions';
import Loading from './particial/Loading';
import moment from 'moment-timezone';
import SecondaryButton from './particial/SecondaryButton';

const Steps = ['推荐至职位', '推荐至客户', '面试', 'Offer', '业绩分配', '入职'];
const IPGSteps = [
  '推荐至职位',
  '推荐至客户',
  '面试',
  'Offer',
  '接受offer',
  '入职',
];
const IPGPayrollSteps = ['推荐至职位', '入职'];

const styles = {
  root: {
    width: '100%',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: 'rgba(0,0,0,0.05)',
      '& .MuiStepper-root': {
        backgroundColor: 'rgba(0,0,0,0.005)',
      },
    },
    '& .MuiStepper-root': {
      padding: '4px',
    },
  },
  flexBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  appliType: {
    border: '1px solid #91d5ff',
    backgroundColor: '#e6f7ff',
    color: '#1890ff',
    padding: '4px',
    textAlign: 'center',
    borderRadius: '6px',
    width: 100,
  },
  eliminateType: {
    border: '1px solid #ef4529',
    color: '#ef4529',
    padding: '4px',
    textAlign: 'center',
    borderRadius: '6px',
    width: 100,
  },
  appliAction: {
    color: 'rgba(0,0,0,0.4)',
  },
};

class ApplicationItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeStep: 1,
    };
  }

  changeActiveStep = (num) => {
    this.setState({
      activeStep: num,
    });
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
      case 'ON_BOARD':
        this.changeActiveStep(2);
        break;
    }
  }

  handleNextBtn = () => {
    let str = '推荐至客户';
    const { activeStep } = this.state;
    if (activeStep === 1) {
      str = '入职';
    } else if (activeStep === 2) {
      str = '更新入职信息';
    }
    return str;
  };

  distinct = (arr, key) => {
    let newobj = {},
      newArr = [];
    for (let i = 0; i < arr.length; i++) {
      let item = arr[i];
      if (!newobj[item[key]]) {
        newobj[item[key]] = newArr.push(item);
      }
    }
    return newArr;
  };

  render() {
    const { activeStep } = this.state;
    const { classes, t, onClick, job, application } = this.props;
    const jobType = application.get('jobType');
    const users = job
      ? job.getIn(['assignedUsers'])
        ? this.distinct(job.getIn(['assignedUsers']).toJS(), 'userId')
        : []
      : [];
    if (!application || !job) {
      return <Loading />;
    }
    return (
      <div
        className={classes.root}
        onClick={onClick}
        key={application.get('id')}
      >
        <div className={classes.flexBtn}>
          <div>
            <Typography style={{ color: '#1890ff' }}>
              {job.get('title')}
              <span style={{ color: '#999' }}>
                <>&nbsp;&nbsp;</>
                {'#' + job.get('id')}
              </span>
            </Typography>
            <div
              className={
                application.get('eliminate').size !== 0
                  ? classes.eliminateType
                  : classes.appliType
              }
            >
              {application.get('eliminate').size !== 0
                ? '淘汰'
                : this.handleNextBtn()}
            </div>
          </div>
          {application.get('eliminate').size !== 0 ? (
            <Typography style={{ color: '#ef4529' }}>{'已淘汰'}</Typography>
          ) : jobType === 'PAY_ROLL' ? (
            <Stepper activeStep={activeStep} alternativeLabel>
              {IPGPayrollSteps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          ) : (
            <Stepper activeStep={activeStep} alternativeLabel>
              {IPGSteps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          )}
        </div>
        <div>
          {'公司:'}
          <>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</>
          {job.getIn(['company', 'name']) || 'N/A'}
        </div>
        <div className={classes.flexBtn} style={{ marginBottom: 10 }}>
          <div>
            {'参与者:'}
            <>&nbsp;&nbsp;&nbsp;</>
            {users.length > 0 &&
              users.map((x, index) => {
                return `${x.firstName} ${x.lastName}${
                  users.length - 1 === index ? '' : ' ,'
                }`;
              })}
          </div>
          <div className={classes.appliAction}>
            {'最近操作: '}
            {moment(application.get('lastModifiedDate')).format('MM-DD HH:mm')}
          </div>
        </div>
        <Divider />
      </div>
    );
  }
}

const mapStateToProps = (state, { application }) => {
  return {
    candidate: state.model.talents.get(String(application.get('talentId'))),
    job: state.model.jobs.get(String(application.get('jobId'))),
    // currentUserId: state.controller.currentUser.get('id'),
  };
};

export default connect(mapStateToProps)(withStyles(styles)(ApplicationItem));
