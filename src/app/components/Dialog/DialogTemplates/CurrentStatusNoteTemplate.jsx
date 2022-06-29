import { withStyles } from '@material-ui/core';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getActivitiesByApplication } from '../../../actions/applicationActions';
import Loading from '../../../components/particial/Loading';
import Grid from '@material-ui/core/Grid';
import Chip from '@material-ui/core/Chip';
import NotesOptions from './NotesOptions';
import { applicationStatus2 } from '../../../constants/formOptions';
import { withTranslation } from 'react-i18next';
const styles = {
  root: {
    width: '650px',
    maxHeight: '500px',
  },
  title: {
    width: '100%',
    marginBottom: '10px',
  },
  notesList: {
    width: '100%',
    maxHeight: '440px',
    paddingTop: '20px',
    overflowY: 'scroll',
    marginTop: '30px',
  },
};

class CurrentStatusNoteTemplate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notesList: null,
    };
  }

  componentDidMount() {
    const { applicationId, status } = this.props;
    this.props
      .dispatch(getActivitiesByApplication(applicationId))
      .then((res) => {
        if (res) {
          let statusNotes = res.filter((item, index) => {
            if (item.status === status) {
              return item;
            }
          });
          this.setState({
            notesList: statusNotes,
          });
        }
      });
  }
  // getLabel = (status) => {
  //     let label = applicationStatus.find((item, index) => {
  //         if (item.value === status) {
  //             return item
  //         }
  //     })
  //     return label.label
  // }
  getStyle = (status) => {
    switch (status) {
      case 'Applied':
        return { backgroundColor: 'rgb(51, 152, 219)', color: 'white' };
      case 'Interview':
        return { backgroundColor: 'rgb(253, 171, 41)', color: 'white' };
      case 'Started':
      case 'START_EXTENSION':
      case 'START_RATE_CHANGE':
        return { backgroundColor: 'rgb(221, 38, 95)', color: 'white' };
      case 'Offered':
      case 'Offer_Accepted':
        return { backgroundColor: 'rgb(245,109,80)', color: 'white' };
      case 'Submitted':
      case 'Shortlisted_By_Client':
        return { backgroundColor: '#21b66e', color: 'white' };
      case 'Internal_Rejected':
      case 'Candidate_Quit':
      case 'Client_Rejected':
      case 'Offer_Rejected':
      case 'START_TERMINATED':
      case 'START_FAIL_WARRANTY':
      case 'FAIL_TO_ONBOARD':
        return { backgroundColor: '#818181', color: 'white' };
    }
  };
  getLable = (status) => {
    let _status = applicationStatus2.filter((item, index) => {
      return item.value === status;
    });
    console.log(_status);
    return _status[0].label;
  };
  render() {
    const { applicationId, status, classes } = this.props;
    const { notesList } = this.state;
    console.log(notesList);
    if (!notesList) {
      return <Loading />;
    }
    if (notesList.length === 0) {
      return <div style={{ width: '300px' }}>No data available</div>;
    }
    return (
      <div className={classes.root}>
        <div className={classes.title}>
          <Grid container spacing={3}>
            <Grid item xs={4} style={{ marginLeft: '20px' }}>
              <h5>{this.props.t('tab:Current Status Notes')} </h5>
            </Grid>
            <Grid item xs={2}>
              <Chip
                size="small"
                label={this.getLable(status)}
                style={this.getStyle(status)}
              />
            </Grid>
          </Grid>
        </div>
        <div className={classes.notesList}>
          {notesList.map((item, index) => {
            return <NotesOptions key={index} data={item} />;
          })}
        </div>
      </div>
    );
  }
}

export default withTranslation('tab')(
  connect()(withStyles(styles)(CurrentStatusNoteTemplate))
);
