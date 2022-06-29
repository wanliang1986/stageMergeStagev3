import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import jobNoteSelector from '../../../../selectors/jobNoteSelector';

import Fab from '@material-ui/core/Fab';

import ContentAdd from '@material-ui/icons/Add';

import AddNote from '../../../../components/forms/AddNote';
import Note from '../../../../components/Note';

class JobNotes extends React.PureComponent {
  constructor(props, context) {
    super(props, context);
    this.state = {
      open: false,
      selectNote: null,
    };
  }

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false, selectNote: null });
  };

  openEdit = (note) => {
    this.setState({
      selectNote: note,
      open: true,
    });
  };

  render() {
    console.log('job relation: notes');

    const { noteList, jobId, users, ...props } = this.props;
    console.log(noteList);
    return (
      <div className="flex-child-auto " style={{ overflow: 'auto' }}>
        <div className="container-padding vertical-layout">
          <div>
            <Fab
              size="small"
              disabled={!props.canEdit}
              color="secondary"
              onClick={this.handleOpen}
            >
              <ContentAdd />
            </Fab>
          </div>
          {noteList.map((note) => (
            <Note
              key={note.get('id')}
              note={note}
              users={users}
              openEdit={(note) => {
                this.openEdit(note);
              }}
            />
          ))}
        </div>
        <AddNote
          isDialog
          open={this.state.open}
          selectNote={this.state.selectNote}
          {...props}
          entityId={jobId}
          type="job"
          handleRequestClose={this.handleClose}
        />
      </div>
    );
  }
}

JobNotes.prototypes = {
  jobId: PropTypes.string.isRequired,
};

function mapStoreStateToProps(state, { jobId }) {
  return {
    noteList: jobNoteSelector(state, jobId),
  };
}

export default connect(mapStoreStateToProps)(JobNotes);
