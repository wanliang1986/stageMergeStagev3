import React from 'react';
import Immutable from 'immutable';
import Select from 'react-select';
import { Trans } from 'react-i18next';
import { connect } from 'react-redux';
import FormTextArea from '../../particial/FormTextArea';
import FormInput from '../../particial/FormInput';
import FormReactSelectContainer from '../../particial/FormReactSelectContainer';
import SearchBox from '../component/search';
import IconButton from '@material-ui/core/IconButton';
import Delete from '@material-ui/icons/Delete';
import Add from '@material-ui/icons/Add';
import OtherTable from '../component/positionTable';
import {
  currency as currencyOptions,
  JOB_USER_ROLES,
  USER_TYPES,
  payRateUnitTypes,
  userTypeForCommission as userTypeOptions,
} from '../../../constants/formOptions';
import { showErrorMessage } from '../../../actions';
import { getApplicationPageSection } from '../../../../apn-sdk/newApplication';
import {
  getAssignedUserArray,
  getACArray,
  getActiveTenantUserArray,
  getDMArray,
  getActiveAMArray,
} from '../../../selectors/userSelector';
import { addApplication } from '../../../actions/applicationActions';
import NumberFormat from 'react-number-format';
import Loading from '../../particial/Loading';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';

const currencyLabels = currencyOptions.reduce((res, v) => {
  res[v.value] = v.label;
  return res;
}, {});
class ApplicationPositionForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      errorMessage: Immutable.Map(),
      note: '',
      submitTime: null,
      currency: null,
      rateUnitType: null,
      selectJobId: props.newCandidateJob.dialogSelectID,
      applicationCommissions: this._getApplicationCommissions(props),
      applicationCommissionsPayroll:
        this._getApplicationCommissionsPayroll(props),
      jobId: null,
      recruiterList: [],
      agreedPayRate: '',
      checkingDuplication: false,
    };
  }

  componentDidMount() {
    // this.fetchData();
  }

  fetchData = () => {
    getApplicationPageSection('SUBMIT_TO_JOB')
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  componentDidUpdate(nextProps, oldState) {
    if (
      JSON.stringify(nextProps.newCandidateJob.dialogSelectID) !==
        JSON.stringify(oldState.jobId) ||
      JSON.stringify(nextProps.recruiterList) !==
        JSON.stringify(oldState.recruiterList)
    ) {
      this.setState({
        applicationCommissions: this._getApplicationCommissions(nextProps),
        applicationCommissionsPayroll:
          this._getApplicationCommissionsPayroll(nextProps),
        jobId: nextProps.newCandidateJob.dialogSelectID,
        recruiterList: nextProps.recruiterList,
      });
    }
  }

  removeErrorMessage = (key) => {
    this.setState({
      errorMessage: this.state.errorMessage.delete(key),
    });
  };

  static validateForm = (positionForm, commissions, positionPageSection) => {
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
      if (
        positionForm.clientNote &&
        positionForm.clientNote.value.length > 5000
      ) {
        errorMessage = errorMessage.set('note', '备注不能大于5000长度');
      }
    }
    if (positionForm.currency && positionForm.rateUnitType) {
      if (positionForm.currency.value && !positionForm.agreedPayRate.value) {
        errorMessage = errorMessage.set('agreedPayRate', '金额不能为空');
      } else if (
        positionForm.currency.value &&
        !positionForm.rateUnitType.value
      ) {
        errorMessage = errorMessage.set('rateUnitType', '类型不能为空');
      } else if (
        positionForm.agreedPayRate.value &&
        !positionForm.currency.value
      ) {
        errorMessage = errorMessage.set('currency', '币种不能为空');
      } else if (
        positionForm.agreedPayRate.value &&
        !positionForm.rateUnitType.value
      ) {
        errorMessage = errorMessage.set('rateUnitType', '类型不能为空');
      } else if (
        positionForm.rateUnitType.value &&
        !positionForm.agreedPayRate.value
      ) {
        errorMessage = errorMessage.set('agreedPayRate', '金额不能为空');
      } else if (
        positionForm.rateUnitType.value &&
        !positionForm.currency.value
      ) {
        errorMessage = errorMessage.set('currency', '币种不能为空');
      }
    }
    if (positionPageSection.includes('IPG_NOTE_REQUIRED')) {
      if (positionForm.clientNote && !positionForm.clientNote.value) {
        errorMessage = errorMessage.set('note', '备注不能为空');
      }
    }

    return errorMessage.size > 0 && errorMessage;
  };

  handleSubmitPosition = (e) => {
    e.preventDefault();
    const {
      applicationCommissions,
      applicationCommissionsPayroll,
      currency,
      rateUnitType,
    } = this.state;
    const {
      newCandidateJob,
      talent,
      job,
      positionPageSection,
      recruitmentProcessId,
    } = this.props;
    const positionForm = e.target;
    if (positionPageSection.length === 0) {
      return;
    }
    // 过滤applicationCommissions
    const filteredApplicationCommissions = applicationCommissions.filter(
      (c) => !!c.userId
    );
    const filteredApplicationCommissionsPayroll =
      applicationCommissionsPayroll.filter((c) => !!c.userId);

    let errorMessage;
    if (positionPageSection.includes('IPG_KPI_USER_WITH_USER_ROLE')) {
      errorMessage = ApplicationPositionForm.validateForm(
        positionForm,
        filteredApplicationCommissions,
        positionPageSection
      );
    } else {
      errorMessage = ApplicationPositionForm.validateForm(
        positionForm,
        null,
        positionPageSection
      );
    }
    if (errorMessage) {
      return this.setState({ errorMessage });
    }
    // 清空提示信息
    this.setState({
      errorMessage: Immutable.Map(),
    });
    const position = {
      recruitmentProcessId,
      talentId: talent.get('id'),
      jobId: newCandidateJob.dialogSelectID,
      note: positionForm.clientNote.value,
    };
    if (positionPageSection.includes('IPG_KPI_USER_WITH_USER_ROLE')) {
      position.ipgKpiUsers = filteredApplicationCommissions;
    }
    if (
      positionPageSection.includes(
        'IPG_KPI_USER_WITH_USER_ROLE_AND_PERCENTAGE_DISABLED'
      )
    ) {
      position.ipgKpiUsers = filteredApplicationCommissionsPayroll;
    }
    if (positionPageSection.includes('IPG_CONTRACT_AGREED_PAY_RATE')) {
      if (
        positionForm.agreedPayRate.value &&
        positionForm.agreedPayRate.value.trim()
      ) {
        position.agreedPayRate = {
          currency,
          rateUnitType,
          agreedPayRate: positionForm.agreedPayRate.value,
        };
      }
    }
    this.props.onSubmit(true);
    this.setState({
      checkingDuplication: true,
    });
    console.log(position);
    this.props
      .dispatch(addApplication(position))
      .then((newApplication) => {
        this.props.dispatch({
          type: 'add_message',
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
        this.props.onSubmit(false);
        this.setState({ checkingDuplication: false });
        this.props.onSubmitToPosition(e);
      })
      .catch((err) => {
        this.props.dispatch(showErrorMessage(err));
        this.setState({ checkingDuplication: false });
        this.props.onSubmit(false);
      });
  };

  renderCommission = (commission, userRole, comIndex) => {
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
        <div className="small-5 columns">
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
                this.removeErrorMessage('commissions');
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
                this.removeErrorMessage('commissions');
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
              this.removeErrorMessage('commissions');
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
              this.removeErrorMessage('commissions');
              applicationCommissions.splice(comIndex + 1, 0, {
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

  _renderCommissionPayroll = (commission) => {
    const { applicationCommissionsPayroll } = this.state;
    const { recruiterList } = this.props;
    const index = applicationCommissionsPayroll.indexOf(commission);
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

  _getApplicationCommissionsPayroll = ({ recruiterList }) => {
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
    return applicationCommissions;
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
        userId: currentUserId,
        userRole: 'SOURCER',
      },
    ];
    return applicationCommissions;
  };

  handleDropDownChange = (key) => (value) => {
    this.setState({ [key]: value });
  };

  handleNumberChange = (key) => (values) => {
    this.setState({ [key]: values.value });
  };

  render() {
    const {
      t,
      classes,
      newCandidateJob,
      job,
      talent,
      positionPageSection,
      recruiterList,
    } = this.props;
    const {
      note,
      errorMessage,
      currency,
      rateUnitType,
      applicationCommissions,
      applicationCommissionsPayroll,
      agreedPayRate,
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
    return (
      <form
        onSubmit={this.handleSubmitPosition}
        id="newApplicationPositionForm"
      >
        <div className="row expanded small-12">
          <SearchBox />
        </div>

        {positionPageSection.includes('IPG_KPI_USER_WITH_USER_ROLE') ? (
          <>
            <div className="row expanded">
              <div className="small-5 columns">
                <FormReactSelectContainer label={'参与者'} />
              </div>
              <div className="small-5 columns">
                <FormReactSelectContainer label={'用户名'} />
              </div>
              <div className="small-2 columns">
                <FormReactSelectContainer label={'操作'} />
              </div>
            </div>
            {applicationCommissions.map((commission, index) => {
              return this.renderCommission(
                commission,
                commission.userRole,
                index
              );
            })}
            {/* {sales.map((commission) => {
              return this.renderCommission(commission, USER_TYPES.AM);
            })}
            {ac.map((commission) => {
              return this.renderCommission(commission, USER_TYPES.AccountCoordinator);
            })}
            {dm.map((commission) => {
              return this.renderCommission(commission, USER_TYPES.DM);
            })}
            {recruiter.map((commission) => {
              return this.renderCommission(commission, USER_TYPES.Recruiter);
            })}

            {sourcer.map((commission) => {
              return this.renderCommission(commission, USER_TYPES.Sourcer);
            })} */}
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

        {positionPageSection.includes('IPG_CONTRACT_AGREED_PAY_RATE') ? (
          <>
            <div
              style={{
                color: '#505050',
                fontSize: 16,
                fontWeight: 600,
                marginTop: 10,
                marginBottom: 10,
              }}
            >
              {'约定薪资信息'}
            </div>
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
                      placeholder={'请选择'}
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
                      placeholder={'请选择'}
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
                    value={agreedPayRate}
                    placeholder={'请输入金额'}
                    onValueChange={this.handleNumberChange('agreedPayRate')}
                    onBlur={() => this.removeErrorMessage('agreedPayRate')}
                    allowNegative={false}
                  />
                </FormReactSelectContainer>
                <input
                  name="agreedPayRate"
                  value={agreedPayRate}
                  type="hidden"
                />
              </div>
            </div>
          </>
        ) : null}

        {/* payroll */}
        {positionPageSection.includes(
          'IPG_KPI_USER_WITH_USER_ROLE_AND_PERCENTAGE_DISABLED'
        )
          ? applicationCommissionsPayroll && (
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
                {applicationCommissionsPayroll.map((commission) => {
                  return this._renderCommissionPayroll(commission);
                })}
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
                        '注意：客户经理将平均分配 40%，客户协调员将平均分配 30%。在这个阶段，我们只记录 AM 和 AC 用户角色，但这不会影响其他用户角色的最终 GM。 HR部门将记录、计算和分配所有其他用户角色的GM。'
                      }
                    </Typography>
                  </div>
                </div>
              </>
            )
          : null}

        {positionPageSection.length ? (
          <div className="row expanded small-12">
            <div className="small-12 columns">
              <FormTextArea
                errorMessage={errorMessage.get('note')}
                onFocus={() => this.removeErrorMessage('note')}
                isRequired={
                  positionPageSection.includes('IPG_NOTE_REQUIRED')
                    ? true
                    : false
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

        <div
          style={{
            color: '#505050',
            fontSize: 16,
            fontWeight: 600,
            marginTop: 10,
            marginBottom: 10,
          }}
        >
          {'已加入的其他职位'}
        </div>
        <OtherTable candidateId={talent.get('id')} />
        <Dialog open={this.state.checkingDuplication}>
          <DialogContent>
            <Loading />
            <Typography>{'Submiting To Position'}</Typography>
          </DialogContent>
        </Dialog>
      </form>
    );
  }
}

function mapStateToProps(state) {
  const jobId = state.controller.newCandidateJob.toJS().dialogSelectID;
  return {
    job: state.model.jobs.get(String(jobId)),
    newCandidateJob: state.controller.newCandidateJob.toJS(),
    userList: getActiveTenantUserArray(state),
    recruiterList: getAssignedUserArray(state, String(jobId)),
    amList: getActiveAMArray(state, String(jobId)),
    acList: getACArray(state, String(jobId)),
    dmList: getDMArray(state, String(jobId)),
    positionPageSection:
      state.controller.newCandidateJob.toJS().positionPageSection,
    recruitmentProcessId:
      state.controller.newCandidateJob.toJS().recruitmentProcessId,
  };
}

export default connect(mapStateToProps)(ApplicationPositionForm);
