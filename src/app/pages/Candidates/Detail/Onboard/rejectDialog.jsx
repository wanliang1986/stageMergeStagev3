import React, { useState } from 'react';
import { withStyles } from '@material-ui/core';
import { connect } from 'react-redux';
import Immutable from 'immutable';

import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import PotentialButton from '../../../../components/particial/PotentialButton';
import PrimaryButton from '../../../../components/particial/PrimaryButton';
import FormTextArea from '../../../../components/particial/FormTextArea';
const styles = {};

const S3LinkDialog = (props) => {
  const { classes, Save, onClose } = props;
  const [errorMessage, setErrorMessage] = useState(Immutable.Map());

  const removeErrorMessage = (key) => {
    const newKey = errorMessage.delete(key);
    return setErrorMessage(newKey);
  };

  const validateForm = (userForm) => {
    let errorMessage = Immutable.Map();

    if (!userForm.comments.value) {
      errorMessage = errorMessage.set('comments', 'Comments Is Required');
    }

    return errorMessage.size > 0 && errorMessage;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const userForm = e.target;
    let errorMessage = validateForm(userForm);
    if (errorMessage) {
      setErrorMessage(errorMessage);
      return;
    }
    Save(userForm.comments.value);
  };

  return (
    <div className={classes.root}>
      <DialogTitle disableTypography className={classes.title}>
        <Typography variant="subtitle2" color="inherit">
          {'Comment to Candidate '}
        </Typography>
      </DialogTitle>
      <DialogContent style={{ padding: '12px 24px 12px' }}>
        <form onSubmit={handleSubmit}>
          <FormTextArea
            name="comments"
            rows="6"
            errorMessage={errorMessage.get('comments')}
            onBlur={() => removeErrorMessage('comments')}
            maxLength={1000}
          />
          <input type="submit" id="submit-button" style={{ display: 'none' }} />
        </form>
      </DialogContent>
      <DialogActions
        style={{ paddingTop: 0, display: 'flex', justifyContent: 'center' }}
      >
        <PotentialButton onClick={onClose}>{'cancel'}</PotentialButton>
        <PrimaryButton htmlFor="submit-button" component="label">
          {'Save'}
        </PrimaryButton>
      </DialogActions>
    </div>
  );
};

function mapStoreStateToProps(state, { match }) {
  return {};
}
export default connect(mapStoreStateToProps)(withStyles(styles)(S3LinkDialog));
