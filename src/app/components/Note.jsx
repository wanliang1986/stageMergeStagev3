import React from 'react';
import { formatBy2 } from './../../utils';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import clsx from 'clsx';
import { notePriority } from './../constants/formOptions';
import { formatUserName } from './../../utils';
import FiberManualRecord from '@material-ui/icons/FiberManualRecord';
import EditIcon from '@material-ui/icons/Edit';
import { connect } from 'react-redux';
const styles = {
  noteTitle: {
    fontSize: '15px',
    color: '#3f3f3f',
    textTransform: 'capitalize',
  },
  noteSubtitle: {
    fontSize: '15px',
    color: '#4f4f4f',
    textTransform: 'capitalize',
  },
  noteContent: {
    fontSize: '15px',
    color: '#3f3f3f',
    marginLeft: '4px',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
  root: {
    paddingLeft: 3,
    borderRadius: 4,
    background: '#2cc86e',
    '&$highPriority': {
      background: '#f2b743',
    },
  },
  highPriority: {},
  noteContainer: {
    padding: 15,
    borderRadius: 4,
    background: 'white',
  },
  iconColor: {
    color: '#2cc86e',
    '&$highPriority': {
      color: '#f2b743',
    },
  },
};

class Note extends React.Component {
  render() {
    const { classes, note } = this.props;

    return (
      <Paper
        className={clsx(classes.root, {
          [classes.highPriority]:
            note.get('priority') !== notePriority[0].value,
        })}
      >
        <div className={clsx('vertical-layout', classes.noteContainer)}>
          <div className="horizontal-layout">
            <FiberManualRecord
              className={clsx(classes.iconColor, {
                [classes.highPriority]:
                  note.get('priority') !== notePriority[0].value,
              })}
            />
            <div className="flex-child-auto horizontal-layout align-justify">
              <span className={classes.noteTitle}>{note.get('title')}</span>
              <span className={classes.noteSubtitle}>
                {formatBy2(
                  // note.get('createdDate'),
                  note.get('createdDate'),
                  formatUserName(note.get('user', 'username'))
                )}
              </span>
              <span>
                {note.get('userId') === this.props.currentUser.get('id') && (
                  <EditIcon
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      this.props.openEdit(note);
                    }}
                  />
                )}
              </span>
            </div>
          </div>
          <span className={classes.noteContent}>{note.get('note')}</span>
        </div>
      </Paper>
    );
  }
}

const mapStateToProps = (state) => {
  const currentUser = state.controller.currentUser;
  return {
    currentUser: currentUser,
  };
};

export default connect(mapStateToProps)(withStyles(styles)(Note));
