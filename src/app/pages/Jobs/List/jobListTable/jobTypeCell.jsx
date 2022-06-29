import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Tooltip from '@material-ui/core/Tooltip';
import {
  jobType as newJobType,
  getJobTypeLabel,
} from '../../../../constants/formOptions';
const style = {
  title: {
    display: 'block',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
};
class jobTypeCell extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { classes, data } = this.props;
    let html = '';
    data.type &&
      newJobType.map((item, index) => {
        if (item.value == data.type) {
          html += `${item.label} `;
        }
      });

    return <span className={classes.title}>{html}</span>;
  }
}

export default withStyles(style)(jobTypeCell);
