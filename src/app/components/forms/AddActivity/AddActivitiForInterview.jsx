import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { makeCancelable } from '../../../../utils';
import { getResumesByTalentId } from '../../../actions/talentActions';
import talentResumeSelector from './../../../selectors/talentResumeSelector';
import { deleteNotification } from '../../../actions/notificationActions';
import {
  currency as currencyOptions,
  getApplicationStatusLabel,
  getTimeZoneList,
  interviewStageList,
  interviewTimeList,
  interviewTypeList,
} from '../../../constants/formOptions';
import moment from 'moment-timezone';

import DatePicker from 'react-datepicker';
import Select from 'react-select';

import Divider from '@material-ui/core/Divider';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import ViewResume from '@material-ui/icons/RemoveRedEye';

import FormInput from '../../particial/FormInput';
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

class InterviewFrom extends Component {
  constructor(props) {
    super(props);

    const { application, resumes, application_ViewDetails: activity } = props;
    const eventRecordedDate = moment(activity.get('eventDate')).tz(
      activity.get('eventTimeZone')
    );
    // console.log(activity);
    this.state = {
      errorMessage: Immutable.Map(),
      status: application.status,
      interviewDate: eventRecordedDate,
      interviewStage: activity.get('eventStage'),
      interviewTime: eventRecordedDate.format('hh:mm'),
      timeZone: activity.get('eventTimeZone'),
      timeZoneList: getTimeZoneList(eventRecordedDate),
      interviewType: activity.get('eventType'),

      selectedResume: resumes.find(
        (value) => value.id === application.resumeId
      ),
      note: '',

      showedResume: false,
      fetching: true,
      edit: props.from === 'ActivityCard' ? true : false,
    };
    this.fTimer = setTimeout(() => this.setState({ fetching: false }), 500);
  }

  componentWillUnmount() {
    this.task && this.task.cancel();
  }

  componentDidMount() {
    const { dispatch, notificationSubList, activityFromJob, application } =
      this.props;
    if (notificationSubList) {
      notificationSubList.forEach((notification) =>
        dispatch(deleteNotification(notification.get('id')))
      );
    }
    if (activityFromJob) {
      this.fetchData();
    }

    if (application) {
      this.setState({
        interviewType: application.eventType,
        note: application.memo,
      });
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
      candidate,
      application,
      status,
      application_ViewDetails,
    } = this.props;

    const { showResume, selectedResume, errorMessage, fetching, edit } =
      this.state;

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
            candidate={candidate}
            onCommissionsUpdate={this.handleCommissionsUpdate}
            t={t}
            edit={edit}
          />
          <section>
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

            <Fragment>
              {/* 面试表格内容 */}
              <div className="row expanded">
                {/* 1.面试日期 eg:2021/1/1 */}
                <div className="small-3 columns">
                  <DatePicker
                    disabled={edit}
                    customInput={
                      <FormInput
                        label={t('field:interviewDate')}
                        name="interviewDate"
                        errorMessage={errorMessage.get('interviewDate')}
                      />
                    }
                    selected={this.state.interviewDate}
                    onChange={(interviewDate) => {
                      this.setState({
                        interviewDate,
                        timeZoneList: interviewDate
                          ? getTimeZoneList(interviewDate)
                          : [],
                      });
                    }}
                    placeholderText="mm/dd/yyyy"
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
                      name="interviewTimeSelect"
                      value={this.state.interviewTime}
                      onChange={(interviewTime) =>
                        this.setState({ interviewTime })
                      }
                      simpleValue
                      options={interviewTimeList}
                      searchable={false}
                      autoBlur={true}
                      clearable={false}
                    />
                  </FormReactSelectContainer>
                </div>

                {/* 3. 选择时区 */}
                <div className="small-6 columns">
                  <FormReactSelectContainer
                    label={t('field:timeZone')}
                    errorMessage={errorMessage.get('eventTimeZone')}
                  >
                    <Select
                      disabled={edit}
                      name="timeZoneSelect"
                      value={this.state.timeZone}
                      onChange={(timeZone) => this.setState({ timeZone })}
                      simpleValue
                      options={this.state.timeZoneList}
                      searchable={false}
                      autoBlur={true}
                      clearable={false}
                    />
                  </FormReactSelectContainer>
                </div>
              </div>

              <div className="row expanded">
                <div className="small-6 columns">
                  <FormReactSelectContainer label={t('field:interviewStage')}>
                    <Select
                      disabled={edit}
                      name="interviewStageSelect"
                      value={
                        edit
                          ? application_ViewDetails.get('eventStage')
                          : this.state.interviewStage
                      }
                      onChange={(interviewStage) =>
                        this.setState({ interviewStage })
                      }
                      simpleValue
                      options={interviewStageList}
                      searchable={false}
                      autoBlur={true}
                      clearable={false}
                    />
                  </FormReactSelectContainer>
                </div>
                <div className="small-6 columns">
                  <FormReactSelectContainer label={t('field:interviewType')}>
                    <Select
                      disabled={edit}
                      name="interviewTypeSelect"
                      value={
                        edit
                          ? application_ViewDetails.get('eventType')
                          : this.state.interviewType
                      }
                      onChange={(interviewType) =>
                        this.setState({ interviewType })
                      }
                      simpleValue
                      options={interviewTypeList}
                      searchable={false}
                      autoBlur={true}
                      clearable={false}
                    />
                  </FormReactSelectContainer>
                </div>
              </div>
            </Fragment>

            {/* 5.选择简历下拉框 */}
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
                    />
                  </FormReactSelectContainer>
                  <input
                    type="hidden"
                    name="resumeId"
                    value={selectedResume ? selectedResume.id : ''}
                  />
                </div>

                {/* 6.上传简历的按钮 */}
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

            {/* 7.备注 */}
            <div className="row expanded">
              <div className="small-12 columns">
                <FormTextArea
                  disabled={edit}
                  errorMessage={errorMessage.get('note')}
                  name="note"
                  label={t('field:note')}
                  rows="3"
                  value={
                    edit ? application_ViewDetails.get('memo') : this.state.note
                  }
                  onChange={this.inputChangeHandler}
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

InterviewFrom.propTypes = {
  cancelAddActivity: PropTypes.func.isRequired,
  application: PropTypes.object.isRequired,
};

const mapStoreStateToProps = (state, { application }) => {
  return {
    resumes: talentResumeSelector(state, application.talentId).toJS(),
    candidate: state.model.talents.get(String(application.talentId)),
    currentUser: state.controller.currentUser,
  };
};

export default connect(mapStoreStateToProps)(InterviewFrom);
