import React from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import {
  getCompany,
  getOpenJobsByCompany,
  getPotentialServiceType,
} from '../../../actions/clientActions';
import { replace } from 'connected-react-router';
import { showErrorMessage } from '../../../actions/index';

import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Divider from '@material-ui/core/Divider';

import CompanyBasic from './CompanyBasic';
import Contacts from './Contacts';
import OpenJobs from './OpenJobs';
import Contracts from './Contracts';
import ProgramTeam from './ProgramTeam';
import Overview from './overView/Overview';
import ProgressNotes from './ProgressNotes';
import CompanyNote from './CompanyNote';
import AmReport from './AmReport';
import SwipeableViews from '../../../components/particial/SwipeableViews';
import InternalPerformanceReport from './InternalPerformanceReport';
import Loading from '../../../components/particial/Loading';

const status = {};

class CompanyTabs extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 0,
    };
  }

  componentDidMount() {
    this.setState({
      selectedTab: 0,
    });
    this.fetchData();
  }

  fetchData = () => {
    const { dispatch, companyId, companyType } = this.props;
    dispatch(getOpenJobsByCompany(companyId));
    dispatch(getPotentialServiceType());
    // dispatch(getContactsByCompany(companyId));
    // dispatch(getClientContactList(companyId));
    dispatch(getCompany(companyId, companyType)).catch((err) => {
      if (err === 404) {
        dispatch(replace('/companies/nomatch'));
      } else {
        dispatch(showErrorMessage(err));
      }
    });
  };

  tabsClickHandler = (e, selectedTab) => {
    status.selectedTab = selectedTab;
    this.setState({ selectedTab });
  };

  render() {
    const {
      t,
      company,
      companyType,
      isCompanyAdmin,
      hasAuthorities,
      ...props
    } = this.props;
    const { selectedTab } = this.state;
    if (!company) {
      return (
        <div className="flex-child-auto flex-container flex-dir-column">
          <Loading />
        </div>
      );
    }
    // console.log('[company]', company.toJS());

    let isProspect = companyType === '1';
    //todo: fix program team
    const swipeableViews = [
      selectedTab === 0 ? (
        <Overview t={t} {...props} company={company} key="1" />
      ) : (
        <br key={'1'} />
      ),
      selectedTab === 1 ? (
        <Contacts t={t} {...props} company={company} key={'2'} />
      ) : (
        <br key={'2'} />
      ),
      selectedTab === 2 ? (
        isProspect ? (
          <ProgressNotes t={t} {...props} company={company} key={'3'} />
        ) : (
          <OpenJobs t={t} {...props} key={'3'} />
        )
      ) : (
        <br key={'3'} />
      ),
      selectedTab === 3 ? (
        !isProspect ? (
          <Contracts t={t} {...props} company={company} key={'4'} />
        ) : (
          <CompanyNote t={t} {...props} company={company} key={'4'} />
        )
      ) : (
        <br key={'4'} />
      ),
      selectedTab === 4 && !isProspect ? (
        <ProgramTeam t={t} {...props} key={'5'} />
      ) : (
        <br key={'5'} />
      ),
      selectedTab === 5 && !isProspect ? (
        <CompanyNote t={t} {...props} company={company} key={'6'} />
      ) : (
        <br key={'6'} />
      ),
      selectedTab === 6 && !isProspect ? (
        <AmReport t={t} {...props} company={company} />
      ) : (
        <br />
      ),
      selectedTab === 7 && !isProspect ? (
        <InternalPerformanceReport t={t} {...props} company={company} />
      ) : (
        <br />
      ),
    ];
    return (
      <Paper className="flex-child-auto flex-container flex-dir-column">
        <CompanyBasic
          t={t}
          company={company}
          isCompanyAdmin={isCompanyAdmin}
          isProspect={isProspect}
          {...props}
        />
        <Divider component="div" />
        <Tabs
          value={selectedTab}
          onChange={this.tabsClickHandler}
          variant="scrollable"
          scrollButtons="off"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label={t('Overview')} />
          <Tab label={t('contacts')} />
          {isProspect ? (
            <Tab label={t('BD Progress Notes')} />
          ) : (
            <Tab label={t('Jobs')} disabled={isProspect} />
          )}
          {!isProspect && <Tab label={t('Service Contracts')} />}
          {!isProspect && (
            <Tab label={t('programTeam')} disabled={isProspect} />
          )}
          <Tab label={t('Note')} />
          {!isProspect && hasAuthorities && <Tab label={t('AM Report')} />}
          {!isProspect && hasAuthorities && (
            <Tab label={t('Internal Performance Report')} />
          )}
        </Tabs>

        <SwipeableViews
          index={selectedTab}
          // onChangeIndex={this.handleChangeIndex}
          children={swipeableViews}
        />
      </Paper>
    );
  }
}

const mapStateToProps = (state, { match }) => {
  const companyId = match.params.id;
  const companyType = match.params.type;
  const currentUser = state.controller.currentUser;
  const companies = state.model.companies;
  const currentUserId = currentUser.get('id');
  const salesLead = state.model.companies.getIn([companyId, 'salesLead']);
  const isAM =
    salesLead &&
    salesLead.find((s) => {
      const accountManager = s.get('accountManager');
      return (
        accountManager &&
        accountManager.find((am) => {
          // console.log(am.get('id'));
          return am.get('id') === currentUserId;
        })
      );
    });
  const isSuperuser =
    currentUser.get('authorities') &&
    currentUser
      .get('authorities')
      .includes(Immutable.Map({ name: 'ROLE_ADMIN' }));
  const isCompanyAdmin =
    (currentUser.get('authorities') &&
      currentUser
        .get('authorities')
        .includes(Immutable.Map({ name: 'ROLE_TENANT_ADMIN' }))) ||
    // currentUserId === companies.getIn([companyId, 'accountManager', 'id'])
    isAM ||
    currentUserId === companies.getIn([companyId, 'bdManager', 'id']);
  const hasAuthorities =
    (currentUser.get('authorities') &&
      currentUser
        .get('authorities')
        .includes(Immutable.Map({ name: 'ROLE_TENANT_ADMIN' }))) ||
    isAM ||
    isSuperuser;

  return {
    company: state.model.companies.get(companyId),
    companyId,
    isCompanyAdmin,
    hasAuthorities,
    companyType,
  };
};

export default withTranslation(['tab', 'action', 'field', 'message', 'common'])(
  connect(mapStateToProps)(CompanyTabs)
);
