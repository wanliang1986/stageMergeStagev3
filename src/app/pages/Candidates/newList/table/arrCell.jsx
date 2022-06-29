import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Tooltip from '@material-ui/core/Tooltip';
import { currency, rateUnitOptions } from '../../../../constants/formOptions';

const style = {
  title: {
    display: 'block',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
};
class ArrCell extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }
  render() {
    const { classes, data, colDef } = this.props;
    let html = data[colDef.colId] && data[colDef.colId].join(', ');
    return (
      <Tooltip
        title={
          <span style={{ whiteSpace: 'pre-line' }}>{html ? html : 'N/A'}</span>
        }
        arrow
        placement="top"
      >
        <span className={classes.title}>{html ? html : 'N/A'}</span>
      </Tooltip>
    );
  }
}

export default withStyles(style)(ArrCell);
