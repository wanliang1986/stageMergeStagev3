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
import InternalPerformanceReport from './InternalPerformanceReport';
import SkipSubmitToAMUsers from './SkipSubmitToAMUsers';
import Loading from '../../../components/particial/Loading';

const status = {};

class CompanyTabs extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: status[this.props.companyId] || 'overview',
    };
  }

  componentDidMount() {
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
    status[this.props.companyId] = selectedTab;
    this.setState({ selectedTab });
  };

  render() {
    const {
      t,
      company,
      companyType,
      isCompanyAdmin,
      hasAuthorities,
      canSkipSubmitToAM,
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

    let isProspect = company.get('type') === 'POTENTIAL_CLIENT';

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
          <Tab value={'overview'} label={t('Overview')} />
          <Tab value={'contacts'} label={t('contacts')} />
          {isProspect ? (
            <Tab value={'progressNote'} label={t('BD Progress Notes')} />
          ) : (
            <Tab value={'jobs'} label={t('Jobs')} disabled={isProspect} />
          )}
          {!isProspect && (
            <Tab value={'serviceContracts'} label={t('Service Contracts')} />
          )}
          {!isProspect && (
            <Tab
              value={'programTeam'}
              label={t('programTeam')}
              disabled={isProspect}
            />
          )}
          <Tab value={'note'} label={t('Note')} />
          {!isProspect && hasAuthorities && (
            <Tab value={'amReport'} label={t('AM Report')} />
          )}
          {!isProspect && hasAuthorities && (
            <Tab
              value={'internalPerformanceReport'}
              label={t('Internal Performance Report')}
            />
          )}
          {!isProspect && hasAuthorities && canSkipSubmitToAM && (
            <Tab
              value={'skipSubmitToAMUsers'}
              label={t('Skip Submit to AM Users')}
            />
          )}
        </Tabs>
        <div
          className={'flex-container flex-child-auto flex-dir-column'}
          style={{ overflow: 'hidden' }}
        >
          {selectedTab === 'overview' && (
            <Overview t={t} {...props} company={company} />
          )}
          {selectedTab === 'contacts' && (
            <Contacts t={t} {...props} company={company} />
          )}
          {selectedTab === 'progressNote' && (
            <ProgressNotes t={t} {...props} company={company} />
          )}
          {selectedTab === 'jobs' && <OpenJobs t={t} {...props} />}
          {selectedTab === 'serviceContracts' && (
            <Contracts t={t} {...props} company={company} />
          )}
          {selectedTab === 'programTeam' && <ProgramTeam t={t} {...props} />}
          {selectedTab === 'note' && (
            <CompanyNote t={t} {...props} company={company} />
          )}
          {selectedTab === 'amReport' && (
            <AmReport t={t} {...props} company={company} />
          )}
          {selectedTab === 'internalPerformanceReport' && (
            <InternalPerformanceReport t={t} {...props} company={company} />
          )}
          {selectedTab === 'skipSubmitToAMUsers' && (
            <SkipSubmitToAMUsers t={t} {...props} company={company} />
          )}
        </div>
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

  const canSkipSubmitToAM =
    !!state.model.skimSubmitToAMCompanies.get(companyId);
  return {
    company: state.model.companies.get(companyId),
    companyId,
    isCompanyAdmin,
    hasAuthorities,
    companyType,
    canSkipSubmitToAM,
  };
};

export default withTranslation(['tab', 'action', 'field', 'message', 'common'])(
  connect(mapStateToProps)(CompanyTabs)
);
