import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { connect } from 'react-redux';

import { showErrorMessage } from '../../actions/index';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';

import SecondaryButton from '../../components/particial/SecondaryButton';
import PrimaryButton from '../../components/particial/PrimaryButton';

import FormInput from '../../components/particial/FormInput';
import { upsertTemplate } from '../../actions/templateAction';

class SaveAsTemplateForm extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      templateName: '',
      errorMessage: Immutable.Map(),
      step: 1,
    };
  }

  saveAsTemplate = () => {
    console.log('???', this.props);

    // const { template, dispatch, handleRequestClose } = this.props;
  };

  handleSubmit = (e) => {
    e.preventDefault();

    const clientForm = e.target;
    const { t, dispatch, handleRequestClose } = this.props;

    let errorMessage = this._validateForm(clientForm, t);
    if (errorMessage) {
      return this.setState({ errorMessage });
    }

    const client = {
      contactType: clientForm.templateName.value,
    };

    const newTemplate = {
      isRichText: true,
      title: clientForm.templateName.value,
      subject: this.props.subject,
      template: this.props.template,
      type: 'Email_Blast',
    };

    this.props
      .dispatch(upsertTemplate(newTemplate))
      .then(() => this.setState({ step: 2 }))
      .catch((err) => dispatch(showErrorMessage(err)));
  };

  _validateForm = (form, t) => {
    let errorMessage = Immutable.Map();

    if (!form.templateName.value) {
      errorMessage = errorMessage.set(
        'templateName',
        t('message:templateNameIsRequired')
      );
    }

    return errorMessage.size > 0 && errorMessage;
  };

  removeErrorMessage = (key) => {
    return this.setState({
      errorMessage: this.state.errorMessage.delete(key),
    });
  };

  handleClose = () => {
    this.props.handleRequestClose();
    // this.props.closeOuter();
  };

  render() {
    const { errorMessage, templateName, step } = this.state;
    const { t, client } = this.props;
    return (
      <Dialog open={true} fullWidth maxWidth="xs">
        {step === 1 && (
          <>
            <DialogTitle>{t('common:Save as Template')}</DialogTitle>
            <DialogContent>
              <form
                id="saveAsTemplateForm"
                className="row"
                onSubmit={this.handleSubmit}
              >
                <div className="row flex-child-auto">
                  <div className="small-12 columns">
                    <FormInput
                      name="templateName"
                      label={t('field:templateName')}
                      defaultValue={templateName}
                      isRequired={true}
                      onFocus={() => {
                        if (this.removeErrorMessage) {
                          this.removeErrorMessage('templateName');
                        }
                      }}
                      errorMessage={
                        errorMessage ? errorMessage.get('templateName') : null
                      }
                    />
                  </div>
                </div>
              </form>
            </DialogContent>
            <DialogActions>
              <div className="horizontal-layout">
                <SecondaryButton
                  onClick={() => this.props.handleRequestClose()}
                >
                  {t('action:cancel')}
                </SecondaryButton>
                <PrimaryButton type="submit" form="saveAsTemplateForm">
                  {t('action:save')}
                </PrimaryButton>
              </div>
            </DialogActions>
          </>
        )}
        {step === 2 && (
          <>
            <DialogTitle>{t('common:Template Saved')}</DialogTitle>
            <DialogContent>
              Your template has been saved, and will appear under "Template"
              whenever you compose a new email.
            </DialogContent>
            <DialogActions>
              <div className="horizontal-layout">
                <PrimaryButton onClick={this.handleClose}>
                  {t('action:Close')}
                </PrimaryButton>
              </div>
            </DialogActions>
          </>
        )}
      </Dialog>
    );
  }
}

SaveAsTemplateForm.propTypes = {
  handleRequestClose: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

export default connect()(SaveAsTemplateForm);
