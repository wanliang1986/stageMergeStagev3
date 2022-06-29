import React from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { withTranslation } from 'react-i18next';
import Immutable from 'immutable';

import HomeIcon from '@material-ui/icons/Home';
import JobIcon from '@material-ui/icons/Work';
import CandidateIcon from '@material-ui/icons/Person';
import ClientIcon from '@material-ui/icons/ImportContacts';
import TemplateIcon from '@material-ui/icons/Description';
import ReportIcon from '@material-ui/icons/InsertChart';
import Search from '@material-ui/icons/Search';
import CreditCard from '@material-ui/icons/CreditCard';
import TenantsIcon from '@material-ui/icons/SupervisedUserCircle';
import ClearAllTwoToneIcon from '@material-ui/icons/ClearAllTwoTone';
import SettingsIcon from '@material-ui/icons/Settings';
import { EmailBlastIcon } from './Icons';

import NavMenu from './particial/NavMenu';

class SideMenuBar extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {};
  }

  handleMenuItemClick = (path) => {
    this.props.dispatch(push(path));
  };

  render() {
    const { loggedin, mobile, authorities, t } = this.props;
    let isRole = false;
    if (authorities) {
      isRole =
        authorities.includes(Immutable.Map({ name: 'ROLE_HR' })) ||
        authorities.includes(Immutable.Map({ name: 'ROLE_ADMIN' })) ||
        authorities.includes(Immutable.Map({ name: 'ROLE_TENANT_ADMIN' }));
    }
    const isMyTeam =
      authorities &&
      !authorities.includes(Immutable.Map({ name: 'ROLE_LIMIT_USER' }));

    if (mobile) {
      return null;
    }

    let authItems = [
      {
        label: t('dashboard'),
        icon: HomeIcon,
        children: [
          {
            label: 'User Dashboard',
            key: 'dashboard',
          },
          {
            label: 'Onboarding Dashboard',
            key: 'Document',
          },
        ],
      },
      {
        label: t('jobs'),
        icon: JobIcon,
        key: 'jobs',
      },
      {
        label: t('candidates'),
        icon: CandidateIcon,
        key: 'candidates',
      },
    ];
    if (
      authorities &&
      !authorities.includes(Immutable.Map({ name: 'ROLE_LIMIT_USER' }))
    ) {
      authItems = authItems.concat([
        {
          label: t('companies'),
          icon: ClientIcon,
          key: 'companies',
        },
        {
          label: t('emailBlast'),
          icon: EmailBlastIcon,
          key: 'emailblast',
        },
        {
          label: t('templates'),
          icon: TemplateIcon,
          key: 'templates',
        },
      ]);
    }

    if (
      authorities &&
      (authorities.includes(Immutable.Map({ name: 'ROLE_TENANT_ADMIN' })) ||
        authorities.includes(Immutable.Map({ name: 'ROLE_PRIMARY_RECRUITER' })))
    ) {
      authItems = authItems.concat([
        {
          label: t('reports'),
          icon: ReportIcon,
          key: 'reports',
        },
        {
          label: t('finance'),
          icon: CreditCard,
          key: 'finance',
        },
      ]);
    } else {
      if (
        authorities &&
        !authorities.includes(Immutable.Map({ name: 'ROLE_LIMIT_USER' }))
      ) {
        authItems = authItems.concat([
          {
            label: t('reports'),
            icon: ReportIcon,
            key: 'reports',
          },
        ]);
      }
    }
    // authItems.push({
    //   label: t('search'),
    //   icon: Search,
    //   key: 'search',
    // });

    // authItems.push({
    //     label: t('reports'),
    //     icon: ReportIcon,
    //     key: 'reports'
    // });
    // authItems.push({
    //   label: t('Document'),
    //   icon: ReportIcon,
    //   key: 'Document',
    // });

    if (isMyTeam && isRole) {
      authItems.push({
        label: t('settings'),
        icon: SettingsIcon,
        children: [
          {
            label: 'Onboarding',
            children: [
              {
                label: 'Documents',
                key: 'setting/document',
              },
              {
                label: 'Packages',
                key: 'setting/package',
              },
              {
                label: 'E-Signature',
                key: 'setting/esignature',
              },
            ],
          },
          {
            label: 'My Team',
            key: 'myteam',
          },
        ],
      });
    } else if (isRole) {
      authItems.push({
        label: t('settings'),
        icon: SettingsIcon,
        children: [
          {
            label: 'Onboarding',
            children: [
              {
                label: 'Documents',
                key: 'setting/document',
              },
              {
                label: 'Packages',
                key: 'setting/package',
              },
              {
                label: 'E-Signature',
                key: 'setting/esignature',
              },
            ],
          },
        ],
      });
    } else if (isMyTeam) {
      authItems.push({
        label: t('settings'),
        icon: SettingsIcon,
        children: [
          {
            label: 'My Team',
            key: 'myteam',
          },
        ],
      });
    }

    authItems.push({
      label: t('Timesheets'),
      icon: ClearAllTwoToneIcon,
      key: 'timesheets',
    });

    authItems = loggedin ? authItems : [];
    if (
      authorities &&
      authorities.includes(Immutable.Map({ name: 'ROLE_ES' }))
    ) {
      authItems = [
        {
          label: t('search'),
          icon: Search,
          key: 'search',
        },
      ];
    }

    return (
      <NavMenu
        menuItems={authItems}
        // selectedIndex={selectedIndex}
        handleMenuItemClick={this.handleMenuItemClick}
      />
    );
  }
}

function mapStoreStateToProps(state) {
  const loggedin = state.controller.loggedin;
  return {
    loggedin,
    mobile: state.mobile,
    authorities: state.controller.currentUser.get('authorities'),
  };
}

export default withTranslation('nav')(
  connect(mapStoreStateToProps)(SideMenuBar)
);
