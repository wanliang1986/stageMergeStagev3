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
  ApplicationOfferFree,
} from '../../../constants/formOptions';
import {
  mapOfferLetterParams,
  swichRate,
  swichSalary,
} from '../../../../utils';

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

class OnBoardDetail extends React.Component {
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

  // FTE费用类型对应label
  renderFTEfeeType = (commision) => {
    return (
      <span>
        {
          ApplicationOfferFree.filter((item) => item.value === commision)[0]
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

  render() {
    const { submitToJobFlag } = this.state;
    const { classes, t, application, job, candidate } = this.props;
    const IPGKpiUser = application.get('ipgKpiUsers')
      ? application.get('ipgKpiUsers').toJS()
      : [];

    const AgreedPayRate = application.getIn(['offerAccept', 'ipgOfferBaseInfo'])
      ? application.getIn(['offerAccept', 'ipgOfferBaseInfo']).toJS()
      : null;
    const createdDate = application.getIn(['onboard', 'createdDate']);
    const createdUser = application.getIn(['onboard', 'createdUser']);
    const lastModifiedDate = application.getIn(['onboard', 'lastModifiedDate']);
    const lastModifiedUser = application.getIn(['onboard', 'lastModifiedUser']);

    const AgreedPayRatePayroll = application.getIn([
      'onboard',
      'ipgOfferBaseInfo',
    ])
      ? application.getIn(['onboard', 'ipgOfferBaseInfo']).toJS()
      : null;

    const IpgOfferAcceptFteFeeCharge = application.getIn([
      'offerAccept',
      'ipgOfferAcceptFteFeeCharge',
    ])
      ? application.getIn(['offerAccept', 'ipgOfferAcceptFteFeeCharge']).toJS()
      : null;

    const IpgOfferAcceptContractFeeCharge = application.getIn([
      'offerAccept',
      'ipgOfferAcceptContractFeeCharge',
    ])
      ? application
          .getIn(['offerAccept', 'ipgOfferAcceptContractFeeCharge'])
          .toJS()
      : null;

    const IpgOfferAcceptContractFeeChargePayroll = application.getIn([
      'onboard',
      'ipgOfferAcceptContractFeeCharge',
    ])
      ? application.getIn(['onboard', 'ipgOfferAcceptContractFeeCharge']).toJS()
      : null;

    const IpgOfferAcceptFteSalaryPackages = application.getIn([
      'offerAccept',
      'ipgOfferAcceptFteSalaryPackages',
    ])
      ? application
          .getIn(['offerAccept', 'ipgOfferAcceptFteSalaryPackages'])
          .toJS()
      : null;

    // FTE类型的详情需要计算
    let TotalFTEChargeAmount = 0; //可计费基本薪资
    let TotalFTEAllAmount = 0; //薪资总计
    let TotalFTEAmount = 0; //可收费总计
    let FTEAmount = 0; //可收费账单金额
    IpgOfferAcceptFteSalaryPackages &&
      IpgOfferAcceptFteSalaryPackages.map((item) => {
        if (item.salaryType === 'BASE_SALARY') {
          TotalFTEChargeAmount = TotalFTEChargeAmount + item.amount;
        }
        if (item.needCharge) {
          TotalFTEAmount = TotalFTEAmount + item.amount;
        }
        TotalFTEAllAmount = TotalFTEAllAmount + item.amount;
      });
    if (
      IpgOfferAcceptFteFeeCharge &&
      IpgOfferAcceptFteFeeCharge.feeType === 'PERCENTAGE'
    ) {
      // 为百分比的时候，需要根据选中的年份或者月份之类进行计算
      const annualSalary = swichSalary(
        TotalFTEChargeAmount,
        AgreedPayRate.rateUnitType
      );
      const totalBillableAmount =
        Number(annualSalary) +
        Number(TotalFTEAmount) -
        Number(TotalFTEChargeAmount);
      FTEAmount = (
        totalBillableAmount *
        (IpgOfferAcceptFteFeeCharge.amount / 100)
      ).toFixed(2);
    } else if (
      IpgOfferAcceptFteFeeCharge &&
      IpgOfferAcceptFteFeeCharge.feeType === 'FLAT_AMOUNT'
    ) {
      FTEAmount = IpgOfferAcceptFteFeeCharge.amount;
    }
    const startDate = application.getIn(['onboard', 'startDate']);
    const warrantyEndDate = application.getIn(['onboard', 'warrantyEndDate']);
    return (
      <div className={classes.root}>
        {JSON.stringify(application.get('onboard')) !== '{}' ? (
          <Accordion onChange={this.changeOpen}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <div className={classes.flexBtn}>
                <Typography>入职</Typography>
                {submitToJobFlag ? (
                  <Typography>
                    {moment(application.get('lastModifiedDate')).format(
                      'YYYY-MM-DD HH:mm:ss'
                    )}
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
                    {'张三 (操作者)'}
                  </Typography>
                  <Typography className={classes.fontDetail}>
                    {moment(application.get('lastModifiedDate')).format(
                      'YYYY-MM-DD HH:mm:ss'
                    )}
                  </Typography>
                </div>

                {AgreedPayRate ? (
                  <>
                    <div className="row expanded small-12">
                      <div className="small-4 columns">
                        <Typography className={classes.fontTitle}>
                          {'入职日期'}
                        </Typography>
                      </div>
                      <div className="small-8 columns">
                        <Typography>{AgreedPayRate.onboardDate}</Typography>
                      </div>
                    </div>
                    <div className="row expanded small-12">
                      <div className="small-4 columns">
                        <Typography className={classes.fontTitle}>
                          {job.get('type') === 'CONTRACT'
                            ? '结束日期'
                            : '试用期结束'}
                        </Typography>
                      </div>
                      <div className="small-8 columns">
                        <Typography>{AgreedPayRate.warrantyEndDate}</Typography>
                      </div>
                    </div>
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
                  </>
                ) : null}

                {IpgOfferAcceptFteSalaryPackages &&
                IpgOfferAcceptFteFeeCharge ? (
                  <>
                    <div className="row expanded small-12">
                      <div className="small-4 columns">
                        <Typography className={classes.fontTitle}>
                          {'可计费基本薪资'}
                        </Typography>
                      </div>
                      <div className="small-8 columns">
                        <Typography>{TotalFTEChargeAmount}</Typography>
                      </div>
                    </div>
                    <div className="row expanded small-12">
                      <div className="small-4 columns">
                        <Typography className={classes.fontTitle}>
                          {'薪资总计'}
                        </Typography>
                      </div>
                      <div className="small-8 columns">
                        <Typography>{TotalFTEAllAmount}</Typography>
                      </div>
                    </div>
                    <div className="row expanded small-12">
                      <div className="small-4 columns">
                        <Typography className={classes.fontTitle}>
                          {'可收费总计'}
                        </Typography>
                      </div>
                      <div className="small-8 columns">
                        <Typography>{TotalFTEAmount}</Typography>
                      </div>
                    </div>
                    <div className="row expanded small-12">
                      <div className="small-4 columns">
                        <Typography className={classes.fontTitle}>
                          {'费用类型'}
                        </Typography>
                      </div>
                      <div className="small-8 columns">
                        <Typography>
                          {this.renderFTEfeeType(
                            IpgOfferAcceptFteFeeCharge.feeType
                          )}
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
                        <Typography>{FTEAmount}</Typography>
                      </div>
                    </div>
                  </>
                ) : null}

                {/* payroll类型的 */}
                {IpgOfferAcceptContractFeeChargePayroll ? (
                  <>
                    <div className="row expanded small-12">
                      <div className="small-4 columns">
                        <Typography className={classes.fontTitle}>
                          {'收费金额'}
                        </Typography>
                      </div>
                      <div className="small-8 columns">
                        <Typography>
                          {this.renderUnitType(AgreedPayRatePayroll.currency)}
                          {IpgOfferAcceptContractFeeChargePayroll.finalBillRate}
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
                          {this.renderUnitType(AgreedPayRatePayroll.currency)}
                          {IpgOfferAcceptContractFeeChargePayroll.finalPayRate}
                        </Typography>
                      </div>
                    </div>
                    <div className="row expanded small-12">
                      <div className="small-4 columns">
                        <Typography className={classes.fontTitle}>
                          {'雇主收费成本'}
                        </Typography>
                      </div>
                      <div className="small-8 columns">
                        <Typography>
                          {
                            IpgOfferAcceptContractFeeChargePayroll.taxBurdenRate
                              .description
                          }
                        </Typography>
                      </div>
                    </div>
                    <div className="row expanded small-12">
                      <div className="small-4 columns">
                        <Typography className={classes.fontTitle}>
                          {'MSP率'}
                        </Typography>
                      </div>
                      <div className="small-8 columns">
                        <Typography>
                          {
                            IpgOfferAcceptContractFeeChargePayroll.mspRate
                              .description
                          }
                        </Typography>
                      </div>
                    </div>
                    <div className="row expanded small-12">
                      <div className="small-4 columns">
                        <Typography className={classes.fontTitle}>
                          {'移民费用'}
                        </Typography>
                      </div>
                      <div className="small-8 columns">
                        <Typography>
                          {
                            IpgOfferAcceptContractFeeChargePayroll
                              .immigrationCost.description
                          }
                        </Typography>
                      </div>
                    </div>
                    <div className="row expanded small-12">
                      <div className="small-4 columns">
                        <Typography className={classes.fontTitle}>
                          {'额外费用'}
                        </Typography>
                      </div>
                      <div className="small-8 columns">
                        <Typography>
                          {this.renderUnitType(AgreedPayRatePayroll.currency)}
                          {IpgOfferAcceptContractFeeChargePayroll.extraCost}
                        </Typography>
                      </div>
                    </div>
                    <div className="row expanded small-12">
                      <div className="small-4 columns">
                        <Typography className={classes.fontTitle}>
                          {'预计每周工作时间'}
                        </Typography>
                      </div>
                      <div className="small-8 columns">
                        <Typography>
                          {
                            IpgOfferAcceptContractFeeChargePayroll.estimatedWorkingHourPerWeek
                          }
                        </Typography>
                      </div>
                    </div>
                    <div className="row expanded small-12">
                      <div className="small-4 columns">
                        <Typography className={classes.fontTitle}>
                          {'GM'}
                        </Typography>
                      </div>
                      <div className="small-8 columns">
                        <Typography>
                          {IpgOfferAcceptContractFeeChargePayroll.gm}
                        </Typography>
                      </div>
                    </div>
                  </>
                ) : null}

                {startDate ? (
                  <div className="row expanded small-12">
                    <div className="small-4 columns">
                      <Typography className={classes.fontTitle}>
                        {'入职日期'}
                      </Typography>
                    </div>
                    <div className="small-8 columns">
                      <Typography>{startDate}</Typography>
                    </div>
                  </div>
                ) : null}

                {warrantyEndDate ? (
                  <div className="row expanded small-12">
                    <div className="small-4 columns">
                      <Typography className={classes.fontTitle}>
                        {'试用期结束'}
                      </Typography>
                    </div>
                    <div className="small-8 columns">
                      <Typography>{warrantyEndDate}</Typography>
                    </div>
                  </div>
                ) : null}

                {IpgOfferAcceptContractFeeCharge ? (
                  <>
                    <div className="row expanded small-12">
                      <div className="small-4 columns">
                        <Typography className={classes.fontTitle}>
                          {'收费金额'}
                        </Typography>
                      </div>
                      <div className="small-8 columns">
                        <Typography>
                          {this.renderUnitType(AgreedPayRate.currency)}
                          {IpgOfferAcceptContractFeeCharge.finalBillRate}
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
                          {IpgOfferAcceptContractFeeCharge.finalPayRate}
                        </Typography>
                      </div>
                    </div>
                    <div className="row expanded small-12">
                      <div className="small-4 columns">
                        <Typography className={classes.fontTitle}>
                          {'雇主收费成本'}
                        </Typography>
                      </div>
                      <div className="small-8 columns">
                        <Typography>
                          {
                            IpgOfferAcceptContractFeeCharge.taxBurdenRate
                              .description
                          }
                        </Typography>
                      </div>
                    </div>
                    <div className="row expanded small-12">
                      <div className="small-4 columns">
                        <Typography className={classes.fontTitle}>
                          {'MSP率'}
                        </Typography>
                      </div>
                      <div className="small-8 columns">
                        <Typography>
                          {IpgOfferAcceptContractFeeCharge.mspRate.description}
                        </Typography>
                      </div>
                    </div>
                    <div className="row expanded small-12">
                      <div className="small-4 columns">
                        <Typography className={classes.fontTitle}>
                          {'移民费用'}
                        </Typography>
                      </div>
                      <div className="small-8 columns">
                        <Typography>
                          {
                            IpgOfferAcceptContractFeeCharge.immigrationCost
                              .description
                          }
                        </Typography>
                      </div>
                    </div>
                    <div className="row expanded small-12">
                      <div className="small-4 columns">
                        <Typography className={classes.fontTitle}>
                          {'额外费用'}
                        </Typography>
                      </div>
                      <div className="small-8 columns">
                        <Typography>
                          {IpgOfferAcceptContractFeeCharge.extraCost}
                        </Typography>
                      </div>
                    </div>
                    <div className="row expanded small-12">
                      <div className="small-4 columns">
                        <Typography className={classes.fontTitle}>
                          {'预计每周工作时间'}
                        </Typography>
                      </div>
                      <div className="small-8 columns">
                        <Typography>
                          {
                            IpgOfferAcceptContractFeeCharge.estimatedWorkingHourPerWeek
                          }
                        </Typography>
                      </div>
                    </div>
                    <div className="row expanded small-12">
                      <div className="small-4 columns">
                        <Typography className={classes.fontTitle}>
                          {'GM'}
                        </Typography>
                      </div>
                      <div className="small-8 columns">
                        <Typography>
                          {IpgOfferAcceptContractFeeCharge.gm}
                        </Typography>
                      </div>
                    </div>
                  </>
                ) : null}

                <div className="row expanded small-12">
                  <div className="small-4 columns">
                    <Typography className={classes.fontTitle}>
                      {'参与者'}
                    </Typography>
                  </div>
                  <div className="small-8 columns">
                    {IPGKpiUser &&
                      IPGKpiUser.map((item) => {
                        return this.renderDetailUser(item);
                      })}
                  </div>
                </div>

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

export default connect(mapStateToProps)(withStyles(styles)(OnBoardDetail));
