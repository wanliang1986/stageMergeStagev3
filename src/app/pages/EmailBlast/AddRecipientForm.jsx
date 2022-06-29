import React from 'react';
import { addRecipientToEmailBlast } from '../../actions/emailAction';

import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';

import AddIcon from '@material-ui/icons/AddCircle';
import DeleteIcon from '@material-ui/icons/Delete';

import SecondaryButton from '../../components/particial/SecondaryButton';
import PrimaryButton from '../../components/particial/PrimaryButton';
import FormReactSelectContainer from '../../components/particial/FormReactSelectContainer';
import FormInput from '../../components/particial/FormInput';

class AddRecipientForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      recipients: [],
      processing: false,
    };
  }
  handleAddRecipient = () => {
    const { recipients, name, email } = this.state;
    this.setState({
      recipients: [{ name, email, source: 'MANUALLY_ADDED' }].concat(
        recipients
      ),
      name: '',
      email: '',
    });
  };

  handleRemove = (index) => {
    const recipients = this.state.recipients.slice();
    recipients.splice(index, 1);
    this.setState({ recipients });
  };

  handleSave = () => {
    const { name, email, recipients } = this.state;
    const { dispatch, emailBlastId, onClose } = this.props;

    this.setState({ processing: true });
    const newRecipients = [{ name, email, source: 'MANUALLY_ADDED' }]
      .concat(recipients)
      .filter((r) => r.name.trim() && r.email.trim());
    dispatch(addRecipientToEmailBlast(emailBlastId, newRecipients)).then(
      (res) => {
        if (res) {
          onClose();
        } else {
          this.setState({ processing: false });
        }
      }
    );
  };

  render() {
    const { recipients, processing, name, email } = this.state;
    const { t, onClose } = this.props;
    return (
      <>
        <DialogTitle>{t('common:addEmailAddress')}</DialogTitle>
        <DialogContent>
          <div className="row expanded">
            <div className="small-4 columns">
              <FormReactSelectContainer label={t('field:name')} />
            </div>
            <div className="small-4 columns">
              <FormReactSelectContainer label={t('field:email')} />
            </div>
            <div className="small-2 columns" />
          </div>
          <div className="row expanded">
            <div className="small-4 columns">
              <FormInput
                value={name}
                onChange={(e) => this.setState({ name: e.target.value })}
              />
            </div>
            <div className="small-4 columns">
              <FormInput
                value={email}
                onChange={(e) => this.setState({ email: e.target.value })}
              />
            </div>
            <div className="small-2 columns">
              <IconButton
                onClick={this.handleAddRecipient}
                size="small"
                color="primary"
              >
                <AddIcon />
              </IconButton>
            </div>
          </div>
          {recipients.map((recipient, index) => (
            <div key={index} className="row expanded">
              <div className="small-4 columns">
                <FormInput
                  value={recipient.name}
                  onChange={(e) => {
                    recipient.name = e.target.value;
                    this.setState({ recipients: recipients.slice() });
                  }}
                />
              </div>
              <div className="small-4 columns">
                <FormInput
                  value={recipient.email}
                  onChange={(e) => {
                    recipient.email = e.target.value;
                    this.setState({ recipients: recipients.slice() });
                  }}
                />
              </div>
              <div className="small-2 columns">
                <IconButton
                  onClick={() => this.handleRemove(index)}
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              </div>
            </div>
          ))}
        </DialogContent>

        <DialogActions>
          <SecondaryButton onClick={onClose} size="small">
            {t('action:cancel')}
          </SecondaryButton>
          <PrimaryButton
            size="small"
            processing={processing}
            onClick={this.handleSave}
          >
            {t('action:save')}
          </PrimaryButton>
          <div className="flex-child-auto" />
        </DialogActions>
      </>
    );
  }
}

export default AddRecipientForm;
