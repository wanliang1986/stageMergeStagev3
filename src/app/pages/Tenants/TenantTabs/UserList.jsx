import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { getUsers, getAllUsers } from '../../../actions/userActions';
import { getAllDivisionList } from '../../../actions/divisionActions';
import {
  updateUserProps,
  getTenantCredit,
} from '../../../actions/tenantActions';
import { sortList, getIndexList } from '../../../../utils';
import { assignUsersToJobsMulti } from '../../../../apn-sdk';
import getDivisionList from '../../../selectors/divisionSelector';
import { getTenantUserList } from '../../../selectors/userSelector';
import { showErrorMessage } from '../../../actions';

import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import Tooltip from '@material-ui/core/Tooltip';
import FilterIcon from '@material-ui/icons/FilterList';
import { AssignJobIcon } from '../../../components/Icons';

import UserTable from '../../../components/Tables/UserTable';
import Loading from '../../../components/particial/Loading';

import PrimaryButton from '../../../components/particial/PrimaryButton';
import CreateUserFormDialog from '../CreateUserFormDialog';
import UpdateUserFormDialog from '../UpdateUserFormDialog';
import AlertDialog from '../../../components/particial/AlertDialog';
import AssginJobs from '../AssignJobs';

const columns = [
  {
    colName: 'tenantActive',
    colWidth: 90,
    col: 'activated',
    fixed: true,
    type: 'active',
    sortable: true,
    disableSearch: true,
  },
  {
    colName: 'fullName',
    colWidth: 200,
    flexGrow: 2,
    col: 'fullName',
    fixed: true,
    sortable: true,
    type: 'nameButton',
  },
  {
    colName: 'Monthly Credits',
    colWidth: 200,
    type: 'credits',
    disableSearch: true,
  },
  {
    colName: 'Bulk Credits',
    colWidth: 200,
    type: 'bulkCredits',
    disableSearch: true,
  },
  {
    colName: 'id',
    colWidth: 160,
    flexGrow: 2,
    col: 'id',
  },
  {
    colName: 'tenantEmail',
    colWidth: 250,
    flexGrow: 2,
    col: 'email',
    sortable: true,
  },
  {
    colName: 'Office',
    colWidth: 160,
    flexGrow: 2,
    col: 'divisionName',
    sortable: true,
  },
  {
    colName: 'limitedUser',
    colWidth: 120,
    col: 'isLimitedUser',
    type: 'role',
    sortable: true,
    disableSearch: true,
  },
  {
    colName: 'Recruiter',
    colWidth: 120,
    col: 'isUser',
    type: 'role',
    sortable: true,
    disableSearch: true,
  },
  // {
  //   colName: 'Account Manager',
  //   colWidth: 120,
  //   col: 'isAM',
  //   type: 'role',
  //   sortable: true,
  //   disableSearch: true
  // },
  // {
  //   colName: 'Sales',
  //   colWidth: 120,
  //   col: 'isSales',
  //   type: 'role',
  //   sortable: true,
  //   disableSearch: true
  // },
  {
    colName: 'Primary Recruiter',
    colWidth: 120,
    col: 'isPrimRecruiter',
    type: 'role',
    sortable: true,
    disableSearch: true,
  },
  {
    colName: 'HR',
    colWidth: 120,
    col: 'isHR',
    type: 'role',
    sortable: true,
    disableSearch: true,
  },
  {
    colName: 'superuser',
    colWidth: 120,
    col: 'isSuperUser',
    type: 'role',
    sortable: true,
    disableSearch: true,
  },

  {
    colName: 'createdAt',
    colWidth: 160,
    col: 'createdDate',
    type: 'date',
    sortable: true,
    disableSearch: true,
  },
];
const columns2 = [
  {
    colName: 'fullName',
    colWidth: 220,
    flexGrow: 2,
    col: 'fullName',
    fixed: true,
    sortable: true,
    // type: 'nameButton'
  },
  {
    colName: 'tenantEmail',
    colWidth: 250,
    flexGrow: 2,
    col: 'email',
    sortable: true,
  },
  {
    colName: 'division',
    colWidth: 160,
    flexGrow: 2,
    col: 'divisionName',
    sortable: true,
  },
  {
    colName: 'createdAt',
    colWidth: 160,
    col: 'createdDate',
    type: 'date',
    sortable: true,
    disableSearch: true,
  },
];
const status = {};
const roleMap = {
  isUser: 'ROLE_USER',
  isLimitedUser: 'ROLE_LIMIT_USER',
  isSuperUser: 'ROLE_TENANT_ADMIN',
  isAM: 'ROLE_ACCOUNT_MANAGER',
  isSales: 'ROLE_SALES',
  isPrimRecruiter: 'ROLE_PRIMARY_RECRUITER',
  isHR: 'ROLE_HR',
};

