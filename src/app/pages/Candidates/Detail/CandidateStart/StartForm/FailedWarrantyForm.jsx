import React from 'react';
import Immutable from 'immutable';
import moment from 'moment-timezone';
import { currency as currencyOptions } from '../../../../../constants/formOptions';

import Select from 'react-select';
import DatePicker from 'react-datepicker';

import Divider from '@material-ui/core/Divider';

import FormReactSelectContainer from '../../../../../components/particial/FormReactSelectContainer';
import FormInput from '../../../../../components/particial/FormInput';
import FormTextArea from '../../../../../components/particial/FormTextArea';
import NumberFormat from 'react-number-format';

const reasonOpts = [
  {
    value: 'CANDIDATE_RESIGNED',
    label: 'Candidate resigned',
  },
  {
    value: 'TERMINATED_PERFORMANCE_REASON',
    label: 'Terminated - performance reason',
  },
  {
    value: 'TERMINATED_OTHER_REASONS_FROM_CANDIDATE',
    label: 'Terminated - other reasons from candidate',
  },
];
const actionPlanOpts = [
  {
    value: 'NO_REPLACEMENT',
    label: 'No replacement',
  },
  {
    value: 'REPLACEMENT_REQUIRED',
    label: 'Replacement required',
  },
];

const currencyLabels = currencyOptions.reduce((res, v) => {
  res[v.value] = v.label;
  return res;
}, {});

class FailedWarrantyForm extends React.Component {
  constructor(props) {
    super(props);
    const failedWarranty = props.failedWarranty;
    this.state = {
      errorMessage: Immutable.Map(),
      processing: false,

      endDate: moment(failedWarranty.endDate),
      reason: failedWarranty.reason,
      actionPlan: failedWarranty.actionPlan,
      totalBillAmount: failedWarranty.totalBillAmount || '',
      note: failedWarranty.note || '',
    };
  }

  handleEndDateChange = (endDate) => {
    this.setState({ endDate });
  };

  handleReasonChange = (reason) => {
    this.setState({ reason });
  };

  handleActionPlanChange = (actionPlan) => {
    this.setState({ actionPlan });
  };
  handleGMChange = ({ value }) => {
    this.setState({
      totalBillAmount: value,
    });
  };

  render() {
    const {
      errorMessage,
      endDate,
      reason,
      actionPlan,
      totalBillAmount,
      note,
    } = this.state;
    const { t, currency } = this.props;
    return (
      <div className="row expanded">
        <div className="small-12 columns">
          <DatePicker
            dropdownMode="select"
            customInput={
              <FormInput
                label={t('field:endDate')}
                isRequired
                errorMessage={errorMessage.get('endDate')}
              />
            }
            selected={endDate}
            // onChange={this.handleEndDateChange}
            placeholderText="mm/dd/yyyy"
            disabled
          />
          <input
            name="endDate"
            type="hidden"
            value={endDate ? endDate.format('YYYY-MM-DD') : ''}
          />
        </div>

        <div className="small-12 columns">
          <FormReactSelectContainer
            isRequired
            errorMessage={errorMessage.get('reason')}
            label={t('field:Choose a Reason')}
          >
            <Select
              value={reason}
              // onChange={this.handleReasonChange}
              simpleValue
              options={reasonOpts}
              autoBlur
              searchable={false}
              clearable={false}
              disabled
            />
          </FormReactSelectContainer>
          <input type="hidden" name="reason" value={reason || ''} />
        </div>

        <div className="small-12 columns">
          <FormReactSelectContainer
            isRequired
            errorMessage={errorMessage.get('actionPlan')}
            label={t('field:Action Plan')}
          >
            <Select
              value={actionPlan}
              // onChange={this.handleActionPlanChange}
              simpleValue
              options={actionPlanOpts}
              autoBlur
              searchable={false}
              clearable={false}
              disabled
            />
          </FormReactSelectContainer>
          <input type="hidden" name="actionPlan" value={actionPlan || ''} />
        </div>

        {actionPlan === 'NO_REPLACEMENT' && (
          <div className="small-12 columns">
            <FormReactSelectContainer
              errorMessage={errorMessage.get('totalBillAmount')}
              // label={t('field:finalFee')}
            >
              <NumberFormat
                decimalScale={2}
                thousandSeparator
                prefix={currencyLabels[currency]}
                value={totalBillAmount}
                disabled
                // onValueChange={this.handleGMChange}
                placeholder={'Enter final GM'}
              />
            </FormReactSelectContainer>
            <input
              type="hidden"
              name="totalBillAmount"
              value={totalBillAmount || ''}
            />
          </div>
        )}

        <div className="small-12 columns">
          <FormTextArea
            label={t('field:note')}
            name="note"
            value={note}
            rows={4}
            disabled
          />
        </div>

        <div className="small-12 columns">
          <Divider style={{ marginBottom: '0.75rem' }} />
        </div>
      </div>
    );
  }
}

export default FailedWarrantyForm;
