import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { makeCancelable, getMemoFromApplication } from '../../../../utils';
import {
  getResumesByTalentId,
  addResume,
  getTalentOwnerships,
  uploadResumeOnly,
} from '../../../actions/talentActions';
import { getJob } from '../../../actions/jobActions';
import {
  updateApplication2,
  updateDashboardApplStatus,
} from '../../../actions/applicationActions';
import { showErrorMessage } from '../../../actions';
import { getTalentResumeArray } from '../../../selectors/talentResumeSelector';

import {
  userTypeForCommission as userTypeOptions,
  USER_TYPES,
  getApplicationStatusLabel,
  canUpdateResume,
  currency as currencyOptions,
} from '../../../constants/formOptions';

import Select from 'react-select';

import Divider from '@material-ui/core/Divider';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import ViewResume from '@material-ui/icons/RemoveRedEye';

import FormReactSelectContainer from '../../particial/FormReactSelectContainer';
import PrimaryButton from '../../particial/PrimaryButton';
import SecondaryButton from '../../particial/SecondaryButton';
import PotentialButton from '../../particial/PotentialButton';
import FormTextArea from '../../particial/FormTextArea';
import ApplicationInfo from '../views/ApplicationInfo';
import ViewResumeInAddActivity from '../../forms/AddActivity/ViewResumeInAddActivity';
import Loading from '../../particial/Loading';

// add by bill
import FormInput from '../../particial/FormInput';
import IconButton from '@material-ui/core/IconButton';
import Delete from '@material-ui/icons/Delete';
import Add from '@material-ui/icons/Add';

import {
  getACArray,
  getActiveAMArray,
  getDMArray,
  getTenantUserArray,
} from '../../../selectors/userSelector';
import NumberFormat from 'react-number-format';

const styles = {
  candidateSec: {
    marginBottom: '1rem',
    display: 'flex',
  },
  candidateInfoIpt: {
    minHeight: '40px',
    // lineHeight: '40px',
  },
  candidateInfoVal: {
    color: '#717171',
  },
};

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

class SubmittedFrom extends Component {
  constructor(props) {
    super(props);

    const { application, resumes, amList, currentUserId } = props;

    this.state = {
      errorMessage: Immutable.Map(),
      selectedResume: resumes.find(
        (value) => value.id === application.get('resumeId')
      ),
      currency: application.getIn(['agreedPayRate', 'currency']) || 'USD',
      rateUnitType:
        application.getIn(['agreedPayRate', 'rateUnitType']) || 'HOURLY',
      agreedPayRate:
        application.getIn(['agreedPayRate', 'agreedPayRate']) < 0
          ? ''
          : application.getIn(['agreedPayRate', 'agreedPayRate']),
      note: '',
      uploading: false,
      showedResume: false,

      processing: false,
      fetching: true,
      applicationCommissions: [],
      owner: [],

      canEdit: !!amList.find((am) => am.userId === currentUserId),
      loadingSourcer: false,
    };
    this.fTimer = setTimeout(() => this.setState({ fetching: false }), 500);
  }

  componentDidMount() {
    const {
      dispatch,
      activityFromJob,
      activityFromTalent,
      application,
      currentUserId,
    } = this.props;

    // add by bill ????????????applicationList????????????
    this.commissionTask = makeCancelable(
      dispatch(getTalentOwnerships(application.get('talentId')))
    );
    this.commissionTask.promise.then((ownership) => {
      const applicationCommissions = application
        .get('applicationCommissions')
        .toJS()
        .filter((ac) => ac.userRole !== USER_TYPES.Owner);
      // console.log(applicationCommissions);
      const owner = ownership.filter(
        (o) => o.ownershipType === USER_TYPES.Owner
      );

      this.setState({
        loadingOwner: false,
        owner,
        applicationCommissions:
          applicationCommissions.length > 0
            ? presetCommissionPCT(applicationCommissions, owner.length > 0)
            : [{ userRole: USER_TYPES.AM }],
        fetching: false,
        canEdit:
          !!applicationCommissions.find((c) => c.userId === currentUserId) ||
          this.state.canEdit,
      });
    });

    if (!activityFromJob) {
      this.amTask = makeCancelable(dispatch(getJob(application.get('jobId'))));
      this.amTask.promise.then(() => {
        const am = this.props.amList.find((am) => am.userId === currentUserId);
        this.setState({
          loadingAM: false,
          canEdit: !!am || this.state.canEdit,
        });
      });
    }
    if (!activityFromTalent) {
      this.resumeTask = makeCancelable(
        dispatch(getResumesByTalentId(application.get('talentId')))
      );
      this.resumeTask.promise.then(() => {
        this.setState({
          selectedResume: this.props.resumes.find(
            (value) => value.id === application.get('resumeId')
          ),
        });
      });
    }
  }

