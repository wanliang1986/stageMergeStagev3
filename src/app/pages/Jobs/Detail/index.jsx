import React from 'react';
import Immutable from 'immutable';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import {
  upsertJob,
  getJob,
  newGetJobApplications,
} from '../../../actions/jobActions';

import JobInfo from './JobInfo';
import JobRelations from './Relations';
import Loading from '../../../components/particial/Loading';

const styles = (theme) => ({
  container: {
    height: '100%',
    display: 'grid',
    gridGap: '16px',
    gridTemplateColumns: '760px minmax(444px, auto)',
    gridTemplateRows: '100% 100%',
    alignContent: 'stretch',
    '& > div': {
      overflow: 'auto',
    },
    gridAutoFlow: 'column',
    [theme.breakpoints.up('sm')]: {
      gridAutoFlow: 'row',
    },
  },
  containerTwo: {
    height: '100%',
    display: 'grid',
    gridGap: '16px',
    gridTemplateColumns: 'minmax(444px, auto)',
    gridTemplateRows: '100% 100%',
    alignContent: 'stretch',
    '& > div': {
      overflow: 'auto',
    },
    gridAutoFlow: 'column',
    [theme.breakpoints.up('sm')]: {
      gridAutoFlow: 'row',
    },
  },
});

class JobDetail extends React.Component {
  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    const { jobId, dispatch } = this.props;
    dispatch(newGetJobApplications(jobId));
    dispatch(getJob(jobId));
  }

  canceledGetJob = () => {
    // console.log('canceledGetJob::::', jobId);
    const { jobId, dispatch } = this.props;
    dispatch(newGetJobApplications(jobId));
    dispatch(getJob(jobId));
  };

  handleUpdateJob = (job) => {
    return this.props.dispatch(upsertJob(job, this.props.jobId));
  };

  render() {
    const {
      job,
      jobId,
      canEdit,
      authorities,
      isLimitUser,
      t,
      i18n,
      classes,
      jobTableSizeFlag,
    } = this.props;
    if (!job) {
      return <Loading />;
    }
    return (
      <div
        className={jobTableSizeFlag ? classes.containerTwo : classes.container}
        // key={job}
      >
        {jobTableSizeFlag ? null : (
          <JobInfo
            key={job}
            job={job}
            jobId={jobId}
            canEdit={canEdit}
            handleUpdateJob={this.handleUpdateJob}
            canceledGetJob={this.canceledGetJob}
            t={t}
            i18n={i18n}
          />
        )}

        {!authorities ? (
          <Loading />
        ) : (
          <JobRelations
            job={job}
            jobId={jobId}
            canEdit={canEdit}
            t={t}
            isLimitUser={isLimitUser}
            {...this.props}
          />
        )}
      </div>
    );
  }
}

function mapStoreStateToProps(state, { match }) {
  const jobId = match.params.jobId;
  const job = state.model.jobs.get(jobId);
  const assignedUsers = job && job.get('assignedUsers');
  const jobTableSizeFlag = state.controller.tableSizeFlag;
  const currentUserId = state.controller.currentUser.get('id');
  const authorities = state.controller.currentUser.get('authorities');
  const assignedUser =
    assignedUsers &&
    assignedUsers.find(
      (assignedUser) => assignedUser.get('userId') === currentUserId
    );

  const isAdmin =
    !!authorities &&
    authorities.includes(Immutable.Map({ name: 'ROLE_ADMIN' }));

  const isTenantAdmin =
    !!authorities &&
    authorities.includes(Immutable.Map({ name: 'ROLE_TENANT_ADMIN' }));

  const canEdit = !!assignedUser || isAdmin || isTenantAdmin;
  console.log('canEdit', canEdit);
  return {
    job,
    canEdit,
    jobId,
    authorities,
    isLimitUser:
      !authorities ||
      authorities.includes(Immutable.Map({ name: 'ROLE_LIMIT_USER' })),
    jobTableSizeFlag,
  };
}

export default withTranslation(['field', 'action', 'message', 'tab'])(
  connect(mapStoreStateToProps)(withStyles(styles)(JobDetail))
);
