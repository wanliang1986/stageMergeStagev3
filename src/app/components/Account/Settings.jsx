import React from 'react';
import { connect } from 'react-redux';
import { updateAccount, changePassword } from '../../actions/userActions';
import { withTranslation } from 'react-i18next';
import Immutable from 'immutable';
import { isEmail } from '../../../utils';
import { withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import AlertError from '@material-ui/icons/Error';
import CheckCircle from '@material-ui/icons/CheckCircle';

import Loading from '../particial/Loading';
import PrimaryButton from '../particial/PrimaryButton';

import { styles } from './params';

class Settings extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      pending: false,
      validation: Immutable.Map(),
      message: null,
      pMessage: null,
    };
  }

  updateHandler = (e) => {
    e.preventDefault();
    const registerForm = e.target;
    let validation = this._validateForm(registerForm, this.props.t);
    if (validation) {
      return this.setState({ validation, message: null });
    }
    const account = {
      email: registerForm.email.value.trim(),
      firstName: registerForm.firstName.value.trim(),
      lastName: registerForm.lastName.value.trim(),
    };

    this.setState({
      pending: true,
      message: null,
      validation: Immutable.Map(),
    });

    this.props
      .dispatch(updateAccount(account))
      .then(() => {
        this.setState({
          pending: false,
          message: {
            message: 'success',
            type: 'hint',
          },
        });
      })
      .catch((err) => {
        console.log(err);

        this.setState({
          pending: false,
          message: {
            message: err.message || err,
            type: 'error',
          },
        });
      });
  };

  changePasswordHandler = (e) => {
    e.preventDefault();
    const { t, dispatch } = this.props;
    const newPassword =
      e.target.newPassword.value && e.target.newPassword.value.trim();
    const confirmPassword =
      e.target.confirmPassword.value && e.target.confirmPassword.value.trim();

    if (!newPassword || !confirmPassword) {
      return this.setState({
        pMessage: { type: 'error', message: t('message:passwordIsRequired') },
      });
    }
    if (newPassword.length < 6) {
      return this.setState({
        pMessage: { type: 'error', message: t('message:passwordShort') },
      });
    }
    if (newPassword !== confirmPassword) {
      return this.setState({
        pMessage: { type: 'error', message: t('message:passwordNotMatch') },
      });
    } else {
      this.setState({ pending: true, pMessage: null });
      dispatch(changePassword(newPassword))
        .then(() => {
          this.setState({
            pending: false,
            pMessage: {
              message: 'success',
              type: 'hint',
            },
          });
        })
        .catch((err) => {
          console.log(err);
          this.setState({
            pending: false,
            pMessage: {
              message: err.message || err,
              type: 'hint',
            },
          });
        });
    }
  };

  _validateForm(form, t) {
    let errorMessage = Immutable.Map();

    if (!form.firstName.value || !form.firstName.value.trim()) {
      errorMessage = errorMessage.set(
        'firstName',
        t('message:firstNameIsRequired')
      );
    }
    if (!form.lastName.value || !form.lastName.value.trim()) {
      errorMessage = errorMessage.set(
        'lastName',
        t('message:lastNameIsRequired')
      );
    }
    if (!isEmail(form.email.value)) {
      errorMessage = errorMessage.set('email', t('message:emailIsInvalid'));
    }
    if (!form.email.value || !form.email.value.trim()) {
      errorMessage = errorMessage.set('email', t('message:emailIsRequired'));
    }

    return errorMessage.size > 0 && errorMessage;
  }

  render() {
    const { message, pMessage, validation } = this.state;
    const { classes, t, currentUser } = this.props;
    if (!currentUser.get('id')) {
      return <Loading />;
    }
    return (
      <Paper className={clsx('vertical-layout', classes.root)}>
        <form onSubmit={this.updateHandler}>
          <Typography variant="h5">{t('common:account')}</Typography>

          {message && (
            <div
              className={clsx(classes.messageContainer, {
                [classes.hint]: message.type === 'hint',
              })}
            >
              {message.type === 'error' ? (
                <AlertError className={classes.icon} />
              ) : (
                <CheckCircle className={classes.icon} />
              )}
              <div className="flex-child-auto">{message.message}</div>
            </div>
          )}

          <div>
            <TextField
              name="firstName"
              defaultValue={currentUser.get('firstName')}
              placeholder={t('field:firstName')}
              error={!!validation.get('firstName')}
              helperText={validation.get('firstName')}
              label={t('field:firstName')}
              fullWidth
              margin="normal"
            />
            <TextField
              name="lastName"
              defaultValue={currentUser.get('lastName')}
              placeholder={t('field:lastName')}
              error={!!validation.get('lastName')}
              helperText={validation.get('lastName')}
              label={t('field:lastName')}
              fullWidth
              margin="normal"
            />
            <TextField
              name="email"
              defaultValue={currentUser.get('email')}
              placeholder={t('field:email')}
              error={!!validation.get('email')}
              helperText={validation.get('email')}
              label={t('field:email')}
              fullWidth
              margin="normal"
            />
          </div>
          <PrimaryButton
            className={classes.loginBtn}
            processing={this.state.pending}
            type="submit"
            fullWidth
          >
            {t('action:save')}
          </PrimaryButton>
        </form>

        <form onSubmit={this.changePasswordHandler}>
          <Typography variant="h5">{t('common:changePassword')}</Typography>

          {pMessage && (
            <div
              className={clsx(classes.messageContainer, {
                [classes.hint]: pMessage.type === 'hint',
              })}
            >
              {pMessage.type === 'error' ? (
                <AlertError className={classes.icon} />
              ) : (
                <CheckCircle className={classes.icon} />
              )}
              <div className="flex-child-auto">{pMessage.message}</div>
            </div>
          )}

          <div>
            <TextField
              name="newPassword"
              type="password"
              label={t('common:newPassword')}
              fullWidth
              margin="normal"
            />
            <TextField
              name="confirmPassword"
              type="password"
              label={t('common:newPasswordConfirm')}
              fullWidth
              margin="normal"
            />
          </div>
          <PrimaryButton
            className={classes.loginBtn}
            processing={this.state.pending}
            type="submit"
            fullWidth
          >
            {t('action:save')}
          </PrimaryButton>
        </form>
      </Paper>
    );
  }
}

function mapStoreStateToProps(state) {
  return {
    currentUser: state.controller.currentUser,
  };
}

export default withTranslation(['message', 'field', 'action'])(
  connect(mapStoreStateToProps)(withStyles(styles)(Settings))
);
