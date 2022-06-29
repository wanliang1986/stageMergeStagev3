import React from 'react';
// import { formatBy2 } from './../../utils';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import clsx from 'clsx';
import {
  notePriority,
  notesTypesnOptions,
  notesStatus,
} from '../../../../constants/formOptions';
import Divider from '@material-ui/core/Divider';
import moment from 'moment-timezone';
import EditIcon from '@material-ui/icons/Edit';
import { connect } from 'react-redux';

const styles = {
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
  flex: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '6px !important',
    alignItems: 'center',
  },
  title: {
    color: '#505050',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 0,
    marginTop: 0,
  },
  status: {
    padding: '4px 6px',
    fontSize: 12,
    color: '#36b37e',
    borderRadius: '8px',
    backgroundColor: 'rgba(215,240,229)',
    marginBottom: 0,
    marginTop: 0,
  },
  statusTwo: {
    padding: '4px 6px',
    fontSize: 12,
    color: '#3398dc',
    borderRadius: '8px',
    backgroundColor: 'rgba(51,152,220,0.5)',
    marginBottom: 0,
    marginTop: 0,
  },
  statusThree: {
    padding: '4px 6px',
    fontSize: 12,
    color: '#f5a623',
    borderRadius: '8px',
    backgroundColor: 'rgba(245,166,35,0.3)',
    marginBottom: 0,
    marginTop: 0,
  },
  time: {
    color: '#aab1b8',
    fontSize: 14,
    marginBottom: 0,
    marginTop: 0,
  },
  content: {
    color: '#505050',
    fontSize: 14,
    marginTop: 0,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
};

class CandidateNote extends React.Component {
  isType = (value) => {
    let str = '';
    notesTypesnOptions.map((item) => {
      if (item.value === value) {
        str = item.label;
      }
    });
    return str;
  };

  isStatus = (value) => {
    let str = '';
    notesStatus.map((item) => {
      if (item.value === value) {
        str = item.label;
      }
    });
    return str;
  };

  render() {
    const { classes, note } = this.props;
    const noteCopy = note ? note.toJS() : {};
    console.log(note.toJS());
    return (
      <Paper
        className={clsx(classes.root, {
          [classes.highPriority]:
            note.get('priority') !== notePriority[0].value,
        })}
      >
        <div className={clsx('vertical-layout', classes.noteContainer)}>
          <div className={classes.flex}>
            <p className={classes.title}>
              {note.get('title')}
              {' - '}
              {this.isType(noteCopy.noteType)}
            </p>
            {noteCopy.noteStatus === notesStatus[0].value ? (
              <p className={classes.status}>
                {this.isStatus(noteCopy.noteStatus)}
              </p>
            ) : null}

            {noteCopy.noteStatus === notesStatus[1].value ? (
              <p className={classes.statusTwo}>
                {this.isStatus(noteCopy.noteStatus)}
              </p>
            ) : null}
            {noteCopy.noteStatus === notesStatus[2].value ? (
              <p className={classes.statusThree}>
                {this.isStatus(noteCopy.noteStatus)}
              </p>
            ) : null}
            <span>
              {noteCopy.userId === this.props.currentUser.get('id') && (
                <EditIcon
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    this.props.openEdit(note);
                  }}
                />
              )}
            </span>
          </div>
          <div className={classes.flex}>
            <p className={classes.time}>
              {noteCopy.user && noteCopy.user.fullName}
            </p>
            <p className={classes.time}>
              {moment(noteCopy.createdDate).format('L')}
            </p>
          </div>
          <Divider />
          <div style={{ marginTop: 15 }}>
            <p className={classes.time}>{'Content'}</p>
            <p className={classes.content}>{noteCopy.note}</p>
          </div>
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

export default connect(mapStateToProps)(withStyles(styles)(CandidateNote));
