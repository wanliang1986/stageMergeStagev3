import React from 'react';
import Immutable from 'immutable';
import moment from 'moment-timezone';
import {
  selectStartToOpen,
  startFailedWarranty,
} from '../../../../../actions/startActions';
import { currency as currencyOptions } from '../../../../../constants/formOptions';

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
import NumberFormat from 'react-number-format';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { showErrorMessage } from '../../../../../actions';
import { getApplication } from '../../../../../actions/applicationActions';

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
//Candidate resigned
// Terminated - performance reason
// Terminated - other reasons from candidate

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
//No replacement
// Replacement required

const currencyLabels = currencyOptions.reduce((res, v) => {
  res[v.value] = v.label;
  return res;
}, {});

class FailedWarrantyForm extends React.Component {
  constructor(props) {
    super(props);
    const failedWarranty = props.start.get('failedWarranty');
    this.state = {
      errorMessage: Immutable.Map(),
      processing: false,

      endDate: failedWarranty
        ? moment(failedWarranty.get('endDate'))
        : moment(),
      reason: failedWarranty ? failedWarranty.get('reason') : null, // 'EMPLOYEE_RESIGNED','CLIENT_CANCELED_POSITION'
      actionPlan: failedWarranty ? failedWarranty.get('actionPlan') : null, // 'REPLACEMENT_REQUIRED','NO_REPLACEMENT',
      totalBillAmount: failedWarranty
        ? failedWarranty.get('totalBillAmount') || ''
        : '',
      note: failedWarranty ? failedWarranty.get('note') : '',
      markCandidateAvailable: failedWarranty
        ? failedWarranty.get('markCandidateAvailable') || false
        : true,
      failedWarranty,
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const { t, dispatch, start, onClose } = this.props;
    const { markCandidateAvailable, failedWarranty } = this.state;
    console.log('handleSubmit');

    let errorMessage = this._validateForm(form, t);
    if (errorMessage) {
      console.log(errorMessage.toJS());
      return this.setState({ errorMessage });
    }
    this.setState({ errorMessage: Immutable.Map(), processing: true });

    const formData = {
      endDate: form.endDate.value,
      reason: form.reason.value,
      actionPlan: form.actionPlan.value,
      note: form.note.value,
      markCandidateAvailable,
    };
    if (form.totalBillAmount) {
      formData.totalBillAmount = form.totalBillAmount.value;
    }

    // console.log(formData);
    dispatch(startFailedWarranty(formData, start.get('id'), !!failedWarranty))
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

  _validateForm(form, t) {
    let errorMessage = Immutable.Map();

    if (!form.endDate.value) {
      errorMessage = errorMessage.set(
        'endDate',
        t('message:End date is required')
      );
    }
    if (!form.reason.value) {
      errorMessage = errorMessage.set(
        'reason',
        t('message:Reason is required')
      );
    }
    if (!form.actionPlan.value) {
      errorMessage = errorMessage.set(
        'actionPlan',
        t('message:Action plan is required')
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
      processing,
      errorMessage,
      endDate,
      reason,
      actionPlan,
      totalBillAmount,
      note,
      markCandidateAvailable,
    } = this.state;
    const { t, onClose, start } = this.props;
    return (
      <>
        <DialogTitle>{t('common:Failed Warranty')}</DialogTitle>
        <DialogContent>
          <form id={'failedWarranty'} onSubmit={this.handleSubmit}>
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
                  onChange={this.handleEndDateChange}
                  placeholderText="mm/dd/yyyy"
                  minDate={moment(start.get('startDate'))}
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

              <div className="small-12 columns">
                <FormReactSelectContainer
                  isRequired
                  errorMessage={errorMessage.get('actionPlan')}
                  label={t('field:Action Plan')}
                >
                  <Select
                    value={actionPlan}
                    onChange={this.handleActionPlanChange}
                    simpleValue
                    options={actionPlanOpts}
                    autoBlur
                    searchable={false}
                    clearable={false}
                  />
                </FormReactSelectContainer>
                <input
                  type="hidden"
                  name="actionPlan"
                  value={actionPlan || ''}
                />
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
                      prefix={
                        currencyLabels[
                          start.getIn(['startFteRate', 'currency'])
                        ]
                      }
                      value={totalBillAmount}
                      onValueChange={this.handleGMChange}
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
                  errorMessage={errorMessage.get('note')}
                  label={t('field:note')}
                  name="note"
                  isRequired
                  value={note}
                  rows={4}
                  onChange={(e) => this.setState({ note: e.target.value })}
                />
              </div>

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
            </div>
          </form>
        </DialogContent>
        <DialogActions>
          <SecondaryButton onClick={() => onClose()}>
            {t('action:cancel')}
          </SecondaryButton>
          <PrimaryButton
            type={'submit'}
            form={'failedWarranty'}
            processing={processing}
          >
            {t('action:save')}
          </PrimaryButton>
        </DialogActions>
      </>
    );
  }
}

export default FailedWarrantyForm;
