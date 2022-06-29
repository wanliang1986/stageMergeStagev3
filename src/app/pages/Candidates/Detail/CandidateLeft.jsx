import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getApplicationListByTalent } from '../../../selectors/applicationSelector';
import talentNoteSelector from '../../../selectors/talentNoteSelector';
import { getActiveStartListByTalent } from '../../../selectors/startSelector';
import dateFns from 'date-fns';
import {
  getTalentOwnerList,
  getTalentShareList,
} from '../../../selectors/talentOwnershipSelector';
import Scrollbars from 'react-custom-scrollbars';

import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import CandidateActivities from './CandidateActivities';
import CandidateNotes from './CandidateNotes';
import CandidateQualification from '../newDetail/candidateQualification';
import CandidateContacts from '../newDetail/candidateContacts';

class CandidateTabs extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      selectedTab: 0,
    };
  }

  tabsClickHandler = (e, selectedTab) => {
    this.setState({ selectedTab });
  };

  render() {
    const { t, applicationList, notes, canEdit, candidateId } = this.props;
    const { selectedTab } = this.state;
    return (
      <Paper
        className="flex-child-auto flex-container flex-dir-column"
        style={{ overflow: 'hidden', height: '100%' }}
      >
        <Tabs
          value={selectedTab}
          onChange={this.tabsClickHandler}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label={t('tab:qualifications')} />
          <Tab label={`${t('tab:activities')} ${applicationList.size}`} />
          <Tab label={`${t('tab:notes')} ${notes.size}`} />
        </Tabs>
        <Scrollbars>
          {selectedTab === 0 && (
            <CandidateQualification
              t={t}
              canEdit={canEdit}
              candidateId={candidateId}
              history={this.props.history}
            />
          )}
          {selectedTab === 1 && (
            <CandidateActivities t={t} candidateId={candidateId} />
          )}
          {selectedTab === 2 && (
            <CandidateNotes t={t} candidateId={candidateId} />
          )}
        </Scrollbars>
      </Paper>
    );
  }
}

class CandidateLeft extends React.PureComponent {
  handleEdit = () => {
    this.props.history.push(`/candidates/edit/${this.props.candidateId}`, {
      stepIndex: 0,
    });
  };

  render() {
    const {
      t,
      tenantId,
      candidate,
      candidateId,
      applicationList,
      notes,
      isLimitUser,
      shares,
      owners,
      canNotApply,
      activeStartList,
    } = this.props;

    const canEdit =
      candidate.get('createdBy') &&
      Number(candidate.get('createdBy').split(',')[1]) === tenantId;
    return (
      <div
        className="flex-child-auto flex-container flex-dir-column vertical-layout"
        style={{ userSelect: 'text' }}
      >
        <CandidateContacts
          candidate={candidate}
          canEdit={canEdit}
          handleEdit={this.handleEdit}
          applicationList={applicationList}
          isLimitUser={isLimitUser}
          t={t}
          shares={shares}
          owners={owners}
          canNotApply={canNotApply}
          activeStartList={activeStartList}
        />
        <CandidateTabs
          candidateId={candidateId}
          notes={notes}
          applicationList={applicationList}
          history={this.props.history}
          canEdit={canEdit}
          t={t}
        />
      </div>
    );
  }
}

CandidateLeft.prototypes = {
  candidateId: PropTypes.string.isRequired,
};

function mapStoreStateToProps(
  state,
  { candidateId, loadingOwnerships, candidate }
) {
  const favoriteCandidateIds = state.controller.searchTalents.favor.ids;
  const shares = getTalentShareList(state, candidateId);
  const currentUserId = state.controller.currentUser.get('id');
  const canNotApply =
    currentUserId &&
    dateFns.isBefore(
      new Date(),
      dateFns.addDays(candidate.get('createdDate'), 3)
    ) &&
    !loadingOwnerships &&
    !shares.find((s) => s.get('userId') === currentUserId) &&
    candidate.getIn(['createdUser', 'id']) !== currentUserId;
  return {
    isLoaded: Boolean(favoriteCandidateIds),
    applicationList: getApplicationListByTalent(state, candidateId),
    notes: talentNoteSelector(state, candidateId),
    shares,
    owners: getTalentOwnerList(state, candidateId),
    canNotApply,
    activeStartList: getActiveStartListByTalent(state, candidateId),
  };
}

export default connect(mapStoreStateToProps)(CandidateLeft);
