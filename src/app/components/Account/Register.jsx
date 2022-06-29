import React from 'react';
import { connect } from 'react-redux';
import { register } from '../../actions';
import { getAllTenants } from '../../actions/tenantActions';
import { withTranslation } from 'react-i18next';
import { Redirect } from 'react-router-dom';
import Immutable from 'immutable';
import { isEmail } from '../../../utils';
import withStyles from '@material-ui/core/styles/withStyles';
import clsx from 'clsx';

import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';

import AlertError from '@material-ui/icons/Error';
import CheckCircle from '@material-ui/icons/CheckCircle';
import PrimaryButton from '../particial/PrimaryButton';

import { styles } from './params';

class Register extends React.PureComponent {
  constructor() {
    super();

    this.state = {
      message: null,
      validation: Immutable.Map(),
      pending: false,
      tenantId: '',
      tenantOptions: [],
    };
  }

  componentDidMount() {
    this.fetchTenants();
  }

  fetchTenants() {
    this.props.dispatch(getAllTenants()).then(({ response }) => {
      this.setState({
        tenantOptions: response.slice(1),
      });
    });
  }

  registerHandler = (e) => {
    e.preventDefault();
    const { t, dispatch } = this.props;
    const registerForm = e.target;
    let validation = this._validateForm(registerForm, t);
    if (validation) {
      return this.setState({ validation, message: null });
    }
    const account = {
      email: registerForm.email.value,
      username: registerForm.username.value,
      password: registerForm.password.value,
      firstName: registerForm.firstName.value,
      lastName: registerForm.lastName.value,
      tenantId: registerForm.tenantId.value,
    };

    this.setState({
      validation: Immutable.Map(),
      pending: true,
      message: null,
    });

    dispatch(register(account))
      .then((response) => {
        console.log(response);
        this.setState({
          pending: false,
          message: {
            type: 'hint',
            message: response.content,
          },
        });
      })
      .catch((err) => {
        this.setState({
          pending: false,
          message: {
            type: 'error',
            message: err.fieldErrors
              ? err.fieldErrors[err.fieldErrors.length - 1].message
              : err.message || JSON.stringify(err),
          },
        });
      });
  };

  handleTenantChange = (e) => {
    this.setState({ tenantId: e.target.value });
  };

  _validateForm(form, t) {
    let hasError = false;
    let errorMessage = Immutable.Map();

    if (!form.firstName.value || !form.firstName.value.trim()) {
      hasError = true;
      errorMessage = errorMessage.set(
        'firstName',
        t('message:firstNameIsRequired')
      );
    }

    if (!form.lastName.value || !form.lastName.value.trim()) {
      hasError = true;
      errorMessage = errorMessage.set(
        'lastName',
        t('message:lastNameIsRequired')
      );
    }
    if (!form.username.value || !form.username.value.trim()) {
      hasError = true;
      errorMessage = errorMessage.set(
        'username',
        t('message:usernameIsRequired')
      );
    }
    if (!isEmail(form.email.value)) {
      hasError = true;
      errorMessage = errorMessage.set('email', t('message:emailIsInvalid'));
    }
    if (!form.email.value || !form.email.value.trim()) {
      hasError = true;
      errorMessage = errorMessage.set('email', t('message:emailIsRequired'));
    }

    if (!form.password.value || !form.password.value.trim()) {
      hasError = true;
      errorMessage = errorMessage.set(
        'password',
        t('message:passwordIsRequired')
      );
    }
    if (form.password.value && form.password.value.trim().length < 6) {
      hasError = true;
      errorMessage = errorMessage.set('password', t('message:passwordShort'));
    }
    if (!form.tenantId.value) {
      hasError = true;
      errorMessage = errorMessage.set('tenant', t('message:tenantIsRequired'));
    }
    return hasError && errorMessage;
  }

  render() {
    const { classes, t, loggedin, location } = this.props;
    const { from } = location.state || { from: { pathname: '/' } };
    const { validation, message } = this.state;
    if (loggedin) {
      return <Redirect to={from} />;
    }

    return (
      <div className="flex-child-auto">
        <Paper className={classes.root}>
          <form onSubmit={this.registerHandler}>
            <Typography variant="h5">{t('common:register')}</Typography>
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
                placeholder={t('field:firstName')}
                error={!!validation.get('firstName')}
                helperText={validation.get('firstName')}
                label={t('field:firstName')}
                fullWidth
                margin="normal"
              />

              <TextField
                name="lastName"
                placeholder={t('field:lastName')}
                error={!!validation.get('lastName')}
                helperText={validation.get('lastName')}
                label={t('field:lastName')}
                fullWidth
                margin="normal"
              />

              <TextField
                name="username"
                placeholder={t('common:username')}
                error={!!validation.get('username')}
                helperText={validation.get('username')}
                label={t('common:username')}
                fullWidth
                margin="normal"
              />

              <TextField
                name="email"
                placeholder={t('field:email')}
                error={!!validation.get('email')}
                helperText={validation.get('email')}
                label={t('field:email')}
                fullWidth
                margin="normal"
              />

              <TextField
                name="password"
                type="password"
                placeholder={t('common:password')}
                error={!!validation.get('password')}
                helperText={validation.get('password')}
                label={t('common:password')}
                fullWidth
                margin="normal"
              />

              <TextField
                select
                name="tenantId"
                value={this.state.tenantId}
                onChange={this.handleTenantChange}
                label={t('common:tenant')}
                error={!!validation.get('tenant')}
                helperText={validation.get('tenant')}
                fullWidth
                margin="normal"
              >
                {this.state.tenantOptions.map((tenant) => (
                  <MenuItem key={tenant.id} value={tenant.id}>
                    {tenant.name}
                  </MenuItem>
                ))}
              </TextField>
            </div>

            <PrimaryButton
              className={classes.loginBtn}
              processing={this.state.pending}
              fullWidth
              type="submit"
            >
              {t('common:register')}
            </PrimaryButton>
          </form>
        </Paper>
      </div>
    );
  }
}

function mapStoreStateToProps(state) {
  const loggedin = state.controller.loggedin;
  return {
    loggedin,
  };
}

export default withTranslation(['message', 'field'])(
  connect(mapStoreStateToProps)(withStyles(styles)(Register))
);
