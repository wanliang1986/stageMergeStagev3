import { withStyles } from '@material-ui/core';
import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import moment from 'moment-timezone';
import Chip from '@material-ui/core/Chip';
import { withTranslation } from 'react-i18next';
const styles = {
  Symbol: {
    width: '4px',
    height: '12px',
    backgroundColor: '#3398dc',
    display: 'inline-block',
  },
  content: {
    width: '100%',
    marginTop: '10px',
    maxHeight: '150px',
    padding: '10px',
  },
};

class CandidateNotesOptions extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  NoteType = (str) => {
    const { classes } = this.props;
    return (
      <>
        <div className={classes.Symbol}></div>
        <Typography
          style={{
            display: 'inline-block',
            marginLeft: '10px',
            fontSize: '14px',
          }}
        >
          {this.props.t('tab:Candidate Notes')}- {str}
        </Typography>
      </>
    );
  };
  getNoteType = (data) => {
    if (data.get('noteType')) {
      switch (data.get('noteType')) {
        case 'CALL_CANDIDATES':
          return this.NoteType('Call Candidates');
        case 'CONSULTANT_INTERVIEW':
          return this.NoteType('Consultant Interview');
        case 'CANDIDATES_NOTES':
          return this.NoteType('Candidates Notes');
      }
    } else {
      return null;
    }
  };
  getNoteStatus = (data) => {
    if (data.get('noteStatus')) {
      switch (data.get('noteStatus')) {
        case 'OPEN_TO_NEW_OPPORTUNITIES':
          return (
            <Chip
              size="small"
              label={'Open to new opportunities'}
              style={{
                backgroundColor: 'rgba(54, 179, 126, 0.2)',
                color: '#36b37e',
              }}
            />
          );
        case 'NOT_ACTIVELY_LOOKING_FOR_NEW_OPPORTUNITIES':
          return (
            <Chip
              size="small"
              label={'Not Actively Looking for New Opportunities'}
              style={{
                backgroundColor: 'rgba(51, 152, 220, 0.2)',
                color: '#3398dc',
              }}
            />
          );
        case 'BLACKLIST':
          return (
            <Chip
              size="small"
              label={'Blacklist'}
              style={{
                backgroundColor: 'rgba(245, 166, 35, 0.2)',
                color: '#f5a623',
              }}
            />
          );
      }
    } else {
      return null;
    }
  };
  getCreatedUser = (data) => {
    if (data.get('user')) {
      return data.get('user').get('fullName');
    }
  };
  getDate = (data) => {
    if (data.get('createdDate')) {
      return moment(data.get('createdDate')).format('L');
    }
  };
  render() {
    const { data, classes } = this.props;

    return (
      <>
        <Paper elevation={3} style={{ width: '95%', margin: '25px auto' }}>
          <Grid container spacing={3}>
            <Grid item xs={6} style={{ padding: '20px', color: '#aab1b8' }}>
              {this.getNoteType(data)}
            </Grid>
            <Grid
              item
              xs={6}
              style={{ textAlign: 'right', padding: '20px', color: '#aab1b8' }}
            >
              {this.getNoteStatus(data)}
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={7} style={{ padding: '20px', color: '#aab1b8' }}>
              {this.getCreatedUser(data)}
            </Grid>
            <Grid
              item
              xs={5}
              style={{ textAlign: 'right', padding: '20px', color: '#aab1b8' }}
            >
              {this.getDate(data)}
            </Grid>
          </Grid>
          <Divider />
          <div className={classes.content}>
            <Typography variant="body1" style={{ color: '#aab1b8' }}>
              Content
            </Typography>
            <Typography
              variant="body2"
              style={{
                width: '100%',
                wordWrap: 'break-word',
                maxHeight: '100px',
                overflowY: 'scroll',
              }}
            >
              {data.get('note')}
            </Typography>
          </div>
        </Paper>
      </>
    );
  }
}

export default withTranslation('tab')(
  withStyles(styles)(CandidateNotesOptions)
);
