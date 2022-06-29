import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { makeCancelable } from '../../../../utils';
import { getResumesByTalentId } from '../../../actions/talentActions';
import {
  getActiveStartListByTalent,
  getStartListByTalent,
  getExtensionList,
} from '../../../selectors/startSelector';
import { OpenOnboarding } from '../../../actions/startActions';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import Resume from './Resume';
import CandidateStart from './CandidateStart/CandidateStart';
import CandidateExtension from './CandidateExtension/CandidateExtension';
import CandidateConversionStart from './CandidateConversionStart/CandidateConversionStart';
import AppliedJobs from './AppliedJobs.jsx';
import AIRecommendations from './AIRecommendations';
import Assignment from './Assignment';
import Onboard from './Onboard';
import UnfoldMoreIcon from '@material-ui/icons/UnfoldMore';
import UnfoldLessIcon from '@material-ui/icons/UnfoldLess';

import * as ActionTypes from '../../../constants/actionTypes';
// tabs: 'AIRecommendations','appliedJobs','resume', 'start','extension', 'conversionStart'

class CandidateDetailRight extends React.Component {
  state = {
    selectedTab: this.props.hasActiveStart
      ? 'appliedJobs'
      : 'AIRecommendations',
    loadingResume: true,
    openOnboardTitle: this.props.title,
    isShowStart: this.props.isShowStart,
  };

  componentDidMount() {
    const { dispatch, candidateId } = this.props;
    dispatch(OpenOnboarding(null));
    this.resumeTask = makeCancelable(
      dispatch(getResumesByTalentId(candidateId))
    );
    this.resumeTask.promise
      .then(() => this.setState({ loadingResume: false }))
      .catch((err) => {
        if (!err.isCanceled) {
          this.setState({ loadingResume: false });
        }
      });
  }

  UNSAFE_componentWillReceiveProps(nextProps: Readonly<P>, nextContext: any) {
    let nextSelectedTab = this.state.selectedTab;
    if (
      (nextProps.hasActiveStart &&
        !this.props.hasActiveStart &&
        this.state.selectedTab === 'AIRecommendations') ||
      nextProps.selectedTab === 'appliedJobs'
    ) {
      nextSelectedTab = 'appliedJobs';
    }
    if (nextProps.selectedTab === 'resume') {
      nextSelectedTab = 'resume';
    }
    if (nextProps.startOpen && nextProps.selectedTab === 'start') {
      nextSelectedTab = 'start';
    }
    if (nextProps.extensionOpen && nextProps.selectedTab === 'extension') {
      nextSelectedTab = 'extension';
    }
    if (
      nextProps.conversionStartOpen &&
      nextProps.selectedTab === 'conversionStart'
    ) {
      nextSelectedTab = 'conversionStart';
    }
    if (
      nextProps.openOnboarding &&
      nextProps.title === 'openOnboard' &&
      nextProps.selectedTab === 'Onboard'
    ) {
      nextSelectedTab = 'Onboard';
    }
    if (nextProps.selectedTab === 'Assignment') {
      nextSelectedTab = 'Assignment';
    }
    console.log('nextProps.title', nextProps.title);
    // if (nextProps.title === 'openOnboard') {
    //   this.setState({
    //     selectedTab: 'Onboard',
    //     openOnboardTitle: 'openOnboard',
    //   });
    // } else if (
    //   nextProps.title === 'openStart' &&
    //   nextProps.startOpen &&
    //   !nextProps.extensionOpen &&
    //   !nextProps.conversionStartOpen
    // ) {
    //   this.setState({
    //     selectedTab: 'start',
    //     isShowStart: true,
    //   });
    // } else {
    this.setState({ selectedTab: nextSelectedTab });
    // }
  }

  componentWillUnmount() {
    this.resumeTask.cancel();
  }

  tabsClickHandler = (e, selectedTab) => {
    const { dispatch, applicationId, hasOnboardingBtn } = this.props;
    if (selectedTab === 'Onboard') {
      dispatch(OpenOnboarding(applicationId, 'openOnboard', null, true));
    }
    dispatch({
      type: ActionTypes.TAB_SELECT,
      selectedTab,
    });
    this.setState({ selectedTab });
  };

  handleCloseStartTab = (cb) => {
    console.log(this.props.hasActiveStart);
    this.setState(
      {
        selectedTab: this.props.hasActiveStart
          ? 'appliedJobs'
          : 'AIRecommendations',
      },
      () => {
        if (cb) {
          cb();
        }
      }
    );
  };

  companyAm = (recommendation, startJobId) => {
    let dialogRecommendation = recommendation.filter((item, index) => {
      return item.id === startJobId;
    });
    if (dialogRecommendation.length > 0 && dialogRecommendation[0].company) {
      return dialogRecommendation[0].company.isAm;
    }
    return false;
  };

