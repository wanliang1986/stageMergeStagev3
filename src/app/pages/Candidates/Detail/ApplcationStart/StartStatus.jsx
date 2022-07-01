import React from 'react';
import { withStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import dateFns from 'date-fns';
// import moment from 'moment-timezone';
import Link from '@material-ui/core/Link';
import PrimaryButton from '../../../../components/particial/PrimaryButton';

const reasonOpts = [
  {
    value: 'CANDIDATE_RESIGNED',
    label: 'Candidate resigned',
  },
  {
    value: 'TERMINATED_PERFORMANCE_REASON',
    label: 'Terminated - performance reason',
  },
  {
    value: 'TERMINATED_OTHER_REASONS_FROM_CANDIDATE',
    label: 'Terminated - other reasons from candidate',
  },
  {
    value: 'CONTRACT_ENDED_AS_SCHEDULED',
    label: 'Contract ended as scheduled',
  },
  {
    value: 'CONTRACT_ENDED_EARLY_PROJECT_END',
    label: 'Contract ended early: project end',
  },
  {
    value: 'CONTRACT_ENDED_EARLY_POOR_PERFORMANCE',
    label: 'Contract ended early: poor performance',
  },
  {
    value: 'CONVERTED_TO_FTE',
    label: 'Converted to FTE',
  },
  {
    value: 'CONVERTED_TO_VENDOR',
    label: 'Converted to vendor',
  },
  {
    value: 'EMPLOYEE_RESIGNED_TOOK_ANOTHER_JOB_OFFER',
    label: 'Employee resigned: took another job offer',
  },
  {
    value: 'EMPLOYEE_RESIGNED_OTHER_REASON',
    label: 'Employee resigned: other reason',
  },
  {
    value: 'QUIT_WITHOUT_GIVING_PROPER_NOTICE',
    label: 'Quit without giving proper notice',
  },
];
const reasonMaps = reasonOpts.reduce((res, value) => {
  res[value.value] = value.label;
  return res;
}, {});
const convertToFteFeeStatusMaps = {
  HAS_CONVERSION_FEE: 'Has conversion fee',
  NO_CONVERSION_FEE: 'No conversion fee',
};

const styles = {
  error: {
    color: '#f56d50',
  },
};

class StartStatus extends React.Component {
  render() {
    const { t, classes, start, isOpen, canView, onOpenStart } = this.props;

    const termination = start.get('termination');
    const failedWarranty = start.get('failedWarranty');

    if (termination) {
      const date = dateFns.format(
        termination.get('terminationDate'),
        'MM/DD/YYYY'
      );
      const reason = reasonMaps[termination.get('reason')];
      const isAfterTerminationDate = dateFns.isAfter(
        new Date(),
        start.getIn(['termination', 'terminationDate'])
      );
      return (
        <div className="horizontal-layout">
          {canView && !isOpen ? (
            <Link
              color={'primary'}
              onClick={onOpenStart}
              className={classes.error}
            >
              {isAfterTerminationDate
                ? 'Terminated at ' + date
                : 'Will terminate at ' + date}
            </Link>
          ) : (
            <Typography color={'textSecondary'}>
              {isAfterTerminationDate
                ? 'Terminated at ' + date
                : 'Will terminate at ' + date}
            </Typography>
          )}
          {isAfterTerminationDate && (
            <Typography className={classes.error}>
              {reason}
              {termination.get('reason') === 'CONVERTED_TO_FTE'
                ? ': ' +
                  convertToFteFeeStatusMaps[
                    termination.get('convertToFteFeeStatus')
                  ]
                : ''}
            </Typography>
          )}
          <div className={'flex-child-auto'} />
        </div>
      );
    }

    if (failedWarranty) {
      const date = dateFns.format(failedWarranty.get('endDate'), 'MM/DD/YYYY');
      const reason = reasonMaps[failedWarranty.get('reason')];
      return (
        <div className="horizontal-layout">
          {canView && !isOpen ? (
            <Link
              color={'primary'}
              onClick={onOpenStart}
              className={classes.error}
            >
              {'Position end at ' + date}
            </Link>
          ) : (
            <Typography color={'textSecondary'}>
              {'Position end at ' + date}
            </Typography>
          )}
          <Typography className={classes.error}>{reason}</Typography>
        </div>
      );
    }

    const startDate = dateFns.format(start.get('startDate'), 'MM/DD/YYYY');
    const startType = start.get('startType');
    const text = startType === 'CONTRACT_EXTENSION' ? 'Extended' : 'Started';
    return (
      <div>
        {canView && !isOpen ? (
          <Link color={'primary'} onClick={onOpenStart}>
            {text + ' at ' + startDate}
          </Link>
        ) : (
          <Typography color={'textSecondary'}>
            {text + ' at ' + startDate}
          </Typography>
        )}
      </div>
    );
  }
}

export default withStyles(styles)(StartStatus);