  componentWillUnmount() {
    this.commissionTask.cancel();
    if (this.amTask) {
      this.amTask.cancel();
    }
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

  handleResumeUpload = (e) => {
    const fileInput = e.target;
    const resumeFile = fileInput.files[0];
    const {
      dispatch,
      application: { talentId },
    } = this.props;
    if (resumeFile) {
      fileInput.value = '';
      this.setState({ uploading: true });
      dispatch(uploadResumeOnly(resumeFile))
        .then((response) => {
          response.talentId = this.props.application.toJS().talentId;
          return dispatch(addResume(response));
        })
        .then(() => {
          this.setState({
            selectedResume: this.props.resumes[0],
          });
        })
        .catch((err) => dispatch(showErrorMessage(err)))
        .finally(() => {
          this.setState({ uploading: false });
        });
    }
  };

  showResume = () => {
    this.setState({ showResume: true });
  };

  closeViewResume = () => {
    this.setState({ showResume: false });
  };

  submitAddCandidateActivity = (e) => {
    e.preventDefault();
    const {
      selectedResume,
      note,
      applicationCommissions,
      owner,
      currency,
      rateUnitType,
      agreedPayRate,
    } = this.state;
    const {
      t,
      cancelAddActivity,
      dispatch,
      currentUserId,
      formType,
      userList,
      amList,
      dmList,
      acList,
      application,
    } = this.props;

    const activity = {
      status: formType,
      resumeId: selectedResume && selectedResume.id,
      memo: note,
    };
    // if (currency && rateUnitType && agreedPayRate) {
    activity.agreedPayRate = {
      currency,
      rateUnitType,
      agreedPayRate: agreedPayRate ? Number(agreedPayRate) : -1,
    };
    // }
    const userOptions = {
      [USER_TYPES.Sourcer]: userList,
      [USER_TYPES.Recruiter]: userList,
      [USER_TYPES.AM]: amList,
      [USER_TYPES.DM]: dmList,
      [USER_TYPES.AccountCoordinator]: acList,
    };
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

    let errorMessage = this._validateForm(
      activity,
      t,
      filteredApplicationCommissions,
      owner.length > 0
    );
    if (errorMessage) {
      return this.setState({ errorMessage });
    }
    //todo: refine check am
    const isAm = filteredApplicationCommissions.find(
      (el) => el.userId === currentUserId && el.userRole === USER_TYPES.AM
    );
    if (!isAm) {
      return this.props.dispatch(
        showErrorMessage('Only Am can submit to client')
      );
    }
    this.setState({ processing: true });
    activity.applicationCommissions = filteredApplicationCommissions;

    return dispatch(updateApplication2(activity, application.get('id')))
      .then((newApplication) => {
        console.log('[[response]]', newApplication);
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

  _removeErrorMsgHandler = (key) => {
    return this.setState({
      errorMessage: this.state.errorMessage.delete(key),
    });
  };

  _validateForm = (activityObject, t, commissions, hasOwner) => {
    let errorMessage = Immutable.Map();

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

    const sum = commissions.reduce((s, c) => {
      return s + (Number(c.percentage) || 0);
    }, 0);

    if (sum + hasOwner * 10 !== 100) {
      errorMessage = errorMessage.set(
        'commissionPct',
        t('message:Commissions are incorrect')
      );
    }
    if (commissions.find((c) => !c.percentage || Number(c.percentage) <= 0)) {
      errorMessage = errorMessage.set(
        'commissionPct',
        t('message:Each commission should be greater than 0%')
      );
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

    return errorMessage.size > 0 && errorMessage;
  };

  handleResumeChange = (newValue) => {
    this.setState(({ selectedResume }) => ({
      selectedResume: newValue || selectedResume,
    }));
  };

  renderCommission = (commission, userRole) => {
    const {
      errorMessage,
      applicationCommissions,
      loadingSourcer,
      loadingAM,
      canEdit,
    } = this.state;
    const { userList, amList, dmList, acList } = this.props;
    const index = applicationCommissions.indexOf(commission);
    const userOptions = {
      [USER_TYPES.Sourcer]: userList,
      [USER_TYPES.Recruiter]: userList,
      [USER_TYPES.AM]: amList,
      [USER_TYPES.DM]: dmList,
      [USER_TYPES.AccountCoordinator]: acList,
    };
    const userValueKey =
      userRole === USER_TYPES.Sourcer || userRole === USER_TYPES.Recruiter
        ? 'id'
        : 'userId';
    const disableEdit =
      (userRole === USER_TYPES.Sourcer || userRole === USER_TYPES.Recruiter) &&
      commission.userId &&
      !userList.find((u) => u.id === commission.userId && !u.disabled);

    return (
      <div key={index} className="row expanded">
        {/* 1.???????????? */}
        <div className="small-4 columns">
          <FormReactSelectContainer>
            <Select
              value={commission.userRole}
              simpleValue
              options={userTypeOptions}
              filterOptions={(options) => options.filter((o) => !o.disabled)}
              autoBlur
              clearable={false}
              disabled={!canEdit || disableEdit}
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

        {/* 2.???????????? */}
        <div className="small-4 columns">
          <FormReactSelectContainer>
            <Select
              disabled={!canEdit || disableEdit}
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

        {/* 3.???????????? */}
        <div className="small-2 columns">
          <FormInput
            disabled={!canEdit}
            name="commissions.commissionPct"
            value={commission.percentage || ''}
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

        {/* 4.??????/???????????? */}
        {canEdit && (
          <div className="small-2 columns horizontal-layout align-self-top">
            {/* ?????? */}
            <IconButton
              size="small"
              disabled={applicationCommissions.length <= 1 || disableEdit}
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

            {/* ?????? */}
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
  renderOwnerCommission = (ownership, size) => {
    const { userList } = this.props;
    return (
      <div key={ownership.userId} className="row expanded">
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
              value={ownership.userId}
              simpleValue
              options={userList}
              autoBlur
              disabled
            />
          </FormReactSelectContainer>
        </div>
        <div className="small-2 columns">
          <FormInput
            name="commissions.commissionPct"
            value={10 / size}
            disabled
            type="number"
            min={0}
            max={100}
            step={0.1}
          />
        </div>
        <div className="small-2 columns horizontal-layout align-self-top" />
      </div>
    );
  };

  // add by bill from 2021/1/11
  setCommissions = () => {
    const { applicationCommissions, errorMessage, owner } = this.state;
    return (
      <div style={{ flex: 3 }}>
        {applicationCommissions.map((commission) => {
          return this.renderCommission(commission, commission.userRole);
        })}
        {owner.map((ownership) => {
          return this.renderOwnerCommission(ownership, owner.length);
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

  handleDropDownChange = (key) => (value) => {
    if (value && value !== this.state[key]) {
      this.setState({ [key]: value });
    }
  };

  handleNumberChange = (key) => (values) => {
    this.setState({ [key]: values.value });
  };

  render() {
    const { t, cancelAddActivity, resumes, application, formType } = this.props;

    const {
      showResume,
      uploading,
      selectedResume,
      currency,
      rateUnitType,
      agreedPayRate,
      note,
      errorMessage,
      fetching,
      processing,
      applicationCommissions,
    } = this.state;

    if (fetching) {
      return <Loading />;
    }

    if (showResume) {
      return (
        <ViewResumeInAddActivity
          resume={Immutable.fromJS(selectedResume)}
          t={t}
          close={this.closeViewResume}
        />
      );
    }

    return (
      <Fragment>
        {/* ?????? */}
        <DialogTitle>{getApplicationStatusLabel(formType)}</DialogTitle>

        {/* ???????????? */}
        <DialogContent>
          <form
            onSubmit={this.submitAddCandidateActivity}
            id="activityForm"
            noValidate
          >
            <section style={styles.candidateSec}>
              {/* ####?????????????????????#### */}
              {/* 1.??????????????? */}
              <ApplicationInfo
                application={application}
                t={t}
                style={{ flex: 2 }}
              />

              {/* 2.????????????AM/Recruiter/Sourcer/owner ????????????????????????????????? */}
              {applicationCommissions && this.setCommissions()}
            </section>
            {/* #####?????????####### */}
            {/*################################################ */}
            {/*################################################ */}

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
                      clearable={false}
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
                      clearable={false}
                      // disabled={edit}
                      value={rateUnitType}
                      simpleValue
                      options={rateUnitTypeOptions}
                      onChange={this.handleDropDownChange('rateUnitType')}
                      placeholder={'Rate Unit Type'}
                    />
                  </FormReactSelectContainer>
                  <input
                    type="hidden"
                    name="rateUnitType"
                    value={rateUnitType || ''}
                  />
                </div>
              </div>

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
                    {canUpdateResume(application.get('status')) && (
                      <PotentialButton
                        component="label"
                        size="small"
                        style={{
                          marginTop: 21,
                        }}
                        fullWidth
                        processing={uploading}
                        onChange={this.handleResumeUpload}
                      >
                        {t('action:uploadResume')}
                        <input
                          key="resume"
                          type="file"
                          style={{ display: 'none' }}
                        />
                      </PotentialButton>
                    )}
                  </div>
                </div>
              </div>
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

        {/* ????????????????????? ????????? ????????? */}
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

SubmittedFrom.propTypes = {
  cancelAddActivity: PropTypes.func.isRequired,
  application: PropTypes.object.isRequired,
};

const mapStoreStateToProps = (state, { application }) => {
  return {
    resumes: getTalentResumeArray(state, application.get('talentId')),
    currentUserId: state.controller.currentUser.get('id'),

    userList: getTenantUserArray(state),
    amList: getActiveAMArray(state, application.get('jobId')),
    acList: getACArray(state, application.get('jobId')),
    dmList: getDMArray(state, application.get('jobId')),
  };
};

export default connect(mapStoreStateToProps)(SubmittedFrom);

const presetCommissionPCT = (commissions, hasOwner) => {
  const { recruiter, sales, sourcer, dm, ac } = commissions.reduce(
    (res, c) => {
      if (c.userRole === USER_TYPES.AM) {
        res.sales.push(c);
      } else if (c.userRole === USER_TYPES.Sourcer) {
        res.sourcer.push(c);
      } else if (c.userRole === USER_TYPES.Recruiter) {
        res.recruiter.push(c);
      } else if (c.userRole === USER_TYPES.DM) {
        res.dm.push(c);
      } else if (c.userRole === USER_TYPES.AccountCoordinator) {
        res.ac.push(c);
      }
      return res;
    },
    {
      recruiter: [],
      dm: [],
      ac: [],
      sales: [],
      sourcer: [],
    }
  );
  sales.forEach((c) => (c.percentage = 10 / sales.length));
  recruiter.forEach(
    (c) => (c.percentage = (55 - hasOwner * 5) / recruiter.length)
  );
  sourcer.forEach((c) => (c.percentage = (35 - hasOwner * 5) / sourcer.length));
  dm.forEach((c) => (c.percentage = 0));
  ac.forEach((c) => (c.percentage = 0));
  return commissions.sort((a, b) => {
    return (a.userRole > b.userRole) - (a.userRole < b.userRole);
  });
};

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
