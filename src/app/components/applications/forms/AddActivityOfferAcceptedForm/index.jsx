import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { makeCancelable, getMemoFromApplication } from '../../../../../utils';
import { getJob } from '../../../../actions/jobActions';
import { getResumesByTalentId } from '../../../../actions/talentActions';
import {
  updateApplication2,
  updateDashboardApplStatus,
} from '../../../../actions/applicationActions';
import { showErrorMessage } from '../../../../actions';
import { getTalentResumeArray } from '../../../../selectors/talentResumeSelector';
import {
  getACArray,
  getActiveAMArray,
  getDMArray,
  getTenantUserArray,
} from '../../../../selectors/userSelector';
import {
  getApplicationStatusLabel,
  JOB_TYPES,
  USER_TYPES,
  userTypeForCommission as userTypeOptions,
} from '../../../../constants/formOptions';

import Select from 'react-select';

import Divider from '@material-ui/core/Divider';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

import ViewResume from '@material-ui/icons/RemoveRedEye';
import Delete from '@material-ui/icons/Delete';
import Add from '@material-ui/icons/Add';

import FormReactSelectContainer from '../../../particial/FormReactSelectContainer';
import PrimaryButton from '../../../particial/PrimaryButton';
import SecondaryButton from '../../../particial/SecondaryButton';
import PotentialButton from '../../../particial/PotentialButton';
import FormTextArea from '../../../particial/FormTextArea';
import ViewResumeInAddActivity from '../../../forms/AddActivity/ViewResumeInAddActivity';
import ApplicationInfo from '../../views/ApplicationInfo';
import Loading from '../../../particial/Loading';

// add by bill
import FormInput from '../../../particial/FormInput';
import FullTimeForm from './FullTime';
import ContractForm from './Contract';
import PayrollingForm from './Payrolling';
import moment from 'moment-timezone';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  candidateSec: {
    marginBottom: '1rem',
    display: 'flex',
  },
  resumeContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
  },
};

class OfferAcceptedFrom extends Component {
  constructor(props) {
    super(props);

    const { application, resumes, job, currentUserId } = props;
    // console.log('OfferAcceptedFrom', application.toJS());
    const applicationCommissions = application
      .get('applicationCommissions')
      .toJS();
    this.state = {
      errorMessage: Immutable.Map(),
      selectedResume: resumes.find(
        (value) => value.id === application.get('resumeId')
      ),
      processing: false,

      positionType: job.get('jobType'),
      positionTitle: job.get('title'),
      loadingAM: !props.activityFromJob,

      applicationCommissions:
        applicationCommissions.filter((c) => c.userRole !== USER_TYPES.Owner)
          .length > 0
          ? applicationCommissions.sort((a, b) => {
              return (a.userRole > b.userRole) - (a.userRole < b.userRole);
            })
          : [{ userRole: USER_TYPES.AM }].concat(applicationCommissions),
      canEdit: !!applicationCommissions.find((c) => c.userId === currentUserId),
    };
    this.fTimer = setTimeout(() => this.setState({ fetching: false }), 500);

    this.formRef = React.createRef();
  }

  componentDidMount() {
    const { dispatch, activityFromJob, activityFromTalent, application } =
      this.props;

    if (!activityFromJob) {
      // load job assigned users
      this.positionTypeTask = makeCancelable(
        dispatch(getJob(application.get('jobId')))
      );
      this.positionTypeTask.promise.then((response) => {
        this.setState({
          positionType: response.jobType,
          positionTitle: response.title,
          loadingAM: false,
        });
      });
    }

    if (!activityFromTalent) {
      // load talent resume
      this.resumetask = makeCancelable(
        dispatch(getResumesByTalentId(application.get('talentId')))
      );
      this.resumetask.promise.then(() => {
        this.setState({
          selectedResume: this.props.resumes.find(
            (value) => value.id === application.get('resumeId')
          ),
        });
      });
    }
  }

  componentWillUnmount() {
    if (this.positionTypeTask) {
      this.positionTypeTask.cancel();
    }
    if (this.resumetask) {
      this.resumetask.cancel();
    }
  }

