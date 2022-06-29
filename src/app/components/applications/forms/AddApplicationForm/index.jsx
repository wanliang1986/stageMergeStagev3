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
import { getRecruitmentProcessId } from '../../../../../apn-sdk/newApplication';

import { getJob } from '../../../../actions/jobActions';

import AddApplicationDefaultFormV3 from './AddApplicationDefaultFormV3';
import AddApplicationPayrollingFormV3 from './AddApplicationPayRollingFormV3';
import Loading from '../../../particial/Loading';

class AddApplication extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      recruitmentProcessNodes: [],
      recruitmentProcessId: null,
    };
  }
  componentDidMount() {
    //should load job first,then check jobType
    this.fetchData();

    getRecruitmentProcessId(this.props.job.get('jobType'))
      .then(({ response }) => {
        this.setState({
          recruitmentProcessNodes: response.recruitmentProcessNodes,
          recruitmentProcessId: response.id,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  fetchData = () => {
    const { jobId, dispatch, isJobDetail } = this.props;
    if (!isJobDetail) {
      dispatch(getJob(jobId));
    }
  };

  render() {
    const { recruitmentProcessNodes } = this.state;
    // console.log('this.props::::', this.props.job.toJS());
    if (
      !this.props.job ||
      !this.props.job.get('jobType') ||
      !this.props.job.get('assignedUsers')
    ) {
      return <Loading />;
    }
    if (
      this.props.job.get('jobType') === JOB_TYPES.Payrolling &&
      recruitmentProcessNodes.length === 2
    ) {
      return <AddApplicationPayrollingFormV3 {...this.props} {...this.state} />;
    }
    return <AddApplicationDefaultFormV3 {...this.props} {...this.state} />;
  }
}

function mapStoreStateToProps(state, { jobId, talentId }) {
  return {
    job: state.model.jobs.get(String(jobId)),
    talent: state.model.talents.get(String(talentId)),
    resumeList: getTalentResumeArray(state, talentId),
    userList: getActiveTenantUserArray(state),
    recruiterList: getAssignedUserArray(state, jobId),
    amList: getActiveAMArray(state, String(jobId)),
    acList: getACArray(state, String(jobId)),
    dmList: getDMArray(state, String(jobId)),
    currentUserId: state.controller.currentUser.get('id'),
  };
}

export default connect(mapStoreStateToProps)(AddApplication);
