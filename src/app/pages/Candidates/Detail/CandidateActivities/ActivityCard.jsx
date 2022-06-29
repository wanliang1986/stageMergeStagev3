import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Immutable from 'immutable';
import activitySelector from '../../../../selectors/activitySelector';
import { getActivitiesByApplication } from '../../../../actions/applicationActions';
import {
  getApplicationStatusLabel,
  INTERVIEW_TYPES,
} from '../../../../constants/formOptions';
import { formatBy, formatUserName } from '../../../../../utils';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import * as Colors from '../../../../styles/Colors';
import InterviewReadonlyForm from './InterviewReadonlyForm';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import PrimaryButton from '../../../../components/particial/PrimaryButton';

const styles = {
  root: {
    overflow: 'hidden',
    padding: '3px 3px 3px 0',
  },
  smallIcon: {
    fontSize: 16,
  },
  small: {
    padding: 8,
  },
  input: {
    border: '2px solid gray',
    borderRadius: '26px',
    borderColor: Colors.GRAY_2,
    width: '100%',
    outline: 'none',
    boxShadow: 'initial',
    padding: '6px 10px 5px',
    fontSize: '14px',
    color: Colors.SUB_TEXT,
  },
  subtitle: {
    color: Colors.SUB_TEXT,
    width: 155,
    textAlign: 'right',
  },
  content: {
    fontSize: '15px',
    color: '#3f3f3f',
    marginLeft: '4px',
  },
  memo: {
    border: '2px solid gray',
    borderColor: Colors.GRAY_2,
    padding: '3px 12px',
    display: 'inline-block',
    borderRadius: 12,
    color: Colors.SUB_TEXT,
    fontSize: 14,
    whiteSpace: 'pre-wrap',
    '&$link': {
      color: Colors.PRIMARY,
      cursor: 'pointer',
    },
  },
  link: {},
  memoBy: {
    color: Colors.GRAY,
    textTransform: 'capitalize',
    marginLeft: 12,
  },
  activity: {
    display: 'flex',
    '& > $arrow': {
      height: 'inherit',
      position: 'relative',
      top: 30,
      background: 'rgb(237, 237, 237)',
      margin: '0px 28px 0px 10px',
      padding: '0 1px',
    },
    '&:last-child > $arrow': {
      background: 'inherit',
    },
  },
  arrow: {
    '& .circle': {
      width: 16,
      height: 16,
      border: `3px solid ${Colors.PRIMARY}`,
      borderRadius: '50%',
      position: 'absolute',
      top: -16,
      left: -7,
    },
    '&:before': {
      content: '""',
      border: '10px solid transparent',
      borderRight: '10px rgba(62, 62, 62, 0.1) solid',
      top: -18,
      height: 0,
      width: 0,
      position: 'absolute',
      right: -28,
    },
    '&:after': {
      border: '8px solid transparent',
      borderRight: '8px white solid',
      content: '""',
      height: 0,
      width: 0,
      top: -16,
      right: -28,
      position: 'absolute',
    },
  },
  ':last-child > .arrow': {},
  DetailsViewText: {
    float: 'right',
    fontSize: 15,
    color: '#3498DB',
    cursor: 'pointer',
    marginTop: 4,
  },
};

class ActivityCard extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      showInterviewReadonlyForm: false,
      activity: {},
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(preProps) {
    if (preProps.applicationId !== this.props.applicationId) {
      this.fetchData();
    }
  }

  fetchData() {
    const { applicationId, getActivitiesByApplication } = this.props;
    getActivitiesByApplication(applicationId);
  }

  showDetails = (activity) => {
    this.props.openAddDialog(activity.get('status'), 'ActivityCard', activity);
  };

  showInterview = (activity, isLink) => {
    // console.log(activity.toJS());
    if (isLink) {
      this.setState({
        showInterviewReadonlyForm: isLink,
        activity: activity.toJS(),
      });
    }
  };

  render() {
    const { classes, activityList, users, t } = this.props;

    console.log('[###act[]]', activityList.toJS());
    return (
      <div className={clsx('vertical-layout', classes.root)}>
        {activityList.map((subList, pindex) => {
          const first = subList.last();
          return (
            <div className={classes.activity} key={pindex}>
              <div className={classes.arrow}>
                <div className="circle" />
              </div>

              <Paper className="flex-child-auto vertical-layout container-padding">
                <div className="horizontal-layout">
                  <Typography variant="subtitle1" className="flex-child-auto">
                    {t(
                      `tab:${getApplicationStatusLabel(
                        first.get('status')
                      ).toLowerCase()}`
                    )}
                  </Typography>
                  <Typography variant="body2" className={classes.subtitle}>
                    {formatBy(
                      first.get('createdDate'),
                      getCreatorName(first, users)
                    )}
                  </Typography>
                </div>
                {subList.map((activity, index) => {
                  // console.log('sublist', activity.toJS());
                  const isLink =
                    activity.get('status') === 'Interview' &&
                    Object.values(INTERVIEW_TYPES).includes(
                      activity.get('eventType')
                    );
                  return (
                    <div key={index}>
                      <span
                        className={clsx(classes.memo, {
                          [classes.link]: isLink,
                        })}
                        onClick={() => this.showInterview(activity, isLink)}
                      >
                        {activity.get('memo')}
                      </span>
                      <small className={classes.memoBy}>
                        {formatBy(
                          activity.get('createdDate'),
                          getCreatorName(activity, users)
                        )}
                      </small>
                      {index === 0 && (
                        <span
                          className={classes.DetailsViewText}
                          onClick={() => {
                            this.showDetails(activity);
                          }}
                        >
                          {t('tab:View Details')}
                        </span>
                      )}
                    </div>
                  );
                })}
              </Paper>
            </div>
          );
        })}
        <Dialog open={this.state.showInterviewReadonlyForm} maxWidth="md">
          <DialogContent>
            <InterviewReadonlyForm activity={this.state.activity} />
          </DialogContent>

          <DialogActions>
            <PrimaryButton
              type="button"
              onClick={() => {
                this.setState({
                  showInterviewReadonlyForm: false,
                });
              }}
            >
              Close
            </PrimaryButton>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

ActivityCard.propTypes = {
  applicationId: PropTypes.number.isRequired,
  getActivitiesByApplication: PropTypes.func.isRequired,
  activityList: PropTypes.instanceOf(Immutable.List).isRequired,
};

function mapStoreStateToProps(state, { applicationId }) {
  return {
    activityList: activitySelector(state, applicationId),
    users: state.model.users,
  };
}

export default withTranslation()(
  connect(mapStoreStateToProps, { getActivitiesByApplication })(
    withStyles(styles)(ActivityCard)
  )
);

function getCreatorName(activity, users) {
  const createdById = activity.get('createdBy').split(',')[0];
  const createdBy = users.get(createdById);
  return createdBy
    ? formatUserName(createdBy)
    : activity.getIn(['user', 'username']);
}
