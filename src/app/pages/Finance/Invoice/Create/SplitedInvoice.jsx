import React, { Component } from 'react';
import moment from 'moment-timezone';

import DatePicker from 'react-datepicker';
import FormInput from '../../../../components/particial/FormInput';
import NumberFormat from 'react-number-format';
import FormReactSelectContainer from '../../../../components/particial/FormReactSelectContainer';

class SplitedInvoice extends Component {
  state = {
    date: moment(),
    dueDate: moment().add(1, 'months'),
    amount: null,
  };

  render() {
    const { t, index, removeErrorMsgHandler, currency } = this.props;

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
              customInput={<FormInput label={t('field:invoiceDate')} />}
              // className={classes.fullWidth}
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
              customInput={<FormInput label={t('field:dueDate')} />}
              // className={classes.fullWidth}
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
            <FormReactSelectContainer label={t('field:amount')} isRequired>
              <NumberFormat
                decimalScale={0}
                thousandSeparator
                prefix={currency === 'USD' ? '$' : '¥'}
                value={this.state.amount}
                onValueChange={({ value }) => this.setState({ amount: value })}
                onFocus={() => {
                  removeErrorMsgHandler('subAmountSum');
                }}
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
