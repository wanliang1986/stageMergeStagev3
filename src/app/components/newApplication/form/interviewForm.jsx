import React from 'react';
import Immutable from 'immutable';
import Select from 'react-select';
import { connect } from 'react-redux';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import FormTextArea from '../../particial/FormTextArea';
import FormReactSelectContainer from '../../particial/FormReactSelectContainer';
import FormInput from '../../particial/FormInput';
// import DatePicker from 'react-datepicker';
import UserOption from '../component/userOption';

import DatePicker from 'react-datepicker-4';
import {
  currency as currencyOptions,
  payRateUnitTypes,
  ApplicationInterviewType,
  ApplicationInterview,
  USER_TYPES,
} from '../../../constants/formOptions';
import {
  updateNewInterviewApplication,
  updateDashboardApplStatus,
} from '../../../actions/applicationActions';
import { showErrorMessage } from '../../../actions';
import FormTitle from '../component/formTitle';
import { getApplicationPageSection } from '../../../../apn-sdk/newApplication';
import moment from 'moment-timezone';
import EditCommisionForm from '../component/EditCommisionForm';
import Loading from '../../particial/Loading';
import NumberFormat from 'react-number-format';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';

const currencyLabels = currencyOptions.reduce((res, v) => {
  res[v.value] = v.label;
  return res;
}, {});

class ApplicationInterviewForm extends React.Component {
  constructor(props) {
    super(props);
    const { application, interviewIndex } = this.props;
    //versionsFlag = true 为通用版本
    const versionsFlag = application
      .get('talentRecruitmentProcessNodes')
      .toJS()
      .some((x) => {
        return x.nodeType === 'COMMISSION';
      });
    const AgreedPayRate = application.get('agreedPayRate');
    const InterviewIndexData =
      application.get('interviews') && interviewIndex
        ? application
            .get('interviews')
            .toJS()
            .filter((item) => item.progress === interviewIndex)
        : null;
    this.state = {
      errorMessage: Immutable.Map(),
      note: InterviewIndexData ? InterviewIndexData[0].note : '',
      kpiUser: null,
      sendEmailToClientFlag: false,
      sendEmailToTalentFlag: false,
      fromTime: InterviewIndexData
        ? new Date(
            moment(InterviewIndexData[0].fromTime)
              .utc()
              .format('YYYY-MM-DD HH:mm:ss')
          )
        : null,
      toTime: InterviewIndexData
        ? new Date(
            moment(InterviewIndexData[0].toTime)
              .utc()
              .format('YYYY-MM-DD HH:mm:ss')
          )
        : null,
      progress: InterviewIndexData ? InterviewIndexData[0].progress : null,
      interviewType: null || 'PHONE',
      currency: AgreedPayRate ? AgreedPayRate.get('currency') : null,
      rateUnitType: AgreedPayRate ? AgreedPayRate.get('rateUnitType') : null,
      agreedPayRate: AgreedPayRate ? AgreedPayRate.get('agreedPayRate') : '',
      pageSectionArr: [],
      user: application.get('kpiUsers') && application.get('kpiUsers').toJS(),
      id: InterviewIndexData ? InterviewIndexData[0].id : null,
      versionsFlag: versionsFlag,
      checkingDuplication: false,
    };
  }

  componentDidMount() {
    const { dispatch, application } = this.props;
    // 获取当前流程页面配置section
    getApplicationPageSection('INTERVIEW', application.get('jobType')).then(
      ({ response }) => {
        this.setState({
          pageSectionArr: this.filterArrItem(response),
        });
      }
    );
  }

  filterArrItem = (arr) => {
    let newArr = [];
    arr.map((item) => {
      newArr.push(item.nodePageSection);
    });
    return newArr;
  };

  handleUser = (user) => {
    this.setState({
      user,
    });
  };

