import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { ADD_MESSAGE } from '../../../../constants/actionTypes';
import { Trans } from 'react-i18next';
import { makeCancelable, getMemoFromApplication } from '../../../../../utils';
import {
  getResumesByTalentId,
  getTalent,
} from '../../../../actions/talentActions';
import { addApplicationPayrolling } from '../../../../actions/applicationActions';
import { showErrorMessage } from '../../../../actions';
import { createApplicationOfferLetter } from '../../../../../apn-sdk';
import {
  getApplicationPageSection,
  updateDashboardApplStatus,
  getRecruitmentProcessId,
} from '../../../../../apn-sdk/newApplication';
import {
  JOB_USER_ROLES,
  USER_TYPES,
  userTypeForCommission as userTypeOptions,
} from '../../../../constants/formOptions';

import Select from 'react-select';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Delete from '@material-ui/icons/Delete';
import Add from '@material-ui/icons/Add';
import FormReactSelectContainer from '../../../particial/FormReactSelectContainer';
import FormTextArea from '../../../particial/FormTextArea';
import ApplicationInfo from '../../views/ApplicationInfo';
import Loading from '../../../particial/Loading';
import FormInput from '../../../particial/FormInput';
import PayrollingForm from '../AddActivityOfferAcceptedForm/Payrolling';

const styles = {
  candidateSec: {
    marginBottom: '1rem',
    display: 'flex',
  },
};

