import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import moment from 'moment-timezone';
import { withStyles } from '@material-ui/core/styles';
import Immutable from 'immutable';
import { recordInvoicePayment } from '../../../../../actions/invoiceActions';
import { currency as currencyOptions } from '../../../../../constants/formOptions';

import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import DatePicker from 'react-datepicker';
import Select from 'react-select';

import FormInput from '../../../../../components/particial/FormInput';
import FormReactSelectContainer from '../../../../../components/particial/FormReactSelectContainer';
import FormTextArea from '../../../../../components/particial/FormTextArea';
import NumberFormat from 'react-number-format';
import PrimaryButton from '../../../../../components/particial/PrimaryButton';
import SecondaryButton from '../../../../../components/particial/SecondaryButton';

export const paymentMethodOptions = [
  { value: 'CASH', label: 'Cash' },
  { value: 'CHECK', label: 'Check' },
  { value: 'CREDIT_CARD', label: 'Credit Card' },
  { value: 'DEBIT_CARD', label: 'Debit Card' },
  { value: 'WIRE_TRANSFER', label: 'Wire Transfer' },
];

const styles = {
  fullWidth: {
    width: '100%',
    '&>div': {
      width: '100%',
    },
  },
  checkboxLabel: {
    marginLeft: -8,
  },
};
const currencyLabels = currencyOptions.reduce((res, v) => {
  res[v.value] = v.label;
  return res;
}, {});

class RecordPaymentForm extends Component {
  constructor(props) {
    super();
    this.state = {
      paymentDate: moment(),
      paymentMethod: 'WIRE_TRANSFER',
      paidAmount: props.amountDue,
      closeWithoutFullPayment: false,
      errorMessage: Immutable.Map(),
      processing: false,
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    console.log(e.target);
    const paymentForm = e.target;
    const { onClose, dispatch, invoice, amountDue } = this.props;
    const paymentRecord = {
      invoiceId: invoice.get('id'),
      paymentMethod: this.state.paymentMethod,
      paidAmount: Number(this.state.paidAmount),
      paymentDate: paymentForm.paymentDate.value,
      closeWithoutFullPayment: this.state.closeWithoutFullPayment,
      note: paymentForm.note.value,
    };
    console.log(paymentRecord);

    let errorMessage = this._validateRecord(paymentRecord, amountDue);
    if (errorMessage) {
      return this.setState({ errorMessage });
    }

    this.setState({ processing: true });
    dispatch(recordInvoicePayment(paymentRecord))
      .then(onClose)
      .catch(() => this.setState({ processing: false }));
  };

  _validateRecord(paymentRecord, amountDue) {
    let errorMessage = Immutable.Map();

    if (paymentRecord.paidAmount === 0) {
      errorMessage = errorMessage.set(
        'paidAmount',
        'message:Paid Amount should be grater then 0.'
      );
    }
    if (paymentRecord.paidAmount > amountDue) {
      errorMessage = errorMessage.set(
        'paidAmount',
        'message:Paid Amount should not be grater then due amount .'
      );
    }
    if (paymentRecord.note.length > 2000) {
      errorMessage = errorMessage.set(
        'note',
        'message:The length of Note is More than 2000'
      );
    }

    return errorMessage.size > 0 && errorMessage;
  }

  render() {
    const { processing, errorMessage } = this.state;
    const { t, classes, onClose, amountDue, invoice } = this.props;

    return (
      <>
        <DialogTitle id="form-dialog-title">
          {t('tab:Record a Payment')}
        </DialogTitle>
        <form onSubmit={this.handleSubmit} style={{ marginTop: '-24px' }}>
          <DialogContent>
            <div>
              <DatePicker
                dropdownMode={'scroll'}
                customInput={<FormInput label={t('field:paymentDate')} />}
                className={classes.fullWidth}
                selected={this.state.paymentDate}
                onChange={(paymentDate) => {
                  this.setState({ paymentDate });
                }}
                maxDate={moment()}
                placeholderText="mm/dd/yyyy"
              />
              <input
                type="hidden"
                name="paymentDate"
                value={
                  this.state.paymentDate
                    ? this.state.paymentDate.format('YYYY-MM-DD')
                    : ''
                }
              />
            </div>
            <div>
              <FormReactSelectContainer label={t('field:Due Amount')}>
                <NumberFormat
                  name="amount"
                  thousandSeparator
                  prefix={currencyLabels[invoice.get('currency')] || ''}
                  value={amountDue}
                  readOnly
                />
              </FormReactSelectContainer>
              <FormReactSelectContainer
                label={t('field:Paid Amount')}
                errorMessage={t(errorMessage.get('paidAmount'))}
              >
                <NumberFormat
                  thousandSeparator
                  decimalScale={2}
                  prefix={currencyLabels[invoice.get('currency')] || ''}
                  value={this.state.paidAmount}
                  onValueChange={({ value }) => {
                    console.log(value);
                    this.setState({ paidAmount: value });
                  }}
                  allowNegative={false}
                  readOnly={invoice.get('invoiceType') === 'STARTUP_FEE'}
                />
              </FormReactSelectContainer>
              <input
                type="hidden"
                name="paidAmount"
                value={this.state.paidAmount || ''}
              />
            </div>

            {invoice.get('invoiceType') !== 'STARTUP_FEE' && (
              <FormControlLabel
                control={
                  <Switch
                    name="current"
                    checked={this.state.closeWithoutFullPayment}
                    onChange={(e) =>
                      this.setState({
                        closeWithoutFullPayment: e.target.checked,
                      })
                    }
                    color="primary"
                  />
                }
                label={t('field:Close Invoice without Full Payment')}
                labelPlacement="start"
                style={{ marginLeft: 0, marginBottom: '0.75em' }}
              />
            )}
            <div>
              <FormReactSelectContainer label={t('field:paymentMethod')}>
                <Select
                  name="paymentMethod"
                  value={this.state.paymentMethod}
                  onChange={(paymentMethod) =>
                    paymentMethod && this.setState({ paymentMethod })
                  }
                  simpleValue
                  options={paymentMethodOptions}
                  // disabled={disabled || !job.get('id')}
                  autoBlur={true}
                  searchable={false}
                  clearable={false}
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
  withStyles(styles)(connect()(RecordPaymentForm))
);