  isJobAM = () => {
    const { userId, jobs, startJobId } = this.props;
    let assignedUsers =
      jobs.get(`${startJobId}`) &&
      jobs.get(`${startJobId}`).get('assignedUsers');
    let status =
      assignedUsers &&
      assignedUsers.some((item, index) => {
        return item.get('userId') === userId && item.get('permission') === 'AM';
      });
    return status;
  };

  componentWillUnmount() {
    this.props.dispatch({
      type: ActionTypes.TAB_SELECT,
      selectedTab: '',
    });
  }

  render() {
    const { selectedTab, loadingResume, openOnboardTitle, isShowStart } =
      this.state;
    const { bigFlag } = this.props;
    const {
      t,
      tenantId,
      candidate,
      candidateId,
      startOpen,
      loadingApplications,
      currentStart,
      currentExtension,
      extensionOpen,
      currentConversionStart,
      conversionStartOpen,
      extensionCount,
      hasActiveStart,
      inCommissions,
      hasAdmin,
      applicationId,
      recommendation,
      startJobId,
      hasOnboardingBtn,
    } = this.props;
    const canEdit =
      candidate.get('createdBy') &&
      Number(candidate.get('createdBy').split(',')[1]) === tenantId;
    let isJobAM = this.isJobAM();
    const openOnboardFlag =
      applicationId && openOnboardTitle === 'openOnboard' && hasOnboardingBtn; // Onboard tabs是否显示
    const openStartFlag = isShowStart && currentStart?.toJS(); // Start tabs是否显示

    return (
      <Paper
        className="flex-child-auto flex-container flex-dir-column"
        style={{ overflow: 'hidden' }}
      >
        <div style={{ width: '100%' }}>
          <div
            style={
              bigFlag
                ? { width: '95%', overflow: 'hidden', float: 'left' }
                : { width: '93%', overflow: 'hidden', float: 'left' }
            }
          >
            <Tabs
              value={selectedTab}
              onChange={this.tabsClickHandler}
              indicatorColor="primary"
              textColor="primary"
              variant="scrollable"
              scrollButtons="auto"
            >
              {!hasActiveStart && (
                <Tab
                  label={t('tab:AIRecommendations')}
                  value={'AIRecommendations'}
                />
              )}
              <Tab label={t('tab:AppliedJobs')} value={'appliedJobs'} />
              <Tab label={t('tab:resume')} value={'resume'} />

              {/* Start */}
              {(openStartFlag || openOnboardFlag || startOpen) && (
                <Tab label={t('tab:Start')} value={'start'} />
              )}

              {extensionOpen && (
                <Tab
                  label={
                    t('tab:Extension') +
                    (extensionCount > 1 ? ` (${extensionCount})` : '')
                  }
                  value={'extension'}
                />
              )}
              {conversionStartOpen && (
                <Tab
                  label={t('tab:Conversion Start')}
                  value={'conversionStart'}
                />
              )}

              {/* Onboard */}
              {(openOnboardFlag || startOpen) && hasOnboardingBtn && (
                <Tab label={t('tab:Onboard')} value={'Onboard'} />
              )}

              {(((inCommissions ||
                hasAdmin ||
                this.companyAm(recommendation, startJobId) ||
                isJobAM) &&
                startOpen &&
                currentStart.get('startType') &&
                (currentStart.get('positionType') === 'CONTRACT' ||
                  currentStart.get('positionType') === 'PAY_ROLL')) ||
                openOnboardFlag) && (
                <Tab label={t('tab:Assignment')} value={'Assignment'} />
              )}
            </Tabs>
          </div>
          <div style={{ width: '5%', float: 'left' }}>
            <div
              style={
                bigFlag
                  ? {
                      transform: 'rotate(45deg)',
                      cursor: 'pointer',
                      margin: '10px',
                    }
                  : {
                      transform: 'rotate(45deg)',
                      cursor: 'pointer',
                      margin: '2px',
                    }
              }
              onClick={() => {
                this.props.changeTableSize();
              }}
            >
              {bigFlag ? (
                <UnfoldLessIcon fontSize="large" style={{ color: '#939393' }} />
              ) : (
                <UnfoldMoreIcon fontSize="large" style={{ color: '#939393' }} />
              )}
            </div>
          </div>
        </div>

        <div
          className="flex-child-auto flex-container flex-dir-column"
          style={{ overflow: 'auto' }}
        >
          {selectedTab === 'AIRecommendations' && (
            <AIRecommendations
              t={t}
              candidateId={candidateId}
              loadingApplications={loadingApplications}
              selectedTab={selectedTab}
            />
          )}

          {selectedTab === 'appliedJobs' && (
            <AppliedJobs
              t={t}
              candidateId={candidateId}
              loadingApplications={loadingApplications}
            />
          )}

          {selectedTab === 'resume' && (
            <Resume
              canEdit={canEdit}
              candidateId={candidateId}
              loadingResume={loadingResume}
            />
          )}

          {/* Start */}
          {selectedTab === 'start' && (
            <CandidateStart
              key={currentStart && currentStart.get('applicationId')}
              t={t}
              candidateId={candidateId}
              start={currentStart}
              onCloseStartTab={this.handleCloseStartTab}
              hasActiveStart={hasActiveStart}
            />
          )}
          {selectedTab === 'extension' && (
            <CandidateExtension
              key={currentExtension && currentExtension.get('applicationId')}
              t={t}
              candidateId={candidateId}
              start={currentExtension}
              currentStart={currentStart}
              onCloseStartTab={this.handleCloseStartTab}
              hasActiveStart={hasActiveStart}
            />
          )}
          {selectedTab === 'conversionStart' && (
            <CandidateConversionStart
              key={
                currentConversionStart &&
                currentConversionStart.get('applicationId')
              }
              t={t}
              candidateId={candidateId}
              start={currentConversionStart}
              currentStart={currentStart}
              onCloseStartTab={this.handleCloseStartTab}
            />
          )}

          {/* Onboard */}
          {selectedTab === 'Onboard' && <Onboard t={t} />}

          {selectedTab === 'Assignment' && (
            <Assignment
              t={t}
              candidateId={candidateId}
              start={currentStart}
              isCompanyAm={this.companyAm(recommendation, startJobId)}
              isJobAM={isJobAM}
              {...this.props}
            />
          )}
        </div>
      </Paper>
    );
  }
}

