import React from 'react';
import { connect } from 'react-redux';
import { login, showErrorMessage } from '../../actions';
import { withTranslation } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';

import { Link, Redirect } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import AlertError from '@material-ui/icons/Error';

import PrimaryButton from '../particial/PrimaryButton';
import { styles } from './params';

class Login extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      usernameError: '',
      passwordError: '',
      errorMessage: '',
      redirectToReferrer: props.loggedin,
      pending: false,
    };
  }

  loginHandler = (e) => {
    e.preventDefault();
    const { userName, password } = e.target;
    const { dispatch, t } = this.props;

    this.setState({
      usernameError: '',
      passwordError: '',
      errorMessage: '',
    });
    if (!userName.value || !userName.value.trim()) {
      return this.setState({ usernameError: t('usernameOrEmailIsRequired') });
    }

    if (!password.value || !password.value.trim()) {
      return this.setState({ passwordError: t('passwordIsRequired') });
    }

    this.setState({
      pending: true,
    });

    dispatch(login(userName.value.trim(), password.value.trim())).catch(
      (err) => {
        if (err.message === 'Bad Credential') {
          this.setState({
            pending: false,
            errorMessage: t('invalid_grant'),
          });
        }
        this.setState({
          pending: false,
        });
        dispatch(showErrorMessage(err));
      }
    );
  };

  render() {
    const { classes, t, loggedin, location } = this.props;
    const { from } = location.state || { from: { pathname: '/' } };
    const { errorMessage, usernameError, passwordError, pending } = this.state;

    if (loggedin) {
      return <Redirect to={from} />;
    }

    return (
      <div className="flex-child-auto">
        <Paper className={classes.root}>
          <form onSubmit={this.loginHandler}>
            <Typography variant="h5">{t('common:signIn')}</Typography>
            {errorMessage && (
              <div className={classes.messageContainer}>
                <AlertError className={classes.icon} />
                <div className="flex-child-auto">{errorMessage}</div>
              </div>
            )}

            <div>
              <TextField
                name="userName"
                type="text"
                placeholder={t('common:usernameOrEmail')}
                error={!!usernameError}
                helperText={usernameError}
                label={t('common:usernameOrEmail')}
                fullWidth
                margin="normal"
              />

              <TextField
                name="password"
                type="password"
                placeholder={t('common:password')}
                error={!!passwordError}
                helperText={passwordError}
                label={t('common:password')}
                fullWidth
                margin="normal"
              />
            </div>

            <PrimaryButton
              className={classes.loginBtn}
              processing={pending}
              type="submit"
              fullWidth
            >
              {t('common:signIn')}
            </PrimaryButton>
            <div className="flex-container align-right">
              <Link to="/forgotpassword" className={classes.link}>
                {t('common:forgotPassword')}
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

export default withTranslation('message')(
  connect(mapStoreStateToProps)(withStyles(styles)(Login))
);
