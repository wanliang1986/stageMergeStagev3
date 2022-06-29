import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';

import Routes from '../Routes';
import Nav from '../components/Nav/index';
import SideMenuBar from '../components/SideMenuBar';
import Messages from '../components/Messages';
import SendEmails from '../components/SendEmails';
import Loading from '../components/particial/Loading';

const styles = {
  root: {
    height: '100vh',
    display: 'flex',
  },
  content: {
    overflow: 'auto',
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
  },
};

function Root({ classes, loginChecked, t }) {
  useEffect(() => {
    console.log('app loaded');
    document.title = t('common:Hitalent');
  });

  if (!loginChecked) {
    return (
      <div className={classes.root}>
        <Loading />
      </div>
    );
  }

  return (
    <div className={classes.root}>
      <SideMenuBar />
      <div className={classes.content}>
        <Nav />
        <Routes />
        <Messages />
        <SendEmails />
      </div>
    </div>
  );
}

function mapStoreStateToProps(state) {
  return {
    loginChecked: state.controller.loginChecked,
  };
}

export default withTranslation(['common', 'nav'])(
  connect(mapStoreStateToProps)(withStyles(styles)(Root))
);
