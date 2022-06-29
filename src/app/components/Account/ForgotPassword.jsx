import React from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { resetPasswordInit } from '../../actions';
import { Link, Redirect } from 'react-router-dom';
import { isEmail } from '../../../utils';
import withStyles from '@material-ui/core/styles/withStyles';
import clsx from 'clsx';

import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import AlertError from '@material-ui/icons/Error';
import CheckCircle from '@material-ui/icons/CheckCircle';

import PrimaryButton from '../particial/PrimaryButton';

import { styles } from './params';

class ForgotPassword extends React.PureComponent {
  constructor() {
    super();

    this.state = {
      emailError: '',
      pending: false,
      message: null,
    };
  }

  resetPasswordHandler = (e) => {
    e.preventDefault();
    const { t, dispatch } = this.props;
    const email = e.target.email.value && e.target.email.value.trim();
    if (!email) {
      return this.setState({ emailError: t('message:emailIsRequired') });
    }
    if (!isEmail(email)) {
      return this.setState({ emailError: t('message:emailIsInvalid') });
    }
    this.setState({
      emailError: '',
      pending: true,
      message: null,
    });

    dispatch(resetPasswordInit(email)).then(
      () => {
        this.setState({
          pending: false,
          message: {
            type: 'hint',
            message: t('message:sendResetSuccess'),
          },
        });
      },
      () => {
        this.setState({
          pending: false,
          message: {
            type: 'hint',
            message: t('message:sendResetFailed'),
          },
        });
      }
    );
  };

  render() {
    const { classes, t, loggedin, location } = this.props;
    const { from } = location.state || { from: { pathname: '/' } };
    const { message, pending, emailError } = this.state;

    if (loggedin) {
      return <Redirect to={from} />;
    }

    return (
      <div className="flex-child-auto">
        <Paper className={classes.root}>
          <form onSubmit={this.resetPasswordHandler}>
            <Typography variant="h5">{t('forgotPassword')}</Typography>

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

            <TextField
              name="email"
              type="text"
              error={!!emailError}
              helperText={emailError}
              label={t('field:email')}
              fullWidth
              margin="normal"
            />
            <PrimaryButton
              className={classes.loginBtn}
              processing={pending}
              type="submit"
              fullWidth
            >
              {t('reset')}
            </PrimaryButton>
            <div className="flex-container align-right">
              <Link to="/login" className={classes.link}>
                {t('backToLogin')}
              </Link>
            </div>
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

export default withTranslation(['common', 'message', 'field'])(
  connect(mapStoreStateToProps)(withStyles(styles)(ForgotPassword))
);
