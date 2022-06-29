import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { formatUserName } from '../../../../utils';

import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Chip from '@material-ui/core/Chip';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import SecondaryButton from '../../../components/particial/SecondaryButton';
import PrimaryButton from '../../../components/particial/PrimaryButton';
import FormInput from '../../../components/particial/FormInput';

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
    this.state = {
      userOptions: props.userOptions.toJS(),
      users: props.userList,
      errorMessage: Immutable.Map(),
      keywords: '',
      indexList: props.userOptions.map((value, index) => index), //index of filteredList
    };
  }

  onFilter2 = (q) => {
    const fields = ['username', 'firstName', 'lastName'];
    const query = new RegExp(q, 'i');
    const indexList = this.props.userOptions.reduce(
      (indexList, user, index) => {
        let isMatch = fields.some((field) => query.test(user.get(field)));
        return isMatch ? indexList.push(index) : indexList;
      },
      Immutable.List()
    );

    this.setState({ indexList });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { users } = this.state;
    const { t, onUpdateUsers } = this.props;

    let errorMessage = Immutable.Map();

    if (users.size === 0) {
      errorMessage = errorMessage.set(
        'users',
        t('message:Please select users')
      );
    }
    if (errorMessage.size > 0) {
      return this.setState({ errorMessage });
    }
    onUpdateUsers(users.map((user) => user.get('id')));
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
    this.props.handleClose();
  };

  render() {
    const { t, classes, userOptions } = this.props;
    const { indexList, users, errorMessage } = this.state;
    const filteredUserList = indexList.map((index) => userOptions.get(index));

    return (
      <>
        <DialogTitle>{t('common:Edit Skip Submit to AM Users')}</DialogTitle>

        <DialogContent className={classes.content}>
          <div
            className={clsx(
              'flex-child-auto flex-container',
              classes.formContainer
            )}
          >
            <div className="small-8 flex-container flex-dir-column container-padding">
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
                    onDelete={(e, a) => {
                      this.handleCheck(miniUser);
                    }}
                    className={classes.chip}
                  />
                ))}
              </div>
            </div>
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
          </div>
        </DialogContent>
        <DialogActions>
          <SecondaryButton onClick={this.handleClose} size="small">
            {t('action:cancel')}
          </SecondaryButton>
          <PrimaryButton onClick={this.handleSubmit} size="small">
            {t('action:save')}
          </PrimaryButton>
        </DialogActions>
      </>
    );
  }
}

AddTeamForm.propTypes = {
  userList: PropTypes.instanceOf(Immutable.List).isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdateUsers: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AddTeamForm);
