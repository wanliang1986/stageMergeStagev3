import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Divider from '@material-ui/core/Divider';
import { withStyles } from '@material-ui/core/styles';

import BillInfoFrom from './components/form/BillInforForm';
import TimeSheetForm from './components/form/timeSheetForm';
import WorkingInformationForm from './components/form/workingInformationForm';
import AssignedUserForm from './components/form/assignedUserForm';
import moment from 'moment-timezone';

const styles = {
  paper: {
    minHeight: '550px',
    overflowY: 'scroll',
  },
  billBox: {
    padding: '20px',
    height: '550px',

    '& .MuiPaper-elevation1': {
      boxShadow: 'none',
    },
  },
  billPic: {
    width: '48px',
    height: '48px',
    borderRadius: '4px',
    backgroundColor: '#3cba92',
    color: 'white',
    textAlign: 'center',
    lineHeight: '48px',
  },
  Information: {
    minHeight: '112px',
  },
};

class BillCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      billAccordion: false,
      timeSheetAccordion: false,
      workingAccordion: false,
      AssignedAccordion: false,
    };
  }
  billAccordionChange = (event, expanded) => {
    this.setState({
      billAccordion: expanded,
    });
  };
  timeSheetAccordionChange = (event, expanded) => {
    this.setState({
      timeSheetAccordion: expanded,
    });
  };
  workingAccordionChange = (event, expanded) => {
    this.setState({
      workingAccordion: expanded,
    });
  };
  AssignedAccordionChange = (event, expanded) => {
    this.setState({
      AssignedAccordion: expanded,
    });
  };

  render() {
    const {
      classes,
      t,
      talentId,
      startId,
      createdTime,
      createdBy,
      billInfo,
      timeSheet,
      workingLocation,
      userInfo,
      index,
      status,
      errorMessage,
    } = this.props;
    const {
      billAccordion,
      timeSheetAccordion,
      workingAccordion,
      AssignedAccordion,
    } = this.state;
    let pageType = this.props.location
      ? this.props.location.state.pageType
      : 'default';
    return (
      <div className={classes.root}>
        <Paper className={classes.paper} key={`billCard_${index}`}>
          <div className={classes.billBox}>
            <Grid container spacing={3}>
              <Grid item xs={1}>
                <div className={classes.billPic}>Bill</div>
              </Grid>
              <Grid item xs={1} container direction="row" alignItems="center">
                <div style={{ marginBottom: '10px' }}>
                  {status && status === 'PENDING' ? 'Pending' : null}
                </div>
              </Grid>
              <Grid
                item
                xs={10}
                container
                direction="row"
                justifyContent="flex-end"
              >
                {createdBy ? (
                  <Grid container justifyContent="flex-end">
                    by {createdBy},
                    {moment(createdTime).format('MM/DD/YY hh:mm A')}
                  </Grid>
                ) : null}
                <Grid container justifyContent="flex-end">
                  Start ID:{startId}
                </Grid>
                <Grid container justifyContent="flex-end">
                  Candidate ID:{talentId}
                </Grid>
              </Grid>
            </Grid>
            <div className={classes.Information}>
              <Accordion onChange={this.billAccordionChange}>
                <AccordionSummary
                  expandIcon={
                    <ExpandMoreIcon
                      style={{
                        color: '#3598dc',
                        marginRight: '80px',
                        marginLeft: '80px',
                      }}
                    />
                  }
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography variant="h6">Billing Information</Typography>
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      height: '25px',
                      lineHeight: '25px',
                      color: '#3598dc',
                    }}
                  >
                    {!billAccordion ? 'Expand More' : 'Expand Less'}
                  </div>
                </AccordionSummary>
                <AccordionDetails>
                  <div style={{ width: '100%' }} id="billingInforMation">
                    <BillInfoFrom
                      t={t}
                      billInfo={billInfo}
                      pageType={pageType}
                      timeSheetType={timeSheet && timeSheet.timeSheetType}
                      errorMessage={errorMessage}
                      {...this.props}
                    />
                  </div>
                </AccordionDetails>
              </Accordion>
            </div>
            <Divider />
            <div className={classes.Information}>
              <Accordion onChange={this.timeSheetAccordionChange}>
                <AccordionSummary
                  expandIcon={
                    <ExpandMoreIcon
                      style={{
                        color: '#3598dc',
                        marginRight: '80px',
                        marginLeft: '80px',
                      }}
                    />
                  }
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography variant="h6">{`Timesheet & Expense`}</Typography>
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      height: '25px',
                      lineHeight: '25px',
                      color: '#3598dc',
                    }}
                  >
                    {!timeSheetAccordion ? 'Expand More' : 'Expand Less'}
                  </div>
                </AccordionSummary>
                <AccordionDetails>
                  <div style={{ width: '100%' }}>
                    <TimeSheetForm
                      t={t}
                      timeSheet={timeSheet}
                      pageType={pageType}
                      errorMessage={errorMessage}
                      {...this.props}
                    />
                  </div>
                </AccordionDetails>
              </Accordion>
            </div>
            <Divider />
            <div className={classes.Information}>
              <Accordion onChange={this.workingAccordionChange}>
                <AccordionSummary
                  expandIcon={
                    <ExpandMoreIcon
                      style={{
                        color: '#3598dc',
                        marginRight: '80px',
                        marginLeft: '80px',
                      }}
                    />
                  }
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography variant="h6">Working Information</Typography>
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      height: '25px',
                      lineHeight: '25px',
                      color: '#3598dc',
                    }}
                  >
                    {!workingAccordion ? 'Expand More' : 'Expand Less'}
                  </div>
                </AccordionSummary>
                <AccordionDetails>
                  <div style={{ width: '100%' }} id="workingInformation">
                    <WorkingInformationForm
                      t={t}
                      workingLocation={workingLocation}
                      pageType={pageType}
                      errorMessage={errorMessage}
                      {...this.props}
                    />
                  </div>
                </AccordionDetails>
              </Accordion>
            </div>
            <Divider />
            <div className={classes.Information}>
              <Accordion onChange={this.AssignedAccordionChange}>
                <AccordionSummary
                  expandIcon={
                    <ExpandMoreIcon
                      style={{
                        color: '#3598dc',
                        marginRight: '80px',
                        marginLeft: '80px',
                      }}
                    />
                  }
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography variant="h6">
                    Assigned User Information
                  </Typography>
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      height: '25px',
                      lineHeight: '25px',
                      color: '#3598dc',
                    }}
                  >
                    {!AssignedAccordion ? 'Expand More' : 'Expand Less'}
                  </div>
                </AccordionSummary>
                <AccordionDetails>
                  <div style={{ width: '100%' }} id="assignUser">
                    <AssignedUserForm
                      t={t}
                      userInfo={userInfo}
                      errorMessage={errorMessage}
                      pageType={pageType}
                      {...this.props}
                    />
                  </div>
                </AccordionDetails>
              </Accordion>
            </div>
          </div>
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(BillCard);