CandidateDetailRight.propTypes = {
  t: PropTypes.func.isRequired,
  candidate: PropTypes.instanceOf(Immutable.Map).isRequired,
};

const mapStateToProps = (state, { candidate, candidateId }) => {
  const recommendation = state.controller.newCandidateJob.get(
    'dialogRecommendation'
  );
  const startJobId =
    state.controller.currentStart.get('start') &&
    state.controller.currentStart.get('start').get('jobId');
  const jobs = state.model.jobs;
  const authorities = state.controller.currentUser.get('authorities');
  const userId = state.controller.currentUser.get('id');
  const isAdmin =
    !!authorities &&
    (authorities.includes(Immutable.Map({ name: 'ROLE_TENANT_ADMIN' })) ||
      authorities.includes(Immutable.Map({ name: 'ROLE_PRIMARY_RECRUITER' })));
  const hasAdmin =
    !!authorities &&
    (authorities.includes(Immutable.Map({ name: 'ROLE_TENANT_ADMIN' })) ||
      authorities.includes(Immutable.Map({ name: 'ROLE_ADMIN' })));

  const currentStart = state.controller.currentStart.get('start');
  if (currentStart) {
    window.localStorage.setItem(
      'currentStart',
      JSON.stringify(currentStart.toJS())
    );
  }
  const commissions = currentStart && currentStart.get('startCommissions');

  const inCommissions =
    commissions &&
    commissions.some((item, index) => {
      return item.get('userId') === userId && item.get('userRole') !== 'OWNER';
    });
  const isCommissionAM =
    commissions &&
    commissions.some((item, index) => {
      return item.get('userId') === userId && item.get('userRole') === 'AM';
    });
  const currentExtension = state.controller.currentStart.get('extension');
  const currentConversionStart =
    state.controller.currentStart.get('conversionStart');
  const extensionCount = currentStart
    ? getExtensionList(state, currentStart.get('applicationId')).size
    : 0;
  return {
    isAdmin,
    hasAdmin,
    inCommissions,
    isCommissionAM,
    startOpen:
      currentStart && currentStart.get('talentId') === candidate.get('id'),
    extensionOpen:
      currentExtension &&
      currentExtension.get('talentId') === candidate.get('id'),
    conversionStartOpen:
      currentConversionStart &&
      currentConversionStart.get('talentId') === candidate.get('id'),
    currentStart,
    isShowStart: state.controller.currentStart.toJS().isShowStart,
    currentExtension,
    currentConversionStart,
    extensionCount,

    openOnboarding: state.controller.openOnboarding,
    hasActiveStart: getActiveStartListByTalent(state, candidateId).size,
    applicationId: state.controller.openOnboarding?.action.applicationId,
    title: state.controller.openOnboarding?.action.title,
    hasOnboardingBtn: state.controller.openOnboarding?.action.hasOnboardingBtn,
    selectedTab: state.controller.selectTab,
    recommendation,
    startJobId,
    jobs,
    userId,
  };
};

export default connect(mapStateToProps)(CandidateDetailRight);
