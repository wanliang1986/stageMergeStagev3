import React, { useEffect, useState } from 'react';

import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';

import SecondaryButton from '../../../components/particial/SecondaryButton';
import PrimaryButton from '../../../components/particial/PrimaryButton';

const AlertDialog = (props) => {
  const {
    onCancel,
    onOK,
    title,
    content,
    cancelLabel = 'Cancel',
    okLabel = 'OK',
    open = false,
  } = props;
  const [processing, setProcessing] = useState(false);

  const handleSubmit = () => {
    setProcessing(true);
    onOK();
  };

  useEffect(() => {
    if (!open) {
      setProcessing(false);
    }
  }, [open]);

  return (
    <Dialog
      onClose={onCancel}
      aria-labelledby="delete-team-title"
      aria-describedby="delete-team-description"
      maxWidth="sm"
      fullWidth
      open={open}
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
          onClick={handleSubmit}
          processing={processing}
          size="small"
        >
          {okLabel}
        </PrimaryButton>
      </DialogActions>
    </Dialog>
  );
};

export default AlertDialog;
