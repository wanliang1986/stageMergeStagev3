import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import talentNoteSelector from '../../../../selectors/talentNoteSelector';

import Fab from '@material-ui/core/Fab';

import ContentAdd from '@material-ui/icons/Add';

import AddNote from '../../../../components/forms/AddNote';
import Note from './CandidateNote';

class CandidateNotes extends React.PureComponent {
  constructor(props) {
    super(props);
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
    const { notes, candidateId, ...props } = this.props;
    console.log(notes.toJS());
    return (
      <div className="container-padding vertical-layout">
        <Fab size="small" color="secondary" onClick={this.handleOpen}>
          <ContentAdd />
        </Fab>
        <AddNote
          open={this.state.open}
          selectNote={this.state.selectNote}
          {...props}
          entityId={candidateId}
          type="talent"
          handleRequestClose={this.handleClose}
        />

        <div className="vertical-layout">
          {notes.map((note) => (
            <div key={note.get('id')}>
              <Note
                note={note}
                openEdit={(note) => {
                  this.openEdit(note);
                }}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }
}

CandidateNotes.prototypes = {
  candidateId: PropTypes.string.isRequired,
  notes: PropTypes.instanceOf(Immutable.List).isRequired,
};

function mapStoreStateToProps(state, { candidateId }) {
  return {
    notes: talentNoteSelector(state, candidateId),
  };
}

export default connect(mapStoreStateToProps)(CandidateNotes);
