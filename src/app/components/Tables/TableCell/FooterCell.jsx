import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';

import { Cell } from 'fixed-data-table-2';

import { styles } from '../params';

class FooterCell extends React.PureComponent {
  render() {
    const { classes, data, columnKey, ...props } = this.props;

    return <Cell {...props}>{data && data.get(columnKey)}</Cell>;
  }
}

export default withStyles(styles)(FooterCell);
