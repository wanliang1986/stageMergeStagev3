import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Immutable from 'immutable';
import { recordApplyCredit } from '../../../../../actions/invoiceActions';
import { currency as currencyOptions } from '../../../../../constants/formOptions';

import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';

import FormReactSelectContainer from '../../../../../components/particial/FormReactSelectContainer';
import FormTextArea from '../../../../../components/particial/FormTextArea';
import NumberFormat from 'react-number-format';
import PrimaryButton from '../../../../../components/particial/PrimaryButton';
import SecondaryButton from '../../../../../components/particial/SecondaryButton';

const currencyLabels = currencyOptions.reduce((res, v) => {
  res[v.value] = v.label;
  return res;
}, {});

class PaymentRecordFrom extends Component {
  constructor(props) {
    super();
    this.state = {
      amount: 0,
      errorMessage: Immutable.Map(),
      processing: false,
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    // console.log(e.target);
    const creditForm = e.target;
    const { onClose, dispatch, invoice, paidAmount } = this.props;
    const creditRecord = {
      invoiceId: invoice.get('id'),
      amount: Number(this.state.amount),
      note: creditForm.note.value,
    };
    console.log(creditRecord);
    let errorMessage = this._validateRecord(creditRecord, paidAmount);
    if (errorMessage) {
      return this.setState({ errorMessage });
    }

    this.setState({ processing: true });
    dispatch(recordApplyCredit(creditRecord))
      .then(onClose)
      .catch(() => this.setState({ processing: false }));
  };

  _validateRecord(creditRecord, paidAmount) {
    let errorMessage = Immutable.Map();

    if (creditRecord.amount <= 0) {
      errorMessage = errorMessage.set(
        'amount',
        'message:Amount should be grater then 0.'
      );
    }
    if (creditRecord.amount > paidAmount) {
      errorMessage = errorMessage.set(
        'amount',
        'message:Amount should not be grater then paid amount.'
      );
    }
    if (creditRecord.note.length > 2000) {
      errorMessage = errorMessage.set(
        'note',
        'message:The length of Note is More than 2000'
      );
    }

    return errorMessage.size > 0 && errorMessage;
  }

  render() {
    const { processing, errorMessage } = this.state;
    const { t, onClose, paidAmount, invoice } = this.props;

    return (
      <>
        <DialogTitle id="form-dialog-title">
          {t('tab:Record Credit')}
        </DialogTitle>
        <form onSubmit={this.handleSubmit} style={{ marginTop: '-24px' }}>
          <DialogContent>
            <div>
              <FormReactSelectContainer label={t('field:Paid Amount')}>
                <NumberFormat
                  name="amount"
                  thousandSeparator
                  prefix={currencyLabels[invoice.get('currency')] || ''}
                  value={paidAmount}
                  readOnly
                />
              </FormReactSelectContainer>
              <Typography variant="body2" gutterBottom component="p">
                {t('tab:invoiceTip1')}
              </Typography>
              <FormReactSelectContainer
                errorMessage={t(errorMessage.get('amount'))}
              >
                <NumberFormat
                  thousandSeparator
                  decimalScale={2}
                  prefix={currencyLabels[invoice.get('currency')] || ''}
                  value={this.state.amount}
                  onValueChange={({ value }) =>
                    this.setState({ amount: value })
                  }
                  allowNegative={false}
                />
              </FormReactSelectContainer>
            </div>

            <div>
              <FormTextArea
                name="note"
                label={t('field:note')}
                rows="4"
                defaultValue={''}
                errorMessage={t(errorMessage.get('note'))}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <SecondaryButton onClick={onClose}>
              {t('action:cancel')}
            </SecondaryButton>
            <PrimaryButton type="submit" processing={processing}>
              {t('action:submit')}
            </PrimaryButton>
          </DialogActions>
        </form>
      </>
    );
  }
}

export default withTranslation(['action', 'message', 'field'])(
  connect()(PaymentRecordFrom)
);