  static validateForm = (basicForm, commissions, pageSectionArr, hasOwner) => {
    let errorMessage = Immutable.Map();
    if (commissions) {
      const am = commissions.find((c) => c.userRole === USER_TYPES.AM);
      if (!am) {
        errorMessage = errorMessage.set('commissions', '客户经理不能为空');
      }

      const commissionWithoutDuplicates = [
        ...new Set(commissions.map((c) => `${c.userRole}-${c.userId}`)),
      ];
      if (commissions.length > commissionWithoutDuplicates.length) {
        errorMessage = errorMessage.set('commissions', '用户角色不能重复');
      }

      const sum = commissions.reduce((s, c) => {
        return s + (Number(c.percentage) || 0);
      }, 0);

      if (sum + hasOwner * 10 !== 100) {
        errorMessage = errorMessage.set('commissions', '用户分配比例错误');
      }
      if (commissions.find((c) => !c.percentage || Number(c.percentage) <= 0)) {
        errorMessage = errorMessage.set(
          'commissions',
          '每一项分配比例应该大于0'
        );
      }
    }

    if (basicForm.progress && !basicForm.progress.value) {
      errorMessage = errorMessage.set('progress', '面试进展不能为空');
    }
    if (!basicForm.fromTime.value || !basicForm.toTime.value) {
      errorMessage = errorMessage.set('interviewTime', '面试时间不能为空');
    }
    if (basicForm.fromTime.value && basicForm.toTime.value) {
      if (
        new Date(basicForm.fromTime.value).getTime() >
        new Date(basicForm.toTime.value).getTime()
      ) {
        errorMessage = errorMessage.set(
          'interviewTime',
          '开始时间不能大于结束时间'
        );
      }
    }
    if (basicForm.clientNote && basicForm.clientNote.value.length > 5000) {
      errorMessage = errorMessage.set('note', '备注不能大于5000长度');
    }
    if (pageSectionArr.includes('IPG_NOTE_REQUIRED')) {
      if (
        (basicForm.clientNote && !basicForm.clientNote.value) ||
        /^\s+$/gi.test(basicForm.clientNote.value)
      ) {
        errorMessage = errorMessage.set('note', '备注不能为空');
      }
    }

    if (basicForm.kpiUser && !basicForm.kpiUser.value) {
      errorMessage = errorMessage.set('kpiUser', '参与者不能为空');
    }

    if (basicForm.currency && basicForm.rateUnitType) {
      if (basicForm.currency.value && !basicForm.agreedPayRate.value) {
        errorMessage = errorMessage.set('agreedPayRate', '金额不能为空');
      } else if (basicForm.currency.value && !basicForm.rateUnitType.value) {
        errorMessage = errorMessage.set('rateUnitType', '类型不能为空');
      } else if (basicForm.agreedPayRate.value && !basicForm.currency.value) {
        errorMessage = errorMessage.set('currency', '币种不能为空');
      } else if (
        basicForm.agreedPayRate.value &&
        !basicForm.rateUnitType.value
      ) {
        errorMessage = errorMessage.set('rateUnitType', '类型不能为空');
      } else if (
        basicForm.rateUnitType.value &&
        !basicForm.agreedPayRate.value
      ) {
        errorMessage = errorMessage.set('agreedPayRate', '金额不能为空');
      } else if (basicForm.rateUnitType.value && !basicForm.currency.value) {
        errorMessage = errorMessage.set('currency', '币种不能为空');
      }
    }

    return errorMessage.size > 0 && errorMessage;
  };

  removeErrorMessage = (key) => {
    this.setState({
      errorMessage: this.state.errorMessage.delete(key),
    });
  };

  handleNumberChange = (key) => (values) => {
    this.setState({ [key]: values.value });
  };

