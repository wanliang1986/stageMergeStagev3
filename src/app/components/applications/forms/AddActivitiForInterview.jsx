import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { getMemoFromApplication } from '../../../../utils';
import {
  updateApplication,
  updateDashboardApplStatus,
} from '../../../actions/applicationActions';

import { showErrorMessage } from '../../../actions';
import {
  getApplicationStatusLabel,
  interviewTimeList,
  interviewTypeList,
  interviewStageList,
  SEND_EMAIL_TYPES,
  currency as currencyOptions,
  // INTERVIEW_TYPES,
} from '../../../constants/formOptions';
import moment from 'moment-timezone';
import { ADD_SEND_EMAIL_REQUEST } from '../../../constants/actionTypes';

import DatePicker from 'react-datepicker';
import Select from 'react-select';

import Divider from '@material-ui/core/Divider';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import FormInput from '../../particial/FormInput';
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

class InterviewFrom extends Component {
  constructor(props) {
    super(props);

    const { application } = props;
    this.state = {
      errorMessage: Immutable.Map(),
      interviewDate: moment(),
      interviewTime: '09:00',
      eventTimeZone: moment.tz.guess(),
      timeZoneList: this._assembleTimezonOptionList(moment()),
      // interviewType: INTERVIEW_TYPES.Phone,

      currency: application.getIn(['agreedPayRate', 'currency']) || null,
      rateUnitType:
        application.getIn(['agreedPayRate', 'rateUnitType']) || null,
      agreedPayRate:
        application.getIn(['agreedPayRate', 'agreedPayRate']) < 0
          ? ''
          : application.getIn(['agreedPayRate', 'agreedPayRate']),
      note: '',
      sendEmailToHM: false,
      sendEmailToTalent: false,

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
    const interviewForm = e.target;
    const {
      t,
      dispatch,
      formType,
      application: oldApplication,
      cancelAddActivity,
      canSkipSubmitToAM,
    } = this.props;
    let errorMessage = this._validateForm(interviewForm, t, canSkipSubmitToAM);
    if (errorMessage) {
      return this.setState({ errorMessage });
    }

    this.setState({ processing: true, errorMessage: Immutable.Map() });

    const {
      sendEmailToHM,
      sendEmailToTalent,
      currency,
      rateUnitType,
      agreedPayRate,
    } = this.state;

    const activity = {
      status: formType,
      resumeId: interviewForm.resumeId.value || null,
      memo: interviewForm.note.value,
      eventStage: interviewForm.interviewStage.value,
      eventType: interviewForm.interviewType.value,
      eventTimeZone: interviewForm.eventTimeZone.value,
    };
    let time =
      interviewForm.interviewDate.value +
      ' ' +
      interviewForm.interviewTime.value;
    time = moment.tz(time, activity.eventTimeZone).utc().format();
    activity.eventDate = time;
    if ((agreedPayRate && agreedPayRate !== '') || currency || rateUnitType) {
      activity.agreedPayRate = {
        currency,
        rateUnitType,
        agreedPayRate: agreedPayRate ? Number(agreedPayRate) : null,
      };
    } else {
      activity.agreedPayRate = null;
    }
    this.props
      .dispatch(updateApplication(activity, oldApplication.get('id')))
      .then((newApplication) => {
        console.log('[[response]]', newApplication);
        cancelAddActivity();
        if (sendEmailToHM) {
          dispatch({
            type: ADD_SEND_EMAIL_REQUEST,
            request: {
              type: SEND_EMAIL_TYPES.SendEmailToHM,
              data: {
                application: newApplication,
              },
            },
          });
        }
        if (sendEmailToTalent) {
          dispatch({
            type: ADD_SEND_EMAIL_REQUEST,
            request: {
              type: SEND_EMAIL_TYPES.SendEmailToCandidate,
              data: {
                application: newApplication,
              },
            },
          });
        }

        dispatch(
          updateDashboardApplStatus(newApplication.id, newApplication.status)
        );
        dispatch({ type: 'UPDATE_DB_DATA' });
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

  _validateForm = (form, t, canSkipSubmitToAM) => {
    let errorMessage = Immutable.Map();
    if (
      form.agreedPayRate.value !== '' &&
      Number(form.agreedPayRate.value) === 0
    ) {
      errorMessage = errorMessage.set(
        'agreedPayRate',
        t('message:The amount of agreed pay rate cannot be 0')
      );
    }
    if (
      (!form.currency.value ||
        !form.rateUnitType.value ||
        !form.agreedPayRate.value) &&
      !(
        !form.currency.value &&
        !form.rateUnitType.value &&
        !form.agreedPayRate.value
      )
    ) {
      errorMessage = errorMessage.set(
        'agreedPayRate',
        t('message:The agreed pay rate part is incomplete')
      );
    }
    // check on google, adobe
    if (
      canSkipSubmitToAM &&
      !form.currency.value &&
      !form.rateUnitType.value &&
      !form.agreedPayRate.value
    ) {
      errorMessage = errorMessage.set(
        'agreedPayRate',
        t('message:The agreed pay rate is required')
      );
    }

    if (!form.interviewDate.value) {
      errorMessage = errorMessage.set(
        'interviewDate',
        t('message:interviewDateIsRequired')
      );
    }
    if (!form.interviewTime.value) {
      errorMessage = errorMessage.set(
        'interviewTime',
        t('message:interviewTimeIsRequired')
      );
    }

    if (!form.eventTimeZone.value) {
      errorMessage = errorMessage.set(
        'eventTimeZone',
        t('message:timeZoneIsRequired')
      );
    }
    if (!form.interviewType.value) {
      errorMessage = errorMessage.set(
        'interviewType',
        t('message:interviewTypeIsRequired')
      );
    }

    if (!form.interviewStage.value) {
      errorMessage = errorMessage.set(
        'interviewStage',
        t('message:interviewStageIsRequired')
      );
    }

    if (!form.note.value) {
      errorMessage = errorMessage.set('note', t('message:noteIsRequired'));
    }

    if (form.note.value.length > 5000) {
      errorMessage = errorMessage.set('note', t('message:noteLengthError'));
    }

    return errorMessage.size > 0 && errorMessage;
  };

  _assembleTimezonOptionList = (interviewDate) => {
    const zoneNames = moment.tz.names();
    // console.log(interviewDate);
    return zoneNames.map((value) => {
      const offset = moment.tz.zone(value).utcOffset(new Date(interviewDate));
      const offsetAbs = Math.abs(offset);
      const remain = offsetAbs % 60;
      const hour = (offsetAbs - remain) / 60;
      const label =
        offset > 0
          ? `(UTC-${hour < 10 ? '0' : ''}${hour}:${
              remain ? remain : '00'
            }) ${value}`
          : `(UTC+${hour < 10 ? '0' : ''}${hour}:${
              remain ? remain : '00'
            }) ${value}`;
      return {
        value,
        label,
      };
    });
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
      errorMessage,
      fetching,
      edit,

      interviewDate,
      interviewTime,
      eventTimeZone,
      timeZoneList,
      interviewType,
      interviewStage,

      currency,
      rateUnitType,
      agreedPayRate,
      note,
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

              {/* 面试表格内容 */}
              <div className="row expanded">
                {/* 1.面试日期 eg:2021/1/1 */}
                <div className="small-3 columns">
                  <DatePicker
                    disabled={edit}
                    customInput={
                      <FormInput
                        label={t('field:interviewDate')}
                        errorMessage={errorMessage.get('interviewDate')}
                      />
                    }
                    selected={interviewDate}
                    onChange={(newInterviewDate) => {
                      newInterviewDate = newInterviewDate || interviewDate;
                      this.setState({
                        interviewDate: newInterviewDate,
                        timeZoneList:
                          this._assembleTimezonOptionList(newInterviewDate),
                      });
                    }}
                    onFocus={() => this._removeErrorMsgHandler('interviewDate')}
                    placeholderText="mm/dd/yyyy"
                  />
                  <input
                    type="hidden"
                    name="interviewDate"
                    value={
                      interviewDate ? interviewDate.format('YYYY-MM-DD') : ''
                    }
                  />
                </div>
                {/* 2.面试时间 eg:20:00 */}
                <div className="small-3 columns">
                  <FormReactSelectContainer
                    label="&nbsp;"
                    errorMessage={errorMessage.get('interviewTime')}
                  >
                    <Select
                      disabled={edit}
                      value={interviewTime}
                      onChange={(newInterviewTime) =>
                        this.setState({
                          interviewTime: newInterviewTime || interviewTime,
                        })
                      }
                      simpleValue
                      options={interviewTimeList}
                      searchable={false}
                      autoBlur={true}
                      clearable={false}
                      onFocus={() =>
                        this._removeErrorMsgHandler('interviewTime')
                      }
                    />
                  </FormReactSelectContainer>
                  <input
                    type="hidden"
                    name="interviewTime"
                    value={interviewTime || ''}
                  />
                </div>
                {/* 3. 选择时区 */}
                <div className="small-6 columns">
                  <FormReactSelectContainer
                    label={t('field:timeZone')}
                    errorMessage={errorMessage.get('eventTimeZone')}
                  >
                    <Select
                      disabled={edit}
                      value={eventTimeZone}
                      onChange={(newTimeZone) =>
                        this.setState({
                          eventTimeZone: newTimeZone || eventTimeZone,
                        })
                      }
                      simpleValue
                      options={timeZoneList}
                      searchable={true}
                      autoBlur={true}
                      clearable={false}
                      onFocus={() =>
                        this._removeErrorMsgHandler('eventTimeZone')
                      }
                    />
                  </FormReactSelectContainer>
                  <input
                    type="hidden"
                    name="eventTimeZone"
                    value={eventTimeZone || ''}
                  />
                </div>
              </div>
              {/* 4.面试下拉框 */}
              <div className="row expanded">
                {/* 4.面试阶段下拉框 */}
                <div className="small-6 columns">
                  <FormReactSelectContainer
                    label={t('field:interviewStage')}
                    errorMessage={errorMessage.get('interviewStage')}
                  >
                    <Select
                      value={interviewStage}
                      onChange={(newInterviewStage) =>
                        this.setState({
                          interviewStage: newInterviewStage || interviewStage,
                        })
                      }
                      placeholder={t('message:select')}
                      simpleValue
                      options={interviewStageList}
                      searchable={false}
                      autoBlur={true}
                      clearable={false}
                    />
                  </FormReactSelectContainer>
                  <input
                    type="hidden"
                    name="interviewStage"
                    value={interviewStage || ''}
                  />
                </div>
                {/* 4.面试类型下拉框 */}
                <div className="small-6 columns">
                  <FormReactSelectContainer
                    label={t('field:interviewType')}
                    errorMessage={errorMessage.get('interviewType')}
                  >
                    <Select
                      value={interviewType}
                      onChange={(newInterviewType) =>
                        this.setState({
                          interviewType: newInterviewType || interviewType,
                        })
                      }
                      placeholder={t('message:select')}
                      simpleValue
                      options={interviewTypeList}
                      searchable={false}
                      autoBlur={true}
                      clearable={false}
                    />
                  </FormReactSelectContainer>
                  <input
                    type="hidden"
                    name="interviewType"
                    value={interviewType || ''}
                  />
                </div>
              </div>
              {/* 5.选择简历下拉框 */}
              <ResumeSelector
                t={t}
                isTalentDetail={this.props.activityFromTalent}
                talentId={application.get('talentId')}
                resumeId={application.get('resumeId')}
                errorMessage={errorMessage}
                removeErrorMessage={this._removeErrorMsgHandler}
                disabled
              />
              {/* 7.备注 */}
              <div className="row expanded">
                <div className="small-12 columns">
                  <FormTextArea
                    disabled={edit}
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
              {/* 8.选择发送email的人 1.Send Email to Candidate 2.Send Email to Hiring Manager */}
              <Divider style={{ margin: '10px 0px ' }} />
              <div className="row expanded">
                <FormControlLabel
                  className="columns"
                  control={
                    <Checkbox
                      disabled={edit}
                      color="primary"
                      checked={this.state.sendEmailToTalent}
                      onChange={(e) =>
                        this.setState({
                          sendEmailToTalent: e.target.checked,
                        })
                      }
                    />
                  }
                  label={t('common:Send Email to Candidate')}
                />
                <FormControlLabel
                  className="columns"
                  control={
                    <Checkbox
                      disabled={edit}
                      color="primary"
                      checked={this.state.sendEmailToHM}
                      onChange={(e) =>
                        this.setState({ sendEmailToHM: e.target.checked })
                      }
                    />
                  }
                  label={t('common:Send Email to Client Contact')}
                />
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

InterviewFrom.propTypes = {
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
    canSkipSubmitToAM,
  };
};

export default connect(mapStoreStateToProps)(InterviewFrom);
