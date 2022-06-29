import React, { Component } from 'react';
import { matchPath } from 'react-router';
import moment from 'moment-timezone';
import { logout } from '../../actions/index';
import { getAllUsers, getCurrentUser } from '../../actions/userActions';
import { getSkipSubmitToAMCompanies } from '../../actions/clientActions';
import { withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

import Popover from '@material-ui/core/Popover';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';

import MoreVertIcon from '@material-ui/icons/ArrowDropDown';
import Language from '@material-ui/icons/Language';
import Settings from '@material-ui/icons/Settings';
import AddLogo from '@material-ui/icons/PhotoSizeSelectLarge';
import ExitIcon from '@material-ui/icons/ExitToApp';
import CheckIcon from '@material-ui/icons/Done';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import SecondaryButton from '../particial/SecondaryButton';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { getClientBriefList } from '../../actions/clientActions';
import * as ActionTypes from '../../constants/actionTypes';

const styles = (theme) => ({
  rightIcon: {
    marginLeft: theme.spacing(1),
    marginRight: -theme.spacing(1),
  },
  listItem: {
    paddingLeft: 16,
    paddingRight: 16,

    '&$nested': {
      paddingLeft: 32,
    },
  },
  nested: {},
  expand: {
    marginLeft: 'auto',
    display: 'inline-flex',
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
    '&$expandOpen': {
      transform: 'rotate(180deg)',
    },
  },
  expandOpen: {},
});
const TRANSFORM_ORIGIN = { horizontal: 'right', vertical: 'top' };
const ANCHOR_ORIGIN = { horizontal: 'right', vertical: 'bottom' };

class Logged extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      openLanguage: false,
    };
  }

  componentDidMount() {
    this.fetchData();
    this._setLangs();
  }

  fetchData() {
    const { dispatch, location } = this.props;
    this.props.dispatch(getCurrentUser());
    this.props.dispatch(getAllUsers());
    this.props.dispatch(getSkipSubmitToAMCompanies());

    // fetch company options
    const match = matchPath(location.pathname, {
      path: '/:page/',
    });
    if (!match || match.params.page !== 'jobs') {
      dispatch(getClientBriefList(0)).then(({ response }) => {
        const companyOptions = getCompanyOptions(response);
        dispatch({
          type: ActionTypes.REVEIVE_COMPANIES_OPTIONS,
          companiesOptions: companyOptions,
        });
      });
    }
  }

  _setLangs = () => {
    const { i18n } = this.props;
    const isZH = i18n.language.match('zh');
    if (isZH) {
      this.props.dispatch({
        type: 'LANGUAGE_ZH',
      });
    } else {
      this.props.dispatch({
        type: 'LANGUAGE_EN',
      });
    }
  };

  logoutHandler = () => {
    this.props.dispatch(logout());
  };

  handleClick = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false, openLanguage: false });
  };

  handleChangeLanguage = (e) => {
    const lng = e.currentTarget.getAttribute('data-lng');
    this.props.i18n.changeLanguage(lng);
    moment.locale(lng);
    this.handleClose();
    this.props.dispatch({
      type: lng === 'zh-cn' ? 'LANGUAGE_ZH' : 'LANGUAGE_EN',
    });
  };

  handleNavToSettings = () => {
    this.props.history.push('/settings');
    this.handleClose();
  };

  handleNavToAddLogo = () => {
    this.props.history.push('/addLogo');
    this.handleClose();
  };

  handleNavToTenant = () => {
    this.props.history.push('/tenantAdminPortal');
    this.handleClose();
  };

  render() {
    const { classes, t, i18n, user, hasAuthorities } = this.props;
    const { open, openLanguage } = this.state;
    const isZH = i18n.language.match('zh');

    return (
      <React.Fragment>
        <SecondaryButton
          onClick={this.handleClick}
          buttonRef={(node) => (this.anchorEl = node)}
        >
          {user.get('firstName')}
          <MoreVertIcon className={classes.rightIcon} />
        </SecondaryButton>

        <Popover
          open={open}
          anchorEl={this.anchorEl}
          transformOrigin={TRANSFORM_ORIGIN}
          anchorOrigin={ANCHOR_ORIGIN}
          onClose={this.handleClose}
          elevation={2}
        >
          <List style={{ width: 250 }}>
            <ListItem
              button
              className={classes.listItem}
              onClick={() => this.setState({ openLanguage: !openLanguage })}
            >
              <ListItemIcon>
                <Language />
              </ListItemIcon>
              <ListItemText primary={t('common:lang')} />
              <ListItemIcon>
                <div
                  className={clsx(classes.expand, {
                    [classes.expandOpen]: openLanguage,
                  })}
                >
                  <ExpandMoreIcon />
                </div>
              </ListItemIcon>
            </ListItem>

            <Collapse in={this.state.openLanguage} timeout="auto">
              <List component="div" disablePadding>
                <ListItem
                  button
                  className={clsx(classes.listItem, classes.nested)}
                  data-lng="zh-cn"
                  onClick={this.handleChangeLanguage}
                >
                  {isZH && (
                    <ListItemIcon>
                      <CheckIcon />
                    </ListItemIcon>
                  )}
                  <ListItemText inset={!isZH} primary="中文" />
                </ListItem>
                <ListItem
                  button
                  className={clsx(classes.listItem, classes.nested)}
                  data-lng="en"
                  onClick={this.handleChangeLanguage}
                >
                  {!isZH && (
                    <ListItemIcon>
                      <CheckIcon />
                    </ListItemIcon>
                  )}
                  <ListItemText inset={Boolean(isZH)} primary="English" />
                </ListItem>
              </List>
            </Collapse>

            <ListItem
              button
              className={classes.listItem}
              onClick={this.handleNavToSettings}
            >
              <ListItemIcon>
                <Settings />
              </ListItemIcon>
              <ListItemText primary={t('common:settings')} />
            </ListItem>

            {hasAuthorities && (
              <ListItem
                button
                className={classes.listItem}
                onClick={this.handleNavToTenant}
              >
                <ListItemIcon>
                  <AccountBoxIcon />
                </ListItemIcon>
                <ListItemText primary={t('common:tenantAdminPortal')} />
              </ListItem>
            )}

            <ListItem
              button
              className={classes.listItem}
              onClick={this.handleNavToAddLogo}
            >
              <ListItemIcon>
                <AddLogo />
              </ListItemIcon>
              <ListItemText primary={t('common:watermark')} />
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem
              button
              className={classes.listItem}
              onClick={this.logoutHandler}
            >
              <ListItemIcon>
                <ExitIcon />
              </ListItemIcon>
              <ListItemText primary={t('common:signOut')} />
            </ListItem>
          </List>
        </Popover>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  const currentUser = state.controller.currentUser;
  const hasAuthorities =
    currentUser.get('authorities') &&
    currentUser
      .get('authorities')
      .includes(Immutable.Map({ name: 'ROLE_ADMIN' }));

  return {
    hasAuthorities,
  };
};

export default connect(mapStateToProps)(withStyles(styles)(Logged));
const getCompanyOptions = (response) => {
  const companyOptions = response.map((item, index) => {
    return {
      value: item.id,
      label: item.name,
      industry: item.industry,
      disabled: !item.active,
    };
  });
  return companyOptions;
};
