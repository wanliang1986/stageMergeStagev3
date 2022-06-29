import React from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import {
  getSkipSubmitToAMUsers,
  updateSkipSubmitToAMUsers,
} from '../../../../apn-sdk';

import Divider from '@material-ui/core/Divider';
import Dialog from '@material-ui/core/Dialog';

import UserTable from '../../../components/Tables/UserTable';
import AddSkipSubmitToAMUsersForm from './AddSkipSubmitToAMUsersForm';

import PrimaryButton from '../../../components/particial/PrimaryButton';
import { getActiveTenantUserList } from '../../../selectors/userSelector';

const columns = [
  {
    colName: 'name',
    colWidth: 200,
    col: 'username',
    type: 'name',
    fixed: true,
    flexGrow: 1,
  },
  {
    colName: 'email',
    colWidth: 240,
    col: 'email',
    flexGrow: 1,
  },
];

class SkipSubmitToAMUsers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      data: Immutable.List(),
    };
  }

  componentDidMount() {
    this.fetchUsers();
  }

  fetchUsers = () => {
    const { companyId, users } = this.props;
    getSkipSubmitToAMUsers(companyId).then(({ response }) => {
      const data = Immutable.List(response.map(this._mapUserIdToUser(users)));
      this.setState({ data });
    });
  };

  updateUsers = (userIds) => {
    const { companyId, users } = this.props;
    updateSkipSubmitToAMUsers(companyId, userIds).then(({ response }) => {
      const data = Immutable.List(response.map(this._mapUserIdToUser(users)));
      this.setState({ data, open: false });
    });
  };
  _mapUserIdToUser =
    (users) =>
    ({ userId }) => {
      const user = users.get(String(userId));
      return Immutable.Map({
        id: user.get('id'),
        username: user.get('username'),
        email: user.get('email'),
        firstName: user.get('firstName'),
        lastName: user.get('lastName'),
      });
    };

  render() {
    const { open, data } = this.state;
    const { t, userOptions } = this.props;
    return (
      <div className="flex-child-auto flex-container flex-dir-column">
        <div>
          <div
            className="flex-container align-middle item-padding"
            style={{ height: 56 }}
          >
            <PrimaryButton onClick={() => this.setState({ open: true })}>
              {t('action:edit')}
            </PrimaryButton>
          </div>
          <Divider />
        </div>
        <div className="flex-child-auto" style={{ overflow: 'hidden' }}>
          <UserTable
            userList={data}
            // onDelete={canEdit && this.handleDeleteUserRelation}
            columns={columns}
          />
        </div>

        <Dialog open={this.state.open} fullWidth maxWidth="md">
          <AddSkipSubmitToAMUsersForm
            t={t}
            userList={data}
            userOptions={userOptions}
            handleClose={() => {
              this.setState({ open: false });
            }}
            onUpdateUsers={this.updateUsers}
          />
        </Dialog>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    users: state.model.users,
    userOptions: getActiveTenantUserList(state),
  };
};
export default connect(mapStateToProps)(SkipSubmitToAMUsers);
