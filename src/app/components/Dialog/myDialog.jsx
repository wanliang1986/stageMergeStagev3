import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { withStyles } from '@material-ui/core';
import PrimaryButton from '../../components/particial/PrimaryButton';
import { withTranslation } from 'react-i18next';
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
      ipgViewDetail,
      ipgDelete,
      ipgCreate,
      CancelBtnVariant,
      SumbitBtnVariant,
      disableBackdropClick,
      creating,
      disableEnforceFocus,
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
        disableEnforceFocus={disableEnforceFocus}
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
          {ipgCreate ? (
            <div style={{ display: 'flex' }}>
              <Button
                onClick={() => {
                  this.props.handleCancel();
                }}
                color="primary"
              >
                {this.props.t('tab:Cancel')}
              </Button>
              <PrimaryButton
                type="button"
                style={{ minWidth: 100 }}
                processing={creating}
                name="submit"
                onClick={() => {
                  this.props.handleConfirm();
                }}
              >
                {this.props.t('tab:Confirm')}
              </PrimaryButton>
            </div>
          ) : (
            ''
          )}
          {ipgDelete ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
              }}
            >
              <div style={{ display: 'flex' }}>
                <Button
                  onClick={() => {
                    this.props.handleCancelClose();
                  }}
                  color="primary"
                >
                  {this.props.t('tab:Cancel')}
                </Button>
                <PrimaryButton
                  type="button"
                  style={{ minWidth: 100, marginLeft: 147 }}
                  processing={creating}
                  name="submit"
                  onClick={() => {
                    this.props.handleCloseJob();
                  }}
                >
                  {this.props.t('tab:Delete Posted Job')}
                </PrimaryButton>
              </div>
              <Button
                variant="outlined"
                onClick={() => {
                  this.props.handleViewDetail();
                }}
                color="primary"
              >
                {this.props.t('tab:View Job Details')}
              </Button>
            </div>
          ) : (
            ''
          )}

          {ipgViewDetail ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
              }}
            >
              <PrimaryButton
                type="button"
                style={{ minWidth: 100 }}
                processing={creating}
                name="submit"
                onClick={() => {
                  this.props.handleCancel();
                }}
              >
                {this.props.t('tab:Close')}
              </PrimaryButton>
              <Button
                variant="outlined"
                onClick={() => {
                  this.props.handleViewDetail();
                }}
                color="primary"
              >
                {this.props.t('tab:View Job Details')}
              </Button>
            </div>
          ) : (
            ''
          )}

          {}
        </DialogActions>
      </Dialog>
    );
  }
}

export default withTranslation('tab')(withStyles(styles)(MyDialog));
