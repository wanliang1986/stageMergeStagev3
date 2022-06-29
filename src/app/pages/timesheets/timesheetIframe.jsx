import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
const styles = {
  container: {
    height: '100%',
  },
};

class TimesheetIframe extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { classes, talentId } = this.props;
    let src = '/timesheetAM#/manageTimesheets';
    if (talentId != '0000') {
      src = `/timesheetAM#/assignmentTimesheet/${talentId}`;
    }
    return (
      <div className={classes.container}>
        <iframe
          id="timesheet"
          style={{
            display: 'block',
            width: '100%',
            height: '100% ',
            border: 'none',
          }}
          allowFullScreen
          src={src}
        />
      </div>
    );
  }
}

function mapStoreStateToProps(state, { match }) {
  const talentId = match.params.talentId;
  return {
    talentId,
  };
}
export default withRouter(
  connect(mapStoreStateToProps)(withStyles(styles)(TimesheetIframe))
);
