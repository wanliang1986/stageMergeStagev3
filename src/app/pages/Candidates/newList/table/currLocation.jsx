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
    return (
      <Tooltip
        title={
          <span style={{ whiteSpace: 'pre-line' }}>
            {data.currentLocation && data.currentLocation.originDisplay
              ? data.currentLocation.originDisplay
              : 'N/A'}
          </span>
        }
        arrow
        placement="top"
      >
        <span className={classes.title}>
          {data.currentLocation && data.currentLocation.originDisplay
            ? data.currentLocation.originDisplay
            : 'N/A'}
        </span>
      </Tooltip>
    );
  }
}

export default withStyles(style)(LocationsCell);
