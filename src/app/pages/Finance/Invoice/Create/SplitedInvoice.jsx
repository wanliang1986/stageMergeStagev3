import React, { Component } from 'react';
import moment from 'moment-timezone';

import DatePicker from 'react-datepicker';
import FormInput from '../../../../components/particial/FormInput';
import NumberFormat from 'react-number-format';
import FormReactSelectContainer from '../../../../components/particial/FormReactSelectContainer';
import { currency as currencyOptions } from '../../../../constants/formOptions';
import clsx from 'clsx';

const currencyLabels = currencyOptions.reduce((res, v) => {
  res[v.value] = v.label;
  return res;
}, {});

class SplitedInvoice extends Component {
  state = {
    date: moment(),
    dueDate: moment().add(30, 'days'),
    amount: null,
  };

  render() {
    const { t, index, removeErrorMsgHandler, currency, errorMessage } =
      this.props;

    console.log('[child invoice]', index, this.state.amount);

    return (
      <div className="row expanded">
        <div
          className="columns"
          style={{ alignSelf: 'center', marginRight: '20px' }}
        >
          Invoice {index + 1}
        </div>
        <div className="flex-child-auto flex-container">
          <div className="small-4 columns">
            <DatePicker
              customInput={
                <FormInput
                  label={t('field:invoiceDate')}
                  isRequired
                  errorMessage={t(errorMessage.get(`childInvoiceDate${index}`))}
                />
              }
              selected={this.state.date}
              onChange={(date) => {
                this.setState({ date });
              }}
              placeholderText="mm/dd/yyyy"
            />
            <input
              name={`childInvoiceDate${index}`}
              type="hidden"
              value={
                this.state.date ? this.state.date.format('YYYY-MM-DD') : ''
              }
            />
          </div>
          <div className="small-4 columns">
            <DatePicker
              customInput={
                <FormInput
                  label={t('field:dueDate')}
                  isRequired
                  errorMessage={t(
                    errorMessage.get(`childInvoiceDueDate${index}`)
                  )}
                />
              }
              selected={this.state.dueDate}
              onChange={(dueDate) => {
                this.setState({ dueDate });
              }}
              placeholderText="mm/dd/yyyy"
            />
            <input
              name={`childInvoiceDueDate${index}`}
              type="hidden"
              value={
                this.state.dueDate
                  ? this.state.dueDate.format('YYYY-MM-DD')
                  : ''
              }
            />
          </div>

          <div className="small-4 columns">
            <FormReactSelectContainer
              label={t('field:amount')}
              isRequired
              errorMessage={
                t(errorMessage.get(`childInvoiceAmount${index}`)) ||
                !!errorMessage.get('subAmountSum')
              }
            >
              <NumberFormat
                decimalScale={2}
                thousandSeparator
                prefix={currencyLabels[currency] || ''}
                value={this.state.amount}
                onValueChange={({ value }) => this.setState({ amount: value })}
                onFocus={() => {
                  removeErrorMsgHandler('subAmountSum');
                }}
                allowNegative={false}
                className={clsx({
                  'is-invalid-input':
                    !!errorMessage.get('subAmountSum') ||
                    !!errorMessage.get(`childInvoiceAmount${index}`),
                })}
              />
            </FormReactSelectContainer>
            <input
              type="hidden"
              name={`childInvoiceAmount${index}`}
              value={this.state.amount || ''}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default SplitedInvoice;
