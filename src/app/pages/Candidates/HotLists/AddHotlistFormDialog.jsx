import React from 'react';
import PropTypes from 'prop-types';
import memoizeOne from 'memoize-one';
import { connect } from 'react-redux';
import {
  getHotListUsersByHotListId,
  upseartHotList,
  updateHotListUsers,
  unSubscribeHotList,
} from '../../../actions/hotlistAction';
import { getTeamList } from '../../../actions/teamActions';
import { getActiveTenantUserList } from '../../../selectors/userSelector';
import teamSelector from '../../../selectors/teamSelector';
import { getHotListUserList } from '../../../selectors/hotListSelector';

import Immutable from 'immutable';
import { withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Scrollbars from 'react-custom-scrollbars';

import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import Chip from '@material-ui/core/Chip';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import SecondaryButton from '../../../components/particial/SecondaryButton';
import PrimaryButton from '../../../components/particial/PrimaryButton';
import PotentialButton from '../../../components/particial/PotentialButton';
import FormInput from '../../../components/particial/FormInput';
import FormTextArea from '../../../components/particial/FormTextArea';
import LinkButton from '../../../components/particial/LinkButton';

const styles = (theme) => ({
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
  expand: {
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
    marginLeft: 'auto',
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
});

class AddHotlistFormDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      indexList: props.userList.map((value, index) => index), //index of filteredList
      errorMessage: Immutable.Map(),
      hotListUsers: Immutable.Set(),
      selectMode: 0,
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // console.log(nextProps.hotListUsers.toJS())
    if (!nextProps.hotListUsers.equals(this.props.hotListUsers)) {
      this.setState({
        hotListUsers: nextProps.hotListUsers
          .toSet()
          .add(nextProps.currentUser.get('id')),
      });
    }

    if (nextProps.userList !== this.props.userList) {
      this.setState({
        indexList: nextProps.userList.map((value, index) => index),
      });
    }
  }

  componentDidMount() {
    this.props.dispatch(getTeamList());
  }

  componentDidUpdate(preProps) {
    if (preProps.hotList.get('id') !== this.props.hotList.get('id')) {
      console.log('componentDidUpdate', this.props.hotList.get('id'));
      this.fetchHotListUserList();
    }
  }

  fetchHotListUserList() {
    const { dispatch, hotList } = this.props;
    const hotListId = hotList.get('id');
    if (hotListId) {
      // console.log('hotListId', hotListId);
      dispatch(getHotListUsersByHotListId(hotListId));
    }
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

  handleUpdateHotList = (e) => {
    e.preventDefault();

    const hotlistForm = e.target;
    const { hotListUsers } = this.state;
    const { dispatch, t, hotList, hotListUsers: oldHotListUsers } = this.props;
    const title = hotlistForm.title.value;
    const notes = hotlistForm.notes.value;
    let errorMessage = Immutable.Map();

    if (!title) {
      errorMessage = errorMessage.set('title', t('message:Name is required'));
    }
    if (!notes) {
      errorMessage = errorMessage.set(
        'notes',
        t('message:Please enter a note')
      );
    }

    if (errorMessage.size > 0) {
      return this.setState({ errorMessage });
    }
    if (!(title === hotList.get('title') && notes === hotList.get('notes'))) {
      dispatch(upseartHotList({ title, notes }, hotList.get('id'))).then(
        (list) => {
          console.log(list);
          if (
            !oldHotListUsers.toSet().equals(hotListUsers) ||
            hotListUsers.isEmpty()
          ) {
            dispatch(updateHotListUsers(hotListUsers.toJSON(), list.id)).then(
              this.handleClose
            );
          } else {
            this.handleClose();
          }
        }
      );
    } else if (!oldHotListUsers.toSet().equals(hotListUsers)) {
      dispatch(
        updateHotListUsers(hotListUsers.toJSON(), hotList.get('id'))
      ).then(this.handleClose);
    } else {
      this.handleClose();
    }
  };

  handleCheck = (userId) => {
    let { hotListUsers, errorMessage } = this.state;
    if (hotListUsers.includes(userId)) {
      this.setState({
        hotListUsers: hotListUsers.remove(userId),
        errorMessage: errorMessage.clear(),
      });
    } else {
      this.setState({
        hotListUsers: hotListUsers.add(userId),
        errorMessage: errorMessage.clear(),
      });
    }
  };

  handleSelectGroup = (team) => () => {
    let { hotListUsers, errorMessage } = this.state;
    let users = team.get('users').map((user) => user.get('id'));
    const newHotListUsers = hotListUsers.union(users);
    if (newHotListUsers.size === hotListUsers.size) {
      this.setState({
        hotListUsers: hotListUsers.subtract(users),
        errorMessage: errorMessage.clear(),
      });
    } else {
      this.setState({
        hotListUsers: newHotListUsers,
        errorMessage: errorMessage.clear(),
      });
    }
  };

  removeErrorMessage = (key) => {
    this.setState({
      errorMessage: this.state.errorMessage.delete(key),
    });
  };

  _formatName = (user) => {
    const firstName = user.get('firstName');
    const lastName = user.get('lastName');
    const username = user.get('username');
    return firstName && lastName ? firstName + ' ' + lastName : username;
  };

  handleClose = () => {
    this.setState({ errorMessage: Immutable.Map() });
    this.props.onClose();
  };
  handleUnsubscribe = () => {
    const { dispatch, hotListUserId, hotList } = this.props;
    dispatch(unSubscribeHotList(hotListUserId, hotList.get('id'))).then(
      this.handleClose
    );
  };

  render() {
    const { t, classes, open, teamList, userList, hotList, hotListUserId } =
      this.props;
    const { indexList, hotListUsers, selectMode, errorMessage } = this.state;
    const filteredUserList = indexList.map((index) => userList.get(index));
    console.log(hotListUsers.toJS());

    return (
      <Dialog
        onClose={this.handleClose}
        aria-labelledby="upsert-team-title"
        maxWidth="md"
        open={open}
        fullWidth
      >
        <DialogTitle id="upsert-team-title">
          {hotList.get('id') ? t('common:editHotlist') : t('common:addHotlist')}
        </DialogTitle>

        <DialogContent className={classes.content}>
          <div
            className={clsx(
              'flex-child-auto flex-container',
              classes.formContainer
            )}
          >
            <form
              onSubmit={this.handleUpdateHotList}
              className="small-7 flex-container flex-dir-column container-padding"
            >
              <div>
                <FormInput
                  name="title"
                  label={t('field:hotlistName')}
                  defaultValue={hotList.get('title') || ''}
                  isRequired
                  errorMessage={errorMessage.get('title')}
                  onBlur={() => this.removeErrorMessage('title')}
                />

                <FormTextArea
                  name="notes"
                  label={t('field:note')}
                  defaultValue={hotList.get('notes') || ''}
                  isRequired
                  rows="3"
                  onBlur={() => this.removeErrorMessage('notes')}
                  errorMessage={errorMessage.get('notes')}
                />
              </div>

              <div>
                <div className="foundation">
                  <label>{t('common:assignUsers')}</label>
                </div>
                <div className="foundation">
                  <span className="form-error is-visible">
                    {errorMessage.get('users')}
                  </span>
                </div>
              </div>
              <Scrollbars autoHide>
                {userList.map((user, index) => {
                  const userId = user.get('id');
                  return hotListUsers.includes(userId) ? (
                    <Chip
                      key={index}
                      label={this._formatName(user)}
                      onDelete={() => this.handleCheck(userId)}
                      className={classes.chip}
                    />
                  ) : null;
                })}
              </Scrollbars>

              <input
                type="submit"
                id="submit-button"
                style={{ display: 'none' }}
              />
            </form>
            <div
              className="flex-child-auto flex-container flex-dir-column"
              style={{ overflow: 'auto' }}
            >
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
                    ` (${hotListUsers.size}/${userList.size})`
                  }
                />
                <Tab label={t('common:addFromGroupList')} />
              </Tabs>

              <Scrollbars autoHide>
                {selectMode === 0 && (
                  <div className="container-padding flex-child-auto flex-container flex-dir-column ">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        this.onFilter2(e.target.keyword.value);
                      }}
                    >
                      <FormInput
                        name="keyword"
                        placeholder={t('common:search user')}
                        defaultValue=""
                      />
                    </form>

                    <div
                      className="flex-child-auto"
                      style={{ overflow: 'auto' }}
                    >
                      <FormGroup>
                        {filteredUserList.map((user, index) => {
                          const userId = user.get('id');
                          return (
                            <FormControlLabel
                              key={index}
                              control={
                                <Checkbox
                                  checked={hotListUsers.includes(userId)}
                                  onChange={() => this.handleCheck(userId)}
                                  color="primary"
                                />
                              }
                              label={this._formatName(user)}
                            />
                          );
                        })}
                      </FormGroup>
                    </div>
                  </div>
                )}

                {selectMode === 1 && (
                  <div className="flex-child-auto" style={{ overflow: 'auto' }}>
                    {teamList.map((team, index) => {
                      let count = 0;
                      const users = team.get('users').map((user, index) => {
                        const userId = user.get('id');
                        const exist = hotListUsers.includes(userId);
                        if (exist) {
                          count++;
                        }
                        return (
                          <div key={index}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  className={classes.checkbox}
                                  checked={exist}
                                  onChange={() => this.handleCheck(userId)}
                                  color="primary"
                                />
                              }
                              label={this._formatName(user)}
                            />
                          </div>
                        );
                      });
                      return (
                        <div key={index}>
                          <div className="flex-container item-padding align-justify align-middle">
                            <LinkButton onClick={this.handleSelectGroup(team)}>
                              {team.get('name')}
                              {` (${count}/${team.get('users').size})`}
                            </LinkButton>
                            <IconButton
                              className={clsx(classes.expand, {
                                [classes.expandOpen]:
                                  index === this.state.expanded,
                              })}
                              onClick={() => {
                                this.setState({
                                  expanded:
                                    index === this.state.expanded
                                      ? null
                                      : index,
                                });
                              }}
                              aria-expanded={this.state.expanded}
                              aria-label="Show more"
                            >
                              <ExpandMoreIcon />
                            </IconButton>
                          </div>

                          <Collapse
                            in={index === this.state.expanded}
                            className="item-padding"
                            timeout="auto"
                            unmountOnExit
                          >
                            <div className="item-padding">{users}</div>
                          </Collapse>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Scrollbars>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <SecondaryButton onClick={this.handleClose} size="small">
            {t('action:cancel')}
          </SecondaryButton>
          <PrimaryButton component="label" size="small" htmlFor="submit-button">
            {t('action:save')}
          </PrimaryButton>
          <div className="flex-child-auto" />
          {hotListUserId && (
            <PotentialButton size="small" onClick={this.handleUnsubscribe}>
              {t('action:Unsubscribe')}
            </PotentialButton>
          )}
        </DialogActions>
      </Dialog>
    );
  }
}

AddHotlistFormDialog.propTypes = {
  hotList: PropTypes.instanceOf(Immutable.Map).isRequired,
  userList: PropTypes.instanceOf(Immutable.List).isRequired,
  teamList: PropTypes.instanceOf(Immutable.List).isRequired,
  onClose: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

AddHotlistFormDialog.defaultProps = {
  hotList: Immutable.Map(),
};

function mapStoreStateToProps(state, { hotList = Immutable.Map() }) {
  const currentUser = state.controller.currentUser;
  const hotListUserId = checkRelation(
    state.relationModel.hotListUsers,
    hotList,
    currentUser
  );
  return {
    userList: getActiveTenantUserList(state),
    teamList: teamSelector(state),
    currentUser,
    hotListUsers: getHotListUserList(state, hotList.get('id')),
    hotListUserId,
  };
}

export default connect(mapStoreStateToProps)(
  withStyles(styles)(AddHotlistFormDialog)
);

const checkRelation = memoizeOne((hotListUsers, hotList, currentUser) => {
  const myRelation = hotListUsers.find(
    (r) =>
      r.get('hotListId') === hotList.get('id') &&
      r.get('userId') === currentUser.get('id')
  );
  const notMine =
    hotList.get('createdBy') !==
    `${currentUser.get('id')},${currentUser.get('tenant')}`;
  return notMine && myRelation && myRelation.get('id');
});
