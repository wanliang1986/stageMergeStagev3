import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { withStyles } from '@material-ui/core';
import PrimaryButton from '../../components/particial/PrimaryButton';

const styles = {};

class MyDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      classes,
      show,
      modalTitle,
      CancelBtnMsg,
      SubmitBtnMsg,
      CancelBtnShow,
      SubmitBtnShow,
      CancelBtnVariant,
      SumbitBtnVariant,
      disableBackdropClick,
      creating,
    } = this.props;
    return (
      <Dialog
        open={show ? show : false}
        onClose={() => {
          this.props.handleClose();
        }}
        maxWidth="lg"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        disableBackdropClick={disableBackdropClick}
      >
        <DialogTitle id="alert-dialog-title">{modalTitle}</DialogTitle>
        <DialogContent>
          {this.props.children ? this.props.children : ''}
        </DialogContent>

        <DialogActions>
          {CancelBtnShow ? (
            <Button
              onClick={() => {
                this.props.handleClose();
              }}
              color="primary"
            >
              {CancelBtnMsg}
            </Button>
          ) : (
            ''
          )}
          {/* <Button
              onClick={() => {
                this.props.primary();
              }}
              variant={SumbitBtnVariant}
              color="primary"
            >
              
            </Button> */}
          {SubmitBtnShow ? (
            <PrimaryButton
              type="button"
              style={{ minWidth: 100 }}
              processing={creating}
              name="submit"
              onClick={() => {
                this.props.primary();
              }}
            >
              {SubmitBtnMsg}
            </PrimaryButton>
          ) : (
            ''
          )}
        </DialogActions>
      </Dialog>
    );
  }
}

export default withStyles(styles)(MyDialog);
