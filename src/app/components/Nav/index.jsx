import React from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { TEXT, PRIMARY } from './../../styles/Colors';
import { NavLink } from 'react-router-dom';
import { withRouter } from 'react-router';
import { reload } from './../../actions';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';

import BackIcon from '@material-ui/icons/ArrowBack';
import RefreshIcon from '@material-ui/icons/Refresh';

import Logged from './Logged';

const routes = [
  // {
  //   path: '/',
  //   label: 'dashboard',
  //   exact: true,
  // },
  {
    path: '/jobs',
    label: 'jobs',
  },
  {
    path: '/candidates',
    label: 'candidates',
  },
  // {
  //   path: '/emailblast',
  //   label: 'emailBlast',
  // },
  // {
  //   path: '/reports',
  //   label: 'reports',
  // },
  {
    path: '/myteam',
    label: 'myteam',
  },
  {
    path: '/finance',
    label: 'finance',
  },
  {
    path: '/finance/invoices',
    label: 'invoice',
  },
  {
    path: '/finance/commissions',
    label: 'commission',
  },
  {
    path: '/search',
    label: 'Search',
  },
  {
    path: '/companies',
    label: 'companies',
  },
  {
    path: '/templates',
    label: 'templates',
  },
  {
    path: '/settings',
    label: 'settings',
  },
  {
    path: '/tenantAdminPortal',
    label: 'Tenant Admin Portal',
  },
];

const Login = ({ t, location }) => {
  const { from } = location.state || { from: { pathname: '/' } };

  return (
    <Typography variant="subtitle1" className="horizontal-layout">
      <NavLink
        to={{
          pathname: '/register',
          state: { from },
        }}
      >
        {t('common:register')}{' '}
      </NavLink>
      <NavLink
        to={{
          pathname: '/login',
          state: { from },
        }}
      >
        {t('common:signIn')}{' '}
      </NavLink>
    </Typography>
  );
};

const styles = {
  linkContainer: {
    display: 'flex',
    '& > $link': {
      marginRight: 16,
      display: 'none',
      '&:hover': {
        color: PRIMARY,
      },
      '&.active': {
        display: 'inherit',
      },
    },
  },
  link: {
    color: TEXT,
    fontSize: 16,
  },
};

const NavLinks = ({ t, classes, location, ...props }) => {
  console.log(props, location);
  const isFinance = location.pathname.match(/^\/(invoices|commissions)/);
  return (
    <React.Fragment>
      {!!isFinance && (
        <NavLink
          key={'finance'}
          to={{
            pathname: '/finance',
            state: location.state || {},
          }}
          className={clsx(classes.link, 'active')}
        >
          {t('finance')}
        </NavLink>
      )}
      {routes.map((nav, index) => {
        return (
          <NavLink
            key={index}
            exact={nav.exact}
            to={{
              pathname: nav.path,
              state: location.state || {},
            }}
            className={classes.link}
          >
            {' '}
            {t(nav.label)}
          </NavLink>
        );
      })}
    </React.Fragment>
  );
};

function Nav({
  currentUser,
  loggedin,
  reloadKey,
  location,
  disableBack,
  classes,
  ...props
}) {
  // console.log('%c nav render: ', 'color: blue', currentUser.toJS(), reloadKey, props);
  return (
    <AppBar position="static" color="default" elevation={1}>
      {loggedin ? (
        <Toolbar>
          <Tooltip title={'Go Back'} disableFocusListener>
            <span>
              <IconButton
                onClick={props.history.goBack}
                style={{ marginLeft: -12, marginRight: 4, padding: 8 }}
                disabled={disableBack}
              >
                <BackIcon />
              </IconButton>
            </span>
          </Tooltip>

          <Tooltip title={'Reload'} disableFocusListener>
            <IconButton
              onClick={() => {
                props.history.replace(location);
                props.dispatch(reload());
              }}
              style={{ marginRight: 20, padding: 8 }}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>

          <Typography
            variant="h6"
            color="inherit"
            className={classes.linkContainer}
          >
            <NavLinks location={location} t={props.t} classes={classes} />
          </Typography>
          <div className="flex-child-auto" />

          <Logged
            key={reloadKey}
            {...props}
            location={location}
            user={currentUser}
          />
        </Toolbar>
      ) : (
        <Toolbar>
          <div className="flex-child-auto" />
          <Login t={props.t} location={location} />
        </Toolbar>
      )}
    </AppBar>
  );
}

function mapStoreStateToProps(state) {
  const currentUser = state.controller.currentUser;
  const loggedin = state.controller.loggedin;
  const disableBack =
    (state.router && state.router.location.key) ===
    (state.controller.routerStatus &&
      state.controller.routerStatus.location.key);
  return {
    currentUser,
    loggedin,
    isMobile: state.controller.isMobile,
    reloadKey: state.controller.reload,
    disableBack,
  };
}

export default withTranslation('nav')(
  withRouter(connect(mapStoreStateToProps)(withStyles(styles)(Nav)))
);
