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
  mapOfferLetterParams,
  swichRate,
  swichSalary,
} from '../../../../utils';
import {
  userTypeForCommission as userTypeOptions,
  currency as currencyOptions,
  payRateUnitTypes,
  ApplicationInterviewType,
  ApplicationOfferFree,
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

class OfferAcceptDetail extends React.Component {
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

  // ????????????????????????????????????
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

  // ????????????label
  renderUnitType = (commision) => {
    return (
      <span>
        {currencyOptions.filter((item) => item.value === commision)[0].label}
      </span>
    );
  };

  // ????????????label
  renderRateType = (commision) => {
    return (
      <span>
        {payRateUnitTypes.filter((item) => item.value === commision)[0].label2}
      </span>
    );
  };

  // FTE??????????????????label
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
    const createdDate = application.getIn(['offerAccept', 'createdDate']);
    const createdUser = application.getIn(['offerAccept', 'createdUser']);
    const lastModifiedDate = application.getIn([
      'offerAccept',
      'lastModifiedDate',
    ]);
    const lastModifiedUser = application.getIn([
      'offerAccept',
      'lastModifiedUser',
    ]);

    const AgreedPayRate = application.getIn(['offerAccept', 'ipgOfferBaseInfo'])
      ? application.getIn(['offerAccept', 'ipgOfferBaseInfo']).toJS()
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

    const IpgOfferAcceptFteSalaryPackages = application.getIn([
      'offerAccept',
      'ipgOfferAcceptFteSalaryPackages',
    ])
      ? application
          .getIn(['offerAccept', 'ipgOfferAcceptFteSalaryPackages'])
          .toJS()
      : null;

    // FTE???????????????????????????
    let TotalFTEChargeAmount = 0; //?????????????????????
    let TotalFTEAllAmount = 0; //????????????
    let TotalFTEAmount = 0; //???????????????
    let FTEAmount = 0; //?????????????????????
    IpgOfferAcceptFteSalaryPackages &&
      IpgOfferAcceptFteSalaryPackages.map((item) => {
        if (item.salaryType === 'BASE_SALARY') {
          TotalFTEChargeAmount = TotalFTEChargeAmount + Number(item.amount);
        }
        if (item.needCharge) {
          TotalFTEAmount = TotalFTEAmount + item.amount;
        }
        TotalFTEAllAmount = TotalFTEAllAmount + item.amount;
      });
    if (
      IpgOfferAcceptFteFeeCharge &&
      IpgOfferAcceptFteFeeCharge.feeType === 'PERCENTAGE' &&
      AgreedPayRate
    ) {
      // ?????????????????????????????????????????????????????????????????????????????????
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

    return (
      <div className={classes.root}>
        {JSON.stringify(application.get('offerAccept')) !== '{}' ? (
          <Accordion onChange={this.changeOpen}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <div className={classes.flexBtn}>
                <Typography>??????Offer</Typography>
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
                    {' (?????????)'}
                  </Typography>
                  <Typography className={classes.fontDetail}>
                    {moment(lastModifiedDate).format('YYYY-MM-DD HH:mm:ss')}
                  </Typography>
                </div>

                {AgreedPayRate ? (
                  <>
                    <div className="row expanded small-12">
                      <div className="small-4 columns">
                        <Typography className={classes.fontTitle}>
                          {'????????????'}
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
                            ? '????????????'
                            : '???????????????'}
                        </Typography>
                      </div>
                      <div className="small-8 columns">
                        <Typography>{AgreedPayRate.warrantyEndDate}</Typography>
                      </div>
                    </div>
                    <div className="row expanded small-12">
                      <div className="small-4 columns">
                        <Typography className={classes.fontTitle}>
                          {'??????/??????'}
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
                          {'?????????????????????'}
                        </Typography>
                      </div>
                      <div className="small-8 columns">
                        <Typography>{TotalFTEChargeAmount}</Typography>
                      </div>
                    </div>
                    <div className="row expanded small-12">
                      <div className="small-4 columns">
                        <Typography className={classes.fontTitle}>
                          {'????????????'}
                        </Typography>
                      </div>
                      <div className="small-8 columns">
                        <Typography>{TotalFTEAllAmount}</Typography>
                      </div>
                    </div>
                    <div className="row expanded small-12">
                      <div className="small-4 columns">
                        <Typography className={classes.fontTitle}>
                          {'???????????????'}
                        </Typography>
                      </div>
                      <div className="small-8 columns">
                        <Typography>{TotalFTEAmount}</Typography>
                      </div>
                    </div>
                    <div className="row expanded small-12">
                      <div className="small-4 columns">
                        <Typography className={classes.fontTitle}>
                          {'????????????'}
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
                          {'?????????????????????'}
                        </Typography>
                      </div>
                      <div className="small-8 columns">
                        <Typography>{FTEAmount}</Typography>
                      </div>
                    </div>
                  </>
                ) : null}

                {/* Contract????????? */}
                {IpgOfferAcceptContractFeeCharge ? (
                  <>
                    <div className="row expanded small-12">
                      <div className="small-4 columns">
                        <Typography className={classes.fontTitle}>
                          {'????????????'}
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
                          {'????????????'}
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
                          {'??????????????????'}
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
                          {'MSP???'}
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
                          {'????????????'}
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
                          {'????????????'}
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
                          {'????????????????????????'}
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
                      {'?????????'}
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
                        {'?????????'}
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
                        {'????????????'}
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
                        {'???????????????'}
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
                        {'??????????????????'}
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

export default connect(mapStateToProps)(withStyles(styles)(OfferAcceptDetail));
