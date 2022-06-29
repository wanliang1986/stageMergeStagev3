import React from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import {
  getApplicationsByTalentId,
  getTalent,
} from '../../../actions/talentActions';
import { distSelect } from '../../../../apn-sdk/newSearch';
import { getNewOptions } from '../../../actions/newCandidate';
import {
  getStartByTalentId,
  selectStartToOpen,
} from '../../../actions/startActions';

import Paper from '@material-ui/core/Paper';

import CandidateLeft from '../Detail/CandidateLeft';
import CandidateDetailRight from '../Detail/CandidateDetailRight';
import CandidateLayout from '../../../components/particial/CandidateLayout';
import Loading from '../../../components/particial/Loading';
import Resume from '../Detail/Resume';

class CandidateDetail extends React.PureComponent {
  state = {
    loadingApplications: true,
    loadingOwnerships: true,
    bigFlag: false,
  };
  fetchData() {
    const { candidateId, dispatch } = this.props;
    dispatch(getTalent(candidateId)).finally(() => {
      this.setState({ loadingOwnerships: false });
    });
    dispatch(getStartByTalentId(candidateId));
    dispatch(getApplicationsByTalentId(candidateId)).finally(() =>
      this.setState({ loadingApplications: false })
    );
    //reset opened start
    dispatch(selectStartToOpen(null));
  }

  getSelectOptions = () => {
    Promise.all([distSelect(65), distSelect(92)]).then((res) => {
      this.props.dispatch(getNewOptions(['degreeList', res[0].response]));
      this.props.dispatch(getNewOptions(['workAuthList', res[1].response]));
    });
  };

  componentDidMount() {
    this.fetchData();
    this.getSelectOptions();
  }

  changeTableSize = () => {
    this.setState({
      bigFlag: !this.state.bigFlag,
    });
  };

  render() {
    const { candidate, tReady, isLimitUser, ...props } = this.props;
    const { loadingApplications, loadingOwnerships, bigFlag } = this.state;

    if (!candidate) {
      return <Loading />;
    }

    return (
      <CandidateLayout bigFlag={bigFlag}>
        {bigFlag ? null : (
          <CandidateLeft
            {...props}
            candidate={candidate}
            isLimitUser={isLimitUser}
            loadingOwnerships={loadingOwnerships}
          />
        )}

        {isLimitUser ? (
          <Paper
            className="flex-child-auto flex-container flex-dir-column"
            style={{ overflow: 'hidden' }}
          >
            <Resume {...props} isLimitUser={isLimitUser} />
          </Paper>
        ) : (
          <CandidateDetailRight
            {...props}
            candidate={candidate}
            loadingApplications={loadingApplications}
            changeTableSize={this.changeTableSize}
            bigFlag={bigFlag}
          />
        )}
      </CandidateLayout>
    );
  }
}

function mapStoreStateToProps(state, { match }) {
  const candidateId = match.params.candidateId;
  const candidate = state.model.talents.get(candidateId);
  const tenantId = state.controller.currentUser.get('tenantId');
  const authorities = state.controller.currentUser.get('authorities');
  const canEdit =
    candidate &&
    candidate.get('createdBy') &&
    Number(candidate.get('createdBy').split(',')[1]) === tenantId;

  return {
    candidateId,
    canEdit,
    candidate,
    tenantId,
    isLimitUser:
      !authorities ||
      authorities.includes(Immutable.Map({ name: 'ROLE_LIMIT_USER' })),
  };
}

export default withTranslation(['tab', 'action', 'field', 'message'])(
  connect(mapStoreStateToProps)(CandidateDetail)
);
