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
    const { classes, t, application, job, candidate } = this.props;
    const Feelist = application.getIn(['commission', 'feeCharge']);
    const salary = application.getIn(['offer', 'salary']);
    const currency = salary && salary.get('currency');
    const users =
      application.getIn(['commission', 'users']) &&
      application
        .getIn(['commission', 'users'])
        .toJS()
        .map((x) => x.user);
    const feeChargeAmount = Feelist && Feelist.get('amount');
    const feeChargeRate = Feelist && Feelist.get('rate') * 100;
    const createdDate = application.getIn(['commission', 'createdDate']);
    const createdUser = application.getIn(['commission', 'createdUser']);
    const lastModifiedDate = application.getIn([
      'commission',
      'lastModifiedDate',
    ]);
    const lastModifiedUser = application.getIn([
      'commission',
      'lastModifiedUser',
    ]);

    return (
      <div className={classes.root}>
        {JSON.stringify(application.get('commission')) !== '{}' ? (
          <Accordion onChange={this.changeOpen}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <div className={classes.flexBtn}>
                <Typography>业绩分配</Typography>
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

                {Feelist ? (
                  <>
                    <div className="row expanded small-12">
                      <div className="small-4 columns">
                        <Typography className={classes.fontTitle}>
                          {'可收费账单金额'}
                        </Typography>
                      </div>
                      <div className="small-8 columns">
                        <Typography>
                          {this.changeCharge(currency)}
                          {feeChargeAmount}
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
                          {users &&
                            users.map((x, index) => {
                              return `${x.firstName} ${x.lastName}${
                                users.length - 1 === index ? '' : ' ,'
                              }`;
                            })}
                        </Typography>
                      </div>
                    </div>
                    <div className="row expanded small-12">
                      <div className="small-4 columns">
                        <Typography className={classes.fontTitle}>
                          {'比例'}
                        </Typography>
                      </div>
                      <div className="small-8 columns">
                        <Typography>{`${feeChargeRate}%`}</Typography>
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
                            {moment(lastModifiedDate).format(
                              'YYYY-MM-DD HH:mm:ss'
                            )}
                          </Typography>
                        </div>
                      </div>
                    ) : null}
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

export default connect(mapStateToProps)(withStyles(styles)(OfferAcceptDetail));
