import React from 'react';
import Immutable from 'immutable';
import Select from 'react-select';
import { connect } from 'react-redux';
import FormReactSelectContainer from '../../particial/FormReactSelectContainer';
import FormInput from '../../particial/FormInput';
import IconButton from '@material-ui/core/IconButton';
import Delete from '@material-ui/icons/Delete';
import Add from '@material-ui/icons/Add';
import {
  getACArray,
  getDMArray,
  getActiveAMArray,
  getTenantUserArray,
} from '../../../selectors/userSelector';
import {
  currency as currencyOptions,
  USER_TYPES,
  userTypeForCommission as userTypeOptions,
} from '../../../constants/formOptions';
import { getTalentOwnerships } from '../../../actions/talentActions';
import { makeCancelable } from '../../../../utils';
import FormTitle from './formTitle';
import { showErrorMessage } from '../../../actions';
import NumberFormat from 'react-number-format';

class CommisionForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: Immutable.Map(),
      applicationCommissions: [],
      owner: [],
    };
    this.inputRef = React.createRef();
  }

  componentDidMount() {
    this.props.onRef(this);
    const { dispatch, application } = this.props;
    // 为了获取applicationList
    this.commissionTask = makeCancelable(
      dispatch(getTalentOwnerships(application.get('talentId')))
    );
    this.commissionTask.promise.then((ownership) => {
      const applicationCommissions = application
        .get('ipgKpiUsers')
        .toJS()
        .filter((ac) => ac.userRole !== USER_TYPES.Owner);
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
        // canEdit:
        //   !!applicationCommissions.find((c) => c.userId === currentUserId) ||
        //   this.state.canEdit,
      });
    });
  }

  renderCommission = (commission, userRole) => {
    const { errorMessage, applicationCommissions, loadingSourcer, loadingAM } =
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
              labelKey={'label2'}
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
                this.props.removeErrorMessage('commissions');
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
              valueKey={userValueKey}
              labelKey="fullName"
              value={commission.userId}
              onChange={(userId) => {
                commission.userId = userId || commission.userId;
                this.props.removeErrorMessage('commissions');
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
        <div className="small-2 columns">
          <FormReactSelectContainer>
            <NumberFormat
              thousandSeparator
              value={commission.percentage || ''}
              onValueChange={(values) => {
                commission.percentage = values.value;
                this.props.removeErrorMessage('commissions');
                this.setState({
                  applicationCommissions: applicationCommissions.slice(),
                });
              }}
              allowNegative={false}
            />
          </FormReactSelectContainer>
          {/* <FormInput
            name="commissions.commissionPct"
            value={commission.percentage || ''}
            onChange={(e) => {
              commission.percentage = e.target.value;
              this.props.removeErrorMessage('commissions');
              this.setState({
                applicationCommissions: applicationCommissions.slice(),
              });
            }}
            type="number"
            min={0}
            max={100}
            errorMessage={
              commission.userId && errorMessage.get('commissionPct') && true
            }
          /> */}
        </div>

        {/* 4.删除/新增一项 */}
        <div className="small-2 columns horizontal-layout align-self-top">
          {/* 删除 */}
          <IconButton
            size="small"
            disabled={applicationCommissions.length <= 1 || disableEdit}
            onClick={() => {
              this.props.removeErrorMessage('commissions');
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
              this.props.removeErrorMessage('commissions');
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

  render() {
    const { key } = this.props;
    const { errorMessage, applicationCommissions } = this.state;
    return (
      <div key={key}>
        <FormTitle title={'业绩分配'} />
        <div className="row expanded">
          <div className="small-4 columns">
            <FormReactSelectContainer label={'参与者'} />
          </div>
          <div className="small-4 columns">
            <FormReactSelectContainer label={'用户名'} />
          </div>
          <div className="small-2 columns">
            <FormReactSelectContainer label={'分成比例%'} />
          </div>
          <div className="small-2 columns">
            <FormReactSelectContainer label={'操作'} />
          </div>
        </div>
        {applicationCommissions && this.setCommissions()}
      </div>
    );
  }
}

function mapStoreStateToProps(state, { application }) {
  return {
    userList: getTenantUserArray(state),
    amList: getActiveAMArray(state, application.get('jobId')),
    acList: getACArray(state, application.get('jobId')),
    dmList: getDMArray(state, application.get('jobId')),
  };
}

export default connect(mapStoreStateToProps)(CommisionForm);

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
  sales.forEach(
    (c) => (c.percentage = c.percentage ? c.percentage : 10 / sales.length)
  );
  recruiter.forEach(
    (c) =>
      (c.percentage = c.percentage
        ? c.percentage
        : (55 - (hasOwner ? hasOwner : 1) * 5) / recruiter.length)
  );
  sourcer.forEach(
    (c) =>
      (c.percentage = c.percentage
        ? c.percentage
        : (35 - (hasOwner ? hasOwner : 1) * 5) / sourcer.length)
  );
  dm.forEach((c) => (c.percentage = c.percentage ? c.percentage : 0));
  ac.forEach((c) => (c.percentage = c.percentage ? c.percentage : 0));
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
