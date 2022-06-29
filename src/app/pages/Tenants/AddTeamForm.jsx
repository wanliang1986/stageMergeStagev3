import React from 'react';
import PropTypes from 'prop-types';
import { upseartTeam, updateTeamUsers } from '../../actions/teamActions';
import Immutable from 'immutable';
import { withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { formatUserName } from '../../../utils';

import Select from 'react-select';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import Chip from '@material-ui/core/Chip';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import SecondaryButton from '../../components/particial/SecondaryButton';
import PrimaryButton from '../../components/particial/PrimaryButton';
import FormInput from '../../components/particial/FormInput';
import FormReactSelectContainer from '../../components/particial/FormReactSelectContainer';

const styles = {
  chip: {
    margin: '0 12px 10px 0',
  },
  content: {
    height: 500,
    display: 'flex',
  },
  formContainer: {
    border: '1px solid #cacaca',
    '&>:first-child': {
      borderRight: '1px solid #cacaca',
    },
  },
};

class AddTeamForm extends React.Component {
  constructor(props) {
    super(props);
    console.log(props.leaderList.toJS());
    this.state = {
      userOptions: props.userList.toJS(),
      users: props.team.get('users'),
      leaderUserId: props.team.get('leaderUserId'),
      errorMessage: Immutable.Map(),
      keywords: '',
      indexList: props.userList.map((value, index) => index), //index of filteredList
    };
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
    const { users } = this.state;
    const { dispatch, t, team } = this.props;
    const name = teamForm.name.value;
    const leaderUserId = teamForm.leaderUserId.value;
    let errorMessage = Immutable.Map();

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
    if (users.size === 0) {
      errorMessage = errorMessage.set(
        'users',
        t('message:Please select group members')
      );
    }
    if (errorMessage.size > 0) {
      return this.setState({ errorMessage });
    }
    if (
      name !== team.get('name') ||
      leaderUserId !== team.get('leaderUserId')
    ) {
      dispatch(upseartTeam({ name, leaderUserId }, team)).then((teamJSON) => {
        if (teamJSON) {
          if (!team.get('users').toSet().equals(users.toSet())) {
            dispatch(
              updateTeamUsers(
                users.map((user) => user.get('id')),
                teamJSON.id
              )
            ).then(this.handleClose);
          } else {
            this.handleClose();
          }
        }
      });
    } else if (!team.get('users').toSet().equals(users.toSet())) {
      dispatch(
        updateTeamUsers(
          users.map((user) => user.get('id')),
          team.get('id')
        )
      ).then(this.handleClose);
    } else {
      this.handleClose();
    }
  };

  removeErrorMessage = (key) => {
    this.setState({
      errorMessage: this.state.errorMessage.delete(key),
    });
  };

  handleCheck = (miniUser) => {
    let users = this.state.users;
    const index = users.indexOf(miniUser);

    if (index !== -1) {
      users = users.remove(index);
    } else {
      users = users.push(miniUser);
    }
    if (this.state.errorMessage.get('users')) {
      this.setState({
        users,
        errorMessage: this.state.errorMessage.remove('users'),
      });
    } else {
      this.setState({ users });
    }
  };

  handleClose = () => {
    this.setState({ errorMessage: Immutable.Map() });
    this.props.onClose();
  };

  render() {
    const { t, classes, team, userList, isAdmin } = this.props;
    const { indexList, users, leaderUserId, errorMessage } = this.state;
    const filteredUserList = indexList.map((index) => userList.get(index));

    return (
      <>
        <DialogTitle>
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
              onSubmit={this.handleSubmit}
              className="small-8 flex-container flex-dir-column container-padding"
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
                    onChange={(leaderUserId) =>
                      this.setState({
                        leaderUserId: leaderUserId || this.state.leaderUserId,
                      })
                    }
                    options={this.state.userOptions}
                    simpleValue
                    readOnly={!isAdmin}
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
                <div className="foundation">
                  <label>{t('field:teamMembers')}</label>
                </div>
                <div className="foundation">
                  <span className="form-error is-visible">
                    {errorMessage.get('users')}
                  </span>
                </div>
              </div>

              <div
                className="flex-container"
                style={{ overflowY: 'auto', flexWrap: 'wrap' }}
              >
                {users.map((miniUser, index) => (
                  <Chip
                    key={index}
                    label={formatUserName(miniUser)}
                    onDelete={
                      isAdmin
                        ? (e, a) => {
                            this.handleCheck(miniUser);
                          }
                        : null
                    }
                    className={classes.chip}
                  />
                ))}
              </div>
            </form>
            {isAdmin && (
              <div className="small-4 flex-container flex-dir-column container-padding ">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    this.onFilter2(e.target.keyword.value);
                  }}
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
                      const miniUser = Immutable.Map({
                        id: user.get('id'),
                        username: user.get('username'),
                        email: user.get('email'),
                        firstName: user.get('firstName'),
                        lastName: user.get('lastName'),
                      });
                      return (
                        <FormControlLabel
                          key={index}
                          control={
                            <Checkbox
                              checked={users.includes(miniUser)}
                              onChange={(e, a) => {
                                this.handleCheck(miniUser);
                              }}
                              color="primary"
                            />
                          }
                          label={formatUserName(user)}
                        />
                      );
                    })}
                  </FormGroup>
                </div>
              </div>
            )}
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

export default withStyles(styles)(AddTeamForm);
