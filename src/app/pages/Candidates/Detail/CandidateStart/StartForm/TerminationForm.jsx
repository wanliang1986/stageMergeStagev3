import React from 'react';
import Immutable from 'immutable';
import moment from 'moment-timezone';

import Select from 'react-select';
import DatePicker from 'react-datepicker';

import Divider from '@material-ui/core/Divider';

import FormReactSelectContainer from '../../../../../components/particial/FormReactSelectContainer';
import FormInput from '../../../../../components/particial/FormInput';
import FormTextArea from '../../../../../components/particial/FormTextArea';

const reasonOpts = [
  {
    value: 'CONTRACT_ENDED_AS_SCHEDULED',
    label: 'Contract ended as scheduled',
  },
  {
    value: 'CONTRACT_ENDED_EARLY_PROJECT_END',
    label: 'Contract ended early: project end',
  },
  {
    value: 'CONTRACT_ENDED_EARLY_POOR_PERFORMANCE',
    label: 'Contract ended early: poor performance',
  },
  {
    value: 'CONVERTED_TO_FTE',
    label: 'Converted to FTE',
  },
  {
    value: 'CONVERTED_TO_VENDOR',
    label: 'Converted to vendor',
  },
  {
    value: 'EMPLOYEE_RESIGNED_TOOK_ANOTHER_JOB_OFFER',
    label: 'Employee resigned: took another job offer',
  },
  {
    value: 'EMPLOYEE_RESIGNED_OTHER_REASON',
    label: 'Employee resigned: other reason',
  },
  {
    value: 'QUIT_WITHOUT_GIVING_PROPER_NOTICE',
    label: 'Quit without giving proper notice',
  },
];

const convertToFteFeeStatusOpts = [
  {
    value: 'HAS_CONVERSION_FEE',
    label:
      'Has conversion fee (complete the Start form the day after the termination date)',
  },
  {
    value: 'NO_CONVERSION_FEE',
    label: 'No conversion fee',
  },
];

class FailedWarrantyForm extends React.Component {
  constructor(props) {
    super(props);
    const termination = props.termination;
    this.state = {
      errorMessage: Immutable.Map(),
      processing: false,

      terminationDate: moment(termination.terminationDate),
      reason: termination.reason,
      note: termination.note || '',
    };
  }

  handleTerminationDateChange = (terminationDate) => {
    this.setState({ terminationDate });
  };

  handleReasonChange = (reason) => {
    this.setState({ reason });
  };

  render() {
    const { errorMessage, terminationDate, reason, note } = this.state;
    const { t, currency, termination } = this.props;
    return (
      <div className="row expanded">
        <div className="small-12 columns">
          <DatePicker
            dropdownMode="select"
            customInput={
              <FormInput
                label={t('field:terminationDate')}
                errorMessage={errorMessage.get('terminationDate')}
              />
            }
            selected={terminationDate}
            // onChange={this.handleEndDateChange}
            placeholderText="mm/dd/yyyy"
            disabled
          />
          <input
            name="terminationDate"
            type="hidden"
            value={terminationDate ? terminationDate.format('YYYY-MM-DD') : ''}
          />
        </div>

        <div className="small-12 columns">
          <FormReactSelectContainer
            // isRequired
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
        {reason === 'CONVERTED_TO_FTE' && (
          <div className="small-12 columns">
            <FormReactSelectContainer>
              <Select
                name="convertToFteFeeStatus"
                value={termination.convertToFteFeeStatus}
                onChange={this.handleConvertToFteFeeStatusChange}
                simpleValue
                options={convertToFteFeeStatusOpts}
                autoBlur
                searchable={false}
                clearable={false}
                disabled
              />
            </FormReactSelectContainer>
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
