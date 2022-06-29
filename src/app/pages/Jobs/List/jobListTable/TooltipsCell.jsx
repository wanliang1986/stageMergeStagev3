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
class TooltipsCell extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const { classes, data, tipKey } = this.props;
    let html = '';
    if (data[tipKey] && data[tipKey].length > 0) {
      data[tipKey].map((item, index) => {
        if (index == data[tipKey].length - 1) {
          html += `${item} \n `;
        } else {
          html += `${item}  ,  \n `;
        }
      });
    }

    return (
      <Tooltip
        title={<span style={{ whiteSpace: 'pre-line' }}>{html}</span>}
        arrow
        placement="top"
      >
        <span className={classes.title}>{html}</span>
      </Tooltip>
    );
  }
}

export default withStyles(style)(TooltipsCell);
