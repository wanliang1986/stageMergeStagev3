import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { makeCancelable, formatBy2 } from '../../../../utils';
import { getResumesByTalentId } from '../../../actions/talentActions';
import { getTalentResumeArray } from '../../../selectors/talentResumeSelector';
import { deleteNotification } from '../../../actions/notificationActions';
import {
  currency as currencyOptions,
  getApplicationStatusByCurrentStatus,
  getApplicationStatusLabel,
} from '../../../constants/formOptions';
import moment from 'moment-timezone';

import Select from 'react-select';

import Divider from '@material-ui/core/Divider';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import ViewResume from '@material-ui/icons/RemoveRedEye';

import FormReactSelectContainer from '../../particial/FormReactSelectContainer';
import PrimaryButton from '../../particial/PrimaryButton';
import PotentialButton from '../../particial/PotentialButton';
import FormTextArea from '../../particial/FormTextArea';
import AddActivitiFormInfoDisplay from './AddActivitiFormInfoDisplay';
import ViewResumeInAddActivity from './ViewResumeInAddActivity';
import Loading from '../../../components/particial/Loading';
import NumberFormat from 'react-number-format';

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

class AddActivityForm extends Component {
  constructor(props) {
    super(props);

    const { application, resumes } = props;
    this.state = {
      errorMessage: Immutable.Map(),
      status: application.status,
      interviewDate: moment(),
      interviewTime: '09:00',
      timeZone: moment.tz.guess(),
      timeZoneList: this._assembleTimezonOptionList(moment()),
      interviewType: '',

      selectedResume: resumes.find(
        (value) => value.id === application.resumeId
      ),
      note: '',

      parsing: false,
      uploading: false,
      showedResume: false,
      sendEmailToHM: false,
      sendEmailToTalent: false,

      processing: false,
      fetching: true,
      edit: props.from === 'ActivityCard',
    };
    this.fTimer = setTimeout(() => this.setState({ fetching: false }), 500);
  }

  componentWillUnmount() {
    this.task && this.task.cancel();
  }

  componentDidMount() {
    const { dispatch, notificationSubList, activityFromJob } = this.props;
    if (notificationSubList) {
      notificationSubList.forEach((notification) =>
        dispatch(deleteNotification(notification.get('id')))
      );
    }
    if (activityFromJob) {
      this.fetchData();
    }
  }

