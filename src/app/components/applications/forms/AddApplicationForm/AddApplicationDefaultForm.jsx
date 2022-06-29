import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from 'react-i18next';
import Immutable from 'immutable';
import { addApplication } from '../../../../actions/applicationActions';
import { getTalent } from '../../../../actions/talentActions';
import { showErrorMessage } from '../../../../actions';
import { makeCancelable } from '../../../../../utils';
import { newGetJobApplications } from '../../../../actions/jobActions';

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

import Delete from '@material-ui/icons/Delete';
import Add from '@material-ui/icons/Add';

import FormInput from '../../../particial/FormInput';
import FormTextArea from '../../../particial/FormTextArea';
import FormReactSelectContainer from '../../../particial/FormReactSelectContainer';
import Loading from '../../../particial/Loading';
import NumberFormat from 'react-number-format';
import ResumeSelector from '../ResumeSelector';

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

class AddApplicationForm extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      errorMessage: Immutable.Map(),
      sendEmail: true,
      applicationCommissions: this._getApplicationCommissions(props),

      currency: null,
      rateUnitType: null,
      agreedPayRate: '',
      customScore: 60,
      uploading: false,
      fetching: !props.isTalentDetail,
    };
  }

  fetchData() {
    const { talentId, dispatch, isTalentDetail } = this.props;

    if (!isTalentDetail) {
      this.talentTask = makeCancelable(dispatch(getTalent(talentId)));
      this.talentTask.promise.then(() => {
        this.setState({
          applicationCommissions: this._getApplicationCommissions(this.props),
          fetching: false,
        });
      });
    }
  }

  componentDidMount() {
    this.fetchData();
  }

  componentWillUnmount() {
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
    } = this.props;

    const {
      applicationCommissions,
      sendEmail,
      customScore,
      currency,
      rateUnitType,
      agreedPayRate,
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
      this.props.canSkipSubmitToAM
    );
    if (errorMessage) {
      return this.setState({ errorMessage });
    }

    const newApplication = {
      status: 'Applied',
      talentId: talentId,
      jobId: jobId,
      resumeId: applicationForm.resumeId.value,
      memo: applicationForm.memo.value,
      highlightedExperience: applicationForm.highlightedExperience.value,
      customScore: customScore,
      applicationCommissions: filteredApplicationCommissions,
    };
    if ((agreedPayRate && agreedPayRate !== '') || currency || rateUnitType) {
      newApplication.agreedPayRate = {
        currency,
        rateUnitType,
        agreedPayRate: agreedPayRate ? Number(agreedPayRate) : null,
      };
    } else {
      newApplication.agreedPayRate = null;
    }
    this.props.onSubmit();

    dispatch(addApplication(newApplication))
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

        if (type === 'jobToCandidate') {
          dispatch(newGetJobApplications(jobId));
        }
        if (sendEmail) {
          dispatch({
            type: ADD_SEND_EMAIL_REQUEST,
            request: {
              type: SEND_EMAIL_TYPES.SendEmailToAM,
              data: {
                application: newApplication,
              },
            },
          });
        }
      })
      .catch((err) => {
        dispatch(showErrorMessage(err));
        onSubmitSuccess();
      });
  };

  _validateForm(form, t, commissions, canSkipSubmitToAM) {
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

    //validate application
    // if (!form.email.value) {
    //   errorMessage = errorMessage.set('email', t('message:emailIsRequired'));
    // }
    // if (!form.phone.value) {
    //   errorMessage = errorMessage.set('phone', t('message:phoneIsRequired'));
    // }

    if (!form.resumeId.value) {
      errorMessage = errorMessage.set(
        'resumeId',
        t('message:resumeIsRequired')
      );
    }

    if (!form.memo.value) {
      errorMessage = errorMessage.set(
        'memo',
        t('message:recommendationCommentsIsRequired')
      );
    }
    if (form.memo.value.length > 5000) {
      errorMessage = errorMessage.set(
        'memo',
        t('message:recommendationCommentsLengthError')
      );
    }

    return errorMessage.size > 0 && errorMessage;
  }

  removeErrorMessage = (key) => {
    this.setState({
      errorMessage: this.state.errorMessage.delete(key),
    });
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
    if (value !== this.state[key]) {
      this.setState({ [key]: value });
      this.removeErrorMessage('agreedPayRate');
    }
  };

  handleNumberChange = (key) => (values) => {
    this.setState({ [key]: values.value });
    this.removeErrorMessage('agreedPayRate');
  };

  render() {
    const {
      t,
      isTalentDetail,
      talent,
      talentId,
      job,
      resumeId,
      initialMemo,
      recruiterList,
      highlightedExperience,
      canSkipSubmitToAM,
    } = this.props;
    const {
      errorMessage,
      applicationCommissions,
      sendEmail,
      currency,
      rateUnitType,
      agreedPayRate,
      fetching,
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
    if (!job || !talent || fetching) {
      return <Loading />;
    }
    return (
      <form onSubmit={this.handleAddApplication} id="applicationForm">
        <div className="row expanded">
          <div className="small-5">
            <div className=" small-12 columns">
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
            </div>
            <ResumeSelector
              // key={talentId}
              t={t}
              isRequired
              talentId={talentId}
              resumeId={resumeId}
              isTalentDetail={isTalentDetail}
              errorMessage={errorMessage}
              removeErrorMessage={this.removeErrorMessage}
            />

            <div className="small-12 columns">
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
            </div>

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
                    placeholder={t('field:Amount')}
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
                    placeholder={t('field:Currency')}
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
                  }}
                >
                  {errorMessage.get('agreedPayRate')}
                </div>
              </div>
            ) : null}
          </div>

          <div className="small-offset-1" />
          <div className="small-6">
            <div className="row expanded">
              <div className="small-4 columns">
                <FormReactSelectContainer label={t('field:userRole')} />
              </div>
              <div className="small-5 columns">
                <FormReactSelectContainer label={t('field:userName')} />
              </div>
            </div>
            {sales.map((commission) => {
              return this.renderCommission(commission, USER_TYPES.AM);
            })}
            {ac.map((commission) => {
              return this.renderCommission(commission, USER_TYPES.DM);
            })}
            {dm.map((commission) => {
              return this.renderCommission(commission, USER_TYPES.DM);
            })}
            {recruiter.map((commission) => {
              return this.renderCommission(commission, USER_TYPES.Recruiter);
            })}

            {sourcer.map((commission) => {
              return this.renderCommission(commission, USER_TYPES.Sourcer);
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

            <div className="small-12">
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
            </div>
            <div className="small-12 columns">
              <FormTextArea
                label={t('field:highlightedExperience')}
                name="highlightedExperience"
                placeholder={'e.g. Google L6, Harward PHD'}
                defaultValue={highlightedExperience || ''}
                rows="2"
                maxLength={50}
              />
            </div>
            <div className="small-12 columns">
              <FormTextArea
                isRequired
                label={t('field:recommendationComments')}
                name="memo"
                placeholder={initialMemo || ''}
                rows="5"
                errorMessage={errorMessage.get('memo')}
                onBlur={() => this.removeErrorMessage('memo')}
              />
            </div>
            <div className="small-12 columns">
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
                label={`${t('tab:Send email to AM')}(${salesNames})`}
              />
            </div>
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
