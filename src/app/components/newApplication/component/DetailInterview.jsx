import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import EditIcon from '@material-ui/icons/Edit';
import moment from 'moment-timezone';
import {
  userTypeForCommission as userTypeOptions,
  currency as currencyOptions,
  payRateUnitTypes,
  ApplicationInterviewType,
} from '../../../constants/formOptions';

const styles = {
  root: {
    width: '100%',
    '& .MuiAccordionSummary-root.Mui-expanded': {
      backgroundColor: 'rgba(0,0,0,0.1)',
    },
    '& .MuiAccordionSummary-content.Mui-expanded': {
      margin: '0',
    },
    '& .columns': {
      padding: '0',
    },
  },
  flexBtn: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  fontDetail: {
    color: 'rgba(0,0,0,0.3)',
  },
  fontTitle: {
    color: 'rgba(0,0,0,0.5)',
  },
};

class InterviewDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      submitToJobFlag: true,
    };
  }

  changeActiveStep = (num) => {
    this.setState({
      activeStep: num,
    });
  };

  changeOpen = () => {
    this.setState({
      submitToJobFlag: !this.state.submitToJobFlag,
    });
  };

  // 流程展开详情用户角色部分
  renderDetailUser = (commision) => {
    return (
      <Typography>
        {
          userTypeOptions.filter((item) => item.value === commision.userRole)[0]
            .label2
        }
        {' - '}
        {commision.user ? commision.user.username : 'N/A'}
        {commision.percentage ? ' - ' + commision.percentage + '%' : null}
      </Typography>
    );
  };

  // 货币对应label
  renderUnitType = (commision) => {
    return (
      <span>
        {currencyOptions.filter((item) => item.value === commision)[0].label}
      </span>
    );
  };

  // 年份对应label
  renderRateType = (commision) => {
    return (
      <span>
        {payRateUnitTypes.filter((item) => item.value === commision)[0].label2}
      </span>
    );
  };

  // 面试对应label
  renderInterviewType = (commision) => {
    return (
      <span>
        {
          ApplicationInterviewType.filter((item) => item.value === commision)[0]
            .label
        }
      </span>
    );
  };

  handleOpen = (e, index) => {
    e.stopPropagation();
    this.props.handleOpenEditDialog();
    this.props.dispatch({
      type: 'EDIT_INTERVIEW_INDEX',
      payload: index,
    });
    this.props.dispatch({
      type: 'APPLICATION_EDITFLAG',
      payload: true,
    });
  };

  render() {
    const { submitToJobFlag } = this.state;
    const { classes, t, application, job, candidate, item, index } = this.props;
    const IPGKpiUser = application.get('ipgKpiUsers')
      ? application.get('ipgKpiUsers').toJS()
      : [];
    const AgreedPayRate = application.get('agreedPayRate')
      ? application.get('agreedPayRate').toJS()
      : null;
    const users =
      application.get('kpiUsers') &&
      application
        .get('kpiUsers')
        .toJS()
        .map((x) => x.user);
    const lastModifiedUser = item && item.lastModifiedUser;
    const lastModifiedDate = item && item.lastModifiedDate;
    return (
      <div className={classes.root} key={index}>
        {application.get('interviews') ? (
          <Accordion onChange={this.changeOpen}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <div className={classes.flexBtn}>
                <Typography>面试-{item.progress}面</Typography>
                {submitToJobFlag ? (
                  <Typography>
                    {moment(lastModifiedDate).format('YYYY-MM-DD HH:mm:ss')}
                  </Typography>
                ) : (
                  <EditIcon
                    fontSize="small"
                    onClick={(e) => {
                      this.handleOpen(e, item.progress);
                    }}
                    style={{ color: 'gray' }}
                  />
                )}
              </div>
            </AccordionSummary>
            <AccordionDetails>
              <div style={{ width: '100%' }}>
                <div className={classes.flexBtn}>
                  <Typography className={classes.fontDetail}>
                    {lastModifiedUser.firstName} {lastModifiedUser.lastName}
                    {' (操作者)'}
                  </Typography>
                  <Typography className={classes.fontDetail}>
                    {moment(lastModifiedDate).format('YYYY-MM-DD HH:mm:ss')}
                  </Typography>
                </div>
                <div className="row expanded small-12">
                  <div className="small-3 columns">
                    <Typography className={classes.fontTitle}>
                      {'面试进展'}
                    </Typography>
                  </div>
                  <div className="small-9 columns">
                    <Typography>{item.progress + '面'}</Typography>
                  </div>
                </div>
                <div className="row expanded small-12">
                  <div className="small-3 columns">
                    <Typography className={classes.fontTitle}>
                      {'面试时间'}
                    </Typography>
                  </div>
                  <div className="small-9 columns">
                    <Typography>
                      {moment(item.fromTime)
                        .utc()
                        .format('YYYY-MM-DD HH:mm:ss')}
                      {' -- '}
                      {moment(item.toTime).utc().format('YYYY-MM-DD HH:mm:ss')}
                    </Typography>
                  </div>
                </div>
                <div className="row expanded small-12">
                  <div className="small-3 columns">
                    <Typography className={classes.fontTitle}>
                      {'面试方式'}
                    </Typography>
                  </div>
                  <div className="small-9 columns">
                    <Typography>
                      {this.renderInterviewType(item.interviewType)}
                    </Typography>
                  </div>
                </div>
                <div className="row expanded small-12">
                  <div className="small-3 columns">
                    <Typography className={classes.fontTitle}>
                      {'参与者'}
                    </Typography>
                  </div>
                  <div className="small-9 columns">
                    {IPGKpiUser &&
                      IPGKpiUser.map((item) => {
                        return this.renderDetailUser(item);
                      })}
                    {users &&
                      users.map((x, index) => {
                        if (x) {
                          return `${x.firstName} ${x.lastName}${
                            users.length - 1 === index ? '' : ' ,'
                          }`;
                        } else {
                          return null;
                        }
                      })}
                  </div>
                </div>
                {AgreedPayRate ? (
                  <>
                    <div className="row expanded small-12">
                      <div className="small-3 columns">
                        <Typography className={classes.fontTitle}>
                          {'币种/类型'}
                        </Typography>
                      </div>
                      <div className="small-9 columns">
                        <Typography>
                          {AgreedPayRate.currency + '('}
                          {this.renderUnitType(AgreedPayRate.currency)}
                          {') / '}
                          {this.renderRateType(AgreedPayRate.rateUnitType)}
                        </Typography>
                      </div>
                    </div>
                    <div className="row expanded small-12">
                      <div className="small-3 columns">
                        <Typography className={classes.fontTitle}>
                          {'工资金额'}
                        </Typography>
                      </div>
                      <div className="small-9 columns">
                        <Typography>
                          {this.renderUnitType(AgreedPayRate.currency)}
                          {AgreedPayRate.agreedPayRate}
                        </Typography>
                      </div>
                    </div>
                  </>
                ) : null}
              </div>
            </AccordionDetails>
          </Accordion>
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = (state, { application }) => {
  return {
    job: state.model.jobs.get(String(application.get('jobId'))),
    candidate: state.model.talents.get(String(application.get('talentId'))),
  };
};

export default connect(mapStateToProps)(withStyles(styles)(InterviewDetail));
