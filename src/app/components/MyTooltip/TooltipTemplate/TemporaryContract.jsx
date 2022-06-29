import { withStyles } from '@material-ui/core';
import React, { Component } from 'react';

import Typography from '@material-ui/core/Typography';

import moment from 'moment-timezone';

const styles = {};

class TemporaryContract extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  getMsgList = (item) => {
    const { type } = this.props;
    return (
      <div>
        Contract "<i>{item.name}</i>"{' '}
        {type === 1 ? 'will be expired on' : 'expired on'}{' '}
        {this.endTime(item.endDate)}
      </div>
    );
  };
  endTime = (time) => {
    return moment(time).format('YYYY-MM-DD');
  };
  render() {
    const { classes, contractList } = this.props;
    console.log(contractList);
    return (
      <>
        {contractList.map((item, index) => {
          return (
            <Typography key={index} variant="caption">
              {this.getMsgList(item)}
            </Typography>
          );
        })}
      </>
    );
  }
}

export default withStyles(styles)(TemporaryContract);
