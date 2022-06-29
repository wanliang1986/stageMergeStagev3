import React from 'react';
import PropTypes from 'prop-types';

import Dialog from '@material-ui/core/Dialog';

import AddNoteForm from './AddNoteForm';

class AddNote extends React.Component {
  render() {
    const { open, ...props } = this.props;
    return (
      <Dialog
        open={open}
        fullWidth
        maxWidth="sm"
        onClose={props.handleRequestClose}
      >
        <AddNoteForm {...props} />
      </Dialog>
    );
  }
}

AddNote.propTypes = {
  entityId: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
  handleRequestClose: PropTypes.func.isRequired,
};

export default AddNote;
