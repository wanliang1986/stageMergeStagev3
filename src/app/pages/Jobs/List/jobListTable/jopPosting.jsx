import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Tooltip from '@material-ui/core/Tooltip';
import { connect } from 'react-redux';
const style = {
  title: {
    display: 'block',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
};
class JobPostingCell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderStats = (data) => {
    if (data.type === 'CONTRACT' || data.type === 'FULL_TIME') {
      if (data?.published) {
        return 'Posted';
      } else {
        return 'Unposted';
      }
    } else {
      return 'N/A';
    }
  };

  render() {
    const { classes, data, colDef } = this.props;
    return <div> {this.renderStats(data)}</div>;
  }
}

const mapStateToProps = (state) => {
  return {};
};

export default connect(mapStateToProps)(withStyles(style)(JobPostingCell));