class OfferAcceptedFrom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      application: Immutable.Map({
        talentId: props.talentId,
        jobId: props.jobId,
        applicationOfferLetter: Immutable.Map(),
      }),
      pageSectionArr: [],
      errorMessage: Immutable.Map(),
      selectedResume: this._getResume(props),
      note: '',
      recruitmentProcessId: props.recruitmentProcessId,
      applicationCommissions: this._getApplicationCommissions(props),
      fetching: true,
    };
    this.formRef = React.createRef();
    this.fTimer = setTimeout(() => this.setState({ fetching: false }), 500);
  }

  fetchData = () => {
    const { talentId, dispatch, isTalentDetail } = this.props;
    if (!isTalentDetail) {
      dispatch(getTalent(talentId));

      this.resumeTask = makeCancelable(
        dispatch(getResumesByTalentId(talentId))
      );
      this.resumeTask.promise.then(() => {
        this.setState({ selectedResume: this._getResume(this.props) });
      });
    }
  };
  _getResume = ({ resumeId, resumeList }) => {
    return resumeId
      ? resumeList.find((value) => value.id === resumeId)
      : resumeList[0];
  };

  componentDidMount() {
    this.fetchData();
    if (this.props.handleMaxWidth) {
      this.props.handleMaxWidth(720);
    }
    getApplicationPageSection('SUBMIT_TO_JOB', 'PAY_ROLL').then(
      ({ response }) => {
        this.setState({
          pageSectionArr: this.filterArrItem(response),
        });
      }
    );

    // getRecruitmentProcessId('PAY_ROLL')
    //   .then(({ response }) => {
    //     console.log(response);
    //     this.setState({
    //       recruitmentProcessId: response.id,
    //     });
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  }

  filterArrItem = (arr) => {
    let newArr = [];
    arr.map((item) => {
      newArr.push(item.nodePageSection);
    });
    return newArr;
  };

  componentWillUnmount() {
    if (this.resumeTask) {
      this.resumeTask.cancel();
    }
  }

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
    const submitForm = e.target;
    const { selectedResume, note, pageSectionArr, recruitmentProcessId } =
      this.state;
    const { t, dispatch, onSubmitSuccess, jobId, talentId } = this.props;
    const { applicationCommissions } = this.state;

    // const applicationOfferLetter = {
    //   startDate: submitForm.startDate.value,
    //   endDate: submitForm.endDate.value,
    //   currency: submitForm.currency.value,
    //   rateUnitType: submitForm.rateUnitType.value,
    //   estimatedWorkingHourPerWeek: submitForm.estimatedWorkingHourPerWeek.value,
    //   extraCost: submitForm.extraCost.value,
    //   finalBillRate: submitForm.finalBillRate.value,
    //   finalPayRate: submitForm.finalPayRate.value,
    //   immigrationCostCode: submitForm.immigrationCostCode.value,
    //   mspRateCode: submitForm.mspRateCode.value,
    //   taxBurdenRateCode: submitForm.taxBurdenRateCode.value,
    //   totalBillAmount: submitForm.totalBillAmount.value,
    // };

    const newApplication = {
      talentId: talentId,
      jobId: jobId,
      // resumeId: selectedResume && selectedResume.id,
      recruitmentProcessId,
      note,
      ipgKpiUsers: applicationCommissions,
      // applicationOfferLetter,
    };

    let errorMessage = this._validateForm(
      newApplication,
      t,
      submitForm,
      pageSectionArr
    );
    if (errorMessage) {
      return this.setState({ errorMessage });
    }

    this.setState({ errorMessage: Immutable.Map() });
    this.props.onSubmit();
    console.log(newApplication);
    dispatch(addApplicationPayrolling(newApplication))
      .then((application) => {
        dispatch({
          type: ADD_MESSAGE,
          message: {
            message: (
              <Trans i18nKey="message:applySuccess">
                s<strong>{{ name: this.props.talent.get('fullName') }}</strong>
                has been assigned to job.
                <strong>{{ title: this.props.job.get('title') }}</strong>.
              </Trans>
            ),
            type: 'hint',
          },
        });
        onSubmitSuccess(application);
      })
      .catch((err) => {
        dispatch(showErrorMessage(err));
        onSubmitSuccess();
      });
  };

  createApplicationOfferLetter = (application) => {
    let OfferLetter = this.refs.PayrollingForm_Ref.state;
    let sendOfferLetter = {
      applicationId: application.id,
      ...OfferLetter.Form,
      totalBillAmount: OfferLetter.totalBillAmount,
    };
    console.log(sendOfferLetter);
    return createApplicationOfferLetter(sendOfferLetter);
  };

  _removeErrorMsgHandler = (key) => {
    return this.setState({
      errorMessage: this.state.errorMessage.delete(key),
    });
  };

  _validateForm = (activityObject, t, submitForm, pageSectionArr) => {
    let errorMessage = Immutable.Map();
    if (!pageSectionArr.includes('DEFAULT_NOTE_OPTIONAL')) {
      if (
        (submitForm.note && !submitForm.note.value) ||
        /^\s+$/gi.test(submitForm.note.value)
      ) {
        errorMessage = errorMessage.set('note', '备注不能为空');
      }
    }
    if (submitForm.note && submitForm.note.value.length > 5000) {
      errorMessage = errorMessage.set('note', '备注不能大于5000长度');
    }
    // OfferLetter Form
    // if (!submitForm.startDate.value) {
    //   errorMessage = errorMessage.set(
    //     'startDate',
    //     'message:Start Date Is Required'
    //   );
    // }

    // if (!submitForm.endDate.value) {
    //   errorMessage = errorMessage.set(
    //     'endDate',
    //     'message:End Date Is Required'
    //   );
    // }

    // if (!submitForm.finalBillRate.value) {
    //   errorMessage = errorMessage.set(
    //     'finalBillRate',
    //     'message:Final Bill Rate Is Required'
    //   );
    // }
    // if (!submitForm.finalPayRate.value) {
    //   errorMessage = errorMessage.set(
    //     'finalPayRate',
    //     'message:Final Pay Rate Is Required'
    //   );
    // }

    // if (!submitForm.taxBurdenRateCode.value) {
    //   errorMessage = errorMessage.set(
    //     'taxBurdenRate',
    //     'message:Tax Burden Rate Is Required'
    //   );
    // }

    // if (!submitForm.mspRateCode.value) {
    //   errorMessage = errorMessage.set(
    //     'mspRate',
    //     'message:MSP Rate Is Required'
    //   );
    // }

    // if (!submitForm.immigrationCostCode.value) {
    //   errorMessage = errorMessage.set(
    //     'immigrationCost',
    //     'message:Immigration Cost Is Requir ed'
    //   );
    // }

    // if (!submitForm.currency.value) {
    //   errorMessage = errorMessage.set(
    //     'currency',
    //     'message:Rate Currency Is Required'
    //   );
    // }
    // if (!submitForm.rateUnitType.value) {
    //   errorMessage = errorMessage.set(
    //     'rateUnitType',
    //     'message:Rate Unit Type Is Required'
    //   );
    // }

    // if (
    //   submitForm.totalBillAmount.value &&
    //   Number(submitForm.totalBillAmount.value) < 0
    // ) {
    //   errorMessage = errorMessage.set(
    //     'totalBillAmount',
    //     'message:Negative value is not allowed'
    //   );
    // }
    // if (!submitForm.totalBillAmount.value) {
    //   errorMessage = errorMessage.set(
    //     'totalBillAmount',
    //     'message:Total Bill Amount / GM Is Required'
    //   );
    // }

    return errorMessage.size > 0 && errorMessage;
  };

  _renderCommission = (commission) => {
    const { applicationCommissions } = this.state;
    const { recruiterList } = this.props;
    const index = applicationCommissions.indexOf(commission);
    return (
      <div key={index} className="row expanded">
        {/* 1.用户身份 */}
        <div className="small-4 columns">
          <FormReactSelectContainer>
            <Select
              value={commission.userRole}
              simpleValue
              options={userTypeOptions}
              autoBlur
              clearable={false}
              disabled
            />
          </FormReactSelectContainer>
        </div>

        {/* 2.选择用户 */}
        <div className="small-4 columns">
          <FormReactSelectContainer>
            <Select
              disabled
              valueKey={'userId'}
              labelKey="fullName"
              value={commission.userId}
              simpleValue
              options={recruiterList}
              autoBlur
              clearable={false}
            />
          </FormReactSelectContainer>
        </div>

        {/* 3.分配比例 */}
        <div className="small-2 columns">
          <FormInput
            disabled
            name="commissions.commissionPct"
            value={commission.percentage}
            type="number"
            min={0}
            max={100}
            step={5}
          />
        </div>

        {/* 4.删除/新增一项 */}
        <div className="small-2 columns horizontal-layout align-self-top">
          {/* 删除 */}
          <IconButton size="small" disabled>
            <Delete />
          </IconButton>

          {/* 新增 */}

          <IconButton size="small" disabled>
            <Add />
          </IconButton>
        </div>
      </div>
    );
  };

  _getApplicationCommissions = ({ recruiterList }) => {
    const AccountManagers = recruiterList
      .filter((value) => value.permission === JOB_USER_ROLES.AccountManager)
      .map((r) => ({ userId: r.userId, userRole: USER_TYPES.AM }));
    const AccountCoordinators = recruiterList
      .filter((value) => value.permission === JOB_USER_ROLES.AccountCoordinator)
      .map((r) => ({
        userId: r.userId,
        userRole: USER_TYPES.AccountCoordinator,
      }));

    const applicationCommissions = [...AccountManagers, ...AccountCoordinators];
    AccountManagers.forEach(
      (c) => (c.percentage = 40 / AccountManagers.length)
    );
    AccountCoordinators.forEach(
      (c) => (c.percentage = 30 / AccountCoordinators.length)
    );
    console.log(applicationCommissions);
    return applicationCommissions;
  };

  render() {
    const { t, resumes, note, job, talent, type, ...props } = this.props;

    const {
      errorMessage,
      fetching,
      applicationCommissions,
      application,
      pageSectionArr,
    } = this.state;

    if (fetching || !job || !talent) {
      return <Loading />;
    }
    console.log(pageSectionArr);
    return (
      <>
        {/* 表单内容 */}
        <form
          onSubmit={this.submitAddCandidateActivity}
          id="applicationForm"
          noValidate
        >
          {applicationCommissions && (
            <>
              {/*Commissions label  */}
              <div className="row expanded">
                <div className="small-4 columns">
                  <FormReactSelectContainer
                    // isRequired
                    label={'参与者'}
                  />
                </div>
                <div className="small-4 columns">
                  <FormReactSelectContainer
                    // isRequired
                    label={'用户名'}
                  />
                </div>
                <div className="small-2 columns">
                  <FormReactSelectContainer
                    // isRequired
                    label={'分成比例%'}
                  />
                </div>
                <div className="small-2 columns">
                  <FormReactSelectContainer
                    // isRequired
                    label={'操作'}
                  />
                </div>
              </div>
              {applicationCommissions.map((commission) => {
                return this._renderCommission(commission);
              })}
              <div className="row expanded" style={{ marginBottom: '0.75em' }}>
                <div className="columns">
                  <Typography
                    variant="caption"
                    color="textSecondary"
                    gutterBottom
                    style={{ lineHeight: 1.3 }}
                  >
                    {
                      '注意：客户经理将平均分配 40%，客户协调员将平均分配 30%。在这个阶段，我们只记录 AM 和 AC 用户角色，但这不会影响其他用户角色的最终 GM。 HR部门将记录、计算和分配所有其他用户角色的GM。'
                    }
                  </Typography>
                </div>
              </div>
            </>
          )}

          {/* 备注 */}
          <div className="row expanded">
            <div className="small-12 columns">
              <FormTextArea
                name="note"
                isRequired={
                  pageSectionArr.includes('DEFAULT_NOTE_OPTIONAL')
                    ? false
                    : true
                }
                errorMessage={errorMessage.get('note')}
                label={'备注'}
                rows="3"
                placeholder={getMemoFromApplication(application)}
                value={note}
                onChange={this.inputChangeHandler}
              />
            </div>
          </div>
        </form>
      </>
    );
  }
}

OfferAcceptedFrom.propTypes = {
  talentId: PropTypes.number.isRequired,
  jobId: PropTypes.number.isRequired,
  resumeId: PropTypes.number,
  initialMemo: PropTypes.string,
  onSubmitSuccess: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default OfferAcceptedFrom;
