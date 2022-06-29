import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import clsx from 'clsx';
import { updateJobUserRelations } from '../../../actions/jobActions';
import { getActiveTenantUserList } from '../../../selectors/userSelector';
import { getProgramTeamList as selectProgramTeamList } from '../../../selectors/teamSelector';
import withStyles from '@material-ui/core/styles/withStyles';
import { getIndexList, formatUserName } from '../../../../utils';
import { getProgramTeamList } from '../../../actions/clientActions';

import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Checkbox from '@material-ui/core/Checkbox';
import Collapse from '@material-ui/core/Collapse';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';

import PrimaryButton from '../../../components/particial/PrimaryButton';
import SecondaryButton from '../../../components/particial/SecondaryButton';
import PotentialButton from '../../../components/particial/PotentialButton';
import FormInput from '../../../components/particial/FormInput';
import SwipeableViews from '../../../components/particial/SwipeableViews';

const styles = (theme) => ({
  container: {
    padding: '8px 10px',
  },
  root: {
    overflow: 'hidden',
    padding: 24,
  },
  contentContainer: {
    border: `1px solid #cacaca`,
    display: 'flex',
    flex: '0 1 auto',
    overflow: 'hidden',
  },
  leftChild: {
    display: 'flex',
    flexDirection: 'column',
    flex: '7 1 70%',
    borderRight: `1px solid #cacaca`,
  },
  rightChild: {
    display: 'flex',
    flexDirection: 'column',
    flex: '3 1 30%',
    overflow: 'hidden',
  },
  errorMessage: {
    fontSize: '0.75rem',
    fontWeight: 700,
    color: '#cc4b37',
  },
  checkbox: {
    padding: 10,
  },
  expand: {
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
    marginLeft: 'auto',
    marginRight: 0,
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
});

class AssignUsers extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      indexList: props.userList.map((value, index) => index), //index of filteredList
      filters: Immutable.Map(),
      filterOpen: true,
      colSortDirs: {},
      selectedUserRelationList: props.userRelationList,
      q: '',
      errorMessage: Immutable.Map(),

      selectMode: 0, //0:all,1:team
      processing: false,
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (!nextProps.userList.equals(this.props.userList)) {
      this.setState({
        indexList: getIndexList(
          nextProps.userList,
          this.state.filters,
          this.state.colSortDirs
        ),
      });
    }
  }

  fetchData() {
    const { dispatch, companyId } = this.props;
    dispatch(getProgramTeamList(companyId));
  }

  onFilter2 = (q) => {
    const indexList = findMultiIndex(q, this.props.userList, [
      'username',
      'firstName',
      'lastName',
    ]);
    this.setState({ indexList });
  };

  handleUpdateJobUserRelation = () => {
    const { dispatch, jobId, handleClose } = this.props;
    const { selectedUserRelationList, errorMessage } = this.state;

    const owner = selectedUserRelationList.filter((user) =>
      user.get('permissionSet').includes('Owner')
    );
    const pRecruiter = selectedUserRelationList.filter((user) =>
      user.get('permissionSet').includes('Admin')
    );

    if (owner.size === 0) {
      return this.setState({
        errorMessage: errorMessage.set('owner', 'Owner is required.'),
      });
    }
    if (owner.size > 1) {
      return this.setState({
        errorMessage: errorMessage.set(
          'owner',
          `Only 1 Owner is required. You set ${owner.size}`
        ),
      });
    }
    if (pRecruiter.size === 0) {
      return this.setState({
        errorMessage: errorMessage.set(
          'pRecruiter',
          'Primary Recruiter is required.'
        ),
      });
    }
    if (pRecruiter.size > 1) {
      return this.setState({
        errorMessage: errorMessage.set(
          'pRecruiter',
          `Only 1 Primary Recruiter is required. You set ${pRecruiter.size}`
        ),
      });
    }
    this.setState({ processing: true });

    dispatch(updateJobUserRelations(selectedUserRelationList, jobId))
      .then(handleClose)
      .catch(() => this.setState({ processing: false }));
  };

  _formatName = (user) => {
    return formatUserName(user);
  };

  handleCheck = (user, index) => {
    let { selectedUserRelationList, errorMessage } = this.state;
    let { jobId, userRelationList } = this.props;
    console.log(userRelationList);
    if (index === -1) {
      let newUserRelation = this._createNewUserRelation(
        userRelationList,
        user,
        jobId
      );
      this.setState({
        selectedUserRelationList:
          selectedUserRelationList.push(newUserRelation),
        errorMessage: errorMessage.clear(),
      });
    } else {
      this.setState({
        selectedUserRelationList: selectedUserRelationList.remove(index),
        errorMessage: errorMessage.clear(),
      });
    }
  };

  handleCheckTeamUser = (teamUser, index) => {
    let { selectedUserRelationList, errorMessage } = this.state;
    let { jobId } = this.props;

    if (index === -1) {
      this.setState({
        selectedUserRelationList: selectedUserRelationList.push(
          teamUser.set('jobId', jobId).remove('id')
        ),
        errorMessage: errorMessage.clear(),
      });
    } else {
      this.setState({
        selectedUserRelationList: selectedUserRelationList.remove(index),
        errorMessage: errorMessage.clear(),
      });
    }
  };

  handleSelectGroup = (team) => () => {
    let { selectedUserRelationList, errorMessage } = this.state;
    let { jobId } = this.props;
    let users = team.get('users');
    users.forEach((teamUser) => {
      const exist = selectedUserRelationList.findIndex(
        (userRelation) => userRelation.get('userId') === teamUser.get('userId')
      );
      if (exist === -1) {
        selectedUserRelationList = selectedUserRelationList.push(
          teamUser.set('jobId', jobId).remove('id')
        );
      }
    });
    this.setState({
      selectedUserRelationList,
      errorMessage: errorMessage.clear(),
    });
  };
  handleUnSelectGroup = (team) => () => {
    let { selectedUserRelationList, errorMessage } = this.state;
    let users = team.get('users');
    users.forEach((teamUser) => {
      const exist = selectedUserRelationList.findIndex(
        (userRelation) => userRelation.get('userId') === teamUser.get('userId')
      );
      if (exist !== -1) {
        selectedUserRelationList = selectedUserRelationList.splice(exist, 1);
      }
    });
    this.setState({
      selectedUserRelationList,
      errorMessage: errorMessage.clear(),
    });
  };

  handlePermission = (value, index) => (e) => {
    let { selectedUserRelationList, errorMessage } = this.state;
    this.setState({
      selectedUserRelationList: selectedUserRelationList.updateIn(
        [index, 'permissionSet'],
        (permissionSet = Immutable.List()) => {
          let index = permissionSet.indexOf(value);
          if (index === -1) {
            return permissionSet.push(value);
          } else {
            return permissionSet.remove(index);
          }
        }
      ),
      errorMessage: errorMessage.clear(),
    });
  };

  handleRemove = (index) => () => {
    let { selectedUserRelationList } = this.state;
    this.setState({
      selectedUserRelationList: selectedUserRelationList.remove(index),
    });
  };

  _createNewUserRelation = (oldUserRelationList, user, jobId) => {
    return (
      oldUserRelationList.find(
        (userRelation) => userRelation.get('userId') === user.get('id')
      ) ||
      Immutable.fromJS({
        permissionSet: Immutable.List(['Apply_Candidate']),
        userId: user.get('id'),
        firstName: user.get('firstName'),
        lastName: user.get('lastName'),
        username: user.get('username'),
        jobId,
      })
    );
  };

  handleUnassignAll = () => {
    const { userRelationList } = this.props;
    const selectedUserRelationList = userRelationList.filter((userRelation) =>
      userRelation.get('permissionSet').includes('Owner')
    );
    this.setState({ selectedUserRelationList });
  };

  render() {
    const { t, classes, userList, teamList, handleClose, isOwner } = this.props;
    const { indexList, errorMessage, selectedUserRelationList, selectMode } =
      this.state;
    const filteredUserList = indexList.map((index) => userList.get(index));

    return (
      <div
        className={clsx(
          'flex-child-auto flex-container flex-dir-column vertical-layout',
          classes.root
        )}
      >
        <Typography variant="h5">{t('common:manageUsers')}</Typography>
        <div className={classes.contentContainer}>
          <div className={classes.leftChild}>
            <div>
              <div
                className="flex-container  align-justify align-middle item-padding"
                style={{ height: 48 }}
              >
                <Typography variant="subtitle2">
                  {t('common:manageAssignedUsers')}
                </Typography>
                <PotentialButton size="small" onClick={this.handleUnassignAll}>
                  {t('action:unassignAll')}
                </PotentialButton>
              </div>
              <Divider />
            </div>
            <div
              className={clsx(classes.errorMessage, {
                'container-padding': errorMessage.size,
              })}
            >
              {errorMessage.get('owner')}
              {errorMessage.get('pRecruiter')}
            </div>

            <div
              className="flex-child-auto flex-container flex-dir-column"
              style={{ overflow: 'auto' }}
            >
              <div>
                <div className="flex-container" style={{ padding: '8px 0' }}>
                  <div className="columns" style={{ maxWidth: 130 }} />
                  <div className="columns flex-container">
                    <Typography variant="subtitle2" className="columns small-2">
                      Account Manager
                    </Typography>
                    <Typography variant="subtitle2" className="columns small-2">
                      Account Coordinator
                    </Typography>
                    <Typography variant="subtitle2" className="columns small-2">
                      Delivery Manager
                    </Typography>
                    <Typography variant="subtitle2" className="columns small-2">
                      Recruiter
                    </Typography>
                    <Typography variant="subtitle2" className="columns small-2">
                      Primary Recruiter
                    </Typography>
                  </div>
                </div>
                <Divider />
              </div>
              <div
                className="flex-child-auto"
                style={{ overflowY: 'overlay', overflowX: 'hidden' }}
              >
                {selectedUserRelationList.map((userRelation, index) => {
                  return (
                    <div key={index}>
                      <div className={'row expanded align-middle '}>
                        <div
                          className="columns flex-container align-middle"
                          style={{ maxWidth: 130 }}
                        >
                          <div className={'columns'}>
                            {this._formatName(userRelation)}
                          </div>
                        </div>
                        <div className="columns flex-container">
                          <div className="columns small-2">
                            <Checkbox
                              checked={userRelation
                                .get('permissionSet')
                                .includes('Owner')}
                              onChange={this.handlePermission('Owner', index)}
                              className={classes.checkbox}
                              color="primary"
                              disabled={!isOwner}
                            />
                          </div>
                          <div className="columns small-2">
                            <Checkbox
                              checked={userRelation
                                .get('permissionSet')
                                .includes('Sales')}
                              onChange={this.handlePermission('Sales', index)}
                              className={classes.checkbox}
                              color="primary"
                            />
                          </div>

                          <div className="columns small-2">
                            <Checkbox
                              checked={userRelation
                                .get('permissionSet')
                                .includes('DELIVERY_MANAGER')}
                              onChange={this.handlePermission(
                                'DELIVERY_MANAGER',
                                index
                              )}
                              className={classes.checkbox}
                              color="primary"
                            />
                          </div>
                          <div className="columns small-2">
                            <Checkbox
                              checked={userRelation
                                .get('permissionSet')
                                .includes('Apply_Candidate')}
                              onChange={this.handlePermission(
                                'Apply_Candidate',
                                index
                              )}
                              className={classes.checkbox}
                              color="primary"
                            />
                          </div>
                          <div className="columns small-3 flex-container align-justify align-middle">
                            <Checkbox
                              checked={userRelation
                                .get('permissionSet')
                                .includes('Admin')}
                              onChange={this.handlePermission('Admin', index)}
                              className={classes.checkbox}
                              color="primary"
                            />
                            <IconButton
                              onClick={this.handleRemove(index)}
                              disabled={
                                !isOwner &&
                                userRelation
                                  .get('permissionSet')
                                  .includes('Owner')
                              }
                              style={{ padding: 8 }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </div>
                        </div>
                      </div>
                      <Divider style={{ marginRight: 1, marginLeft: 1 }} />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className={classes.rightChild}>
            <Tabs
              value={selectMode}
              onChange={(e, selectMode) => this.setState({ selectMode })}
              variant="fullWidth"
              indicatorColor="primary"
              textColor="primary"
              scrollButtons="off"
            >
              <Tab
                label={
                  t('common:addFromUserList') +
                  ` (${selectedUserRelationList.size}/${userList.size})`
                }
              />
              <Tab label={t('common:addFromGroupList')} />
            </Tabs>
            <SwipeableViews
              index={selectMode}
              animateTransitions={false}
              style={{ margin: 0 }}
            >
              <div className="flex-child-auto flex-container flex-dir-column ">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    this.onFilter2(e.target.q.value);
                  }}
                  style={{ padding: '12px 12px 0' }}
                >
                  <FormInput
                    defaultValue=""
                    name="q"
                    placeholder={t('common:search user')}
                  />
                </form>

                <div className="flex-child-auto" style={{ overflow: 'auto' }}>
                  <List disablePadding>
                    {filteredUserList.map((user, index) => {
                      const exist = selectedUserRelationList.findIndex(
                        (userRelation) =>
                          userRelation.get('userId') === user.get('id')
                      );
                      return (
                        <ListItem
                          key={index}
                          dense
                          button
                          onClick={() => this.handleCheck(user, exist)}
                        >
                          <Checkbox
                            checked={exist !== -1}
                            tabIndex={-1}
                            color="primary"
                            style={{ padding: 0 }}
                          />
                          <ListItemText>{this._formatName(user)}</ListItemText>
                        </ListItem>
                      );
                    })}
                  </List>
                </div>
              </div>

              <div className="flex-child-auto" style={{ overflow: 'auto' }}>
                <List disablePadding>
                  {teamList.map((team, index) => {
                    let count = 0;
                    let users = team.get('users').map((user, index) => {
                      const exist = selectedUserRelationList.findIndex(
                        (userRelation) =>
                          userRelation.get('userId') === user.get('userId')
                      );
                      if (exist !== -1) {
                        count++;
                      }
                      return (
                        <ListItem
                          key={index}
                          dense
                          button
                          className={classes.nested}
                          onClick={() => this.handleCheckTeamUser(user, exist)}
                        >
                          <Checkbox
                            checked={exist !== -1}
                            tabIndex={-1}
                            color="primary"
                            style={{ padding: 0 }}
                          />
                          <ListItemText>{this._formatName(user)}</ListItemText>
                        </ListItem>
                      );
                    });
                    users = users.unshift(
                      <ListItem
                        key={-1}
                        dense
                        button
                        className={classes.nested}
                        onClick={
                          count === 0
                            ? this.handleSelectGroup(team)
                            : this.handleUnSelectGroup(team)
                        }
                      >
                        <Checkbox
                          checked={count === team.get('users').size}
                          tabIndex={-1}
                          color="primary"
                          style={{ padding: 0 }}
                          indeterminate={count < users.size && count > 0}
                        />
                        <ListItemText>All</ListItemText>
                      </ListItem>
                    );
                    return (
                      <React.Fragment key={index}>
                        <ListItem
                          button
                          onClick={() => {
                            this.setState({
                              expanded:
                                index === this.state.expanded ? null : index,
                            });
                          }}
                        >
                          <ListItemText
                            primary={`${team.get('name')} (${count}/${
                              team.get('users').size
                            })`}
                          />
                          <ListItemIcon
                            className={clsx(classes.expand, {
                              [classes.expandOpen]:
                                index === this.state.expanded,
                            })}
                            aria-expanded={this.state.expanded}
                            aria-label="Show more"
                          >
                            <ExpandMoreIcon />
                          </ListItemIcon>
                        </ListItem>

                        <Collapse
                          in={index === this.state.expanded}
                          timeout="auto"
                          unmountOnExit
                        >
                          <List component="div" disablePadding>
                            {users}
                          </List>
                        </Collapse>
                      </React.Fragment>
                    );
                  })}
                </List>
              </div>
            </SwipeableViews>
          </div>
        </div>
        <div>
          <div className="horizontal-layout">
            <SecondaryButton onClick={handleClose}>
              {t('action:cancel')}
            </SecondaryButton>
            <PrimaryButton
              disabled={selectedUserRelationList.size === 0}
              processing={this.state.processing}
              onClick={this.handleUpdateJobUserRelation}
            >
              {t('action:submit')}
            </PrimaryButton>
          </div>
        </div>
      </div>
    );
  }
}

AssignUsers.propTypes = {
  jobId: PropTypes.string.isRequired,
  handleClose: PropTypes.func.isRequired,
  userRelationList: PropTypes.instanceOf(Immutable.List).isRequired,
};

function mapStoreStateToProps(state, { jobId, isOwner, companyId }) {
  const currentUserId = state.controller.currentUser.get('id');
  const owner = state.relationModel.usersToJobsRelations.find(
    (userRelation) => {
      return (
        userRelation.get('userId') === currentUserId &&
        userRelation.get('jobId') === Number(jobId) &&
        userRelation.get('permissionSet').includes('Owner')
      );
    }
  );

  return {
    userList: getActiveTenantUserList(state),
    teamList: selectProgramTeamList(state, companyId),
    isOwner: isOwner || !!owner,
  };
}

export default connect(mapStoreStateToProps)(withStyles(styles)(AssignUsers));

const findMultiIndex = (q, list = Immutable.List(), fields = []) => {
  const query = new RegExp(q, 'i');
  return list.reduce((res, item, index) => {
    let isMatch = fields.some((field) => query.test(item.get(field)));
    return isMatch ? res.push(index) : res;
  }, Immutable.List());
};
