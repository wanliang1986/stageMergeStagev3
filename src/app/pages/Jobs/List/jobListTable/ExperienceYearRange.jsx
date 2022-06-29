import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Tooltip from '@material-ui/core/Tooltip';

const style = {
  title: {
    display: 'block',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
};
class LocationsCell extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const { classes, data } = this.props;
    let html = '';
    if (data.experienceYearRange) {
      const { gte, lte } = data.experienceYearRange;
      if (gte && lte) {
        html = `${gte}-${lte}`;
      } else if (!gte && lte) {
        html = `less than ${lte}`;
      } else if (gte && !lte) {
        html = `more than ${gte}`;
      } else if (gte == 0 && !lte) {
        html = `more than ${gte}`;
      } else if (!gte && lte == 0) {
        html = `fresh graduate`;
      }
    }

    return (
      // <Tooltip title={<span style={{ whiteSpace: 'pre-line' }}>{html}</span>} arrow placement="top">
      <span className={classes.title}>{html}</span>
      // </Tooltip>
    );
  }
}

export default withStyles(style)(LocationsCell);
