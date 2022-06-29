import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Select from 'react-select';
import Divider from '@material-ui/core/Divider';
import FormTextArea from '../../particial/FormTextArea';
import FormInput from '../../particial/FormInput';
import FormReactSelectContainer from '../../particial/FormReactSelectContainer';
import Button from '@material-ui/core/Button';
import { addTalentNote } from '../../../actions/talentActions';
import { showErrorMessage } from '../../../actions';
const styles = {
  root: {
    width: '580px',
    height: '350px',
  },
  btn: {
    width: '100px',
    height: '40px',
    marginTop: '10px',
  },
};

const notesTypesnOptions = [
  { value: 'CALL_CANDIDATES', label: 'Call Candidates' },
  { value: 'CONSULTANT_INTERVIEW', label: 'Consultant Interview' },
  { value: 'CANDIDATES_NOTES', label: 'Candidates Notes' },
];

const notesStatus = [
  { value: 'OPEN_TO_NEW_OPPORTUNITIES', label: 'Open to new opportunities' },
  {
    value: 'NOT_ACTIVELY_LOOKING_FOR_NEW_OPPORTUNITIES',
    label: 'Not Actively Looking for New Opportunities',
  },
  { value: 'BLACKLIST', label: 'Blacklist' },
];

const priorityOption = [
  { value: 'NORMAL', label: 'Normal' },
  { value: 'HIGH', label: 'High' },
];

class AddCandidateNoteTemplate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      noteType: 'CALL_CANDIDATES',
      noteStatus: null,
      note: null,
      priority: 'NORMAL',
      title: null,
    };
  }
  noteTypeSelect = (type) => {
    this.setState({
      noteType: type,
    });
  };

  noteStatusSelect = (status) => {
    this.setState({
      noteStatus: status,
    });
  };

  inputChangeHandler = (e) => {
    this.setState({
      note: e.target.value,
    });
  };

  createNotes = () => {
    const { noteType, noteStatus, title, priority, note } = this.state;
    const { talentId } = this.props;
    let obj = {
      title: title,
      priority: priority,
      noteType: noteType,
      noteStatus: noteStatus,
      note: note,
      talentId: talentId,
    };
    if (!obj.title) {
      this.props.dispatch(showErrorMessage('Title is required'));
      return;
    } else if (!obj.note) {
      this.props.dispatch(showErrorMessage('Note is required'));
      return;
    }
    this.props.dispatch(addTalentNote(obj)).then((res) => {
      if (res) {
        this.props.closed();
        this.props.fetchData();
      }
    });
  };
  render() {
    const { talentId, classes } = this.props;
    const { noteType, noteStatus, note, title, priority } = this.state;
    return (
      <div className={classes.root}>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Select
              value={noteType}
              options={notesTypesnOptions}
              labelKey={'label'}
              valueKey={'value'}
              simpleValue
              onChange={(type) => {
                this.noteTypeSelect(type);
              }}
              autoBlur={true}
              searchable={false}
              clearable={false}
            />
          </Grid>
          {noteType && noteType !== 'CANDIDATES_NOTES' ? (
            <Grid item xs={6}>
              <Select
                value={noteStatus}
                options={notesStatus}
                labelKey={'label'}
                valueKey={'value'}
                simpleValue
                onChange={(status) => {
                  this.noteStatusSelect(status);
                }}
                autoBlur={true}
                searchable={false}
                clearable={false}
              />
            </Grid>
          ) : null}
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={8}>
            <FormInput
              name="title"
              label={'Title'}
              autoComplete="true"
              defaultValue={title}
              onChange={(e) => {
                this.setState({ title: e.target.value });
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <FormReactSelectContainer label={'Priority'}>
              <Select
                value={priority}
                options={priorityOption}
                labelKey={'label'}
                valueKey={'value'}
                simpleValue
                onChange={(priority) => {
                  this.setState({ priority: priority });
                }}
                autoBlur={true}
                searchable={false}
                clearable={false}
              />
            </FormReactSelectContainer>
          </Grid>
        </Grid>
        <div>
          <FormTextArea
            name="note"
            label={'Content'}
            rows="5"
            value={note}
            onChange={(e) => {
              this.inputChangeHandler(e);
            }}
          />
        </div>
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

export default connect()(withStyles(styles)(AddCandidateNoteTemplate));
