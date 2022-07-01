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

class OfferDetail extends React.Component {
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

  handleOpen = (e) => {
    e.stopPropagation();
    this.props.handleOpenEditDialog();
    this.props.dispatch({
      type: 'APPLICATION_EDITFLAG',
      payload: true,
    });
  };

  changeCharge = (currency) => {
    let str = '$';
    if (currency === 'CNY') {
      str = '￥';
    } else if (currency === 'EUR') {
      str = '€';
    } else if (currency === 'GBP') {
      str = '£';
    }
    return str;
  };

  render() {
    const { submitToJobFlag } = this.state;
    const { classes, t, application, job, candidate, item, index } = this.props;
    const IPGKpiUser = application.get('ipgKpiUsers')
      ? application.get('ipgKpiUsers').toJS()
      : [];
    const createdDate = application.getIn(['offer', 'createdDate']);
    const createdUser = application.getIn(['offer', 'createdUser']);
    const lastModifiedDate = application.getIn(['offer', 'lastModifiedDate']);
    const lastModifiedUser = application.getIn(['offer', 'lastModifiedUser']);
    const AgreedPayRate = application.get('agreedPayRate')
      ? application.get('agreedPayRate').toJS()
      : null;
    const salary = application.getIn(['offer', 'salary']);
    const salaryList =
      application.getIn(['offer', 'salaryPackages']) &&
      application.getIn(['offer', 'salaryPackages']).toJS();
    const feeCharge = application.getIn(['offer', 'feeCharge']);
    let TotalBill = 0; //薪资总计 可收费 + 不可收费
    let TotalBillCharge = 0; //可收费总计
    salaryList &&
      salaryList.map((item) => {
        if (item.salaryType) {
          TotalBill = TotalBill + Number(item.amount) * 1000;
        }
        if (item.needCharge && item.salaryType) {
          TotalBillCharge = TotalBillCharge + Number(item.amount) * 1000;
        }
      });
    TotalBill = TotalBill / 1000;
    TotalBillCharge = TotalBillCharge / 1000;
    const users =
      application.get('kpiUsers') &&
      application
        .get('kpiUsers')
        .toJS()
        .map((x) => x.user);

    return (
      <div className={classes.root} key={index}>
        {JSON.stringify(application.get('offer')) !== '{}' ? (
          <Accordion onChange={this.changeOpen}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <div className={classes.flexBtn}>
                <Typography>Offer</Typography>
                {submitToJobFlag ? (
                  <Typography>
                    {moment(lastModifiedDate).format('YYYY-MM-DD HH:mm:ss')}
                  </Typography>
                ) : (
                  <EditIcon
                    fontSize="small"
                    onClick={this.handleOpen}
                    style={{ color: 'gray' }}
                  />
                )}
              </div>
            </AccordionSummary>
            <AccordionDetails>
              <div style={{ width: '100%' }}>
                <div className={classes.flexBtn}>
                  <Typography className={classes.fontDetail}>
                    {lastModifiedUser.get('firstName')}{' '}
                    {lastModifiedUser.get('lastName')}
                    {' (操作者)'}
                  </Typography>
                  <Typography className={classes.fontDetail}>
                    {moment(lastModifiedDate).format('YYYY-MM-DD HH:mm:ss')}
                  </Typography>
                </div>
                <div className="row expanded small-12">
                  <div className="small-4 columns">
                    <Typography className={classes.fontTitle}>
                      {'签订日期'}
                    </Typography>
                  </div>
                  <div className="small-8 columns">
                    <Typography>
                      {application.getIn(['offer', 'signedDate'])}
                    </Typography>
                  </div>
                </div>
                <div className="row expanded small-12">
                  <div className="small-4 columns">
                    <Typography className={classes.fontTitle}>
                      {'预计入职日期'}
                    </Typography>
                  </div>
                  <div className="small-8 columns">
                    <Typography>
                      {application.getIn(['offer', 'estimateOnboardDate'])}
                    </Typography>
                  </div>
                </div>
                <div className="row expanded small-12">
                  <div className="small-4 columns">
                    <Typography className={classes.fontTitle}>
                      {'参与者'}
                    </Typography>
                  </div>
                  <div className="small-8 columns">
                    <Typography>
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
                    </Typography>
                  </div>
                </div>
                {AgreedPayRate ? (
                  <>
                    <div className="row expanded small-12">
                      <div className="small-4 columns">
                        <Typography className={classes.fontTitle}>
                          {'币种/类型'}
                        </Typography>
                      </div>
                      <div className="small-8 columns">
                        <Typography>
                          {AgreedPayRate.currency + '('}
                          {this.renderUnitType(AgreedPayRate.currency)}
                          {') / '}
                          {this.renderRateType(AgreedPayRate.rateUnitType)}
                        </Typography>
                      </div>
                    </div>
                    <div className="row expanded small-12">
                      <div className="small-4 columns">
                        <Typography className={classes.fontTitle}>
                          {'工资金额'}
                        </Typography>
                      </div>
                      <div className="small-8 columns">
                        <Typography>
                          {this.renderUnitType(AgreedPayRate.currency)}
                          {AgreedPayRate.agreedPayRate}
                        </Typography>
                      </div>
                    </div>
                  </>
                ) : null}
                {salary ? (
                  <div className="row expanded small-12">
                    <div className="small-4 columns">
                      <Typography className={classes.fontTitle}>
                        {'币种类型'}
                      </Typography>
                    </div>
                    <div className="small-8 columns">
                      <Typography>
                        {salary && salary.get('currency') + '('}
                        {this.renderUnitType(salary && salary.get('currency'))}
                        {') / '}
                        {this.renderRateType(
                          salary && salary.get('rateUnitType')
                        )}
                      </Typography>
                    </div>
                  </div>
                ) : null}

                {salaryList ? (
                  <>
                    <div className="row expanded small-12">
                      <div className="small-4 columns">
                        <Typography className={classes.fontTitle}>
                          {'薪资总计'}
                        </Typography>
                      </div>
                      <div className="small-8 columns">
                        <Typography>
                          {`${this.changeCharge(
                            salary && salary.get('currency')
                          )} ${TotalBill.toFixed(2)}`}
                        </Typography>
                      </div>
                    </div>
                    <div className="row expanded small-12">
                      <div className="small-4 columns">
                        <Typography className={classes.fontTitle}>
                          {'可收费总计'}
                        </Typography>
                      </div>
                      <div className="small-8 columns">
                        <Typography>
                          {`${this.changeCharge(
                            salary && salary.get('currency')
                          )} ${TotalBillCharge.toFixed(2)}`}
                        </Typography>
                      </div>
                    </div>
                  </>
                ) : null}
                {feeCharge ? (
                  <>
                    <div className="row expanded small-12">
                      <div className="small-4 columns">
                        <Typography className={classes.fontTitle}>
                          {'费用比率'}
                        </Typography>
                      </div>
                      <div className="small-8 columns">
                        <Typography>
                          {`${feeCharge.get('rate') * 100}%`}
                        </Typography>
                      </div>
                    </div>
                    <div className="row expanded small-12">
                      <div className="small-4 columns">
                        <Typography className={classes.fontTitle}>
                          {'可收费账单金额'}
                        </Typography>
                      </div>
                      <div className="small-8 columns">
                        <Typography>
                          {`${this.changeCharge(
                            salary && salary.get('currency')
                          )} ${feeCharge.get('amount')}`}
                        </Typography>
                      </div>
                    </div>
                  </>
                ) : null}
                {createdUser ? (
                  <div className="row expanded small-12">
                    <div className="small-4 columns">
                      <Typography className={classes.fontTitle}>
                        {'添加者'}
                      </Typography>
                    </div>
                    <div className="small-8 columns">
                      <Typography>
                        {createdUser.get('firstName')}{' '}
                        {createdUser.get('lastName')}
                      </Typography>
                    </div>
                  </div>
                ) : null}

                {createdDate ? (
                  <div className="row expanded small-12">
                    <div className="small-4 columns">
                      <Typography className={classes.fontTitle}>
                        {'添加时间'}
                      </Typography>
                    </div>
                    <div className="small-8 columns">
                      <Typography>
                        {' '}
                        {moment(createdDate).format('YYYY-MM-DD HH:mm:ss')}
                      </Typography>
                    </div>
                  </div>
                ) : null}

                {lastModifiedUser ? (
                  <div className="row expanded small-12">
                    <div className="small-4 columns">
                      <Typography className={classes.fontTitle}>
                        {'最近修改者'}
                      </Typography>
                    </div>
                    <div className="small-8 columns">
                      <Typography>
                        {lastModifiedUser.get('firstName')}{' '}
                        {lastModifiedUser.get('lastName')}
                      </Typography>
                    </div>
                  </div>
                ) : null}

                {lastModifiedDate ? (
                  <div className="row expanded small-12">
                    <div className="small-4 columns">
                      <Typography className={classes.fontTitle}>
                        {'最近修改时间'}
                      </Typography>
                    </div>
                    <div className="small-8 columns">
                      <Typography>
                        {moment(lastModifiedDate).format('YYYY-MM-DD HH:mm:ss')}
                      </Typography>
                    </div>
                  </div>
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

export default connect(mapStateToProps)(withStyles(styles)(OfferDetail));
