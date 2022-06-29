import React from 'react';
import { withStyles } from '@material-ui/core/styles';

const styles = (theme) => ({
  container: {
    height: '100%',
    display: 'grid',
    gridGap: '16px',
    gridTemplateColumns: '600px minmax(444px, auto)',
    gridTemplateRows: '100% 100%',
    alignContent: 'stretch',
    '& > div': {
      overflow: 'auto',
    },
    gridAutoFlow: 'column',
    [theme.breakpoints.up('sm')]: {
      gridAutoFlow: 'row',
    },
  },
});

class JobLayout extends React.Component {
  render() {
    const { classes, children } = this.props;
    return <div className={classes.container}>{children}</div>;
  }
}

export default withStyles(styles)(JobLayout);
