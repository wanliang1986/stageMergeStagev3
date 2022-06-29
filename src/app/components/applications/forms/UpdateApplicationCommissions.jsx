import React from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import {
  userTypeForCommission as userTypeOptions,
  USER_TYPES,
  JOB_TYPES,
} from '../../../constants/formOptions';
import { getApplicationCommissions } from '../../../../apn-sdk';
import { showErrorMessage } from '../../../actions';
import { updateApplicationCommissions } from '../../../actions/applicationActions';
import { getJob } from '../../../actions/jobActions';
import { makeCancelable } from '../../../../utils';
import {
  getACArray,
  getActiveAMArray,
  getDMArray,
  getTenantUserArray,
} from '../../../selectors/userSelector';

import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import PrimaryButton from '../../particial/PrimaryButton';
import SecondaryButton from '../../particial/SecondaryButton';
import FormReactSelectContainer from '../../particial/FormReactSelectContainer';
import Select from 'react-select';
import IconButton from '@material-ui/core/IconButton';
import Delete from '@material-ui/icons/Delete';
import Add from '@material-ui/icons/Add';
import Loading from '../../particial/Loading';
import FormInput from '../../particial/FormInput';

class UpdateApplicationCommissions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      processing: false,
      fetching: true,
      errorMessage: Immutable.Map(),
      canEdit: false,
      loadingSourcer: false,
    };
  }

  componentDidMount() {
    const { applicationId, jobId, currentUserId, dispatch } = this.props;

    this.amTask = makeCancelable(dispatch(getJob(jobId)));
    this.amTask.promise.then(() => {
      const am = this.props.amList.find((am) => am.userId === currentUserId);
      this.setState({
        loadingAM: false,
        canEdit: !!am || this.state.canEdit,
      });
    });

    this.commissionTask = makeCancelable(
      getApplicationCommissions(applicationId)
    );
    this.commissionTask.promise.then(({ response }) => {
      response = response || [];
      this.setState({
        applicationCommissions:
          response.filter((c) => c.userRole !== USER_TYPES.Owner).length > 0
            ? response.sort((a, b) => {
                return (a.userRole > b.userRole) - (a.userRole < b.userRole);
              })
            : [{ userRole: USER_TYPES.AM }].concat(response),
        fetching: false,
        canEdit:
          !!response.find((c) => c.userId === currentUserId) ||
          this.state.canEdit,
      });
    });
  }
  componentWillUnmount() {
    this.commissionTask.cancel();
    this.amTask.cancel();
  }

  handleSubmit = () => {
    const {
      t,
      applicationId,
      onSuccess,
      dispatch,
      onClose,
      userList,
      amList,
      dmList,
      acList,
      jobType,
    } = this.props;
    const { applicationCommissions } = this.state;
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
      null,
      t,
      filteredApplicationCommissions,
      applicationCommissions.some((ac) => ac.userRole === USER_TYPES.Owner),
      jobType
    );
    if (errorMessage) {
      return this.setState({ errorMessage });
    }
    this.setState({ processing: true, errorMessage: Immutable.Map() });

    dispatch(
      updateApplicationCommissions(
        applicationId,
        filteredApplicationCommissions
      )
    )
      .then((response) => {
        onSuccess && onSuccess(response);
        onClose();
      })
      .catch((err) => {
        dispatch(showErrorMessage(err));
        this.setState({ processing: false });
      });
  };

  _validateForm(form, t, commissions, hasOwner, jobType) {
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
    if (jobType !== JOB_TYPES.Payrolling) {
      const sum = commissions.reduce((s, c) => {
        return s + (Number(c.percentage) || 0);
      }, 0);

      if (sum + hasOwner * 10 !== 100) {
        errorMessage = errorMessage.set(
          'commissionPct',
          t('message:Commissions are incorrect')
        );
      }
    }
    if (commissions.find((c) => !c.percentage || Number(c.percentage) <= 0)) {
      errorMessage = errorMessage.set(
        'commissionPct',
        t('message:Each commission should be greater than 0%')
      );
    }
    return errorMessage.size > 0 && errorMessage;
  }

  removeErrorMessage = (key) => {
    this.setState({
      errorMessage: this.state.errorMessage.delete(key),
    });
  };

  renderCommission = (commission, userRole, ownerSize) => {
    const { applicationCommissions, loadingSourcer, loadingAM, errorMessage } =
      this.state;

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
    // 如作为Recruiter 或者Sourcer的员工离职，那么在commission表格中，此人名字灰掉 不可删除
    // 但是可以调节分成比例且分成比例必须大于0%，同时可引入其他在职员工参与分成
    const disableEdit =
      (userRole === USER_TYPES.Sourcer || userRole === USER_TYPES.Recruiter) &&
      commission.userId &&
      !userList.find((u) => u.id === commission.userId && !u.disabled);

    return (
      <div key={index} className="row expanded">
        <div className="small-4 columns">
          <FormReactSelectContainer>
            <Select
              value={commission.userRole}
              simpleValue
              options={userTypeOptions}
              filterOptions={(options) => options.filter((o) => !o.disabled)}
              autoBlur
              clearable={false}
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
              disabled={disableEdit}
            />
          </FormReactSelectContainer>
        </div>
        <div className="small-4 columns">
          <FormReactSelectContainer>
            <Select
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
              disabled={disableEdit}
            />
          </FormReactSelectContainer>
        </div>
        {/* 3.分配比例 */}

        <div className="small-2 columns">
          <FormInput
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
        <div className="small-2 columns horizontal-layout align-self-top">
          <IconButton
            size="small"
            disabled={
              applicationCommissions.length <= 1 + ownerSize || disableEdit
            }
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
        <div className="small-2 columns">
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

  render() {
    const {
      fetching,
      processing,
      applicationCommissions,
      errorMessage,
      canEdit,
    } = this.state;
    const { t, onClose } = this.props;
    console.log(applicationCommissions, canEdit);
    if (fetching) {
      return <Loading />;
    }
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
      <>
        <DialogTitle>{t('common:Update Application Commissions')}</DialogTitle>
        <DialogContent style={{ overflow: 'visible' }}>
          {nonOwnerCommission.map((commission) => {
            return this.renderCommission(
              commission,
              commission.userRole,
              owner.length
            );
          })}
          {owner.map((commission) => {
            return this.renderOwnerCommission(commission, owner.length);
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
        </DialogContent>
        <DialogActions>
          <div className="horizontal-layout">
            <SecondaryButton onClick={onClose}>
              {t('action:cancel')}
            </SecondaryButton>
            <PrimaryButton
              disabled={!canEdit}
              processing={processing}
              onClick={this.handleSubmit}
            >
              {t('action:submit')}
            </PrimaryButton>
          </div>
        </DialogActions>
      </>
    );
  }
}

function mapStoreStateToProps(state, { jobId }) {
  return {
    jobType: state.model.jobs.getIn([String(jobId), 'jobType']),
    userList: getTenantUserArray(state),
    amList: getActiveAMArray(state, jobId),
    acList: getACArray(state, jobId),
    dmList: getDMArray(state, jobId),
    currentUserId: state.controller.currentUser.get('id'),
  };
}

export default connect(mapStoreStateToProps)(UpdateApplicationCommissions);

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
