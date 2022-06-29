import React from 'react';
import { JOB_TYPES } from '../../../../constants/formOptions';
import { connect } from 'react-redux';
import { getAssignedUsers } from '../../../../selectors/userSelector';

import Loading from '../../../../components/particial/Loading';
import JobContact from './JobInfoContract';
import JobFullTime from './JobInfoFullTime';
import JobInfoPayrolling from './JobInfoPayrolling';

class JobInfo extends React.Component {
  render() {
    const { job, ...props } = this.props;
    //detail page always call get detail
    console.log(job.get('jobType'));
    console.log(job && job.toJS());
    if (job.get('jobType') === JOB_TYPES.Payrolling) {
      return <JobInfoPayrolling job={job} {...props} />;
    }
    if (job.get('jobType') === JOB_TYPES.FullTime) {
      return <JobFullTime job={job} {...props} />;
    }
    if (job.get('jobType') === JOB_TYPES.Contract) {
      return <JobContact job={job} {...props} />;
    }

    return <Loading />;
  }
}

const mapStateToProps = (state, { job }) => {
  return {
    userRelationList: getAssignedUsers(state, job.get('id')),
  };
};

export default connect(mapStateToProps)(JobInfo);
