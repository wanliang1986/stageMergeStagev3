import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { addJobNote, editJobNote } from '../../../actions/jobActions';
import { addTalentNote, editTalentNote } from '../../../actions/talentActions';
import { showErrorMessage } from '../../../actions/';
import {
  notesTypesnOptions,
  notesStatus,
  notePriority,
} from '../../../constants/formOptions';

import Select from 'react-select';

import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import PrimaryButton from '../../particial/PrimaryButton';
import FormInput from '../../particial/FormInput';
import FormTextArea from '../../particial/FormTextArea';
import FormReactSelectContainer from '../../particial/FormReactSelectContainer';

class AddNoteForm extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      noteType: props.selectNote
        ? props.selectNote.get('noteType')
        : notesTypesnOptions[0].value,
      noteStatus: props.selectNote ? props.selectNote.get('noteStatus') : '',
      priority: props.selectNote
        ? props.selectNote.get('priority')
        : notePriority[0].value,
      processing: false,
    };
    this.form = React.createRef();
  }

  handleAddCommentSubmit = (e) => {
    e.stopPropagation();
    const addCommentForm = this.form.current;
    if (!addCommentForm.note.value && !addCommentForm.title.value) {
      this.props.dispatch(showErrorMessage('Note or Title is required'));
      return;
    }
    if (addCommentForm.title.value.length > 255) {
      this.props.dispatch(
        showErrorMessage('The length of Title is More than 255')
      );
      return;
    }
    if (addCommentForm.note.value.length > 5000) {
      this.props.dispatch(
        showErrorMessage('The length of Content is More than 5000')
      );
      return;
    }

    if (this.props.type === 'job') {
      this.setState({ processing: true });
      const note = {
        title: addCommentForm.title.value,
        note: addCommentForm.note.value,
        priority: addCommentForm.priority.value,
        jobId: this.props.entityId,
      };
      if (this.props.selectNote && this.props.selectNote.get('id')) {
        this.props
          .dispatch(editJobNote(note, this.props.selectNote.get('id')))
          .then(this.props.handleRequestClose)
          .catch((err) => {
            this.setState({ processing: false });
            this.props.dispatch(showErrorMessage(err));
          });
      } else {
        this.props
          .dispatch(addJobNote(note))
          .then(this.props.handleRequestClose)
          .catch((err) => {
            this.setState({ processing: false });
            this.props.dispatch(showErrorMessage(err));
          });
      }
    }

    if (this.props.type === 'talent') {
      if (addCommentForm.noteType.value !== notesTypesnOptions[2].value) {
        if (!addCommentForm.noteStatus.value) {
          this.props.dispatch(showErrorMessage('Type is required'));
          return;
        }
      }
      this.setState({ processing: true });
      const note = {
        title: addCommentForm.title.value,
        note: addCommentForm.note.value,
        priority: addCommentForm.priority.value,
        noteStatus:
          addCommentForm.noteType.value === notesTypesnOptions[2].value
            ? null
            : addCommentForm.noteStatus.value,
        noteType: addCommentForm.noteType.value,
        talentId: this.props.entityId,
      };
      if (this.props.selectNote && this.props.selectNote.get('id')) {
        this.props
          .dispatch(editTalentNote(note, this.props.selectNote.get('id')))
          .then(this.props.handleRequestClose)
          .catch((err) => {
            this.setState({ processing: false });
            this.props.dispatch(showErrorMessage(err));
          });
      } else {
        this.props
          .dispatch(addTalentNote(note))
          .then(this.props.handleRequestClose)
          .catch((err) => {
            this.setState({ processing: false });
            this.props.dispatch(showErrorMessage(err));
          });
      }
    }
  };

  render() {
    const { t, type, selectNote } = this.props;
    const { noteType, noteStatus, priority, processing } = this.state;
    return (
      <>
        <DialogTitle>
          {type === 'job'
            ? t('common:Create Job Notes')
            : t('common:Create Candidate Notes')}
        </DialogTitle>
        <DialogContent>
          <form className="vertical-layout" ref={this.form}>
            <div className="row expanded">
              {type !== 'job' && (
                <>
                  <div className="small-4 columns">
                    <FormReactSelectContainer label="">
                      <Select
                        name="noteType"
                        clearable={false}
                        options={notesTypesnOptions}
                        value={noteType}
                        onChange={(noteType) =>
                          noteType && this.setState({ noteType })
                        }
                        simpleValue
                        openOnFocus={true}
                        searchable={false}
                        // filterOptions={() => []}
                        // noResultsText={null}
                      />
                    </FormReactSelectContainer>
                  </div>
                  <div className="small-8 columns">
                    {noteType === notesTypesnOptions[2].value ? null : (
                      <FormReactSelectContainer label="">
                        <Select
                          clearable={false}
                          options={notesStatus}
                          value={noteStatus}
                          onChange={(noteStatus) =>
                            this.setState({ noteStatus })
                          }
                          simpleValue
                          // searchable={false}
                          openOnFocus={true}
                          noResultsText={null}
                        />
                      </FormReactSelectContainer>
                    )}
                    <input
                      type="hidden"
                      name="noteStatus"
                      value={noteStatus || ''}
                    />
                  </div>
                </>
              )}

              <div className="small-9 columns">
                <FormInput
                  name="title"
                  label={t('field:noteTitle')}
                  defaultValue={selectNote && selectNote.get('title')}
                />
              </div>
              <div className="small-3 columns">
                <FormReactSelectContainer label={t('field:priority')}>
                  <Select
                    name="priority"
                    clearable={false}
                    options={notePriority}
                    value={priority}
                    onChange={(priority) =>
                      priority && this.setState({ priority })
                    }
                    simpleValue
                    openOnFocus={true}
                    searchable={false}
                  />
                </FormReactSelectContainer>
              </div>

              <div className="small-12 columns">
                <FormTextArea
                  label={t('field:content')}
                  name="note"
                  rows={8}
                  defaultValue={selectNote && selectNote.get('note')}
                />
              </div>
            </div>
          </form>
        </DialogContent>
        <DialogActions>
          <PrimaryButton
            onClick={this.handleAddCommentSubmit}
            processing={processing}
          >
            {t('action:save')}
          </PrimaryButton>
        </DialogActions>
      </>
    );
  }
}

AddNoteForm.propTypes = {
  entityId: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default connect()(AddNoteForm);