  fetchData() {
    const { dispatch, application } = this.props;
    this.task = makeCancelable(
      dispatch(getResumesByTalentId(application.talentId))
    );
    this.task.promise.then(() => {
      this.setState({
        selectedResume: this.props.resumes.find(
          (value) => value.id === application.resumeId
        ),
      });
    });
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

  showResume = () => {
    this.setState({ showResume: true });
  };

  closeViewResume = () => {
    this.setState({ showResume: false });
  };

  _removeErrorMsgHandler = (key) => {
    return this.setState({
      errorMessage: this.state.errorMessage.delete(key),
    });
  };

  _validateForm = (activityObject, t) => {
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

    if (activityObject.eventType) {
      if (!this.state.interviewDate) {
        errorMessage = errorMessage.set(
          'interviewDate',
          t('message:interviewDateIsRequired')
        );
      }
      if (!this.state.interviewTime) {
        errorMessage = errorMessage.set(
          'interviewTime',
          t('message:interviewTimeIsRequired')
        );
      }
      if (!activityObject.eventTimeZone) {
        errorMessage = errorMessage.set(
          'eventTimeZone',
          t('message:timeZoneIsRequired')
        );
      }
    }
    return errorMessage.size > 0 && errorMessage;
  };

  _assembleTimezonOptionList = (interviewDate) => [
    {
      value: 'America/Los_Angeles',
      label: `(UTC-0${
        moment.tz
          .zone('America/Los_Angeles')
          .utcOffset(interviewDate.valueOf()) / 60
      }:00) Pacific Time`,
    },
    {
      value: 'Asia/Shanghai',
      label: '(UTC+08:00) Beijing Time',
    },
  ];

  handleResumeChange = (newValue) => {
    this.setState(({ selectedResume }) => ({
      selectedResume: newValue || selectedResume,
    }));
  };

  render() {
    const {
      t,
      cancelAddActivity,
      resumes,
      application,
      application_ViewDetails,
      // status,
    } = this.props;

    const {
      // status,
      showResume,
      selectedResume,
      errorMessage,
      fetching,
      edit,
    } = this.state;

    let status;
    // 判断是否来自Dashboard
    !!this.props.notDashboard
      ? (status = this.props.status)
      : (status = this.state.status);

    const initialMemo = formatBy2(
      application.lastModifiedDate,
      application.lastModifiedUser + '\n' + application.memo
    );

    const applicationStatusOptions = getApplicationStatusByCurrentStatus(
      application.status
    );
    // console.log('info', activityInfo);

    if (showResume) {
      return (
        <ViewResumeInAddActivity
          resume={Immutable.fromJS(selectedResume)}
          t={t}
          close={this.closeViewResume}
        />
      );
    }

    if (fetching) {
      return <Loading />;
    }
    const agreedPayRate = application.agreedPayRate || {};
    return (
      <Fragment>
        {/* 标题 */}
        <DialogTitle>{getApplicationStatusLabel(status)}</DialogTitle>

        {/* 表单内容 */}
        <DialogContent>
          <AddActivitiFormInfoDisplay
            application={application}
            onCommissionsUpdate={this.handleCommissionsUpdate}
            t={t}
            edit={edit}
          />
          <section>
            {/* 下拉框选择状态组件 暂时取消(除了从Dashboard过来的) */}
            {!this.props.notDashboard && (
              <div className="small-12 columns">
                <FormReactSelectContainer
                  label={t('field:status')}
                  errorMessage={errorMessage.get('status')}
                >
                  <Select
                    disabled={edit}
                    name="status"
                    clearable={false}
                    options={applicationStatusOptions}
                    value={status}
                    onChange={(status) => this.setState({ status })}
                    simpleValue
                    className="capitalize-dropdown"
                    openOnFocus={true}
                    autoBlur={true}
                    onFocus={() => this._removeErrorMsgHandler('status')}
                  />
                </FormReactSelectContainer>
              </div>
            )}

            <Divider style={{ margin: '20px -24px 15px' }} />
            <div className="row expanded">
              <div className="columns">
                <FormReactSelectContainer
                  label={t('field:agreedPayRate')}
                  errorMessage={errorMessage.get('agreedPayRate')}
                />
              </div>
            </div>
            <div className="row expanded">
              <div className="columns">
                <FormReactSelectContainer>
                  <NumberFormat
                    thousandSeparator
                    prefix={currencyLabels[agreedPayRate.currency]}
                    disabled={edit}
                    value={
                      agreedPayRate.agreedPayRate < 0
                        ? ''
                        : agreedPayRate.agreedPayRate
                    }
                    allowNegative={false}
                    placeholder={'Amount'}
                  />
                </FormReactSelectContainer>
              </div>

              <div className="columns">
                <FormReactSelectContainer>
                  <Select
                    labelKey={'label2'}
                    clearable={false}
                    disabled={edit}
                    value={agreedPayRate.currency}
                    options={currencyOptions}
                    simpleValue
                    placeholder={'Currency'}
                  />
                </FormReactSelectContainer>
              </div>
              <div className="columns">
                <FormReactSelectContainer>
                  <Select
                    clearable={false}
                    disabled={edit}
                    value={agreedPayRate.rateUnitType}
                    simpleValue
                    options={rateUnitTypeOptions}
                    placeholder={'Rate Unit Type'}
                  />
                </FormReactSelectContainer>
              </div>
            </div>

            {selectedResume && (
              <div className="row expanded">
                <div className="columns">
                  <FormReactSelectContainer
                    label={t('field:resume')}
                    errorMessage={errorMessage.get('resumeId')}
                    icon={<ViewResume onClick={this.showResume} />}
                  >
                    <Select
                      disabled={edit}
                      name="resumeSelect"
                      valueKey={'id'}
                      labelKey={'name'}
                      value={selectedResume}
                      onChange={this.handleResumeChange}
                      options={resumes}
                      searchable={false}
                      autoBlur={true}
                      clearable={false}
                      onFocus={() => this._removeErrorMsgHandler('resumeId')}
                    />
                  </FormReactSelectContainer>
                  <input
                    type="hidden"
                    name="resumeId"
                    value={selectedResume ? selectedResume.id : ''}
                  />
                </div>

                <div style={{ width: 160 }}>
                  <div className="columns">
                    <PotentialButton
                      size="small"
                      style={{
                        marginTop: 23,
                      }}
                      fullWidth
                      onClick={this.showResume}
                    >
                      {t('action:view')}
                    </PotentialButton>
                  </div>
                </div>
              </div>
            )}
            <div className="row expanded">
              <div className="small-12 columns">
                <FormTextArea
                  disabled={edit}
                  errorMessage={errorMessage.get('note')}
                  name="note"
                  label={t('field:note')}
                  rows="3"
                  placeholder={initialMemo}
                  value={
                    edit ? application_ViewDetails.get('memo') : this.state.note
                  }
                  onChange={this.inputChangeHandler}
                  onFocus={() => this._removeErrorMsgHandler('note')}
                />
              </div>
            </div>
          </section>
        </DialogContent>
        <Divider />

        {/* 修改状态的按钮 （取消 提交） */}
        <DialogActions>
          <div className="horizontal-layout">
            <PrimaryButton onClick={cancelAddActivity}>
              {t('action:close')}
            </PrimaryButton>
          </div>
        </DialogActions>
      </Fragment>
    );
  }
}

AddActivityForm.propTypes = {
  cancelAddActivity: PropTypes.func.isRequired,
  application: PropTypes.object.isRequired,
};

const mapStoreStateToProps = (state, { application }) => {
  return {
    resumes: getTalentResumeArray(state, application.talentId),
    candidate: state.model.talents.get(String(application.talentId)),
    currentUser: state.controller.currentUser,
  };
};

export default connect(mapStoreStateToProps)(AddActivityForm);
