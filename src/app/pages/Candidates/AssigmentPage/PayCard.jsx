import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import moment from 'moment-timezone';

import PayForm from './components/form/PayForm';

const styles = {
  paper: {
    padding: '20px',
    minHeight: '550px',
    '& .MuiPaper-elevation1': {
      boxShadow: 'none',
    },
  },
  billPic: {
    width: '48px',
    height: '48px',
    borderRadius: '4px',
    backgroundColor: '#f6d365',
    color: 'white',
    textAlign: 'center',
    lineHeight: '48px',
  },
  Information: {
    minHeight: '100px',
  },
};

class PayCard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      classes,
      t,
      talentId,
      startId,
      createdTime,
      createdBy,
      pageType,
      status,
    } = this.props;
    const {} = this.state;
    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <Grid container spacing={3}>
            <Grid item xs={1}>
              <div className={classes.billPic}>Pay</div>
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
          <PayForm
            t={t}
            {...this.props}
            pageType={pageType}
            getPayRate={(val) => {
              this.props.getPayRate(val);
            }}
          />
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(PayCard);
