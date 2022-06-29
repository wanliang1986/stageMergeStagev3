import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { getMemoFromApplication } from '../../../../utils';
import {
  updateApplication2,
  updateDashboardApplStatus,
} from '../../../actions/applicationActions';

import { showErrorMessage } from '../../../actions';
import {
  getApplicationStatusLabel,
  canUpdateResume,
  currency as currencyOptions,
} from '../../../constants/formOptions';

import Select from 'react-select';

import Divider from '@material-ui/core/Divider';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import FormReactSelectContainer from '../../particial/FormReactSelectContainer';
import PrimaryButton from '../../particial/PrimaryButton';
import SecondaryButton from '../../particial/SecondaryButton';
import FormTextArea from '../../particial/FormTextArea';
import ApplicationInfoWithCommissions from '../views/ApplicationInfoWithCommissions';
import Loading from '../../particial/Loading';
import NumberFormat from 'react-number-format';
import ResumeSelector from './ResumeSelector';

const rateUnitTypeOptions = [
  { label: 'Yearly', value: 'YEARLY' },
  { label: 'Monthly', value: 'MONTHLY' },
  { label: 'Weekly', value: 'WEEKLY' },
  { label: 'Daily', value: 'DAILY' },
  { label: 'Hourly', value: 'HOURLY' },
];
const currencyLabels = currencyOptions.reduce((res, v) => {
  res[v.value] = v.label;
  return res;
}, {});

class AddActivityDefaultForm extends Component {
  constructor(props) {
    super(props);

    const { application } = props;
    this.state = {
      errorMessage: Immutable.Map(),
      currency: application.getIn(['agreedPayRate', 'currency']) || null,
      rateUnitType:
        application.getIn(['agreedPayRate', 'rateUnitType']) || null,
      agreedPayRate:
        application.getIn(['agreedPayRate', 'agreedPayRate']) < 0
          ? ''
          : application.getIn(['agreedPayRate', 'agreedPayRate']),
      note: '',

      processing: false,
      fetching: true,
    };
    this.fTimer = setTimeout(() => this.setState({ fetching: false }), 500);
  }

  handleCommissionsUpdate = (commissions) => {
    this.setState({ commissions });
  };