  handleSubmitInterview = (e) => {
    e.preventDefault();
    const {
      currency,
      rateUnitType,
      progress,
      fromTime,
      toTime,
      interviewType,
      sendEmailToClientFlag,
      sendEmailToTalentFlag,
      pageSectionArr,
      user,
      id,
      versionsFlag,
    } = this.state;
    const { application } = this.props;
    const interviewForm = e.target;
    if (pageSectionArr.length === 0) {
      return;
    }
    // 分配比例校验
    let errorMessage;
    if (pageSectionArr.includes('IPG_KPI_USER_WITH_USER_ROLE')) {
      const filteredApplicationCommissions =
        this.$ref.state.applicationCommissions.filter((c) => !!c.userId);
      const owner = this.$ref.state.owner.filter((c) => !!c.userId);
      errorMessage = ApplicationInterviewForm.validateForm(
        interviewForm,
        filteredApplicationCommissions,
        pageSectionArr,
        owner ? owner.length > 0 : null
      );
    } else {
      errorMessage = ApplicationInterviewForm.validateForm(
        interviewForm,
        null,
        pageSectionArr,
        null
      );
    }
    if (errorMessage) {
      return this.setState({ errorMessage });
    }
    // 清空提示信息
    this.setState({
      errorMessage: Immutable.Map(),
    });
    const interview = {
      talentRecruitmentProcessId: application.getIn([
        'submitToClient',
        'talentRecruitmentProcessId',
      ]),
      progress,
      fromTime: moment(fromTime).format('YYYY-MM-DDTHH:mm:[00][Z]'),
      toTime: moment(toTime).format('YYYY-MM-DDTHH:mm:[00][Z]'),
      interviewType,
      note: interviewForm.clientNote.value,
    };
    if (pageSectionArr.includes('DEFAULT_KPI_USERS')) {
      let userList = [];
      user.forEach((x) => {
        userList.push({
          userId: x.userId,
        });
      });
      interview.kpiUsers = userList;
    }
    if (pageSectionArr.includes('IPG_KPI_USER_WITH_USER_ROLE')) {
      const filteredApplicationCommissions =
        this.$ref.state.applicationCommissions.filter((c) => !!c.userId);
      interview.ipgKpiUsers = filteredApplicationCommissions;
    }
    if (pageSectionArr.includes('IPG_CONTRACT_AGREED_PAY_RATE')) {
      if (
        interviewForm.agreedPayRate.value &&
        interviewForm.agreedPayRate.value.trim()
      ) {
        interview.agreedPayRate = {
          currency,
          rateUnitType,
          agreedPayRate: interviewForm.agreedPayRate.value,
        };
      }
    }
    if (id) {
      interview.id = id;
    }

    console.log(interview);
    this.setState({
      checkingDuplication: true,
    });
    this.props.onSubmit(true);
    this.props
      .dispatch(updateNewInterviewApplication(interview))
      .then((newApplication) => {
        console.log('[[response]]', newApplication);
        // 发送邮件待定, api还没好
        // if (sendEmailToClientFlag) {
        //   this.props.dispatch({
        //     type: ADD_SEND_EMAIL_REQUEST,
        //     request: {
        //       type: SEND_EMAIL_TYPES.SendEmailToHM,
        //       data: {
        //         application: newApplication,
        //       },
        //     },
        //   });
        // }
        // if (sendEmailToTalentFlag) {
        //   this.props.dispatch({
        //     type: ADD_SEND_EMAIL_REQUEST,
        //     request: {
        //       type: SEND_EMAIL_TYPES.SendEmailToCandidate,
        //       data: {
        //         application: newApplication,
        //       },
        //     },
        //   });
        // }
        this.props.onSubmit(false);
        this.setState({ checkingDuplication: false });
        this.props.onSubmitToInterview(e);
        // this.props.dispatch(
        //   updateDashboardApplStatus(newApplication.id, newApplication.status)
        // );
        this.props.dispatch({ type: 'UPDATE_DB_DATA' });
      })
      .catch((err) => {
        this.props.dispatch(showErrorMessage(err));
        this.setState({ checkingDuplication: false });
        this.props.onSubmit(false);
      });
  };

  handleDropDownChange = (key) => (value) => {
    this.setState({ [key]: value });
  };

