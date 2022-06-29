import { withStyles } from '@material-ui/core';
import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ClearAllIcon from '@material-ui/icons/ClearAll';
import Badge from '@material-ui/core/Badge';
import FormInput from '../../../../components/particial/FormInput';
import FormReactSelectContainer from '../../../../components/particial/FormReactSelectContainer';
import DatePicker from 'react-datepicker';
import * as ActionTypes from '../../../../constants/actionTypes';

import { getAssignmentCurrent } from '../../../../actions/assignment';
import { connect } from 'react-redux';
import Immutable from 'immutable';

const styles = {
  root: {
    width: '100%',
    height: '100%',
    padding: '20px',
    '& .MuiButton-root': {
      minWidth: '48px',
      minHeight: '48px',
    },
  },
  title: {
    textAlign: 'center',
  },
  subtitle: {
    marginTop: '10px',
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
  form: {
    marginTop: '20px',
  },
};

class AssignmentTab extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  assignmentDetails = () => {
    const { assignment } = this.props;
    if (assignment && assignment.assignmentCount > 0) {
      this.props.history.push({
        pathname: `/candidates/assignment/${assignment.id}`,
        state: { pageType: 'default' },
      });
    } else {
      this.props.history.push({
        pathname: `/candidates/CreateAssignment/${'ASSIGNMENT'}`,
        state: { pageType: 'default' },
      });
    }
  };
  componentDidMount() {
    const { dispatch, currentStart } = this.props;
    dispatch(getAssignmentCurrent(currentStart && currentStart.get('id'))).then(
      (res) => {
        console.log(res);
      }
    );
    //调接口，数据存储到redux
  }

  render() {
    const {
      classes,
      t,
      hasAdmin,
      isCommissionAM,
      isCompanyAm,
      isJobAM,
      assignment,
      currentStart,
    } = this.props;
    let talentId = currentStart && currentStart.get('talentId');
    return (
      <div className={classes.root}>
        <div className={classes.title}>
          {assignment && assignment.assignmentCount > 0 ? (
            <Typography variant="h5">Assignment</Typography>
          ) : (
            <Typography variant="h5">New Assignment</Typography>
          )}
        </div>
        <div className={classes.subtitle}>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <Typography variant="h6">General Information</Typography>
            </Grid>
            <Grid item xs={6} container justifyContent="flex-end">
              {assignment && assignment.assignmentCount > 0 ? (
                <Badge
                  badgeContent={assignment.assignmentCount}
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
              ) : (
                <Button className={classes.btnDisabled} disabled>
                  Bill
                </Button>
              )}
              {assignment && assignment.assignmentCount > 0 ? (
                <Badge
                  badgeContent={assignment.assignmentCount}
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
              ) : (
                <Button className={classes.btnDisabled} disabled>
                  Pay
                </Button>
              )}
              {assignment &&
              assignment.assignmentCount > 0 &&
              (hasAdmin || isCommissionAM || isCompanyAm || isJobAM) ? (
                <Button
                  className={classes.btnOpen2}
                  onClick={() => {
                    this.props.history.push({
                      pathname: `/timesheets/Search/${talentId}`,
                    });
                  }}
                >
                  <ClearAllIcon />
                </Button>
              ) : (
                <Button className={classes.btnDisabled} disabled>
                  <ClearAllIcon />
                </Button>
              )}
            </Grid>
          </Grid>
        </div>
        <div className={classes.form}>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <FormReactSelectContainer
                label={t('field:Start Date')}
                isRequired={true}
              >
                <DatePicker
                  placeholderText="mm/dd/yyyy"
                  value={
                    assignment && assignment.startDate
                      ? assignment.startDate
                      : currentStart && currentStart.get('startDate')
                  }
                  disabled
                />
              </FormReactSelectContainer>
            </Grid>
            <Grid item xs={6}>
              <FormReactSelectContainer
                label={t('field:End Date')}
                isRequired={true}
              >
                <DatePicker
                  placeholderText="mm/dd/yyyy"
                  value={
                    assignment && assignment.endDate
                      ? assignment.endDate
                      : currentStart && currentStart.get('endDate')
                  }
                  disabled
                />
              </FormReactSelectContainer>
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={4}>
              <FormInput
                name="JobNumber"
                label={t('field:jobNumber')}
                value={
                  assignment && assignment.jobId
                    ? assignment.jobId
                    : currentStart && currentStart.get('jobId')
                }
                disabled
              />
            </Grid>
            <Grid item xs={4}>
              <FormInput
                name="Title"
                label={t('field:Title')}
                value={
                  assignment && assignment.jobTitle
                    ? assignment.jobTitle
                    : currentStart && currentStart.get('jobTitle')
                }
                disabled
              />
            </Grid>
            <Grid item xs={4}>
              <FormInput
                name="Company"
                label={t('field:Company')}
                value={
                  assignment && assignment.companyName
                    ? assignment.companyName
                    : currentStart && currentStart.get('company')
                }
                disabled
              />
            </Grid>
          </Grid>
        </div>
        <div style={{ marginTop: '10px' }}>
          <Button
            variant="contained"
            color="primary"
            size="small"
            disabled={!hasAdmin && !isCommissionAM && !isCompanyAm && !isJobAM}
            onClick={() => {
              this.assignmentDetails();
            }}
          >
            Assignment Details
          </Button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  console.log(state.controller.assignment.toJS());
  let assignment = state.controller.assignment.get('assignmentBasicInfor');
  console.log(assignment);
  let currentStart = state.controller.currentStart.get('start')
    ? state.controller.currentStart.get('start')
    : Immutable.fromJS(JSON.parse(window.localStorage.getItem('currentStart')));
  return {
    assignment,
    currentStart,
  };
};

export default connect(mapStateToProps)(withStyles(styles)(AssignmentTab));
