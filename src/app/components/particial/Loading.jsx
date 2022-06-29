import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

import CircularProgress from '@material-ui/core/CircularProgress';

const styles = {
  root: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
};

const Loading = ({ classes, style }) => {
  return (
    <div className={clsx(classes.root, 'container-padding')} style={style}>
      <CircularProgress size={60} thickness={5} />
    </div>
  );
};

export default withStyles(styles)(Loading);
