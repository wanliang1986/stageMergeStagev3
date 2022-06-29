import React from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import CompanyInfo from './CompanyInfo';
import UserList from './UserList';
import GroupList from './GroupList';
// import Demo from './Demo';
import Division from './Division';
import Loading from '../../../components/particial/Loading';
import NewCompanyInfo from './newCompanyInfo';

import { getAssignedUserJob } from '../../../actions/teamActions';

const tabs = ['?tab=users', '?tab=grouplist', '?tab=division', '?tab=info'];

class TenantsTabs extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      selectedTab: tabs.indexOf(props.location.search || '?tab=users'),
    };
  }

  static getDerivedStateFromProps(props, state) {
    return {
      selectedTab: tabs.indexOf(props.location.search || '?tab=users'),
    };
  }

  componentDidMount() {
    console.timeEnd('talent tab');
    const { userId, dispatch } = this.props;
    let id = String(userId);
    dispatch(getAssignedUserJob(id));
  }

  componentDidUpdate() {
    console.timeEnd('talent tab');
  }

  tabsClickHandler = (event, selectedTab) => {
    this._handleActive(selectedTab);
  };

  _handleActive = (selectedTab) => {
    /*
     * not setState here
     * new State will be set next lifecycle WillReceiveProps
     * */
    this.props.history.replace(
      tabs[selectedTab],
      this.props.location.state || {}
    );
  };

  render() {
    console.time('talent tab');
    const { t, authorities } = this.props;
    const { selectedTab } = this.state;

    if (!authorities) {
      return (
        <Paper className="flex-child-auto flex-container flex-dir-column">
          <Loading />
        </Paper>
      );
    }
    return (
      <Paper className="flex-child-auto flex-container flex-dir-column">
        <Tabs
          value={selectedTab}
          onChange={this.tabsClickHandler}
          variant="scrollable"
          scrollButtons="off"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label={t('userList')} />
          <Tab label={t('groupList')} />
          <Tab label={t('User Office')} />
          <Tab label={t('companyInfo')} />
        </Tabs>

        <div className="flex-child-auto flex-container flex-dir-column">
          {selectedTab === 0 && <UserList t={t} />}
          {selectedTab === 1 && <GroupList t={t} />}
          {selectedTab === 2 && <Division t={t} />}
          {/* {selectedTab === 3 && <CompanyInfo t={t} />} */}
          {selectedTab === 3 && <NewCompanyInfo t={t} />}
        </div>
      </Paper>
    );
  }
}

const mapStoreStateToProps = (state) => {
  const authorities = state.controller.currentUser.get('authorities');
  const userId = state.controller.currentUser.get('id');
  return {
    authorities,
    userId,
  };
};

export default withTranslation(['tab', 'action', 'field', 'message'])(
  connect(mapStoreStateToProps)(TenantsTabs)
);
