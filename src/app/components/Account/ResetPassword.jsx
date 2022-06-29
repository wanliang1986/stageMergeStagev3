import React from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { resetPasswordFinish } from '../../actions';
import clsx from 'clsx';
import withStyles from '@material-ui/core/styles/withStyles';

import { Link, Redirect } from 'react-router-dom';

import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import AlertError from '@material-ui/icons/Error';
import CheckCircle from '@material-ui/icons/CheckCircle';

import PrimaryButton from '../particial/PrimaryButton';

import { styles } from './params';

class ResetPassword extends React.PureComponent {
  constructor() {
    super();

    this.state = {
      message: null,
      pending: false,
    };
  }

  resetHandler = (e) => {
    e.preventDefault();
    const { t, dispatch, location } = this.props;
    const newPassword =
      e.target.newPassword.value && e.target.newPassword.value.trim();
    const confirmPassword =
      e.target.confirmPassword.value && e.target.confirmPassword.value.trim();
    if (!newPassword || !confirmPassword) {
      return this.setState({
        message: { type: 'error', message: t('message:passwordIsRequired') },
      });
    }
    if (newPassword.length < 6) {
      return this.setState({
        message: { type: 'error', message: t('message:passwordShort') },
      });
    }
    if (newPassword !== confirmPassword) {
      return this.setState({
        message: { type: 'error', message: t('message:passwordNotMatch') },
      });
    } else {
      this.setState({ pending: true, message: null });
      const query = new URLSearchParams(location.search);
      dispatch(resetPasswordFinish(query.get('resetKey'), newPassword))
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
            message: { type: 'error', message: err.message || err },
          });
        });
    }
  };

  render() {
    const { classes, t, location } = this.props;
    const { from } = location.state || { from: { pathname: '/jobs' } };
    const { message } = this.state;

    if (this.props.loggedin) {
      return <Redirect to={from} />;
    }

    return (
      <div className="flex-child-auto">
        <Paper className={classes.root}>
          <form onSubmit={this.resetHandler}>
            <Typography variant="h5">{t('common:resetPassword')}</Typography>

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
                name="newPassword"
                type="password"
                placeholder={t('common:newPassword')}
                label={t('common:newPassword')}
                fullWidth
                margin="normal"
              />
              <TextField
                name="confirmPassword"
                type="password"
                placeholder={t('common:newPasswordConfirm')}
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
              {t('action:submit')}
            </PrimaryButton>
            <div className="flex-container align-right">
              <Link to="/login" className={classes.link}>
                {t('common:backToLogin')}
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

export default withTranslation(['message', 'action'])(
  connect(mapStoreStateToProps)(withStyles(styles)(ResetPassword))
);
