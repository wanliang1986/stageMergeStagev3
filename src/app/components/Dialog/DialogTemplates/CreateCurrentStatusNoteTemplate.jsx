import { withStyles } from '@material-ui/core';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import Chip from '@material-ui/core/Chip';
import { applicationStatus2 } from '../../../constants/formOptions';
import FormTextArea from '../../particial/FormTextArea';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import {
  getApplication,
  updateApplication,
} from '../../../actions/applicationActions';
import { showErrorMessage } from '../../../actions';
const styles = {
  root: {
    width: '550px',
    height: '250px',
  },
  title: {
    width: '100%',
    marginBottom: '10px',
  },
  btn: {
    width: '100px',
    height: '40px',
    marginTop: '10px',
  },
};

class CreateCurrentStatusNoteTemplate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      note: null,
    };
  }
  getLabel = (status) => {
    let label = applicationStatus2.find((item, index) => {
      if (item.value === status) {
        return item;
      }
    });
    if (label) {
      return label.label;
    }
  };
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

  inputChangeHandler = (e) => {
    this.setState({
      note: e.target.value,
    });
  };
  createNotes = () => {
    const { note } = this.state;
    console.log(note);
    let value = note && note.replace(/\ +/g, '');
    if (!note || value === '') {
      this.props.dispatch(showErrorMessage('Note is required'));
      return;
    }
    const { applicationId, status } = this.props;
    this.props.dispatch(getApplication(applicationId)).then((res) => {
      let resumeId = res.resumeId;
      let status = res.status;
      let params = {
        memo: note,
        status: status,
        resumeId: resumeId,
      };
      this.props
        .dispatch(updateApplication(params, applicationId))
        .then((res) => {
          this.props.closed();
          this.props.fetchData();
        });
    });
  };
  render() {
    const { applicationId, status, classes } = this.props;
    const { note } = this.state;
    return (
      <div className={classes.root}>
        <div className={classes.title}>
          <Grid container spacing={3}>
            <Grid item xs={8}>
              <h5>Create Note for Current Status</h5>
            </Grid>
            <Grid item xs={4}>
              <Chip
                size="small"
                label={this.getLabel(status)}
                style={this.getStyle(status)}
              />
            </Grid>
          </Grid>
        </div>
        <FormTextArea
          name="note"
          label={'Content'}
          rows="5"
          value={note}
          onChange={(e) => {
            this.inputChangeHandler(e);
          }}
        />
        <Divider />
        <Button
          className={classes.btn}
          variant="contained"
          color="primary"
          onClick={() => {
            this.createNotes();
          }}
        >
          Save
        </Button>
      </div>
    );
  }
}

export default connect()(withStyles(styles)(CreateCurrentStatusNoteTemplate));
