import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { makeCancelable } from '../../../../utils';
import { getResumesByTalentId } from '../../../actions/talentActions';
import {
  getActiveStartListByTalent,
  getExtensionList,
} from '../../../selectors/startSelector';

import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import Resume from './Resume';
import CandidateStart from './CandidateStart/CandidateStart';
import CandidateExtension from './CandidateExtension/CandidateExtension';
import CandidateConversionStart from './CandidateConversionStart/CandidateConversionStart';
import AppliedJobs from './AppliedJobs.jsx';
import AIRecommendations from './AIRecommendations';

// tabs: 'AIRecommendations','appliedJobs','resume', 'start','extension', 'conversionStart'
class CandidateDetailRight extends React.Component {
  state = {
    selectedTab: this.props.hasActiveStart
      ? 'appliedJobs'
      : 'AIRecommendations',
    loadingResume: true,
  };

  componentDidMount() {
    const { dispatch, candidateId } = this.props;
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
    // const selectedTab = this.state.selectedTab
    let nextSelectedTab = this.state.selectedTab;
    if (
      nextProps.hasActiveStart &&
      !this.props.hasActiveStart &&
      this.state.selectedTab === 'AIRecommendations'
    ) {
      nextSelectedTab = 'appliedJobs';
    }
    if (nextProps.startOpen) {
      nextSelectedTab = 'start';
    }
    if (nextProps.extensionOpen) {
      nextSelectedTab = 'extension';
    }
    if (nextProps.conversionStartOpen) {
      nextSelectedTab = 'conversionStart';
    }
    this.setState({
      selectedTab: nextSelectedTab,
    });
  }

  componentWillUnmount() {
    this.resumeTask.cancel();
  }

  tabsClickHandler = (e, selectedTab) => {
    this.setState({ selectedTab });
  };
  handleCloseStartTab = (cb) => {
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

  render() {
    const { selectedTab, loadingResume } = this.state;

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
    } = this.props;

    const canEdit =
      candidate.get('createdBy') &&
      Number(candidate.get('createdBy').split(',')[1]) === tenantId;

    return (
      <Paper
        className="flex-child-auto flex-container flex-dir-column"
        style={{ overflow: 'hidden' }}
      >
        <Tabs
          value={selectedTab}
          onChange={this.tabsClickHandler}
          indicatorColor="primary"
          textColor="primary"
        >
          {!hasActiveStart && (
            <Tab
              label={t('tab:AIRecommendations')}
              value={'AIRecommendations'}
            />
          )}
          <Tab label={t('tab:AppliedJobs')} value={'appliedJobs'} />
          <Tab label={t('tab:resume')} value={'resume'} />
          {startOpen && <Tab label={t('tab:Start')} value={'start'} />}
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
            <Tab label={t('tab:Conversion Start')} value={'conversionStart'} />
          )}
        </Tabs>

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
  const authorities = state.controller.currentUser.get('authorities');

  const isAdmin =
    !!authorities &&
    (authorities.includes(Immutable.Map({ name: 'ROLE_TENANT_ADMIN' })) ||
      authorities.includes(Immutable.Map({ name: 'ROLE_PRIMARY_RECRUITER' })));
  const currentStart = state.controller.currentStart.get('start');
  const currentExtension = state.controller.currentStart.get('extension');
  const currentConversionStart =
    state.controller.currentStart.get('conversionStart');
  const extensionCount = currentStart
    ? getExtensionList(state, currentStart.get('applicationId')).size
    : 0;

  return {
    isAdmin,
    startOpen:
      currentStart && currentStart.get('talentId') === candidate.get('id'),
    extensionOpen:
      currentExtension &&
      currentExtension.get('talentId') === candidate.get('id'),
    conversionStartOpen:
      currentConversionStart &&
      currentConversionStart.get('talentId') === candidate.get('id'),
    currentStart,
    currentExtension,
    currentConversionStart,
    extensionCount,
    hasActiveStart: getActiveStartListByTalent(state, candidateId).size,
  };
};

export default connect(mapStateToProps)(CandidateDetailRight);
