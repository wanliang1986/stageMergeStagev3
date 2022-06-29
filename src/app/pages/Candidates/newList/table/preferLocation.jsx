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
    let tooltips = '';
    data.preferredLocations &&
      data.preferredLocations.map((item, index) => {
        if (index == 0) html = item.originDisplay;
        if (index == data.preferredLocations.length - 1) {
          tooltips += `${item.originDisplay} \n `;
        } else {
          tooltips += `${item.originDisplay}  ,  \n `;
        }
      });
    return (
      <Tooltip
        title={
          <span style={{ whiteSpace: 'pre-line' }}>
            {tooltips ? tooltips : 'N/A'}
          </span>
        }
        arrow
        placement="top"
      >
        <span className={classes.title}>{html ? html : 'N/A'}</span>
      </Tooltip>
    );
  }
}

export default withStyles(style)(LocationsCell);