  showResume = () => {
    this.setState({ showResume: true });
  };

  closeViewResume = () => {
    this.setState({ showResume: false });
  };

  submitAddCandidateActivity = (e) => {
    e.preventDefault();
    const submitForm = this.formRef.current;
    const { selectedResume, note } = this.state;
    const {
      t,
      dispatch,
      formType,
      userList,
      amList,
      acList,
      dmList,
      application,
      cancelAddActivity,
    } = this.props;
    const { applicationCommissions } = this.state;
    const userOptions = {
      [USER_TYPES.Sourcer]: userList,
      [USER_TYPES.Recruiter]: userList,
      [USER_TYPES.AM]: amList,
      [USER_TYPES.AccountCoordinator]: acList,
      [USER_TYPES.DM]: dmList,
    };
    //filter unfilled data
    const filteredApplicationCommissions = applicationCommissions
      .filter((ac) => ac.userRole !== USER_TYPES.Owner)
      .map((commission) => {
        const user = userOptions[commission.userRole].find(
          (u) =>
            u[
              commission.userRole === USER_TYPES.Sourcer ||
              commission.userRole === USER_TYPES.Recruiter
                ? 'id'
                : 'userId'
            ] === commission.userId
        );
        commission.userId = user && commission.userId;
        return commission;
      })
      .filter((c) => !!c.userId);

    const activity = {
      status: formType,
      resumeId: selectedResume && selectedResume.id,
      memo: submitForm.note.value,
      eventType: 'OFFER_ACCEPTED',
    };

    let errorMessage = this._validateForm(
      activity,
      t,
      filteredApplicationCommissions,
      applicationCommissions.some((ac) => ac.userRole === USER_TYPES.Owner),
      submitForm
    );
    if (errorMessage) {
      return this.setState({ errorMessage });
    }

    this.setState({ processing: true, errorMessage: Immutable.Map() });
    const offerLetter = this._getOfferLetterData(submitForm);
    // console.log(offerLetter);
    activity.eventDate = offerLetter.startDate + 'T00:00:00Z';
    activity.applicationOfferLetter = offerLetter;
    activity.applicationCommissions = filteredApplicationCommissions;
    activity.agreedPayRate = application.get('agreedPayRate');

    dispatch(updateApplication2(activity, application.get('id')))
      .then((newApplication) => {
        cancelAddActivity();
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

  _getOfferLetterData = (submitForm) => {
    let { positionType } = this.state;
    switch (positionType) {
      case JOB_TYPES.FullTime:
        return {
          startDate: submitForm.startDate.value,
          warrantyEndDate: submitForm.warrantyEndDate.value,
          currency: submitForm.currency.value,
          rateUnitType: submitForm.rateUnitType.value,
          salary: submitForm.salary.value,
          signOnBonus: submitForm.signOnBonus.value,
          retentionBonus: submitForm.retentionBonus.value,
          annualBonus: submitForm.annualBonus.value,
          relocationPackage: submitForm.relocationPackage.value,
          extraFee: submitForm.extraFee.value,
          feeType: submitForm.feeType.value,
          feePercentage:
            submitForm.feePercentage && submitForm.feePercentage.value,
          totalBillableAmount: submitForm.totalBillableAmount.value,
          totalBillAmount: submitForm.totalBillAmount.value,
        };
      case JOB_TYPES.Payrolling:
      case JOB_TYPES.Contract: {
        return {
          startDate: submitForm.startDate.value,
          endDate: submitForm.endDate.value,
          currency: submitForm.currency.value,
          rateUnitType: submitForm.rateUnitType.value,
          estimatedWorkingHourPerWeek:
            submitForm.estimatedWorkingHourPerWeek.value,
          extraCost: submitForm.extraCost.value,
          finalBillRate: submitForm.finalBillRate.value,
          finalPayRate: submitForm.finalPayRate.value,
          immigrationCostCode: submitForm.immigrationCostCode.value,
          mspRateCode: submitForm.mspRateCode.value,
          taxBurdenRateCode: submitForm.taxBurdenRateCode.value,
          totalBillAmount: submitForm.totalBillAmount.value,
        };
      }
      default: {
        console.log('JOB IS LOST');
      }
    }
  };

  renderCommission = (commission, userRole, ownerSize) => {
    let {
      errorMessage,
      applicationCommissions,
      loadingSourcer,
      loadingAM,
      canEdit,
      positionType,
    } = this.state;
    canEdit = canEdit && positionType !== JOB_TYPES.Payrolling;
    const { userList, amList, acList, dmList, edit } = this.props;
    const index = applicationCommissions.indexOf(commission);
    const userOptions = {
      [USER_TYPES.Sourcer]: userList,
      [USER_TYPES.Recruiter]: userList,
      [USER_TYPES.AM]: amList,
      [USER_TYPES.AccountCoordinator]: acList,
      [USER_TYPES.DM]: dmList,
    };

    const userValueKey =
      userRole === USER_TYPES.Sourcer || userRole === USER_TYPES.Recruiter
        ? 'id'
        : 'userId';
    // 如作为Recruiter 或者Sourcer的员工离职，那么在commission表格中，此人名字灰掉 不可删除
    // 但是可以调节分成比例且分成比例必须大于0%，同时可引入其他在职员工参与分成
    const disableEdit =
      (userRole === USER_TYPES.Sourcer || userRole === USER_TYPES.Recruiter) &&
      commission.userId &&
      !userList.find((u) => u.id === commission.userId && !u.disabled);

    return (
      <div key={index} className="row expanded">
        {/* 1.用户身份 */}
        <div className="small-4 columns">
          <FormReactSelectContainer>
            <Select
              value={commission.userRole}
              simpleValue
              options={userTypeOptions}
              filterOptions={(options) => options.filter((o) => !o.disabled)}
              autoBlur
              clearable={false}
              disabled={!canEdit || edit || disableEdit}
              onChange={(userRole) => {
                commission.userRole = userRole || commission.userRole;
                const user = userOptions[commission.userRole].find(
                  (u) =>
                    u[
                      commission.userRole === USER_TYPES.Sourcer ||
                      commission.userRole === USER_TYPES.Recruiter
                        ? 'id'
                        : 'userId'
                    ] === commission.userId
                );
                commission.userId = user && commission.userId;

                this.setState({
                  applicationCommissions: applicationCommissions.slice(),
                });
              }}
            />
          </FormReactSelectContainer>
        </div>

        {/* 2.选择用户 */}
        <div className="small-4 columns">
          <FormReactSelectContainer>
            <Select
              disabled={!canEdit || edit || disableEdit}
              valueKey={userValueKey}
              labelKey="fullName"
              value={commission.userId}
              onChange={(userId) => {
                commission.userId = userId || commission.userId;
                this.setState({
                  applicationCommissions: applicationCommissions.slice(),
                });
              }}
              simpleValue
              options={userOptions[userRole]}
              filterOptions={(options, filterValue) => {
                // console.log(filterValue);
                return options.filter(
                  (o) =>
                    !o.disabled &&
                    _filterOption(o, filterValue, {
                      ignoreCase: true,
                      matchProp: 'any',
                      matchPos: 'any',
                      valueKey: userValueKey,
                      labelKey: 'fullName',
                    })
                );
              }}
              autoBlur
              clearable={false}
              isLoading={
                userRole === USER_TYPES.Sourcer ||
                userRole === USER_TYPES.Recruiter
                  ? loadingSourcer
                  : loadingAM
              }
            />
          </FormReactSelectContainer>
        </div>

        {/* 3.分配比例 */}
        <div className="columns">
          <FormInput
            disabled={!canEdit || edit}
            name="commissions.commissionPct"
            value={commission.percentage}
            onChange={(e) => {
              commission.percentage = e.target.value;
              this.setState({
                applicationCommissions: applicationCommissions.slice(),
              });
            }}
            type="number"
            min={0}
            max={100}
            step={5}
            errorMessage={
              commission.userId && errorMessage.get('commissionPct') && true
            }
          />
        </div>

        {/* 4.删除/新增一项 */}
        {canEdit && !edit && (
          <div className="horizontal-layout align-self-top">
            {/* 删除 */}
            <IconButton
              size="small"
              disabled={
                applicationCommissions.length <= 1 + ownerSize || disableEdit
              }
              onClick={() => {
                this.setState({
                  applicationCommissions: applicationCommissions.filter(
                    (c) => c !== commission
                  ),
                });
              }}
            >
              <Delete />
            </IconButton>

            {/* 新增 */}
            <IconButton
              size="small"
              onClick={() => {
                applicationCommissions.splice(index + 1, 0, {
                  userId:
                    userList.find(
                      (u) => !u.disabled && u.id === commission.userId
                    ) && commission.userId,
                  userRole,
                  percentage: commission.percentage || 0,
                });
                this.setState({
                  applicationCommissions: applicationCommissions.slice(),
                });
              }}
            >
              <Add />
            </IconButton>
          </div>
        )}
      </div>
    );
  };
  renderOwnerCommission = (commission) => {
    const { applicationCommissions } = this.state;
    const { userList } = this.props;
    const index = applicationCommissions.indexOf(commission);

    return (
      <div key={index} className="row expanded">
        <div className="small-4 columns">
          <FormReactSelectContainer>
            <Select
              value={USER_TYPES.Owner}
              simpleValue
              options={userTypeOptions}
              autoBlur
              clearable={false}
              disabled
            />
          </FormReactSelectContainer>
        </div>
        <div className="small-4 columns">
          <FormReactSelectContainer>
            <Select
              valueKey={'id'}
              labelKey="fullName"
              value={commission.userId}
              simpleValue
              options={userList}
              autoBlur
              disabled
            />
          </FormReactSelectContainer>
        </div>
        <div className="small-4 columns">
          <FormInput
            name="commissions.commissionPct"
            value={commission.percentage}
            disabled
            type="number"
            min={0}
            max={100}
            step={0.1}
          />
        </div>
      </div>
    );
  };

  _removeErrorMsgHandler = (key) => {
    return this.setState({
      errorMessage: this.state.errorMessage.delete(key),
    });
  };

  _validateForm = (activityObject, t, commissions, hasOwner, submitForm) => {
    let errorMessage = Immutable.Map();

    // commissions

    const am = commissions.find((c) => c.userRole === USER_TYPES.AM);
    if (!am) {
      errorMessage = errorMessage.set('commissions', t('message:amIsRequired'));
    }

    const commissionWithoutDuplicates = [
      ...new Set(commissions.map((c) => `${c.userRole}-${c.userId}`)),
    ];
    if (commissions.length > commissionWithoutDuplicates.length) {
      errorMessage = errorMessage.set(
        'commissions',
        t('message:There are duplicate commissions')
      );
    }
    if (this.props.job.get('jobType') !== JOB_TYPES.Payrolling) {
      const sum = commissions
        .filter((c) => c.userId && c.userRole !== USER_TYPES.Owner)
        .reduce((s, c) => {
          return s + (Number(c.percentage) || 0);
        }, 0);
      if (sum + hasOwner * 10 !== 100) {
        errorMessage = errorMessage.set(
          'commissionPct',
          t('message:Commissions are incorrect')
        );
      }

      // if (!activityObject.resumeId) {
      //   errorMessage = errorMessage.set(
      //     'resumeId',
      //     t('message:resumeIsRequired')
      //   );
      // }
    }
    if (commissions.find((c) => !c.percentage || Number(c.percentage) <= 0)) {
      errorMessage = errorMessage.set(
        'commissionPct',
        t('message:Each commission should be greater than 0%')
      );
    }

    // OfferLetter Form

    if (submitForm.endDate && !submitForm.endDate.value) {
      errorMessage = errorMessage.set(
        'endDate',
        'message:End Date Is Required'
      );
    }

    if (submitForm.finalBillRate && !submitForm.finalBillRate.value) {
      errorMessage = errorMessage.set(
        'finalBillRate',
        'message:Final Bill Rate Is Required'
      );
    }
    if (submitForm.finalPayRate && !submitForm.finalPayRate.value) {
      errorMessage = errorMessage.set(
        'finalPayRate',
        'message:Final Pay Rate Rate Is Required'
      );
    }

    if (submitForm.taxBurdenRateCode && !submitForm.taxBurdenRateCode.value) {
      errorMessage = errorMessage.set(
        'taxBurdenRate',
        'message:Tax Burden Rate Is Required'
      );
    }

    if (submitForm.mspRateCode && !submitForm.mspRateCode.value) {
      errorMessage = errorMessage.set(
        'mspRate',
        'message:MSP Rate Is Required'
      );
    }

    if (
      submitForm.immigrationCostCode &&
      !submitForm.immigrationCostCode.value
    ) {
      errorMessage = errorMessage.set(
        'immigrationCost',
        'message:Immigration Cost Is Required'
      );
    }

    if (submitForm.startDate && !submitForm.startDate.value) {
      errorMessage = errorMessage.set(
        'startDate',
        'message:Start Date Is Required'
      );
    }
    if (submitForm.warrantyEndDate && !submitForm.warrantyEndDate.value) {
      errorMessage = errorMessage.set(
        'warrantyEndDate',
        'message:Warranty EndDate Is Required'
      );
    }

    if (
      submitForm.endDate &&
      submitForm.endDate.value &&
      submitForm.startDate.value &&
      moment(submitForm.endDate.value).isBefore(
        moment(submitForm.startDate.value)
      )
    ) {
      errorMessage = errorMessage.set(
        'endDate',
        'message:End Date should not be before Start Date'
      );
    }

    if (
      submitForm.warrantyEndDate &&
      submitForm.warrantyEndDate.value &&
      submitForm.startDate.value &&
      !moment(submitForm.startDate.value).isBefore(
        moment(submitForm.warrantyEndDate.value)
      )
    ) {
      errorMessage = errorMessage.set(
        'warrantyEndDate',
        'message:Warranty EndDate should be after Start Date'
      );
    }
    if (submitForm.salary && !submitForm.salary.value) {
      errorMessage = errorMessage.set(
        'salary',
        'message:Billable Base Salary Is Required'
      );
    }
    if (!submitForm.currency.value) {
      errorMessage = errorMessage.set(
        'currency',
        this.props.job.get('jobType') !== JOB_TYPES.FullTime
          ? 'message:Salary Currency Is Required'
          : 'message:Rate Currency Is Required'
      );
    }
    if (!submitForm.rateUnitType.value) {
      errorMessage = errorMessage.set(
        'rateUnitType',
        this.props.job.get('jobType') !== JOB_TYPES.FullTime
          ? 'message:Rate Unit Type Is Required'
          : 'message:Salary Unit Type Is Required'
      );
    }

    if (
      submitForm.totalBillableAmount &&
      !submitForm.totalBillableAmount.value
    ) {
      errorMessage = errorMessage.set(
        'totalBillableAmount',
        'message:Total Billable Amount Is Required'
      );
    }
    if (
      submitForm.totalBillAmount.value &&
      Number(submitForm.totalBillAmount.value) < 0
    ) {
      errorMessage = errorMessage.set(
        'totalBillAmount',
        t('message:Negative value is not allowed')
      );
    }
    if (!submitForm.totalBillAmount.value) {
      errorMessage = errorMessage.set(
        'totalBillAmount',
        'message:Total Bill Amount / GM Is Required'
      );
    }
    if (submitForm.feeType && !submitForm.feeType.value) {
      errorMessage = errorMessage.set(
        'FeeType',
        'message:Fee Type Is Required'
      );
    }

    // application
    if (!activityObject.status) {
      errorMessage = errorMessage.set('status', t('message:statusIsRequired'));
    }

    if (!activityObject.memo) {
      errorMessage = errorMessage.set('note', t('message:noteIsRequired'));
    }

    if (activityObject.memo.length > 5000) {
      errorMessage = errorMessage.set('note', t('message:noteLengthError'));
    }

    return errorMessage.size > 0 && errorMessage;
  };

  // add by bill from 2021/1/13
  setCommissions = () => {
    const { applicationCommissions, errorMessage } = this.state;
    const { nonOwnerCommission, owner } = applicationCommissions.reduce(
      (res, c) => {
        if (c.userRole === USER_TYPES.Owner) {
          res.owner.push(c);
        } else {
          res.nonOwnerCommission.push(c);
        }
        return res;
      },
      {
        nonOwnerCommission: [],
        owner: [],
      }
    );

    return (
      <div style={{ flex: 3 }}>
        {nonOwnerCommission.map((commission) => {
          return this.renderCommission(
            commission,
            commission.userRole,
            owner.length
          );
        })}
        {owner.map((commission) => {
          return this.renderOwnerCommission(commission);
        })}

        {errorMessage.get('commissions') && (
          <div className="columns" style={{ marginTop: 4 }}>
            <div className="foundation">
              <span className="form-error is-visible">
                {errorMessage.get('commissions')}
              </span>
            </div>
          </div>
        )}
        {errorMessage.get('commissionPct') && (
          <div className="columns" style={{ marginTop: 4 }}>
            <div className="foundation">
              <span className="form-error is-visible">
                {errorMessage.get('commissionPct')}
              </span>
            </div>
          </div>
        )}
      </div>
    );
  };

  switchForm = () => {
    const { errorMessage, positionType, positionTitle } = this.state;
    const { application, ...props } = this.props;
    // const positionType = 'CONTRACT';

    switch (positionType) {
      case JOB_TYPES.FullTime:
        return (
          <FullTimeForm
            errorMessage={errorMessage}
            removeErrorMsgHandler={this._removeErrorMsgHandler}
            positionType={positionType}
            positionTitle={positionTitle}
            application={application.toJS()}
            {...props}
          />
        );
      case JOB_TYPES.Contract:
        return (
          <ContractForm
            errorMessage={errorMessage}
            removeErrorMsgHandler={this._removeErrorMsgHandler}
            positionType={positionType}
            positionTitle={positionTitle}
            application={application.toJS()}
            {...props}
          />
        );
      case JOB_TYPES.Payrolling:
        return (
          <PayrollingForm
            errorMessage={errorMessage}
            removeErrorMsgHandler={this._removeErrorMsgHandler}
            positionType={positionType}
            positionTitle={positionTitle}
            application={application.toJS()}
            {...props}
          />
        );
      default: {
        return 'nothing';
      }
    }
  };

  render() {
    const {
      t,
      cancelAddActivity,
      resumes,
      application,
      formType,
      edit,
      classes,
    } = this.props;

    const {
      showResume,
      selectedResume,
      errorMessage,
      fetching,
      applicationCommissions,
      positionType,
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
          <form
            onSubmit={this.submitAddCandidateActivity}
            id="activityForm"
            noValidate
            ref={this.formRef}
          >
            {/* 只读信息 */}
            <section className={classes.candidateSec}>
              <ApplicationInfo application={application} t={t} split />
            </section>
            <section>
              {/* add by bill from 2021/1/12*/}
              {/* 区分positionType */}
              {positionType && this.switchForm()}

              {applicationCommissions && (
                <>
                  {/*Commissions label  */}
                  <div className="row expanded">
                    <div className="small-4 columns">
                      <FormReactSelectContainer
                        isRequired
                        label={t('field:userRole')}
                      />
                    </div>
                    <div className="small-4 columns">
                      <FormReactSelectContainer
                        isRequired
                        label={t('field:userName')}
                      />
                    </div>
                    <div className="small-4 columns">
                      <FormReactSelectContainer
                        isRequired
                        label={t('field:commissionSplit')}
                      />
                    </div>
                  </div>
                  {this.setCommissions()}
                </>
              )}

              {positionType === JOB_TYPES.Payrolling ? (
                <div
                  className="row expanded"
                  style={{ marginBottom: '0.75em' }}
                >
                  <div className="columns">
                    <Typography
                      variant="caption"
                      color="textSecondary"
                      gutterBottom
                      style={{ lineHeight: 1.3 }}
                    >
                      {
                        'Note: Account Managers will share 40% evenly and Account Coordinators will share 30% evenly. At this stage, we only record AM and AC user role, however this will not affect other user roles’ final GM. HR department will record, calculate and allocate all other user roles’ GM. '
                      }
                    </Typography>
                  </div>
                </div>
              ) : (
                <div className="row expanded">
                  <div className="columns">
                    <FormReactSelectContainer
                      label={t('field:resume')}
                      errorMessage={errorMessage.get('resumeId')}
                      icon={
                        selectedResume ? (
                          <ViewResume
                            onClick={this.showResume}
                            style={{ cursor: 'pointer' }}
                          />
                        ) : null
                      }
                    >
                      <Select
                        disabled
                        valueKey={'id'}
                        labelKey={'name'}
                        value={selectedResume}
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

                  <div style={{ width: 160 }}>
                    <div className="columns">
                      <PotentialButton
                        size="small"
                        style={{
                          marginTop: 23,
                        }}
                        fullWidth
                        onClick={this.showResume}
                        disabled={!selectedResume}
                      >
                        {t('action:view')}
                      </PotentialButton>
                    </div>
                  </div>
                </div>
              )}

              {/* 备注 */}
              <div className="row expanded">
                <div className="small-12 columns">
                  <FormTextArea
                    disabled={edit}
                    errorMessage={errorMessage.get('note')}
                    name="note"
                    label={t('field:note')}
                    rows="3"
                    placeholder={getMemoFromApplication(application)}
                    defaultValue={''}
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
            {edit ? (
              <PrimaryButton onClick={cancelAddActivity}>
                {t('action:close')}
              </PrimaryButton>
            ) : (
              <>
                <SecondaryButton onClick={cancelAddActivity}>
                  {t('action:cancel')}
                </SecondaryButton>
                <PrimaryButton
                  processing={processing}
                  onClick={this.submitAddCandidateActivity}
                >
                  {t('action:submit')}
                </PrimaryButton>
              </>
            )}
          </div>
        </DialogActions>
        {showResume && (
          <div className={classes.resumeContainer}>
            <ViewResumeInAddActivity
              resume={Immutable.fromJS(selectedResume)}
              t={t}
              close={this.closeViewResume}
            />
          </div>
        )}
      </Fragment>
    );
  }
}

OfferAcceptedFrom.propTypes = {
  cancelAddActivity: PropTypes.func.isRequired,
  application: PropTypes.object.isRequired,
};

const mapStoreStateToProps = (state, { application }) => {
  return {
    job: state.model.jobs.get(String(application.get('jobId'))),
    resumes: getTalentResumeArray(state, application.get('talentId')),
    currentUserId: state.controller.currentUser.get('id'),

    userList: getTenantUserArray(state),
    amList: getActiveAMArray(state, application.get('jobId')),
    acList: getACArray(state, application.get('jobId')),
    dmList: getDMArray(state, application.get('jobId')),
  };
};

export default connect(mapStoreStateToProps)(
  withStyles(styles)(OfferAcceptedFrom)
);

const _filterOption = (option, filterValue, props) => {
  if (!filterValue) return true;

  let value = option[props.valueKey];
  let label = option[props.labelKey];
  if (!value && !label) {
    return false;
  }

  let valueTest = value ? String(value) : null;
  let labelTest = label ? String(label) : null;

  if (props.ignoreCase) {
    if (valueTest && props.matchProp !== 'label')
      valueTest = valueTest.toLowerCase();
    if (labelTest && props.matchProp !== 'value')
      labelTest = labelTest.toLowerCase();
  }

  return props.matchPos === 'start'
    ? (valueTest &&
        props.matchProp !== 'label' &&
        valueTest.substr(0, filterValue.length) === filterValue) ||
        (labelTest &&
          props.matchProp !== 'value' &&
          labelTest.substr(0, filterValue.length) === filterValue)
    : (valueTest &&
        props.matchProp !== 'label' &&
        valueTest.indexOf(filterValue) >= 0) ||
        (labelTest &&
          props.matchProp !== 'value' &&
          labelTest.indexOf(filterValue) >= 0);
};
