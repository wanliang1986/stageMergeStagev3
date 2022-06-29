import React from 'react';
import moment from 'moment-timezone';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core';
import { getJob } from '../../../../actions/jobActions';
import { getApplicationStatusLabel } from '../../../../constants/formOptions';
import { formatBy } from '../../../../../utils';
import { getApplicationCommissionsByApplicationId } from '../../../../selectors/applicationSelector';
import { getAssignedUsers } from '../../../../selectors/userSelector';
import { Link } from 'react-router-dom';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

import ApplicationStart from '../ApplcationStart';
import * as Colors from '../../../../styles/Colors';
import {
  makeGetStartByApplicationId,
  makeGetPreStartByApplicationId,
  getActiveStartListByTalent,
} from '../../../../selectors/startSelector';
const styles = {
  root: {
    color: Colors.TEXT,
    marginRight: -8,
  },
  listItemTitle: {
    color: Colors.SUB_TEXT,
    fontSize: '1.15rem',
  },
  listItemSubTitle: {
    textAlign: 'right',
    width: 155,
    lineHeight: 1.5,
    fontSize: 14,
  },
  listItemContent: {
    fontSize: 14,
    fontWeight: 500,
  },
};
const ApplicationContent = withStyles(styles)(({ application, t, classes }) => {
  // console.log(application.get('company'));
  const isTerminate = application.get('status') === 'START_TERMINATED';
  const eventDate = moment(application.get('eventDate'))
    .tz('utc')
    .format('YYYY-MM-DD');
  return (
    <div className={classes.root}>
      <div className="flex-container align-justify">
        {/* 动态卡片标题 */}
        <Typography variant="subtitle2" className={classes.listItemTitle}>
          {moment().isBefore(moment(eventDate)) && isTerminate
            ? `Will Terminate at ${eventDate}`
            : t(
                `tab:${getApplicationStatusLabel(
                  application.get('status')
                ).toLowerCase()}`
              )}
        </Typography>

        {/* 动态的时间和相关的用户 */}
        <Typography className={classes.listItemSubTitle}>
          {formatBy(
            application.get('lastModifiedDate'),
            application.get('lastModifiedUser')
          )}
        </Typography>
      </div>

      {/* 公司名称和职业名称 */}
      <Typography className={classes.listItemContent}>
        {application.get('company')
          ? application.get('company').get('name')
          : application.get('companyName')}{' '}
        ------- {application.get('title')} (
        <Link
          className="job-link"
          to={`/jobs/detail/${application.get('jobId')}`}
        >
          # {application.get('code') || application.get('jobId')}
        </Link>
        )
      </Typography>

      <ApplicationStart
        t={t}
        application={application}
        applicationId={application.get('id')}
        candidateId={application.get('talentId')}
      />
    </div>
  );
});

class Application extends React.PureComponent {
  componentDidMount() {
    const { dispatch, application } = this.props;
    dispatch(getJob(application.get('jobId')));
  }

  render() {
    const { application, t, onClick, disabled, candidateId } = this.props;
    return (
      <ListItem
        key={application.get('id')}
        button
        disabled={disabled}
        onClick={onClick}
        divider
      >
        <ListItemText
          primary={
            <ApplicationContent
              t={t}
              application={application}
              candidateId={candidateId}
            />
          }
        />
      </ListItem>
    );
  }
}

const mapStateToProps = (state, { application, isAdmin, currentUserId }) => {
  const getStartByApplicationId = makeGetStartByApplicationId();
  const getPreStartByApplicationId = makeGetPreStartByApplicationId();
  const applicationCommissions = getApplicationCommissionsByApplicationId(
    state,
    application.get('id')
  );
  const assignedUsers = getAssignedUsers(state, application.get('jobId'));
  // console.log('applicationCommissions',applicationCommissions.toJS(),assignedUsers.toJS())
  // let isCompanyClientAM =
  //   application.get('company') &&
  //   Boolean(application.get('company').toJS().isAm);
  // let isJobAM =
  //   assignedUsers &&
  //   assignedUsers.length > 0 &&
  //   assignedUsers.some((item) => {
  //     return currentUserId == item.userId && item.permission == 'AM';
  //   });
  return {
    disabled:
      !isAdmin &&
      !applicationCommissions.find(
        (ac) => ac.get('userId') === currentUserId
      ) &&
      !assignedUsers.find((ac) => ac.get('userId') === currentUserId),
  };
};

export default connect(mapStateToProps)(Application);
