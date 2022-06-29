import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { style } from '../../../../../components/Tables/params';
import moment from 'moment-timezone';

class PostingTimeCell extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const { classes, data } = this.props;
    return (
      <span>
        {data.postingTime
          ? moment(data.postingTime).format('YYYY-MM-DD')
          : null}
      </span>
    );
  }
}

export default withStyles(style)(PostingTimeCell);
