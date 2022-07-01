import React from 'react';
import Immutable from 'immutable';
import moment from 'moment-timezone';
import {
  selectStartToOpen,
  startTermination,
} from '../../../../../actions/startActions';

import Select from 'react-select';

import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import SecondaryButton from '../../../../../components/particial/SecondaryButton';
import PrimaryButton from '../../../../../components/particial/PrimaryButton';
import FormReactSelectContainer from '../../../../../components/particial/FormReactSelectContainer';
import DatePicker from 'react-datepicker';
import FormInput from '../../../../../components/particial/FormInput';
import FormTextArea from '../../../../../components/particial/FormTextArea';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { showErrorMessage } from '../../../../../actions';
import { getApplication } from '../../../../../actions/applicationActions';

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

class TerminationForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: Immutable.Map(),
      processing: false,

      terminationDate: moment.max([
        moment(),
        moment(props.start.get('startDate')),
      ]),
      reason: null,
      convertToFteFeeStatus: 'HAS_CONVERSION_FEE',
      note: '',
      markCandidateAvailable: true,
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const { t, dispatch, start, onClose } = this.props;
    const { markCandidateAvailable } = this.state;
    console.log('handleSubmit');

    let errorMessage = this._validateForm(form, t, start);
    if (errorMessage) {
      console.log(errorMessage.toJS());
      return this.setState({ errorMessage });
    }
    this.setState({ errorMessage: Immutable.Map(), processing: true });

    const formData = {
      terminationDate: form.terminationDate.value,
      reason: form.reason.value,
      note: form.note.value,
      markCandidateAvailable,
    };
    if (formData.reason === 'CONVERTED_TO_FTE') {
      formData.convertToFteFeeStatus = this.state.convertToFteFeeStatus;
    }
    // console.log(formData);
    dispatch(startTermination(formData, start.get('id')))
      .then((newStart) => {
        dispatch(selectStartToOpen(Immutable.fromJS(newStart)));
        dispatch(getApplication(start.get('applicationId')));
        onClose(newStart);
      })
      .catch((err) => {
        dispatch(showErrorMessage(err));
        this.setState({ processing: false });
      });
  };

  _validateForm(form, t, start) {
    let errorMessage = Immutable.Map();

    if (!form.terminationDate.value) {
      errorMessage = errorMessage.set(
        'terminationDate',
        t('message:Termination date is required')
      );
    }
    if (
      form.terminationDate.value &&
      moment(form.terminationDate.value).isBefore(
        moment(start.get('startDate'))
      )
    ) {
      errorMessage = errorMessage.set(
        'terminationDate',
        t('message:Termination date should not be before Start date')
      );
    }
    if (
      form.terminationDate.value &&
      moment(start.get('endDate')).isBefore(moment(form.terminationDate.value))
    ) {
      errorMessage = errorMessage.set(
        'terminationDate',
        t('message:Termination date should be before End date')
      );
    }
    if (!form.reason.value) {
      errorMessage = errorMessage.set(
        'reason',
        t('message:Reason is required')
      );
    }
    if (!form.note.value) {
      errorMessage = errorMessage.set('note', t('message:Note is required'));
    }
    if (form.note.value.length > 5000) {
      errorMessage = errorMessage.set('note', t('message:noteLengthError'));
    }

    return errorMessage.size > 0 && errorMessage;
  }

  handleTerminationDateChange = (terminationDate) => {
    this.setState({ terminationDate });
  };

  handleReasonChange = (reason) => {
    this.setState({ reason });
  };
  handleConvertToFteFeeStatusChange = (convertToFteFeeStatus) => {
    if (convertToFteFeeStatus) this.setState({ convertToFteFeeStatus });
  };

  render() {
    const {
      processing,
      errorMessage,
      terminationDate,
      reason,
      convertToFteFeeStatus,
      markCandidateAvailable,
    } = this.state;
    const { t, onClose, start } = this.props;
    console.log(start.toJS());
    return (
      <>
        <DialogTitle>{t('common:Termination')}</DialogTitle>
        <DialogContent>
          <form id={'termination'} onSubmit={this.handleSubmit}>
            <div className="row expanded">
              <div className="small-12 columns">
                <DatePicker
                  dropdownMode="select"
                  customInput={
                    <FormInput
                      label={t('field:terminationDate')}
                      isRequired
                      errorMessage={errorMessage.get('terminationDate')}
                    />
                  }
                  selected={terminationDate}
                  onChange={this.handleTerminationDateChange}
                  placeholderText="mm/dd/yyyy"
                  minDate={moment(start.get('startDate'))}
                  maxDate={moment(start.get('endDate'))}
                />
                <input
                  name="terminationDate"
                  type="hidden"
                  value={
                    terminationDate ? terminationDate.format('YYYY-MM-DD') : ''
                  }
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
                    onChange={this.handleReasonChange}
                    simpleValue
                    options={reasonOpts}
                    autoBlur
                    searchable={false}
                    clearable={false}
                  />
                </FormReactSelectContainer>
                <input type="hidden" name="reason" value={reason || ''} />
              </div>

              {reason === 'CONVERTED_TO_FTE' && (
                <div className="small-12 columns">
                  <FormReactSelectContainer>
                    <Select
                      name="convertToFteFeeStatus"
                      value={convertToFteFeeStatus}
                      onChange={this.handleConvertToFteFeeStatusChange}
                      simpleValue
                      options={convertToFteFeeStatusOpts}
                      autoBlur
                      searchable={false}
                      clearable={false}
                    />
                  </FormReactSelectContainer>
                </div>
              )}

              <div className="small-12 columns">
                <FormTextArea
                  label={t('field:note')}
                  name="note"
                  isRequired
                  defaultValue={''}
                  rows={4}
                  errorMessage={errorMessage.get('note')}
                />
              </div>

              {reason !== 'CONVERTED_TO_FTE' && (
                <div className="small-12 columns">
                  <FormControlLabel
                    control={
                      <Checkbox
                        color="primary"
                        checked={markCandidateAvailable}
                        onChange={(e, markCandidateAvailable) =>
                          this.setState({ markCandidateAvailable })
                        }
                      />
                    }
                    label={`Make the candidate available now`}
                  />
                </div>
              )}
            </div>
          </form>
        </DialogContent>
        <DialogActions>
          <SecondaryButton onClick={() => onClose()}>
            {t('action:cancel')}
          </SecondaryButton>
          <PrimaryButton
            type={'submit'}
            form={'termination'}
            processing={processing}
          >
            {t('action:save')}
          </PrimaryButton>
        </DialogActions>
      </>
    );
  }
}

export default TerminationForm;
