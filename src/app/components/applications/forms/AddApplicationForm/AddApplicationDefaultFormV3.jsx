import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from 'react-i18next';
import Immutable from 'immutable';
import { addApplicationJob } from '../../../../actions/applicationActions';
import {
  getResumesByTalentId,
  addResume,
  uploadResumeOnly,
  getTalent,
} from '../../../../actions/talentActions';
import { showErrorMessage } from '../../../../actions';
import { makeCancelable } from '../../../../../utils';
import { newGetJobApplications } from '../../../../actions/jobActions';
import {
  getApplicationPageSection,
  getRecruitmentProcessId,
} from '../../../../../apn-sdk/newApplication';
import {
  ADD_MESSAGE,
  ADD_SEND_EMAIL_REQUEST,
} from '../../../../constants/actionTypes';
import {
  currency as currencyOptions,
  JOB_USER_ROLES,
  SEND_EMAIL_TYPES,
  USER_TYPES,
  userTypeForCommission as userTypeOptions,
} from '../../../../constants/formOptions';

import Select from 'react-select';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Slider from '@material-ui/core/Slider';
import Divider from '@material-ui/core/Divider';
import Delete from '@material-ui/icons/Delete';
import Add from '@material-ui/icons/Add';

import PotentialButton from '../../../particial/PotentialButton';
import FormInput from '../../../particial/FormInput';
import FormTextArea from '../../../particial/FormTextArea';
import FormReactSelectContainer from '../../../particial/FormReactSelectContainer';
import Loading from '../../../particial/Loading';
import NumberFormat from 'react-number-format';

const rateUnitTypeOptions = [
  { value: 'HOURLY', label: 'Hour', label2: '小时' },
  { value: 'DAILY', label: 'Day', label2: '天' },
  { value: 'WEEKLY', label: 'Week', label2: '周' },
  { value: 'MONTHLY', label: 'Month', label2: '月' },
  { value: 'YEARLY', label: 'Year', label2: '年' },
];
const currencyLabels = currencyOptions.reduce((res, v) => {
  res[v.value] = v.label;
  return res;
}, {});

