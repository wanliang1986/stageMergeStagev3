import React from 'react';
import { connect } from 'react-redux';
import {
  JOB_TYPES,
  USER_TYPES,
  userTypeForCommission as userTypeOptions,
} from '../../../../../constants/formOptions';
import { getTenantUserArray } from '../../../../../selectors/userSelector';

import Select from 'react-select';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

import Delete from '@material-ui/icons/Delete';
import Add from '@material-ui/icons/Add';

import FormReactSelectContainer from '../../../../../components/particial/FormReactSelectContainer';
import FormInput from '../../../../../components/particial/FormInput';

class StartCommissions extends React.Component {
  constructor(props) {
    super();
    this.state = {
      startCommissions: props.startCommissions.sort((a, b) => {
        return (a.userRole > b.userRole) - (a.userRole < b.userRole);
      }),
    };
  }

  componentDidMount() {
    const { edit, positionType, startCommissions } = this.props;
    if (edit) {
      let filteredStartCommissions = startCommissions || [];
      if (positionType === JOB_TYPES.Payrolling) {
        filteredStartCommissions = filteredStartCommissions.filter(
          (c) =>
            c.userRole === USER_TYPES.AM ||
            c.userRole === USER_TYPES.AccountCoordinator
        );
      }
      if (filteredStartCommissions.length === 0) {
        filteredStartCommissions = [
          { userRole: USER_TYPES.AM, percentage: 10 },
        ];
      }
      // console.log(filteredStartCommissions);
      this.setState({
        startCommissions: filteredStartCommissions.sort((a, b) => {
          return (a.userRole > b.userRole) - (a.userRole < b.userRole);
        }),
      });
    }
  }

  renderCommission = (commission, userRole, ownerSize) => {
    const { edit, userList, errorMessage, positionType } = this.props;
    const { startCommissions } = this.state;
    const index = startCommissions.indexOf(commission);

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
              options={
                positionType === JOB_TYPES.Payrolling
                  ? userTypeOptions.slice(0, 2)
                  : userTypeOptions
              }
              filterOptions={(options) => options.filter((o) => !o.disabled)}
              autoBlur
              clearable={false}
              onChange={(userRole) => {
                commission.userRole = userRole || commission.userRole;
                this.setState({ startCommissions: startCommissions.slice() });
              }}
              disabled={!edit || disableEdit}
            />
          </FormReactSelectContainer>
        </div>
        <div className="small-4 columns">
          <FormReactSelectContainer>
            <Select
              valueKey="id"
              labelKey="fullName"
              value={commission.userId}
              onChange={(userId) => {
                commission.userId = userId || commission.userId;
                this.setState({ startCommissions: startCommissions.slice() });
              }}
              simpleValue
              options={userList}
              filterOptions={(options, filterValue) => {
                // console.log(filterValue);
                return options.filter(
                  (o) =>
                    !o.disabled &&
                    _filterOption(o, filterValue, {
                      ignoreCase: true,
                      matchProp: 'any',
                      matchPos: 'any',
                      valueKey: 'id',
                      labelKey: 'fullName',
                    })
                );
              }}
              autoBlur
              clearable={false}
              disabled={!edit || disableEdit}
            />
          </FormReactSelectContainer>
        </div>

        <div className="small-2 columns">
          <FormInput
            name="commissions.commissionPct"
            value={commission.percentage}
            onChange={(e) => {
              commission.percentage = e.target.value;
              this.setState({ startCommissions: startCommissions.slice() });
            }}
            type="number"
            min={0}
            max={100}
            step={5}
            errorMessage={errorMessage.get('commissions') && true}
            disabled={!edit}
          />
        </div>
        <div className="small-2 columns horizontal-layout align-self-top">
          <IconButton
            size="small"
            disabled={startCommissions.length <= 1 + ownerSize || disableEdit}
            onClick={() => {
              this.setState({
                startCommissions: startCommissions.filter(
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
              startCommissions.splice(index, 0, {
                userId:
                  userList.find(
                    (u) => !u.disabled && u.id === commission.userId
                  ) && commission.userId,
                userRole,
                percentage: commission.percentage || 0,
              });
              this.setState({ startCommissions: startCommissions.slice() });
            }}
          >
            <Add />
          </IconButton>
        </div>
      </div>
    );
  };

  renderOwnerCommission = (commission) => {
    const { userList, errorMessage } = this.props;
    const { startCommissions } = this.state;
    const index = startCommissions.indexOf(commission);

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
            errorMessage={errorMessage.get('commissions') && true}
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
    const { startCommissions } = this.state;
    const { t, errorMessage, positionType } = this.props;
    const { nonOwnerCommission, owner } = (startCommissions || []).reduce(
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
    // console.log(startCommissions);
    return (
      <>
        <div className="row expanded">
          <div className="small-4 columns">
            <FormReactSelectContainer label={t('field:userRole')} />
          </div>
          <div className="small-4 columns">
            <FormReactSelectContainer label={t('field:userName')} />
          </div>
          <div className="small-4 columns">
            <FormReactSelectContainer label={t('field:commissionSplit')} />
          </div>
        </div>
        <input
          type="hidden"
          name="startCommissions"
          value={startCommissions ? JSON.stringify(startCommissions) : ''}
        />

        {nonOwnerCommission.map((commission) =>
          this.renderCommission(commission, commission.userRole, owner.length)
        )}
        {owner.map((commission) => this.renderOwnerCommission(commission))}

        {errorMessage.get('commissions') && (
          <div className="columns" style={{ marginTop: 4 }}>
            <div className="foundation">
              <span className="form-error is-visible">
                {t(errorMessage.get('commissions'))}
              </span>
            </div>
          </div>
        )}
        {errorMessage.get('commissionPct') && (
          <div className="columns" style={{ marginTop: 4 }}>
            <div className="foundation">
              <span className="form-error is-visible">
                {t(errorMessage.get('commissionPct'))}
              </span>
            </div>
          </div>
        )}
        {positionType === JOB_TYPES.Payrolling && (
          <div className="columns" style={{ marginBottom: '0.75rem' }}>
            <Typography variant="caption" color="textSecondary">
              Note: Account Managers will share 40% evenly and Account
              Coordinators will share 30% evenly. At this stage, we only record
              AM and AC user role, however this will not affect other user
              roles??? final GM. HR department will record, calculate and allocate
              all other user roles??? GM.
            </Typography>
          </div>
        )}
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userList: getTenantUserArray(state),
    currentUserId: state.controller.currentUser.get('id'),
  };
};
export default connect(mapStateToProps)(StartCommissions);

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