function onScrollEnd(scrollLeft, scrollTop) {
  status.scrollLeft = scrollLeft;
  status.scrollTop = scrollTop;
}
class UserList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.fTimer = setTimeout(() => {
      this.setState({ show: true });
    }, 850);

    this.state = {
      searching: false,
      filteredIndex: getIndexList(
        props.userList,
        status.filters,
        status.colSortDirs
      ),
      filters: status.filters || Immutable.Map(),
      colSortDirs: status.colSortDirs || {},
      filterOpen: status.filterOpen || true,
      selected: null,
      createOpen: false,

      handleChangeUserProps: null,
      assignJobUserList: Immutable.Set(),
      assignJobOpen: false,
    };
    this.filteredUserList = Immutable.List();
  }

  // Fetch user info from server
  componentDidMount() {
    this.fetchUserList();
    this.props.dispatch(getAllDivisionList());
    if (this.props.isAdmin) {
      this.getTenantCredit();
    }
  }

  componentWillUnmount() {
    clearTimeout(this.fTimer);
    status.filters = this.state.filters;
    status.filterOpen = this.state.filterOpen;
    status.colSortDirs = this.state.colSortDirs;
  }

  static getDerivedStateFromProps(props, state) {
    if (props.userList && !props.userList.equals(state.preUserList)) {
      let columnKey = state.colSortDirs && Object.keys(state.colSortDirs)[0];
      return {
        preUserList: props.userList,
        filteredIndex: getIndexList(
          props.userList,
          state.filters,
          state.colSortDirs,
          columnKey !== 'activated' && 'activated'
        ),
      };
    }
    return null;
  }

  getTenantCredit = () => {
    const { tenantId } = this.props;
    this.props.dispatch(getTenantCredit(tenantId));
  };

  // Fetch all the user from the server.
  fetchUserList = () => {
    const { dispatch, isAdmin } = this.props;
    if (isAdmin) {
      dispatch(getUsers());
    } else {
      dispatch(getAllUsers());
    }
  };

  onFilter = (input) => {
    let filters = this.state.filters;

    let col = input.name;
    let query = input.value;
    if ((filters.get(col) || '') === query) {
      return;
    }
    if (!query) {
      filters = filters.remove(col);
    } else {
      filters = filters.set(col, query);
    }

    this.setState({
      filters,
      filteredIndex: getIndexList(
        this.props.userList,
        filters,
        this.state.colSortDirs
      ),
    });
  };

  onSortChange = (columnKey, sortDir) => {
    let filteredIndex;

    filteredIndex = sortDir
      ? sortList(
          this.state.filteredIndex,
          this.props.userList,
          columnKey,
          sortDir,
          columnKey !== 'activated' && 'activated'
        )
      : getIndexList(this.props.userList, this.state.filters);

    this.setState({
      filteredIndex,
      colSortDirs: {
        [columnKey]: sortDir,
      },
    });
  };

  handleOpenUpdateForm = (selected) => {
    this.setState({ selected });
  };

  handleCloseCreateDialog = () => {
    this.setState({ createOpen: false });
  };

  handleCloseUpdateDialog = () => {
    this.setState({ selected: null });
  };

  //判断inActive用户时，当前用户是否是列表中最后一个super user

  isLastSuperUser = (user) => {
    const { userList } = this.props;
    let superUserList = userList.filter((item, index) => {
      return item.get('isSuperUser') === true && item.get('activated') === true;
    });
    if (
      superUserList.size === 1 &&
      user.get('id') === superUserList.getIn([0, 'id'])
    ) {
      return true;
    }
    return false;
  };

  handleActiveChange = (user) => {
    const { dispatch } = this.props;
    let type = this.isLastSuperUser(user);
    if (type) {
      dispatch(showErrorMessage('You must keep a super user account'));
      return;
    } else {
      const oldUser = {
        activated: user.get('activated'),
        email: user.get('email'),
        id: user.get('id'),
      };
      const newUser = {
        // authorities: authorities,
        activated: !user.get('activated'),
        email: user.get('email'),
        id: user.get('id'),
        usedMonthlyCredit: user.get('usedMonthlyCredit'),
        usedBulkCredit: user.get('usedBulkCredit'),
      };
      this.setState({
        handleChangeUserProps: () =>
          dispatch(updateUserProps(oldUser, newUser, user.get('id'))).then(
            (res) => {
              this.handleCancelChangeUserProps();
              this.getTenantCredit();
            }
          ),
      });
    }
  };

  handleRoleChange = (rowIndex, role) => {
    const user = this.filteredUserList.get(rowIndex);
    const { dispatch } = this.props;
    let type = this.isLastSuperUser(user);
    if (type) {
      dispatch(showErrorMessage('You must keep a super user account'));
      return;
    } else {
      const newRole = Immutable.Map({
        name: roleMap[role],
      });
      const oldAuthorities = user.get('authorities');
      const index = oldAuthorities.indexOf(newRole);
      const newAuthorities =
        index === -1
          ? oldAuthorities.push(newRole)
          : oldAuthorities.remove(index);

      const oldUser = {
        authorities: oldAuthorities,
        email: user.get('email'),
        id: user.get('id'),
      };
      const newUser = {
        authorities: newAuthorities,
        email: user.get('email'),
        id: user.get('id'),
      };

      this.setState({
        handleChangeUserProps: () => {
          this.handleCancelChangeUserProps();
          dispatch(updateUserProps(oldUser, newUser, user.get('id')));
        },
      });
    }
  };

  handleCancelChangeUserProps = (e) => {
    this.setState({ handleChangeUserProps: null });
  };

  onUsersSelected = (userId) => {
    let userList = this.state.assignJobUserList;
    if (userList.includes(userId)) {
      userList = userList.delete(userId);
    } else {
      userList = userList.add(userId);
    }
    this.setState({ assignJobUserList: userList });
  };

  assignJobsToUsers = (jobList) => {
    let param = {
      userId: this.state.assignJobUserList,
      jobId: jobList,
      permissionSet: ['Apply_Candidate'],
    };

    this.setState({ assigning: true });

    assignUsersToJobsMulti(param)
      .then((resp) => {
        console.log(resp);
        //clear the selected list
        this.handleCloseAssignJobs();
      })
      .catch((err) => {
        console.log('###:', err);
      })
      .finally(() => {
        this.setState({ assigning: false });
      });
  };

  handleOpenAssignJobs = () => {
    this.setState({ assignJobOpen: true });
  };
  handleCloseAssignJobs = () => {
    this.setState({ assignJobOpen: false, assignJobUserList: Immutable.Set() });
  };

  isSelected = (userId) => this.state.assignJobUserList.includes(userId);

  render() {
    const {
      userList,
      isAdmin,
      tenant,
      availableCredit,
      availableBulkCredit,
      totalMonthlyCredit,
      nextMonthAvailableCredit,
      ...props
    } = this.props;
    const {
      filters,
      filterOpen,
      filteredIndex,
      colSortDirs,
      selected,
      handleChangeUserProps,
      assignJobUserList,
    } = this.state;
    // console.log('^^^^^^^^^^^^', filteredIndex.toJS(), colSortDirs);

    const filteredUserList = filteredIndex.map((index) => userList.get(index));
    if (!this.filteredUserList.equals(filteredUserList)) {
      this.filteredUserList = filteredUserList;
    }
    return (
      <div className="flex-child-auto flex-container flex-dir-column">
        <div>
          <div
            className="flex-container align-middle item-padding"
            style={{ height: 56 }}
          >
            {isAdmin && (
              <div className="item-padding">
                <PrimaryButton
                  onClick={() => this.setState({ createOpen: true })}
                  style={{ minWidth: 120 }}
                >
                  {props.t('action:create')}
                </PrimaryButton>
              </div>
            )}
            <IconButton
              onClick={() => this.setState({ filterOpen: !filterOpen })}
              color={filterOpen ? 'primary' : 'default'}
            >
              <FilterIcon />
            </IconButton>
            <Tooltip title="Assign Jobs">
              <div>
                <IconButton
                  disabled={assignJobUserList.size === 0}
                  onClick={this.handleOpenAssignJobs}
                >
                  <AssignJobIcon />
                </IconButton>
              </div>
            </Tooltip>

            <Typography variant="subtitle1" className={'item-padding'}>
              Active User:{' '}
              {userList.filter((user) => user.get('activated')).size}
            </Typography>
            <Typography variant="subtitle1" className={'item-padding'}>
              Total User: {userList.size}
            </Typography>
          </div>
          <Divider />
        </div>

        {this.state.show ? (
          <div
            className="flex-child-auto"
            style={{ overflow: 'hidden', position: 'relative' }}
          >
            <UserTable
              userList={this.filteredUserList}
              onScrollEnd={onScrollEnd}
              scrollLeft={status.scrollLeft}
              scrollTop={status.scrollTop}
              filters={filters}
              columns={isAdmin ? columns : columns2}
              onFilter={this.onFilter}
              filterOpen={filterOpen}
              colSortDirs={colSortDirs}
              onSortChange={this.onSortChange}
              onActiveChange={this.handleActiveChange}
              onRoleChange={this.handleRoleChange}
              onSelect={this.onUsersSelected}
              selected={assignJobUserList}
              onEdit={this.handleOpenUpdateForm}
            />
          </div>
        ) : (
          <Loading />
        )}
        <Dialog
          onClose={this.handleCloseCreateDialog}
          maxWidth="sm"
          open={this.state.createOpen}
        >
          <CreateUserFormDialog
            {...props}
            tenant={tenant}
            availableCredit={availableCredit}
            availableBulkCredit={availableBulkCredit}
            onClose={this.handleCloseCreateDialog}
          />
        </Dialog>
        <Dialog
          onClose={this.handleCloseUpdateDialog}
          maxWidth="sm"
          open={selected !== null}
        >
          <UpdateUserFormDialog
            onClose={this.handleCloseUpdateDialog}
            availableCredit={availableCredit}
            totalMonthlyCredit={totalMonthlyCredit}
            availableBulkCredit={availableBulkCredit}
            nextMonthAvailableCredit={nextMonthAvailableCredit}
            tenant={tenant}
            userInfo={filteredUserList.get(selected)}
            {...props}
          />
        </Dialog>

        <AlertDialog
          onOK={handleChangeUserProps}
          onCancel={this.handleCancelChangeUserProps}
          title={props.t('common:Confirm Change')}
          content={'Do you wish to save this change?'}
          okLabel="Yes"
          cancelLabel="No"
        />

        <Dialog
          open={this.state.assignJobOpen}
          fullWidth
          maxWidth="md"
          disableEnforceFocus
        >
          <AssginJobs
            onSave={this.assignJobsToUsers}
            onClose={this.handleCloseAssignJobs}
            assigning={this.state.assigning}
            {...props}
          />
        </Dialog>
      </div>
    );
  }
}

