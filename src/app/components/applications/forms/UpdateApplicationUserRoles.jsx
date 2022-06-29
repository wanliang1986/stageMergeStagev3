import React from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import {
  userTypeForCommission as userTypeOptions,
  USER_TYPES,
} from '../../../constants/formOptions';
import { getApplicationCommissions } from '../../../../apn-sdk';
import { updateApplicationCommissions } from '../../../actions/applicationActions';
import { showErrorMessage } from '../../../actions';
import { getJob } from '../../../actions/jobActions';
import { makeCancelable } from '../../../../utils';
import {
  getACArray,
  getActiveAMArray,
  getDMArray,
  getTenantUserArray,
} from '../../../selectors/userSelector';
import Select from 'react-select';
import IconButton from '@material-ui/core/IconButton';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import Delete from '@material-ui/icons/Delete';
import Add from '@material-ui/icons/Add';

import PrimaryButton from '../../particial/PrimaryButton';
import SecondaryButton from '../../particial/SecondaryButton';
import FormReactSelectContainer from '../../particial/FormReactSelectContainer';

import Loading from '../../particial/Loading';

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
    this.commissionTask.promise
      .then(({ response }) => {
        response = response || [];
        this.setState({
          applicationCommissions:
            response.length > 0
              ? response.sort((a, b) => {
                  return (a.userRole > b.userRole) - (a.userRole < b.userRole);
                })
              : [{ userRole: USER_TYPES.AM }],
          fetching: false,
          canEdit:
            !!response.find((c) => c.userId === currentUserId) ||
            this.state.canEdit,
        });
      })
      .catch(() => {
        //handle old data structure
        this.setState({
          applicationCommissions: [{ userRole: USER_TYPES.AM }],
          fetching: false,
          canEdit: true,
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
    } = this.props;
    let { applicationCommissions } = this.state;
    const userOptions = {
      [USER_TYPES.Sourcer]: userList,
      [USER_TYPES.Recruiter]: userList,
      [USER_TYPES.AM]: amList,
      [USER_TYPES.DM]: dmList,
      [USER_TYPES.AccountCoordinator]: acList,
    };
    applicationCommissions = applicationCommissions
      .filter((ac) => ac.userRole !== USER_TYPES.Owner)
      .map((commission) => {
        console.log(commission.userRole);
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
    let errorMessage = this._validateForm(null, t, applicationCommissions);
    if (errorMessage) {
      return this.setState({ errorMessage });
    }
    this.setState({ processing: true, errorMessage: Immutable.Map() });

    dispatch(
      updateApplicationCommissions(
        applicationId,
        applicationCommissions.filter((ac) => ac.userRole !== USER_TYPES.Owner)
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

  _validateForm(form, t, commissions) {
    let errorMessage = Immutable.Map();
    const am = commissions.find((c) => c.userRole === USER_TYPES.AM);
    console.log(am);

    const commissionWithoutDuplicates = [
      ...new Set(commissions.map((c) => `${c.userRole}-${c.userId}`)),
    ];
    if (commissions.length > commissionWithoutDuplicates.length) {
      errorMessage = errorMessage.set(
        'commissions',
        t('message:There are duplicate commissions')
      );
    }
    if (!am) {
      errorMessage = errorMessage.set('commissions', t('message:amIsRequired'));
    }
    return errorMessage.size > 0 && errorMessage;
  }

  removeErrorMessage = (key) => {
    this.setState({
      errorMessage: this.state.errorMessage.delete(key),
    });
  };

  renderCommission = (commission, userRole, size) => {
    const { applicationCommissions, loadingSourcer, loadingAM } = this.state;

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
        <div className="small-5 columns">
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
        <div className="small-2 columns horizontal-layout align-self-top">
          <IconButton
            size="small"
            disabled={applicationCommissions.length <= 1 || disableEdit}
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
    const { nonOwnerCommission } = applicationCommissions.reduce(
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
        <DialogTitle>{t('common:Update Application User Roles')}</DialogTitle>
        <DialogContent style={{ overflow: 'visible' }}>
          {nonOwnerCommission.map((commission) => {
            return this.renderCommission(commission, commission.userRole);
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
    userList: getTenantUserArray(state),
    amList: getActiveAMArray(state, jobId),
    dmList: getDMArray(state, jobId),
    acList: getACArray(state, jobId),
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