  inputChangeHandler = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  };

  submitAddCandidateActivity = (e) => {
    e.preventDefault();
    const activityForm = e.target;
    const { note, currency, rateUnitType, agreedPayRate } = this.state;
    const {
      dispatch,
      t,
      formType,
      application: oldApplication,
      cancelAddActivity,
      canSkipSubmitToAM,
    } = this.props;
    const status =
      formType === 'updateResume' ||
      formType === 'addNote' ||
      formType === 'preStatus'
        ? oldApplication.get('status')
        : formType;
    console.log(status, oldApplication.toJS(), oldApplication.get('status'));
    const activity = {
      status: status,
      resumeId: activityForm.resumeId.value || null,
      memo: note,
    };
    if ((agreedPayRate && agreedPayRate !== '') || currency || rateUnitType) {
      activity.agreedPayRate = {
        currency,
        rateUnitType,
        agreedPayRate: agreedPayRate ? Number(agreedPayRate) : null,
      };
    } else {
      activity.agreedPayRate = null;
    }
    let errorMessage = this._validateForm(activity, t, canSkipSubmitToAM);
    if (errorMessage) {
      return this.setState({ errorMessage });
    }

    this.setState({ processing: true });
    dispatch(updateApplication2(activity, oldApplication.get('id')))
      .then((newApplication) => {
        console.log('[[response]]', newApplication);
        cancelAddActivity();
        if (status !== oldApplication.get('status')) {
          dispatch(
            updateDashboardApplStatus(newApplication.id, newApplication.status)
          );
          dispatch({ type: 'UPDATE_DB_DATA' });
        }
      })
      .catch((err) => {
        this.setState({ processing: false });
        dispatch(showErrorMessage(err));
      });
  };

  _removeErrorMsgHandler = (key) => {
    return this.setState({
      errorMessage: this.state.errorMessage.delete(key),
    });
  };

  _validateForm = (activityObject, t, canSkipSubmitToAM) => {
    let errorMessage = Immutable.Map();
    if (!activityObject.status) {
      errorMessage = errorMessage.set('status', t('message:statusIsRequired'));
    }
    if (!activityObject.resumeId) {
      errorMessage = errorMessage.set(
        'resumeId',
        t('message:resumeIsRequired')
      );
    }
    if (!activityObject.memo) {
      errorMessage = errorMessage.set('note', t('message:noteIsRequired'));
    }

    if (activityObject.memo.length > 5000) {
      errorMessage = errorMessage.set('note', t('message:noteLengthError'));
    }

    if (
      activityObject.agreedPayRate &&
      activityObject.agreedPayRate.agreedPayRate === 0
    ) {
      errorMessage = errorMessage.set(
        'agreedPayRate',
        t('message:The amount of agreed pay rate cannot be 0')
      );
    }
    if (
      activityObject.agreedPayRate &&
      (!activityObject.agreedPayRate.currency ||
        !activityObject.agreedPayRate.rateUnitType ||
        (activityObject.agreedPayRate.agreedPayRate !== 0 &&
          !activityObject.agreedPayRate.agreedPayRate))
    ) {
      errorMessage = errorMessage.set(
        'agreedPayRate',
        t('message:The agreed pay rate part is incomplete')
      );
    }

    // check on google, adobe
    if (canSkipSubmitToAM && !activityObject.agreedPayRate) {
      errorMessage = errorMessage.set(
        'agreedPayRate',
        t('message:The agreed pay rate is required')
      );
    }

    return errorMessage.size > 0 && errorMessage;
  };

  handleDropDownChange = (key) => (value) => {
    if (value !== this.state[key]) {
      this.setState({ [key]: value });
      this._removeErrorMsgHandler('agreedPayRate');
    }
  };

  handleNumberChange = (key) => (values) => {
    this.setState({ [key]: values.value });
    this._removeErrorMsgHandler('agreedPayRate');
  };

  render() {
    const { t, cancelAddActivity, application, formType, canSkipSubmitToAM } =
      this.props;

    const {
      currency,
      rateUnitType,
      agreedPayRate,
      note,
      errorMessage,
      fetching,
      processing,
    } = this.state;

    if (fetching) {
      return <Loading />;
    }

    return (
      <Fragment>
        {/* 标题 */}
        <DialogTitle>
          {t(`tab:${getApplicationStatusLabel(formType).toLowerCase()}`)}
        </DialogTitle>

        {/* 表单内容 */}
        <DialogContent>
          <form onSubmit={this.submitAddCandidateActivity} id="activityForm">
            <ApplicationInfoWithCommissions
              applicationId={application.get('id')}
              onCommissionsUpdate={this.handleCommissionsUpdate}
              t={t}
            />
            <section>
              <Divider style={{ margin: '20px -24px 15px' }} />
              <div className="row expanded">
                <div className="columns">
                  <FormReactSelectContainer
                    label={t('field:agreedPayRate')}
                    errorMessage={!!errorMessage.get('agreedPayRate')}
                    isRequired={canSkipSubmitToAM}
                  />
                </div>
              </div>
              <div className="row expanded">
                <div className="columns">
                  <FormReactSelectContainer>
                    <NumberFormat
                      thousandSeparator
                      prefix={currencyLabels[currency]}
                      // disabled={edit}
                      value={agreedPayRate}
                      onValueChange={this.handleNumberChange('agreedPayRate')}
                      allowNegative={false}
                      placeholder={'Amount'}
                    />
                  </FormReactSelectContainer>
                  <input
                    type="hidden"
                    name="agreedPayRate"
                    value={agreedPayRate || ''}
                  />
                </div>

                <div className="columns">
                  <FormReactSelectContainer>
                    <Select
                      labelKey={'label2'}
                      clearable={true}
                      // disabled={edit}
                      value={currency}
                      options={currencyOptions}
                      onChange={this.handleDropDownChange('currency')}
                      simpleValue
                      placeholder={'Currency'}
                    />
                  </FormReactSelectContainer>
                  <input type="hidden" name="currency" value={currency || ''} />
                </div>
                <div className="columns">
                  <FormReactSelectContainer>
                    <Select
                      clearable={true}
                      // disabled={edit}
                      value={rateUnitType}
                      simpleValue
                      options={rateUnitTypeOptions}
                      onChange={this.handleDropDownChange('rateUnitType')}
                      placeholder={t('field:Rate Unit Type')}
                    />
                  </FormReactSelectContainer>
                  <input
                    type="hidden"
                    name="rateUnitType"
                    value={rateUnitType || ''}
                  />
                </div>
              </div>
              {errorMessage && errorMessage.get('agreedPayRate') ? (
                <div className="columns">
                  <div
                    style={{
                      color: '#cc4b37',
                      fontWeight: 'bold',
                      fontSize: '0.75rem',
                      transform: `translateY(-8px)`,
                    }}
                  >
                    {errorMessage.get('agreedPayRate')}
                  </div>
                </div>
              ) : null}

              <ResumeSelector
                t={t}
                isTalentDetail={this.props.activityFromTalent}
                talentId={application.get('talentId')}
                resumeId={application.get('resumeId')}
                errorMessage={errorMessage}
                removeErrorMessage={this._removeErrorMsgHandler}
                disabled={!canUpdateResume(application.get('status'))}
              />
              <div className="row expanded">
                <div className="small-12 columns">
                  <FormTextArea
                    errorMessage={errorMessage.get('note')}
                    name="note"
                    label={t('field:note')}
                    rows="3"
                    placeholder={getMemoFromApplication(application)}
                    value={note}
                    onChange={this.inputChangeHandler}
                    onFocus={() => this._removeErrorMsgHandler('note')}
                  />
                </div>
              </div>
            </section>
          </form>
        </DialogContent>
        <Divider />

        {/* 修改状态的按钮 （取消 提交） */}
        <DialogActions>
          <div className="horizontal-layout">
            <SecondaryButton onClick={cancelAddActivity}>
              {t('action:cancel')}
            </SecondaryButton>
            <PrimaryButton
              type="submit"
              form="activityForm"
              processing={processing}
            >
              {t('action:submit')}
            </PrimaryButton>
          </div>
        </DialogActions>
      </Fragment>
    );
  }
}

AddActivityDefaultForm.propTypes = {
  cancelAddActivity: PropTypes.func.isRequired,
  application: PropTypes.object.isRequired,
};

const mapStoreStateToProps = (state, { application }) => {
  const job = state.model.jobs.get(String(application.get('jobId')));
  const companyId = job && job.get('companyId');
  const canSkipSubmitToAM = !!state.model.skimSubmitToAMCompanies.get(
    String(companyId)
  );
  return {
    currentUserId: state.controller.currentUser.get('id'),
    canSkipSubmitToAM,
  };
};

export default connect(mapStoreStateToProps)(AddActivityDefaultForm);