UserList.propTypes = {
  t: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  userList: PropTypes.instanceOf(Immutable.List).isRequired,
};

function mapStoreStateToProps(state) {
  const authorities = state.controller.currentUser.get('authorities');
  const tenantId = state.controller.currentUser.get('tenantId');
  const tenant = state.model.tenants.get(tenantId.toString());
  const availableCredit = state.model.tenantCredit.get(
    'availableMonthlyCredit'
  );
  const availableBulkCredit = state.model.tenantCredit.get(
    'availableBulkCredit'
  );
  const totalMonthlyCredit = state.model.tenantCredit.get('totalMonthlyCredit');
  const nextMonthAvailableCredit = state.model.tenantCredit.get(
    'nextMonthAvailableCredit'
  );
  const isAdmin =
    !!authorities &&
    (authorities.includes(Immutable.Map({ name: 'ROLE_TENANT_ADMIN' })) ||
      authorities.includes(Immutable.Map({ name: 'ROLE_HR' })));

  return {
    userList: getTenantUserList(state),
    divisionList: getDivisionList(state),
    availableCredit,
    availableBulkCredit,
    totalMonthlyCredit,
    nextMonthAvailableCredit,
    isAdmin,
    tenant: tenant,
    tenantId: tenantId,
  };
}

export default connect(mapStoreStateToProps)(UserList);
