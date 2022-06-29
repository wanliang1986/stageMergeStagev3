import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Badge from '@material-ui/core/Badge';
import DropDownBtn from './components/dropDownBtn';
import ClearAllIcon from '@material-ui/icons/ClearAll';
import Divider from '@material-ui/core/Divider';
import BillCard from './BillCard';
import EditIcon from '@material-ui/icons/Edit';
import { withTranslation } from 'react-i18next';

import { withStyles } from '@material-ui/styles';
import moment from 'moment-timezone';
import * as apnSDK from '../../../../apn-sdk';
import { getClientContactArrayByCompany } from '../../../selectors/clientSelector';
import { getClientContactList } from '../../../actions/clientActions';

import {
  getAssignmentList,
  getAssignmentDetail,
  getLatestAssignment,
} from '../../../actions/assignment';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import * as ActionTypes from '../../../constants/actionTypes';
import loadsh from 'lodash';
import memoizeOne from 'memoize-one';
const styles = {
  root: {
    width: '100%',
    height: '100%',
  },
  billCardTitle: {
    width: '100%',
    height: '150px',
    padding: '10px',
  },
  title: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  mleft: {
    marginLeft: '10px',
  },
  btns: {
    '& .MuiButton-root': {
      minWidth: '48px',
      minHeight: '48px',
    },
  },
  billTitle: {
    width: '100%',
    padding: '0px 10px',
    backgroundColor: '#c2e9fb',
    marginBottom: '13px',
    borderRadius: '4px 4px 0px 0px',
  },
  billTitle_1: {
    width: '100%',
    padding: '0px 10px',
    backgroundColor: '#fee140',
    marginBottom: '13px',
    borderRadius: '4px 4px 0px 0px',
  },
  billCards: {
    width: '100%',
    overFlowX: 'scroll',
    marginTop: '20px',
  },
  billCardsBox: {
    display: 'flex',
  },
  billCardBox: {
    minWidth: '700px',
    marginLeft: '10px',
    flex: 1,
  },
  btnOpen: {
    width: '48px',
    height: '48px',
    backgroundColor: '#3cba92',
    color: '#fff',
    marginLeft: '10px',
    '&:hover': {
      width: '48px',
      height: '48px',
      backgroundColor: '#7af1cb',
    },
  },
  btnOpen1: {
    width: '48px',
    height: '48px',
    backgroundColor: '#f6d365',
    color: '#fff',
    marginLeft: '10px',
    '&:hover': {
      width: '48px',
      height: '48px',
      backgroundColor: '#f6e5af',
    },
  },
  btnOpen2: {
    width: '48px',
    height: '48px',
    backgroundColor: '#3398dc',
    color: '#fff',
    marginLeft: '10px',
    '&:hover': {
      width: '48px',
      height: '48px',
      backgroundColor: '#68bdf7',
    },
  },
  btnDisabled: {
    width: '48px',
    height: '48px',
    backgroundColor: '#e8e8e8',
    color: '#999',
    marginLeft: '10px',
  },
};

class BillHistoryPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      assignmentCurrentList: null,
      newResponse: null,
    };
  }

  componentDidMount() {
    const { dispatch, currentStart } = this.props;
    dispatch(getAssignmentList(currentStart.get('id'))).then((response) => {
      this.setState({
        newResponse: response,
      });
      let order = response.map((item, index) => {
        return item.id;
      });
      let _assignmentCurrentList = [];

      const promise = new Promise((resolve, reject) => {
        response.forEach((item, index) => {
          let obj;
          apnSDK.getAssignmentDetail(item.id).then((res) => {
            obj = {
              ...item,
              ...res.response,
            };
            console.log(order);
            _assignmentCurrentList.push(obj);
            _assignmentCurrentList.sort((a, b) => {
              return order.indexOf(a.id) - order.indexOf(b.id);
            });
            if (
              _assignmentCurrentList.length === this.state.newResponse.length
            ) {
              resolve(_assignmentCurrentList);
            }
          });
        });
      });
      promise.then((res) => {
        this.setState({
          assignmentCurrentList: res,
        });
      });
    });
    dispatch(getClientContactList(currentStart.get('companyId')));
  }

  timeJudge = (obj) => {
    let newDate = new Date().getTime();
    let endDate = moment(obj.endDate)
      .add(23, 'hours')
      .add(59.999999, 'minutes')
      .valueOf();
    if (newDate > endDate && obj.status !== 'PENDING') {
      return false;
    }
    return true;
  };

  timeJudge_1 = (obj) => {
    if (obj.status === 'APPROVED') {
      let newDate = new Date().getTime();
      let endDate = moment(obj.endDate)
        .add(23, 'hours')
        .add(59.999999, 'minutes')
        .valueOf();
      let startDate = moment(obj.startDate).valueOf();
      if (newDate > endDate) {
        return '(Ended Assignment)';
      } else if (newDate < endDate && newDate > startDate) {
        return '(Current Assignment)';
      } else {
        return '(Future Assignment)';
      }
    }
    return null;
  };

  toAssignmentDetail = (id) => {
    this.props.history.push({
      pathname: `/candidates/assignment/${id}`,
      state: { pageType: 'default' },
    });
  };

  handleMenuItemClick = (index) => {
    const { dispatch, currentStart } = this.props;
    if (index === 0) {
      this.props.history.push({
        pathname: `/candidates/CreateAssignment/${'EXTENSION'}`,
        state: { pageType: 'default' },
      });
    } else {
      this.props.history.push({
        pathname: `/candidates/CreateAssignment/${'RATE_CHANGE'}`,
        state: { pageType: 'default' },
      });
    }
    dispatch(getLatestAssignment(currentStart.get('id')));
  };

  companyAm = (recommendation, startJobId) => {
    let company = recommendation.filter((item, index) => {
      if (item.id === startJobId) {
        return item.company;
      }
    });
    if (company.length > 0) {
      return company[0].company.isAm;
    }
    return false;
  };

  isJobAM = () => {
    const { userId, jobs, startJobId } = this.props;
    console.log(jobs.toJS());
    console.log(startJobId);
    let assignedUsers =
      jobs.get(`${startJobId}`) &&
      jobs.get(`${startJobId}`).get('assignedUsers');
    let status =
      assignedUsers &&
      assignedUsers.some((item, index) => {
        return item.get('userId') === userId && item.get('permission') === 'AM';
      });
    return status;
  };

  render() {
    const {
      classes,
      t,
      location,
      assignmentBasicInfor,
      clientList,
      hasAdmin,
      isCommissionAM,
      recommendation,
      startJobId,
      currentStart,
      contactsList,
    } = this.props;
    const { assignmentCurrentList } = this.state;
    let pageType = location ? location.state.pageType : 'default';
    return (
      <div className={classes.root}>
        <Paper>
          <Tabs value={0} indicatorColor="primary" textColor="primary">
            <Tab label="Assigment" />
          </Tabs>
          <div className={classes.billCardTitle}>
            <div className={classes.title}>
              <Typography variant="h6">Bill History</Typography>
            </div>
            <Grid container spacing={3}>
              <Grid item xs={8}>
                <DropDownBtn
                  disabled={
                    !hasAdmin &&
                    !isCommissionAM &&
                    !this.companyAm(recommendation, startJobId) &&
                    !this.isJobAM()
                  }
                  handleMenuItemClick={(index) => {
                    this.handleMenuItemClick(index);
                  }}
                />
              </Grid>

              <Grid
                item
                xs={4}
                container
                direction="row"
                justifyContent="flex-end"
                className={classes.btns}
              >
                {
                  <Badge
                    badgeContent={assignmentBasicInfor.assignmentCount}
                    color="secondary"
                  >
                    <Button
                      className={classes.btnOpen}
                      onClick={() => {
                        this.props.history.push({
                          pathname: '/candidates/billHistory',
                          state: { pageType: 'history' },
                        });
                      }}
                    >
                      Bill
                    </Button>
                  </Badge>
                }
                {
                  <Badge
                    badgeContent={assignmentBasicInfor.assignmentCount}
                    color="secondary"
                  >
                    <Button
                      className={classes.btnOpen1}
                      onClick={() => {
                        this.props.history.push({
                          pathname: '/candidates/payHistory',
                          state: { pageType: 'history' },
                        });
                      }}
                    >
                      Pay
                    </Button>
                  </Badge>
                }

                {hasAdmin ||
                isCommissionAM ||
                this.companyAm(recommendation, startJobId) ||
                this.isJobAM() ? (
                  <Button className={classes.btnOpen2}>
                    <ClearAllIcon
                      onClick={() => {
                        this.props.history.push({
                          pathname: `/timesheets/Search/${currentStart.get(
                            'talentId'
                          )}`,
                        });
                      }}
                    />
                  </Button>
                ) : (
                  <Button className={classes.btnDisabled} disabled>
                    <ClearAllIcon />
                  </Button>
                )}
              </Grid>
            </Grid>
          </div>
          <Divider />
          <div className={classes.billCards}>
            <div className={classes.billCardsBox}>
              {assignmentCurrentList &&
                assignmentCurrentList.map((item, index) => {
                  return (
                    <div key={index}>
                      <div className={classes.billCardBox}>
                        <div
                          className={
                            item.status === 'PENDING'
                              ? classes.billTitle
                              : classes.billTitle_1
                          }
                        >
                          <Grid container spacing={3}>
                            <Grid item xs={10} style={{ padding: '5px' }}>
                              {item.startDate} - {item.endDate}{' '}
                              {this.timeJudge_1(item)}
                            </Grid>
                            <Grid
                              item
                              xs={2}
                              style={{ textAlign: 'right', padding: '5px' }}
                            >
                              {this.timeJudge(item) === true &&
                              (hasAdmin ||
                                isCommissionAM ||
                                this.companyAm(recommendation, startJobId) ||
                                this.isJobAM()) ? (
                                <EditIcon
                                  style={{
                                    fontSize: '20px',
                                    color: '#3598dc',
                                    cursor: 'pointer',
                                  }}
                                  onClick={() => {
                                    this.toAssignmentDetail(item.id);
                                  }}
                                />
                              ) : null}
                            </Grid>
                          </Grid>
                        </div>
                        <BillCard
                          t={t}
                          index={item.id}
                          createdBy={item.createdBy}
                          createdTime={item.createdTime}
                          startId={item.startId}
                          talentId={item.talentId}
                          assignmentId={item.id}
                          status={item.status}
                          isExempt={
                            item.billInfo &&
                            item.billInfo.assignmentId === item.id &&
                            item.billInfo.isExcept
                          }
                          billInfo={
                            item.billInfo &&
                            item.billInfo.assignmentId === item.id
                              ? item.billInfo
                              : null
                          }
                          timeSheet={
                            item.timeSheet &&
                            item.billInfo.assignmentId === item.id
                              ? item.timeSheet
                              : null
                          }
                          workingLocation={
                            item.workLocation &&
                            item.billInfo.assignmentId === item.id
                              ? item.workLocation
                              : null
                          }
                          userInfo={
                            item.userInfo &&
                            item.billInfo.assignmentId === item.id
                              ? item.userInfo
                              : null
                          }
                          pageType={pageType}
                          clientList={clientList}
                          contactsList={contactsList}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </Paper>
      </div>
    );
  }
}

const mapStateToProps = (state, { match }) => {
  const authorities = state.controller.currentUser.get('authorities');
  const userId = state.controller.currentUser.get('id');
  const recommendation = state.controller.newCandidateJob.get(
    'dialogRecommendation'
  );
  const startJobId =
    state.controller.currentStart.get('start') &&
    state.controller.currentStart.get('start').get('jobId');
  const jobs = state.model.jobs;
  const hasAdmin =
    !!authorities &&
    (authorities.includes(Immutable.Map({ name: 'ROLE_TENANT_ADMIN' })) ||
      authorities.includes(Immutable.Map({ name: 'ROLE_ADMIN' })));
  let assignmentBasicInfor = state.controller.assignment.get(
    'assignmentBasicInfor'
  );
  let assignmentId = match.params.assignmentId;
  const currentStart =
    state.controller.currentStart.size > 0
      ? state.controller.currentStart.get('start')
      : Immutable.fromJS(
          JSON.parse(window.localStorage.getItem('currentStart'))
        );
  const commissions = currentStart && currentStart.get('startCommissions');
  const assignmentCurrentList = state.controller.assignment.get(
    'assignmentCurrentList'
  );
  const isCommissionAM =
    commissions &&
    commissions.some((item, index) => {
      return item.get('userId') === userId && item.get('userRole') === 'AM';
    });
  const clientList = getClientContactArrayByCompany(
    state,
    currentStart.get('companyId')
  );

  console.log(clientList);
  return {
    assignmentBasicInfor,
    currentStart,
    assignmentId,
    assignmentCurrentList,
    hasAdmin,
    isCommissionAM,
    clientList: getClientContactArrayByCompany(
      state,
      currentStart.get('companyId')
    ),
    contactsList: getClientContactArrayByCompany(
      state,
      currentStart.get('companyId')
    ),
    recommendation,
    startJobId,
    jobs,
    userId,
  };
};

export default withTranslation(['tab', 'action', 'field', 'message'])(
  connect(mapStateToProps)(withStyles(styles)(BillHistoryPage))
);

// const getClientList = memoizeOne((clients, clientContactId) => {
//   return clients
//     .filter((c) => c.get('id') === clientContactId)
//     .toList()
//     .toJS();
// });
