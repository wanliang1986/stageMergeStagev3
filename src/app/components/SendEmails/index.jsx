import React from 'react';
import { REMOVE_SEND_EMAIL_REQUEST } from '../../constants/actionTypes';
import { SEND_EMAIL_TYPES } from '../../constants/formOptions';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

import Dialog from '@material-ui/core/Dialog';

import DraggablePaperComponent from '../particial/DraggablePaperComponent';
import SendEmailToTalents from '../sendEmail/SendEmailToTalents';
import SendEmailToAM from '../sendEmail/SendEmailToJobOwner';
import SendEmailToCandidate from '../sendEmail/SendEmailToTalent';
import SendEmailToHiringManager from '../sendEmail/SendEmailToHiringManager';
import SendEmailToJobUsers from '../sendEmail/SendEmailToJobUsers';
import SendEmailBlast from '../sendEmail/SendEmailBlast';
import SendEmailToClientInvoice from '../sendEmail/SendEmailToClientInvoice';

class SendEmails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: true,
    };
  }

  handleClose = () => {
    if (this.props.sendEmailRequest.size > 0) {
      this.setState({ open: false });
    }
  };

  handleExit = () => {
    this.props.dispatch({
      type: REMOVE_SEND_EMAIL_REQUEST,
    });
    this.setState({ open: true });
  };

  renderContent = (request) => {
    const type = request.get('type');
    const data = request.get('data');
    // console.log(type);
    const { t, dispatch } = this.props;
    switch (type) {
      case SEND_EMAIL_TYPES.SendEmailToTalents: {
        return (
          <SendEmailToTalents
            t={t}
            dispatch={dispatch}
            {...data}
            onClose={this.handleClose}
          />
        );
      }
      case SEND_EMAIL_TYPES.SendEmailToAM: {
        return (
          <SendEmailToAM
            t={t}
            dispatch={dispatch}
            {...data}
            onClose={this.handleClose}
          />
        );
      }
      case SEND_EMAIL_TYPES.SendEmailToCandidate: {
        return (
          <SendEmailToCandidate
            t={t}
            dispatch={dispatch}
            {...data}
            onClose={this.handleClose}
          />
        );
      }
      case SEND_EMAIL_TYPES.SendEmailToHM: {
        return (
          <SendEmailToHiringManager
            t={t}
            dispatch={dispatch}
            {...data}
            onClose={this.handleClose}
          />
        );
      }
      case SEND_EMAIL_TYPES.SendEmailToAssignedUsers: {
        return (
          <SendEmailToJobUsers
            t={t}
            dispatch={dispatch}
            {...data}
            onClose={this.handleClose}
          />
        );
      }
      case SEND_EMAIL_TYPES.SendEmailBlast: {
        return (
          <SendEmailBlast
            t={t}
            dispatch={dispatch}
            {...data}
            onClose={this.handleClose}
          />
        );
      }

      case SEND_EMAIL_TYPES.SendEmailToClientInvoice: {
        return (
          <SendEmailToClientInvoice
            t={t}
            dispatch={dispatch}
            {...data}
            onClose={this.handleClose}
          />
        );
      }
      default:
        return JSON.stringify(request);
    }
  };

  render() {
    const { open } = this.state;
    const { sendEmailRequest } = this.props;
    const request = sendEmailRequest.first();
    return (
      <Dialog
        open={open && sendEmailRequest.size > 0}
        // onClose={this.handleClose}
        TransitionProps={{
          onExited: this.handleExit,
        }}
        fullWidth
        maxWidth="md"
        PaperComponent={DraggablePaperComponent}
        disableEnforceFocus
      >
        {request && this.renderContent(request)}
      </Dialog>
    );
  }
}

function mapStoreStateToProps(state) {
  return {
    sendEmailRequest: state.controller.sendEmailRequest,
  };
}

export default withTranslation(['tab', 'action', 'field', 'message'])(
  connect(mapStoreStateToProps)(SendEmails)
);
