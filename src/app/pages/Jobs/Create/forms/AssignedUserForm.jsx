import React from 'react';
import { connect } from 'react-redux';

import FormReactSelectContainer from '../../../../components/particial/FormReactSelectContainer';
import { getActiveTenantUserArray } from '../../../../selectors/userSelector';
import Select from 'react-select';
import IconButton from '@material-ui/core/IconButton';
import Delete from '@material-ui/icons/Delete';
import Add from '@material-ui/icons/AddCircle';
import { JOB_TYPES, TEAM_PERMISSIONS } from '../../../../constants/formOptions';

const permissionOptions = [
  {
    value: TEAM_PERMISSIONS.AccountManager,
    label: 'Account Manager',
  },
  {
    value: TEAM_PERMISSIONS.AccountCoordinator,
    label: 'Account Coordinator',
  },
  {
    value: TEAM_PERMISSIONS.DeliveryManager,
    label: 'Delivery Manager',
  },
  {
    value: TEAM_PERMISSIONS.PrimaryRecruiter,
    label: 'Primary Recruiter',
  },
  {
    value: TEAM_PERMISSIONS.Recruiter,
    label: 'Recruiter',
  },
];
const payRollingPermissionOptions = [
  {
    value: TEAM_PERMISSIONS.AccountManager,
    label: 'Account Manager',
  },
  {
    value: TEAM_PERMISSIONS.AccountCoordinator,
    label: 'Account Coordinator',
  },
];

const userRoles = {
  [JOB_TYPES.FullTime]: permissionOptions,
  [JOB_TYPES.Contract]: permissionOptions,
  [JOB_TYPES.Payrolling]: payRollingPermissionOptions,
};

class AssignedUserForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingUser: false,
    };
  }

  renderUser = (user, index) => {
    const [userPermission] = user.permissionSet;
    const { jobType, assignedUsers, userList, onUpdateUser } = this.props;
    return (
      <div key={index} className="row expanded">
        <div className="small-6 columns">
          <FormReactSelectContainer>
            <Select
              value={userPermission}
              simpleValue
              options={userRoles[jobType]}
              onChange={(permission) => {
                user.permissionSet = permission
                  ? [permission]
                  : user.permissionSet;

                onUpdateUser(assignedUsers.slice());
              }}
              clearable={false}
              disabled={index === 0}
            />
          </FormReactSelectContainer>
        </div>
        <div className="small-6 flex-container">
          <div className="columns">
            <FormReactSelectContainer>
              <Select
                valueKey={'id'}
                labelKey={'fullName'}
                value={user.userId}
                simpleValue
                options={userList}
                onChange={(userId) => {
                  user.userId = userId || user.userId;
                  onUpdateUser(assignedUsers.slice());
                }}
                clearable={false}
              />
            </FormReactSelectContainer>
          </div>
          <div>
            {index === 0 ? (
              <IconButton
                size="small"
                onClick={() => {
                  assignedUsers.splice(1, 0, {
                    permissionSet: [],
                  });
                  onUpdateUser(assignedUsers.slice());
                }}
              >
                <Add />
              </IconButton>
            ) : (
              <IconButton
                size="small"
                onClick={() =>
                  onUpdateUser(assignedUsers.filter((c) => c !== user))
                }
              >
                <Delete />
              </IconButton>
            )}
          </div>
        </div>
      </div>
    );
  };

  render() {
    const { t, assignedUsers, errorMessage } = this.props;
    return (
      <div>
        <div className="row expanded">
          <div className="small-12 columns">
            <FormReactSelectContainer label={t('field:assignedUsers')} />
          </div>
        </div>
        {assignedUsers.map(this.renderUser)}
        <div className="row expanded">
          <div className="columns">
            <div
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#cc4b37',
              }}
            >
              {errorMessage.get('assignedUser')}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStoreStateToProps(state) {
  return {
    userList: getActiveTenantUserArray(state),
  };
}

export default connect(mapStoreStateToProps)(AssignedUserForm);
