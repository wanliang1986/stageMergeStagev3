import React from 'react';
import { connect } from 'react-redux';
import { JOB_TYPES } from '../../../../constants/formOptions';
import { getTalentResumeArray } from '../../../../selectors/talentResumeSelector';
import {
  getAssignedUserArray,
  getACArray,
  getActiveTenantUserArray,
  getDMArray,
  getActiveAMArray,
} from '../../../../selectors/userSelector';
import { getJob } from '../../../../actions/jobActions';

import AddApplicationDefaultForm from './AddApplicationDefaultForm';
import AddApplicationPayrollingForm from './AddApplicationPayRollingForm';
import Loading from '../../../particial/Loading';

class AddApplication extends React.PureComponent {
  componentDidMount() {
    //should load job first,then check jobType
    this.fetchData();
  }

  fetchData = () => {
    const { jobId, dispatch, isJobDetail } = this.props;
    if (!isJobDetail) {
      dispatch(getJob(jobId));
    }
  };

  render() {
    console.log('this.props::::', this.props);
    if (
      !this.props.job ||
      !this.props.job.get('jobType') ||
      !this.props.job.get('assignedUsers')
    ) {
      return <Loading />;
    }
    if (this.props.job.get('jobType') === JOB_TYPES.Payrolling) {
      return <AddApplicationPayrollingForm {...this.props} />;
    }
    return <AddApplicationDefaultForm {...this.props} />;
  }
}

function mapStoreStateToProps(state, { jobId, talentId }) {
  const job = state.model.jobs.get(String(jobId));
  const canSkipSubmitToAM = !!state.model.skimSubmitToAMCompanies.get(
    String(job && job.get('companyId'))
  );
  return {
    job,
    talent: state.model.talents.get(String(talentId)),
    resumeList: getTalentResumeArray(state, talentId),
    userList: getActiveTenantUserArray(state),
    recruiterList: getAssignedUserArray(state, jobId),
    amList: getActiveAMArray(state, String(jobId)),
    acList: getACArray(state, String(jobId)),
    dmList: getDMArray(state, String(jobId)),
    currentUserId: state.controller.currentUser.get('id'),
    canSkipSubmitToAM,
  };
}

export default connect(mapStoreStateToProps)(AddApplication);
