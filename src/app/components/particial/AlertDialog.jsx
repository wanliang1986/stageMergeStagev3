import React from 'react';
import PropTypes from 'prop-types';

import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';

import SecondaryButton from './SecondaryButton';
import PrimaryButton from './PrimaryButton';

class AlertDialog extends React.PureComponent {
  state = {
    processing: false,
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({ processing: false });
  }

  handleSubmit = () => {
    this.setState({ processing: true });
    try {
      this.props.onOK();
    } catch (e) {
      this.setState({ processing: false });
    }
  };

  render() {
    const { onCancel, onOK, title, content, cancelLabel, okLabel } = this.props;

    return (
      <Dialog
        onClose={onCancel}
        aria-labelledby="delete-team-title"
        aria-describedby="delete-team-description"
        maxWidth="sm"
        fullWidth
        open={!!onOK}
      >
        <DialogTitle id="delete-team-title">{title}</DialogTitle>

        <DialogContent>
          <DialogContentText component="div" id="delete-team-description">
            {content}
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <SecondaryButton onClick={onCancel} size="small">
            {cancelLabel}
          </SecondaryButton>
          <PrimaryButton
            onClick={this.handleSubmit}
            processing={this.state.processing}
            size="small"
          >
            {okLabel}
          </PrimaryButton>
        </DialogActions>
      </Dialog>
    );
  }
}

AlertDialog.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onOK: PropTypes.func,
  title: PropTypes.string.isRequired,
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
    .isRequired,
  cancelLabel: PropTypes.string.isRequired,
  okLabel: PropTypes.string.isRequired,
};

AlertDialog.defaultProps = {
  title: '',
  content: '',
  cancelLabel: 'Cancel',
  okLabel: 'OK',
};

export default AlertDialog;
