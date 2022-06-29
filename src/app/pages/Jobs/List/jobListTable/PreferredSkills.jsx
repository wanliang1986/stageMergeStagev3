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
class PreferredSkills extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }
  PreferredSkills;

  render() {
    const { classes, data } = this.props;
    let html = '';
    data.preferredSkills &&
      data.preferredSkills.map((item, index) => {
        if (index == data.preferredSkills.length - 1) {
          html += `${item.skillName} \n `;
        } else {
          html += `${item.skillName}  ,  \n `;
        }
      });
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

export default withStyles(style)(PreferredSkills);