class AddApplicationForm extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: Immutable.Map(),
      selectedResume: this._getResume(props),
      sendEmail: true,
      applicationCommissions: this._getApplicationCommissions(props),

      currency: 'USD',
      rateUnitType: 'HOURLY',
      agreedPayRate: '',
      customScore: 60,
      section: [],
      recruitmentProcessId: props.recruitmentProcessId,
    };
  }

  fetchData() {
    const { talentId, dispatch, isTalentDetail, job } = this.props;
    // 获取流程对应的展示section
    getApplicationPageSection('SUBMIT_TO_JOB', job.get('jobType'))
      .then((res) => {
        this.setState({
          section: res.response.map((item) => item.nodePageSection),
        });
      })
      .catch((err) => {
        console.log(err);
      });
    // getRecruitmentProcessId(job.get('jobType'))
    //   .then(({ response }) => {
    //     console.log(response);
    //     this.setState({
    //       recruitmentProcessId: response.id,
    //     });
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
    if (!isTalentDetail) {
      this.talentTask = makeCancelable(dispatch(getTalent(talentId)));
      this.talentTask.promise.then(() => {
        this.setState({
          applicationCommissions: this._getApplicationCommissions(this.props),
        });
      });

      this.resumeTask = makeCancelable(
        dispatch(getResumesByTalentId(talentId))
      );
      this.resumeTask.promise.then(() => {
        this.setState({ selectedResume: this._getResume(this.props) });
      });
    }
  }

  componentDidMount() {
    this.fetchData();
  }

  componentWillUnmount() {
    if (this.resumeTask) {
      this.resumeTask.cancel();
    }
    if (this.talentTask) {
      this.talentTask.cancel();
    }
  }

  handleAddApplication = (e) => {
    e.preventDefault();
    const applicationForm = e.target;
    const {
      talentId,
      jobId,
      dispatch,
      onSubmitSuccess,
      t,
      userList,
      amList,
      dmList,
      acList,
      type,
      recruitmentProcessId,
    } = this.props;
    const {
      applicationCommissions,
      sendEmail,
      customScore,
      currency,
      rateUnitType,
      agreedPayRate,
      section,
    } = this.state;
    const userOptions = {
      [USER_TYPES.Sourcer]: userList,
      [USER_TYPES.Recruiter]: userList,
      [USER_TYPES.AM]: amList,
      [USER_TYPES.DM]: dmList,
      [USER_TYPES.AccountCoordinator]: acList,
    };
    const filteredApplicationCommissions = applicationCommissions
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
      applicationForm,
      t,
      filteredApplicationCommissions,
      section
    );
    if (errorMessage) {
      return this.setState({ errorMessage });
    }

    const newApplication = {
      // status: 'Applied',
      recruitmentProcessId,
      talentId: talentId,
      jobId: jobId,
      // resumeId: applicationForm.resumeId.value,
      note: applicationForm.memo.value,
      // highlightedExperience: applicationForm.highlightedExperience.value,
      // customScore: customScore,
    };
    if (section.includes('IPG_KPI_USER_WITH_USER_ROLE')) {
      newApplication.ipgKpiUsers = filteredApplicationCommissions;
    }
    if (section.includes('IPG_CONTRACT_AGREED_PAY_RATE')) {
      if (currency && rateUnitType) {
        newApplication.agreedPayRate = {
          currency,
          rateUnitType,
          agreedPayRate: agreedPayRate ? Number(agreedPayRate) : -1,
        };
      }
    }

    this.props.onSubmit();
    dispatch(addApplicationJob(newApplication))
      .then((newApplication) => {
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

        onSubmitSuccess(newApplication);

        // if (type === 'jobToCandidate') {
        //   dispatch(newGetJobApplications(jobId));
        // }
        // if (sendEmail) {
        //   dispatch({
        //     type: ADD_SEND_EMAIL_REQUEST,
        //     request: {
        //       type: SEND_EMAIL_TYPES.SendEmailToAM,
        //       data: {
        //         application: newApplication,
        //       },
        //     },
        //   });
        // }
      })
      .catch((err) => {
        dispatch(showErrorMessage(err));
        onSubmitSuccess();
      });
  };

  openResume = (value, event) => {
    window.open(value.s3Link);
  };

  handleResumeUpload = (e) => {
    const fileInput = e.target;
    const resumeFile = fileInput.files[0];
    this.removeErrorMessage('resume');
    const { dispatch, talentId } = this.props;
    if (resumeFile) {
      fileInput.value = '';
      this.setState({ uploading: true });
      dispatch(uploadResumeOnly(resumeFile))
        .then((response) => {
          response.talentId = talentId;
          return dispatch(addResume(response));
        })
        .then(() => {
          this.setState({
            selectedResume: this.props.resumeList[0],
          });
        })
        .catch((err) => dispatch(showErrorMessage(err)))
        .finally(() => {
          this.setState({ uploading: false });
        });
    }
  };

  _validateForm(form, t, commissions, section) {
    let errorMessage = Immutable.Map();

    //validate commissions
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

    //validate application
    // if (!form.email.value) {
    //   errorMessage = errorMessage.set('email', t('message:emailIsRequired'));
    // }
    // if (!form.phone.value) {
    //   errorMessage = errorMessage.set('phone', t('message:phoneIsRequired'));
    // }

    // if (!form.resumeId.value) {
    //   errorMessage = errorMessage.set('resume', t('message:resumeIsRequired'));
    // }
    console.log(section);
    if (!section.includes('DEFAULT_NOTE_OPTIONAL')) {
      if (!form.memo.value || /^\s+$/gi.test(form.memo.value)) {
        errorMessage = errorMessage.set('memo', '备注不能为空');
      }
    }

    // if (!form.memo.value) {
    //   errorMessage = errorMessage.set('memo', '备注不能为空');
    // }
    if (form.memo.value.length * 1 > 5000) {
      errorMessage = errorMessage.set('memo', '备注不能超过5000长度');
    }

    return errorMessage.size > 0 && errorMessage;
  }

  removeErrorMessage = (key) => {
    this.setState({
      errorMessage: this.state.errorMessage.delete(key),
    });
  };

  handleResumeChange = (newValue) => {
    this.setState(({ selectedResume }) => ({
      selectedResume: newValue || selectedResume,
    }));
  };

  renderCommission = (commission, userRole) => {
    const { applicationCommissions } = this.state;
    const { userList, amList, dmList, acList } = this.props;
    const index = applicationCommissions.indexOf(commission);
    const userOptions = {
      [USER_TYPES.Sourcer]: userList,
      [USER_TYPES.Recruiter]: userList,
      [USER_TYPES.AM]: amList,
      [USER_TYPES.DM]: dmList,
      [USER_TYPES.AccountCoordinator]: acList,
    };
    return (
      <div key={index} className="row expanded">
        <div className="small-4 columns">
          <FormReactSelectContainer>
            <Select
              labelKey={'label2'}
              value={commission.userRole}
              simpleValue
              options={userTypeOptions}
              autoBlur
              clearable={false}
              onChange={(userRole) => {
                if (userRole === 'DELIVERY_MANAGER') {
                  commission.userRole = 'DM';
                } else {
                  commission.userRole = userRole || commission.userRole;
                }
                const user = userOptions[commission.userRole].find(
                  (u) =>
                    u[
                      commission.userRole === USER_TYPES.Sourcer
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
        <div className="small-5 columns">
          <FormReactSelectContainer>
            <Select
              valueKey={
                userRole === USER_TYPES.Sourcer ||
                userRole === USER_TYPES.Recruiter
                  ? 'id'
                  : 'userId'
              }
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
              autoBlur
              clearable={false}
            />
          </FormReactSelectContainer>
        </div>
        <div className="small-2 columns horizontal-layout align-self-top">
          <IconButton
            size="small"
            disabled={applicationCommissions.length <= 1}
            onClick={() => {
              if (applicationCommissions.length > 1)
                this.setState({
                  applicationCommissions: applicationCommissions.filter(
                    (c) => c !== commission
                  ),
                });
            }}
          >
            <Delete />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => {
              applicationCommissions.push({
                userId: commission.userId,
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
      </div>
    );
  };

  _getResume = ({ resumeId, resumeList }) => {
    return resumeId
      ? resumeList.find((value) => value.id === resumeId)
      : resumeList[0];
  };
  _getApplicationCommissions = ({ recruiterList, currentUserId, talent }) => {
    const am = recruiterList.find(
      (value) => value.permission === JOB_USER_ROLES.AccountManager
    );
    const applicationCommissions = [
      {
        userId: am ? am.userId : null,
        userRole: 'AM',
      },
      {
        userId: currentUserId,
        userRole: 'RECRUITER',
      },
      {
        userId:
          (talent && talent.getIn(['createdUser', 'id'])) || currentUserId,
        userRole: 'SOURCER',
      },
    ];
    return applicationCommissions;
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
    const {
      t,
      talent,
      job,
      resumeList,
      initialMemo,
      recruiterList,
      highlightedExperience,
    } = this.props;
    const {
      selectedResume,
      errorMessage,
      applicationCommissions,
      sendEmail,
      currency,
      rateUnitType,
      agreedPayRate,
      section,
    } = this.state;
    const { recruiter, sales, sourcer, dm, ac } = applicationCommissions.reduce(
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
        sales: [],
        sourcer: [],
        dm: [],
        ac: [],
      }
    );

    let emailArr = [];
    let phoneArr = [];
    talent &&
      talent.toJS().contacts &&
      talent.toJS().contacts.map((item) => {
        if (item.type === 'PHONE') {
          phoneArr.push(item.contact);
        }
        if (item.type === 'EMAIL') {
          emailArr.push(item.contact);
        }
      });

    const salesNames = sales
      .map((c) => recruiterList.find((r) => r.userId === c.userId))
      .filter((c) => c)
      .map((c) => c.fullName)
      .join();
    if (!job || !talent) {
      return <Loading />;
    }
    return (
      <form onSubmit={this.handleAddApplication} id="applicationForm">
        <div className="row expanded">
          <div className="small-5">
            {/* <div className=" small-12 columns">
              <FormInput
                label={t('field:jobTitle')}
                value={`# ${job.get('id')} - ${job.get('title')}`}
                readOnly
              />
            </div>

            <div className="small-12 columns">
              <FormInput
                label={t('field:candidate')}
                value={talent.get('fullName')}
                readOnly
              />
            </div> */}
            {/* <div className="small-12">
              <div className="row">
                <div className="columns">
                  <FormReactSelectContainer
                    label={t('field:resume')}
                    isRequired={true}
                    errorMessage={errorMessage.get('resume')}
                  >
                    <Select
                      valueKey={'id'}
                      labelKey={'name'}
                      clearable={false}
                      options={resumeList}
                      value={selectedResume}
                      onChange={this.handleResumeChange}
                      onBlur={() => this.removeErrorMessage('resume')}
                      onValueClick={this.openResume}
                      className="capitalize-dropdown"
                      autoBlur={true}
                      openOnFocus={true}
                      placeholder={
                        resumeList.length
                          ? t('message:selectResume')
                          : t('message:noResumeUploaded')
                      }
                    />
                  </FormReactSelectContainer>
                  <input
                    type="hidden"
                    name="resumeId"
                    value={
                      this.state.selectedResume
                        ? this.state.selectedResume.id
                        : ''
                    }
                  />
                </div>
                <div className="columns" style={{ flex: 'inherit' }}>
                  <PotentialButton
                    component="label"
                    style={{
                      width: 160,
                      marginTop: 21,
                      marginLeft: 8,
                    }}
                    processing={this.state.uploading}
                    size="small"
                    disabled={this.state.uploading}
                    onChange={this.handleResumeUpload}
                  >
                    {t('action:uploadResume')}

                    <input
                      key="resume"
                      type="file"
                      style={{ display: 'none' }}
                    />
                  </PotentialButton>
                </div>
              </div>
            </div> */}

            {/* <div className="small-12 columns">
              <FormInput
                name="email"
                readOnly
                label={t('field:candidateEmail')}
                defaultValue={emailArr.length > 0 ? emailArr[0] : ''}
              />
            </div>

            <div className="small-12 columns">
              <FormInput
                name="phone"
                readOnly
                label={t('field:candidatePhone')}
                defaultValue={phoneArr.length > 0 ? phoneArr[0] : ''}
              />
            </div> */}
          </div>
          {/* <div className="small-offset-1" /> */}
          {section && section.includes('IPG_KPI_USER_WITH_USER_ROLE') ? (
            <div className="small-12">
              <div className="row expanded">
                <div style={{ width: '10%', textAlign: 'right', marginTop: 5 }}>
                  {/* <FormReactSelectContainer label={t('field:userRole')} />
                   */}
                  {'参与者'}
                </div>
                {/* <div className="small-5 columns">
             <FormReactSelectContainer label={t('field:userName')} />
           </div> */}
                <div style={{ flex: 1 }}>
                  {sales.map((commission) => {
                    return this.renderCommission(commission, USER_TYPES.AM);
                  })}
                  {ac.map((commission) => {
                    return this.renderCommission(
                      commission,
                      USER_TYPES.AccountCoordinator
                    );
                  })}
                  {dm.map((commission) => {
                    return this.renderCommission(commission, USER_TYPES.DM);
                  })}
                  {recruiter.map((commission) => {
                    return this.renderCommission(
                      commission,
                      USER_TYPES.Recruiter
                    );
                  })}

                  {sourcer.map((commission) => {
                    return this.renderCommission(
                      commission,
                      USER_TYPES.Sourcer
                    );
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
                </div>
              </div>
            </div>
          ) : (
            ''
          )}
          <div className="small-12">
            {/* <div className="small-12">
              <div className="row">
                <div className="columns small-4">
                  <FormInput
                    label={t('field:score2')}
                    type="number"
                    value={this.state.customScore || 0}
                    onChange={(e) =>
                      this.setState({ customScore: e.target.value })
                    }
                  />
                </div>

                <div className="columns" style={{ marginTop: 20 }}>
                  <Slider
                    value={this.state.customScore}
                    min={0}
                    max={100}
                    step={5}
                    onChange={(e, customScore) =>
                      this.setState({ customScore })
                    }
                  />
                </div>
              </div>
            </div> */}
            {/* <div className="small-12 columns">
              <FormTextArea
                label={t('field:highlightedExperience')}
                name="highlightedExperience"
                placeholder={'e.g. Google L6, Harward PHD'}
                defaultValue={highlightedExperience || ''}
                rows="2"
                maxLength={50}
              />
            </div> */}
            {section && section.includes('IPG_CONTRACT_AGREED_PAY_RATE') ? (
              <div>
                <div style={{ display: 'flex' }}>
                  <div
                    style={{ width: '10%', textAlign: 'right', marginTop: 5 }}
                  >
                    {'币种/类型'}
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
                    <input
                      type="hidden"
                      name="currency"
                      value={currency || ''}
                    />
                  </div>
                  <div className="columns">
                    <FormReactSelectContainer>
                      <Select
                        labelKey={'label2'}
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
                  {errorMessage && errorMessage.get('agreedPayRate') ? (
                    <div
                      style={{
                        color: '#cc4b37',
                        fontWeight: 'bold',
                        fontSize: '0.75em',
                      }}
                    >
                      {errorMessage.get('agreedPayRate')}
                    </div>
                  ) : null}
                </div>
                <div style={{ display: 'flex' }}>
                  <div
                    style={{ width: '10%', textAlign: 'right', marginTop: 5 }}
                  >
                    {'工资金额'}
                  </div>
                  <div className="columns">
                    <FormReactSelectContainer>
                      <NumberFormat
                        thousandSeparator
                        prefix={currencyLabels[currency]}
                        // disabled={edit}
                        value={agreedPayRate}
                        onValueChange={this.handleNumberChange('agreedPayRate')}
                        allowNegative={false}
                        placeholder={'请输入金额'}
                      />
                    </FormReactSelectContainer>
                    <input
                      type="hidden"
                      name="agreedPayRate"
                      value={agreedPayRate || ''}
                    />
                  </div>
                </div>
              </div>
            ) : (
              ''
            )}

            <div style={{ display: 'flex' }}>
              <div style={{ width: '10%', textAlign: 'right', marginTop: 5 }}>
                {'备注'}
                {section.includes('DEFAULT_NOTE_OPTIONAL') ? null : (
                  <span style={{ color: 'red', paddingLeft: '4px' }}>*</span>
                )}
              </div>
              <div className="columns">
                <FormTextArea
                  // isRequired={}
                  // label={t('field:recommendationComments')}
                  name="memo"
                  placeholder={initialMemo || ''}
                  rows="5"
                  errorMessage={errorMessage.get('memo')}
                  onBlur={() => this.removeErrorMessage('memo')}
                />
              </div>
            </div>
            {/* <div className="small-12 columns">
              <FormControlLabel
                control={
                  <Checkbox
                    color="primary"
                    checked={sendEmail}
                    onChange={(e) =>
                      this.setState({ sendEmail: e.target.checked })
                    }
                  />
                }
                label={`Send email to AM (${salesNames})`}
              />
            </div> */}
          </div>
        </div>
      </form>
    );
  }
}

AddApplicationForm.propTypes = {
  talentId: PropTypes.number.isRequired,
  jobId: PropTypes.number.isRequired,
  resumeId: PropTypes.number,
  initialMemo: PropTypes.string,
  highlightedExperience: PropTypes.string,
  onSubmitSuccess: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};
AddApplicationForm.defaultProps = {
  onSubmit: () => {},
};

export default AddApplicationForm;