  render() {
    const { t, application, interviewIndex } = this.props;
    const {
      note,
      errorMessage,
      sendEmailToClientFlag,
      sendEmailToTalentFlag,
      fromTime,
      toTime,
      progress,
      interviewType,
      kpiUser,
      currency,
      rateUnitType,
      pageSectionArr,
      user,
      versionsFlag,
    } = this.state;
    let InterviewNumArr;
    if (application.get('interviews')) {
      InterviewNumArr = GetInterviewNum(
        application.get('interviews').toJS(),
        interviewIndex
      );
    } else {
      InterviewNumArr = GetInterviewNum();
    }

    if (pageSectionArr.length === 0) {
      return <Loading />;
    }
    return (
      <form
        onSubmit={this.handleSubmitInterview}
        id="newApplicationInterviewForm"
      >
        <div className="row expanded small-12">
          <div className="small-6 columns">
            <FormReactSelectContainer
              label={'面试进展'}
              isRequired={true}
              errorMessage={errorMessage.get('progress')}
            >
              <Select
                clearable={false}
                simpleValue
                options={InterviewNumArr}
                value={progress}
                onChange={this.handleDropDownChange('progress')}
                onBlur={() => this.removeErrorMessage('progress')}
              />
            </FormReactSelectContainer>
            <input type="hidden" name="progress" value={progress || ''} />
          </div>
          <div className="small-6 row expanded">
            <div className="small-6 columns">
              <FormReactSelectContainer
                label={'面试时间'}
                isRequired={true}
                errorMessage={errorMessage.get('interviewTime')}
              >
                <DatePicker
                  maxDate={toTime && toTime}
                  selected={fromTime}
                  onChange={(fromTime) => this.setState({ fromTime })}
                  timeInputLabel="Time:"
                  placeholderText="请选择时间"
                  dateFormat="MM/dd/yyyy hh:mm aa"
                  showTimeInput
                  onBlur={() => this.removeErrorMessage('interviewTime')}
                />
              </FormReactSelectContainer>
              <input
                type="hidden"
                name="fromTime"
                value={fromTime ? fromTime : ''}
              />
            </div>
            <div className="small-6 columns">
              <FormReactSelectContainer
                label={<>&nbsp;</>}
                errorMessage={errorMessage.get('interviewTime')}
              >
                <DatePicker
                  selected={toTime}
                  placeholderText="请选择时间"
                  minDate={fromTime && fromTime}
                  onChange={(toTime) => this.setState({ toTime })}
                  onBlur={() => this.removeErrorMessage('interviewTime')}
                  timeInputLabel="Time:"
                  dateFormat="MM/dd/yyyy hh:mm aa"
                  showTimeInput
                />
              </FormReactSelectContainer>
              <input type="hidden" name="toTime" value={toTime ? toTime : ''} />
            </div>
          </div>
        </div>
        <div className="row expanded small-12">
          <div className="small-6 columns">
            <FormReactSelectContainer
              label={'面试方式'}
              errorMessage={errorMessage.get('interviewType')}
            >
              <Select
                clearable={false}
                simpleValue
                options={ApplicationInterviewType}
                value={interviewType}
                onChange={this.handleDropDownChange('interviewType')}
              />
            </FormReactSelectContainer>
            <input
              type="hidden"
              name="interviewType"
              value={interviewType || ''}
            />
          </div>
          {/* 默认版本定制内容 */}
          {pageSectionArr.includes('DEFAULT_KPI_USERS') ? (
            <div className="small-6 columns">
              <FormReactSelectContainer
                label={'参与者'}
                isRequired={true}
                // errorMessage={errorMessage.get('user')}
              >
                {/* <Select labelKey={'label2'} clearable={false} simpleValue /> */}
              </FormReactSelectContainer>
              <UserOption
                errorMessage={errorMessage.get('kpiUser')}
                handleUser={this.handleUser}
                value={Immutable.List(user)}
                onBlur={() => this.removeErrorMessage('kpiUser')}
              />
              <input type="hidden" name="kpiUser" value={user || ''} />
            </div>
          ) : null}
        </div>

        {/* IPG定制section */}
        {pageSectionArr.includes('IPG_KPI_USER_WITH_USER_ROLE') ? (
          <>
            <EditCommisionForm
              key={'SubmitToInterview'}
              onRef={(ref) => {
                this.$ref = ref;
              }}
              application={application}
              removeErrorMessage={this.removeErrorMessage}
            />
            {errorMessage.get('commissions') && (
              <div className="columns" style={{ marginTop: 4 }}>
                <div className="foundation">
                  <span className="form-error is-visible">
                    {errorMessage.get('commissions')}
                  </span>
                </div>
              </div>
            )}
          </>
        ) : null}

        {pageSectionArr.includes('IPG_CONTRACT_AGREED_PAY_RATE') ? (
          <>
            <FormTitle title={'约定薪资信息'} />
            <div className="row expanded small-12">
              <div className="small-6 row expanded">
                <div className="small-6 columns">
                  <FormReactSelectContainer
                    label={'币种/类型'}
                    errorMessage={errorMessage.get('currency')}
                  >
                    <Select
                      labelKey={'label3'}
                      clearable={true}
                      simpleValue
                      options={currencyOptions}
                      value={currency}
                      onChange={this.handleDropDownChange('currency')}
                      onBlur={() => this.removeErrorMessage('currency')}
                    />
                  </FormReactSelectContainer>
                  <input type="hidden" name="currency" value={currency || ''} />
                </div>
                <div className="small-6 columns">
                  <FormReactSelectContainer
                    label={<>&nbsp;</>}
                    errorMessage={errorMessage.get('rateUnitType')}
                  >
                    <Select
                      labelKey={'label2'}
                      clearable={true}
                      simpleValue
                      options={payRateUnitTypes}
                      value={rateUnitType}
                      onChange={this.handleDropDownChange('rateUnitType')}
                      onBlur={() => this.removeErrorMessage('rateUnitType')}
                    />
                  </FormReactSelectContainer>
                  <input
                    type="hidden"
                    name="rateUnitType"
                    value={rateUnitType || ''}
                  />
                </div>
              </div>
              <div className="small-6 columns">
                <FormReactSelectContainer
                  label={'工资金额'}
                  errorMessage={errorMessage.get('agreedPayRate')}
                >
                  <NumberFormat
                    thousandSeparator
                    prefix={currencyLabels[currency]}
                    value={this.state.agreedPayRate}
                    onValueChange={this.handleNumberChange('agreedPayRate')}
                    onBlur={() => this.removeErrorMessage('agreedPayRate')}
                    allowNegative={false}
                  />
                </FormReactSelectContainer>
                <input
                  name="agreedPayRate"
                  value={this.state.agreedPayRate}
                  type="hidden"
                />
              </div>
            </div>
          </>
        ) : null}

        {pageSectionArr.length ? (
          <div className="row expanded small-12">
            <div className="small-12 columns">
              <FormTextArea
                errorMessage={errorMessage.get('note')}
                onFocus={() => this.removeErrorMessage('note')}
                isRequired={
                  pageSectionArr.includes('IPG_NOTE_REQUIRED') ? true : false
                }
                label={'备注'}
                name="clientNote"
                defaultValue={note || ''}
                rows="2"
                maxLength={100}
              />
            </div>
          </div>
        ) : null}

        <div className="small-12 columns">
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                checked={sendEmailToClientFlag}
                onChange={(e) =>
                  this.setState({ sendEmailToClientFlag: e.target.checked })
                }
              />
            }
            label={'邮件通知客户联系人'}
          />
        </div>
        <div className="small-12 columns">
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                checked={sendEmailToTalentFlag}
                onChange={(e) =>
                  this.setState({ sendEmailToTalentFlag: e.target.checked })
                }
              />
            }
            label={'邮件通知候选人'}
          />
        </div>
        <Dialog open={this.state.checkingDuplication}>
          <DialogContent>
            <Loading />
            <Typography>{'Submiting To Interview'}</Typography>
          </DialogContent>
        </Dialog>
      </form>
    );
  }
}

function mapStoreStateToProps(state, { application }) {
  return {
    interviewIndex: state.controller.newCandidateJob.toJS().interviewIndex,
  };
}

export default connect(mapStoreStateToProps)(ApplicationInterviewForm);

const GetInterviewNum = (interviewArr, interviewIndex) => {
  let interviewNum = [];
  interviewArr &&
    interviewArr.map((item) => {
      interviewNum.push(item.progress);
    });

  let arr = ApplicationInterview.filter(
    (item) => !interviewNum.includes(item.value)
  );

  if (arr.length > 5) {
    arr = arr.slice(0, 5);
  }
  if (interviewIndex) {
    arr.push({
      label: `第${interviewIndex}轮`,
      value: String(interviewIndex),
      disabled: true,
    });
  }
  return arr;
};
