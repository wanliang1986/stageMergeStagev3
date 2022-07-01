import React from 'react';
import { connect } from 'react-redux';
import * as ActionTypes from './../constants/actionTypes';
import { withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';

import ErrorBoundary from './particial/ErrorBoundary';

const styles = (theme) => ({
  // success: {
  //     backgroundColor: green[600],
  // },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  info: {
    backgroundColor: theme.palette.primary.dark,
  },
  // warning: {
  //     backgroundColor: amber[700],
  // },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
});

class Messages extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      open: true,
    };
  }

  handleClose = (event, reson) => {
    // console.log('Messages: handleClose',event,reson);
    if (this.props.message.size > 0) {
      this.setState({ open: false });
    }
  };

  handleExit = () => {
    this.props.dispatch({
      type: ActionTypes.REMOVE_MESSAGE,
    });
    this.setState({ open: true });
  };

  render() {
    // console.log('messages')
    const { classes, message } = this.props;
    let content = message.getIn([0, 'message']) || '';
    const type = message.getIn([0, 'type']) || '';

    if (typeof content !== 'string' && type === 'error') {
      content = JSON.stringify(content);
    }
    // console.log('open', this.state.open, message.size > 0)
    return (
      <ErrorBoundary>
        <Snackbar
          open={this.state.open && message.size > 0}
          autoHideDuration={message.size > 1 ? 2000 : 4000}
          onClose={this.handleClose}
          TransitionProps={{
            onExited: this.handleExit,
          }}
        >
          <SnackbarContent
            className={clsx({ [classes.error]: type === 'error' })}
            message={content}
          />
        </Snackbar>
      </ErrorBoundary>
    );
  }
}

function mapStoreStateToProps(state) {
  return {
    message: state.controller.message,
  };
}

export default connect(mapStoreStateToProps)(withStyles(styles)(Messages));
