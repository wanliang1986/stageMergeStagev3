import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Immutable from 'immutable';
import activitySelector from '../../../selectors/activitySelector';
import { getActivitiesByApplication } from '../../../actions/applicationActions';
import { getApplicationStatusLabel } from '../../../constants/formOptions';
import { formatBy } from '../../../../utils/index';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import * as Colors from '../../../styles/Colors/index';
import Chip from '@material-ui/core/Chip';
import Loading from '../../../components/particial/Loading';
import moment from 'moment-timezone';
// import InterviewReadonlyForm from './InterviewReadonlyForm';

// import Dialog from '@material-ui/core/Dialog';
// import DialogActions from '@material-ui/core/DialogActions';
// import DialogContent from '@material-ui/core/DialogContent';
// import PrimaryButton from '../../../components/particial/PrimaryButton';

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
    '&:hover': {
      color: Colors.PRIMARY,
      cursor: 'pointer',
    },
  },
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
};

const notesList = [
  { id: '1', value: '233' },
  { id: '2', value: '2343' },
];

class NotesCard extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      showInterviewReadonlyForm: false,
      activity: {},
    };
  }

  render() {
    const { classes, companyNodes } = this.props;
    console.log(companyNodes);
    if (!companyNodes) {
      return (
        <Typography variant="h5">There is no BD Progress Notes</Typography>
      );
    }

    return (
      <div className={clsx('vertical-layout', classes.root)}>
        {companyNodes.map((subList, pindex) => {
          // const first = subList.last();
          return (
            <div className={classes.activity} key={pindex}>
              <div style={{ minWidth: '160px' }}>
                <div style={{ textAlign: 'right' }}>
                  {moment(subList.contactDate).format('L hh:ss a')}
                </div>
                <div style={{ textAlign: 'right' }}>
                  By {subList.creatorName}
                </div>
              </div>
              <div className={classes.arrow}>
                <div className="circle" />
              </div>

              <Paper className="flex-child-auto vertical-layout container-padding">
                <div className="row expanded">
                  <div className="small-8 columns">
                    <Typography variant="h6" gutterBottom>
                      {subList.clientContactName}
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                      {subList.contactCategoryType === 'OTHER'
                        ? subList.contactCategoryType +
                          ':' +
                          subList.otherCategory
                        : subList.contactCategoryType}
                    </Typography>
                  </div>
                  <div
                    className="small-4 columns"
                    style={{ textAlign: 'right' }}
                  >
                    <Chip
                      label={subList.contactType}
                      style={{
                        borderRadius: '4px',
                        backgroundColor: 'rgba(51, 152, 220, 0.16)',
                        color: '#3398db',
                        border: '1px solid #3398db',
                      }}
                    />
                  </div>
                </div>
                <div>
                  <Typography variant="body2" gutterBottom>
                    {subList.note}
                  </Typography>
                </div>
              </Paper>
            </div>
          );
        })}
      </div>
    );
  }
}

export default withStyles(styles)(NotesCard);
