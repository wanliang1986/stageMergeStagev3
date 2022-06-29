import { withStyles } from '@material-ui/core';
import React, { Component } from 'react';

const styles = {
  root: {
    width: '415px',
  },
};

class DeleteProgramTeam extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { classes, teamName } = this.props;
    return (
      <div className={classes.root}>
        <p>Are you sure you want to delete program team {teamName}?</p>
      </div>
    );
  }
}

export default withStyles(styles)(DeleteProgramTeam);
