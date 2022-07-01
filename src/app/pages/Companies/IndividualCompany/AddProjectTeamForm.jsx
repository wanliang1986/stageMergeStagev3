import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  upseartProgramTeam,
  updateProgramTeamUsers,
  createProjectTeam,
  uploadProjectTeam,
} from '../../../actions/clientActions';
import Immutable from 'immutable';
import { withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { formatUserName } from '../../../../utils';

import Select from 'react-select';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import SecondaryButton from '../../../components/particial/SecondaryButton';
import PrimaryButton from '../../../components/particial/PrimaryButton';
import FormInput from '../../../components/particial/FormInput';
import FormReactSelectContainer from '../../../components/particial/FormReactSelectContainer';
import { updateJobUserRelations } from '../../../actions/jobActions';
import Typography from '@material-ui/core/Typography';
import PotentialButton from '../../../components/particial/PotentialButton';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import { showErrorMessage } from '../../../actions';
import TeamMember from '../Form/TeamMember/TeamMember';
import UserSearchSelect from '../../../components/userSearchSelect';
import lodash from 'lodash';
import { user } from '../../../actions/schemas';

const styles = {
  chip: {
    margin: '0 12px 10px 0',
  },
  content: {
    height: 375,
    display: 'flex',
  },
  formContainer: {
    overflow: 'auto',
    '&>:first-child': {
      // borderRight: '1px solid #cacaca',
    },
  },
};

class AddTeamForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      processing: false,
      oldTeam: props.team,
      userOptions: props.leaderList.toJS(),
      users: Immutable.List(),

      leaderUserId: props.team.get('leaderUserId') || null,
      errorMessage: Immutable.Map(),
      keywords: '',
      indexList: props.userList.map((value, index) => index), //index of filteredList
    };
  }
  componentDidMount() {
    const { currentUser } = this.props;
    const { oldTeam } = this.state;
    this.setState({
      users: oldTeam.get('id')
        ? oldTeam.get('companyProjectTeamUsers')
        : Immutable.List(),
    });
  }

  onFilter2 = (q) => {
    const fields = ['username', 'firstName', 'lastName'];
    const query = new RegExp(q, 'i');
    const indexList = this.props.userList.reduce((indexList, user, index) => {
      let isMatch = fields.some((field) => query.test(user.get(field)));
      return isMatch ? indexList.push(index) : indexList;
    }, Immutable.List());

    this.setState({ indexList });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const teamForm = e.target;
    const { users, oldTeam } = this.state;
    const { dispatch, t, team, companyId } = this.props;
    const name = teamForm.name.value;
    const leaderUserId = teamForm.leaderUserId.value;
    let errorMessage = Immutable.Map();
    let hasPermissionSet = users.some((item, index) => {
      return item.get('permissions').size === 0;
    });
    if (hasPermissionSet) {
      errorMessage = errorMessage.set(
        'permissions',
        t('message:Permissionset must be selected')
      );
    }
    if (!name) {
      errorMessage = errorMessage.set(
        'name',
        t('message:Group Name is required')
      );
    }
    if (!leaderUserId) {
      errorMessage = errorMessage.set(
        'teamLeader',
        t('message:Team Leader is required')
      );
    }
    // console.log(users.toJS());
    const owner = users.filter((user) =>
      user.get('permissions').includes('Owner')
    );
    const pRecruiter = users.filter((user) =>
      user.get('permissions').includes('Admin')
    );

    if (owner.size === 0) {
      errorMessage = errorMessage.set(
        'Owner',
        t(`message:Account Manager is required. `)
      );
    }
    if (owner.size > 1) {
      errorMessage = errorMessage.set(
        'Owner',
        t(`message:Only 1 Account Manager is required. You set ${owner.size}. `)
      );
    }
    if (pRecruiter.size === 0) {
      errorMessage = errorMessage.set(
        'pRecruiter',
        t('message:Primary Recruiter is required. ')
      );
    }
    if (pRecruiter.size > 1) {
      errorMessage = errorMessage.set(
        'pRecruiter',
        t(
          `message:Only 1 Primary Recruiter is required. You set ${pRecruiter.size}. `
        )
      );
    }

    if (users.size === 0) {
      errorMessage = errorMessage.set(
        'users',
        t('message:Please select group members')
      );
    }
    if (errorMessage.size > 0) {
      return this.setState({ errorMessage });
    }
    this.setState({ processing: true });

    // (async () => {
    //   let newTeam = oldTeam;
    //   if (
    //     name !== oldTeam.get('name') ||
    //     leaderUserId !== oldTeam.get('leaderUserId')
    //   ) {
    //     let team = await dispatch(
    //       upseartProgramTeam({ name, leaderUserId, companyId }, oldTeam)
    //     );
    //     newTeam = Immutable.fromJS(team);
    //     this.setState({ oldTeam: team });
    //   }
    //   await dispatch(updateProgramTeamUsers(users, newTeam.get('id')));
    // })()
    //   .then(this.handleClose)
    //   .catch((err) => {
    //     this.setState({ processing: false });
    //     dispatch(showErrorMessage(err));
    //   });

    let obj = {
      name: name,
      leaderUserId: leaderUserId,
      companyId: companyId,
      companyProjectTeamUsers: users,
    };
    if (team.get('id')) {
      dispatch(uploadProjectTeam(obj, team.get('id')))
        .then(this.handleClose)
        .catch((err) => {
          this.setState({ processing: false });
          dispatch(showErrorMessage(err));
        });
    } else {
      dispatch(createProjectTeam(obj))
        .then(this.handleClose)
        .catch((err) => {
          this.setState({ processing: false });
          dispatch(showErrorMessage(err));
        });
    }
  };

  removeErrorMessage = (key) => {
    this.setState({
      errorMessage: this.state.errorMessage.delete(key),
    });
  };

  handleCheck = (miniUser) => {
    let { users } = this.state;
    const index = users.findIndex(
      (teamUser) => teamUser.get('userId') === miniUser.id
    );
    if (index !== -1) {
      users = users.remove(index);
    } else {
      users = users.push(this._createNewTeamUser(Immutable.Map(miniUser)));
    }
    this.setState({
      users,
      errorMessage: this.state.errorMessage.remove('users'),
    });
  };

  handlePermission = (value, index) => (e) => {
    let { users, errorMessage } = this.state;
    this.setState({
      users: users.updateIn(
        [index, 'permissions'],
        (permissions = Immutable.List()) => {
          let index = permissions.indexOf(value);
          if (index === -1) {
            return permissions.push(value);
          } else {
            return permissions.remove(index);
          }
        }
      ),
      errorMessage: errorMessage.clear(),
    });
  };
  handleRemove = (index) => () => {
    let { users } = this.state;
    this.setState({
      users: users.remove(index),
    });
  };

  _createNewTeamUser = (user, permission) => {
    const { oldTeam } = this.state;
    let oldTeamUser;
    if (oldTeam.get('companyProjectTeamUsers')) {
      oldTeamUser = oldTeam
        .get('companyProjectTeamUsers')
        .find((teamUser) => teamUser.get('userId') === user.get('id'));
    } else {
      oldTeamUser = oldTeam
        .get('users')
        .find((teamUser) => teamUser.get('userId') === user.get('id'));
    }
    return (
      oldTeamUser ||
      Immutable.Map({
        permissions: Immutable.List([permission || 'Apply_Candidate']),
        userId: user.get('id'),
        firstName: user.get('firstName'),
        lastName: user.get('lastName'),
        username: user.get('username'),
      })
    );
  };

  handleClearTeamUsers = () => {
    this.setState({
      users: Immutable.List([
        this._createNewTeamUser(this.props.currentUser, 'Owner'),
      ]),
    });
  };

  handleClose = () => {
    let { errorMessage } = this.state;
    this.setState({ errorMessage: errorMessage.clear() });
    this.props.onClose();
  };

  changeLeader = (leader) => {
    let { users } = this.state;
    let index = this.getUsersOwner(users);
    if (index !== null) {
      users = users.splice(index, 1);
      this.setState({
        users,
        leaderUserId: null,
      });
    }
    let _index = this.getUser(leader, users);
    if (_index !== null) {
      users = users.update(_index, 'permissions', (val) =>
        val.updateIn(['permissions'], (k) => k.push('Owner'))
      );
    } else {
      users = users.push(
        this._createNewTeamUser(Immutable.Map(leader), 'Owner')
      );
    }
    this.setState({
      users,
      leaderUserId: leader.id || this.state.leaderUserId,
    });
  };

  getUsersOwner = (users) => {
    let ownerIndex = null;
    users.forEach((item, index) => {
      let userSet = item.get('permissions').toJS();
      let type = userSet.some((val, key) => {
        return val === 'Owner';
      });
      if (type) {
        ownerIndex = index;
      }
    });
    return ownerIndex;
  };

  getUser = (leader, users) => {
    let userIndex = null;
    users.forEach((item, index) => {
      if (leader.id === item.get('userId')) {
        userIndex = index;
      }
    });
    return userIndex;
  };

  setCheckedNames = (users) => {
    let newUsers = users.map((item, index) => {
      return {
        ...item,
        fullName: item.firstName + ' ' + item.lastName,
      };
    });
    let names = [];
    newUsers.forEach((val, index) => {
      names.push(val.fullName);
    });
    return names;
  };
  setFullName = (users) => {
    let newUsers = users.map((item, index) => {
      return {
        ...item,
        fullName: item.firstName + ' ' + item.lastName,
      };
    });
    return newUsers;
  };

  render() {
    const { t, classes, team, userList, isAdmin } = this.props;
    const { indexList, users, leaderUserId, errorMessage } = this.state;
    const filteredUserList = indexList.map((index) => userList.get(index));
    return (
      <>
        <DialogTitle id="upsert-team-title">
          {team.get('id') ? t('common:Edit Team') : t('common:New Team')}
        </DialogTitle>

        <DialogContent className={classes.content}>
          <div
            className={clsx(
              'flex-child-auto flex-container',
              classes.formContainer
            )}
          >
            <form
              id="groupForm"
              style={{ width: '452px' }}
              onSubmit={this.handleSubmit}
              className="flex-container flex-dir-column container-padding"
            >
              <div>
                <FormInput
                  name="name"
                  readOnly={!isAdmin}
                  label={t('field:teamName')}
                  isRequired
                  key={team.get('id')}
                  defaultValue={team.get('name') || ''}
                  errorMessage={errorMessage.get('name')}
                  onBlur={() => this.removeErrorMessage('name')}
                />
              </div>
              <div>
                <FormReactSelectContainer
                  label={t('field:teamLeader')}
                  isRequired
                  errorMessage={errorMessage.get('teamLeader')}
                >
                  <Select
                    key={team.get('id')}
                    valueKey="id"
                    labelKey="fullName"
                    value={leaderUserId}
                    clearable={false}
                    onChange={(leaderUser) => {
                      this.changeLeader(leaderUser);
                    }}
                    options={this.state.userOptions}
                    // simpleValue
                    onBlur={() => this.removeErrorMessage('name')}
                  />
                </FormReactSelectContainer>
                <input
                  type="hidden"
                  name="leaderUserId"
                  value={leaderUserId || ''}
                />
              </div>
              <div>
                {/* <TeamMember
                  label={`Assign Team Member`}
                  checkedMember={users.toJS()}
                  teamMember={filteredUserList}
                  handleCheck={(user) => {
                    this.handleCheck(user);
                  }}
                /> */}
                <UserSearchSelect
                  label={`Assign Team Member`}
                  checkedMember={users ? this.setFullName(users.toJS()) : []}
                  checkedName={users ? this.setCheckedNames(users.toJS()) : []}
                  teamMember={filteredUserList}
                  handleCheck={(user) => {
                    this.handleCheck(user);
                  }}
                />
              </div>
            </form>
            {users && users.size > 0 ? (
              <div className="flex-container flex-dir-column container-padding ">
                <div
                  className="flex-child-auto"
                  style={{ overflow: 'auto', border: '1px solid #cdcdcd' }}
                >
                  <div style={{ width: 640 }}>
                    <div>
                      <div
                        className="flex-container"
                        style={{ padding: '8px 0' }}
                      >
                        <Typography
                          variant="subtitle2"
                          className="columns"
                          style={{ maxWidth: 130 }}
                        >
                          {/* {t('field:teamMembers')} */}
                        </Typography>
                        <div className="columns flex-container">
                          <Typography
                            variant="subtitle2"
                            className="columns small-2"
                          >
                            Account Manager
                          </Typography>
                          <Typography
                            variant="subtitle2"
                            className="columns small-2"
                          >
                            Account Coordinator
                          </Typography>
                          <Typography
                            variant="subtitle2"
                            className="columns small-2"
                          >
                            Delivery Manager
                          </Typography>
                          <Typography
                            variant="subtitle2"
                            className="columns small-2"
                          >
                            Recruiter
                          </Typography>
                          <Typography
                            variant="subtitle2"
                            className="columns small-2"
                          >
                            Primary Recruiter
                          </Typography>
                          {/* <div className="columns small-1">
                          <PotentialButton
                            size="small"
                            onClick={this.handleClearTeamUsers}
                          >
                            {t('action:clear')}
                          </PotentialButton> */}
                          {/*<IconButton*/}
                          {/*  onClick={this.handleUnassignAll}*/}
                          {/*  style={{ padding: 8 }}*/}
                          {/*>*/}
                          {/*  <DeleteIcon />*/}
                          {/*</IconButton>*/}
                          {/* </div> */}
                        </div>
                      </div>
                      <Divider />
                    </div>
                    <div>
                      {users.map((teamUser, index) => {
                        return (
                          <div key={index}>
                            <div className={'row expanded align-middle '}>
                              <div
                                className="columns flex-container align-middle"
                                style={{ maxWidth: 130 }}
                              >
                                <div className={'columns'}>
                                  {formatUserName(teamUser)}
                                </div>
                              </div>
                              <div className="columns flex-container">
                                <div className="columns small-2">
                                  <Checkbox
                                    checked={teamUser
                                      .get('permissions')
                                      .includes('Owner')}
                                    onChange={this.handlePermission(
                                      'Owner',
                                      index
                                    )}
                                    className={classes.checkbox}
                                    color="primary"
                                  />
                                </div>
                                <div className="columns small-2">
                                  <Checkbox
                                    checked={teamUser
                                      .get('permissions')
                                      .includes('Sales')}
                                    onChange={this.handlePermission(
                                      'Sales',
                                      index
                                    )}
                                    className={classes.checkbox}
                                    color="primary"
                                  />
                                </div>

                                <div className="columns small-2">
                                  <Checkbox
                                    checked={teamUser
                                      .get('permissions')
                                      .includes('Delivery_Manager')}
                                    onChange={this.handlePermission(
                                      'Delivery_Manager',
                                      index
                                    )}
                                    className={classes.checkbox}
                                    color="primary"
                                  />
                                </div>
                                <div className="columns small-2">
                                  <Checkbox
                                    checked={teamUser
                                      .get('permissions')
                                      .includes('Apply_Candidate')}
                                    onChange={this.handlePermission(
                                      'Apply_Candidate',
                                      index
                                    )}
                                    className={classes.checkbox}
                                    color="primary"
                                  />
                                </div>
                                <div className="columns small-2">
                                  <Checkbox
                                    checked={teamUser
                                      .get('permissions')
                                      .includes('Admin')}
                                    onChange={this.handlePermission(
                                      'Admin',
                                      index
                                    )}
                                    className={classes.checkbox}
                                    color="primary"
                                  />
                                </div>
                                {/* <div className="columns small-1 ">
                                <IconButton
                                  onClick={this.handleRemove(index)}
                                  style={{ padding: 8 }}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </div> */}
                              </div>
                            </div>
                            <Divider
                              style={{ marginRight: 1, marginLeft: 1 }}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="foundation" style={{ marginTop: '20px' }}>
                  <span className="form-error is-visible">
                    {errorMessage.get('users')}
                    {errorMessage.get('Owner')}
                    {errorMessage.get('pRecruiter')}
                    {errorMessage.get('permissions')}
                  </span>
                </div>
                {/* <form
                onSubmit={(e) => {
                  e.preventDefault();
                  this.onFilter2(e.target.keyword.value);
                }}
                style={{ width: 220 }}
              >
                <FormInput
                  name="keyword"
                  placeholder={t('common:search user')}
                  defaultValue={''}
                />
              </form>

              <div className="flex-child-auto" style={{ overflow: 'auto' }}>
                <FormGroup>
                  {filteredUserList.map((user, index) => {
                    return (
                      <FormControlLabel
                        key={index}
                        control={
                          <Checkbox
                            checked={
                              !!users.find(
                                (teamUser) =>
                                  teamUser.get('userId') === user.get('id')
                              )
                            }
                            onChange={(e, a) => {
                              this.handleCheck(user);
                            }}
                            color="primary"
                          />
                        }
                        label={formatUserName(user)}
                      />
                    );
                  })}
                </FormGroup>
              </div> */}
              </div>
            ) : null}
          </div>
        </DialogContent>
        <DialogActions>
          <SecondaryButton onClick={this.handleClose} size="small">
            {t('action:cancel')}
          </SecondaryButton>
          <PrimaryButton
            type="submit"
            size="small"
            disabled={!isAdmin}
            processing={this.state.processing}
            form="groupForm"
          >
            {t('action:save')}
          </PrimaryButton>
        </DialogActions>
      </>
    );
  }
}

AddTeamForm.propTypes = {
  team: PropTypes.instanceOf(Immutable.Map).isRequired,
  userList: PropTypes.instanceOf(Immutable.List).isRequired,
  leaderList: PropTypes.instanceOf(Immutable.List).isRequired,
  onClose: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

AddTeamForm.defaultProps = {
  team: Immutable.fromJS({
    users: [],
  }),
};
function mapStoreStateToProps(state) {
  return {
    currentUser: state.controller.currentUser,
  };
}
export default connect(mapStoreStateToProps)(withStyles(styles)(AddTeamForm));
