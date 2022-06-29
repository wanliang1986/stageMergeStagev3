import React from 'react';

import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import FormTextArea from '../../../../../components/particial/FormTextArea';
import PrimaryButton from '../../../../../components/particial/PrimaryButton';
import SecondaryButton from '../../../../../components/particial/SecondaryButton';
import {
  voidInvoice,
  voidInvoice2,
} from '../../../../../actions/invoiceActions';

class VoidForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: '',
      processing: false,
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { t, onClose, dispatch, invoiceNo } = this.props;
    console.log(e.target.reason.value);
    const reason = e.target.reason.value;
    if (!reason) {
      return this.setState({
        errorMessage: 'message:Void Reason is required.',
      });
    }
    if (reason.length > 2000) {
      return this.setState({
        errorMessage: 'message:The length of Void Reason is More than 2000.',
      });
    }
    this.setState({ processing: true, errorMessage: '' });
    dispatch(voidInvoice2(invoiceNo, reason))
      .then(onClose)
      .catch(() => this.setState({ processing: false }));
  };

  render() {
    const { errorMessage, processing } = this.state;
    const { t, onClose } = this.props;
    return (
      <>
        <DialogTitle>{t('tab:Void Invoice')}</DialogTitle>
        <DialogContent>
          <form onSubmit={this.handleSubmit} id={'invoiceVoidForm'}>
            <FormTextArea
              isRequired
              label={t('field:reason')}
              errorMessage={t(errorMessage)}
              rows={4}
              name={'reason'}
            />
          </form>
        </DialogContent>
        <DialogActions className="horizontal-layout">
          <SecondaryButton onClick={onClose}>
            {t('action:cancel')}
          </SecondaryButton>
          <PrimaryButton
            type="submit"
            form={'invoiceVoidForm'}
            processing={processing}
          >
            {t('action:submit')}
          </PrimaryButton>
        </DialogActions>
      </>
    );
  }
}

export default VoidForm;
