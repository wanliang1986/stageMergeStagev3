import React from 'react';
import { withStyles } from '@material-ui/core/styles';

const styles = (theme) => ({
  container: {
    height: '100%',
    display: 'grid',
    gridGap: '16px',
    gridAutoColumns: 'minmax(500px, 800px) minmax(600px, auto)',
    gridAutoRows: '100%',
    alignContent: 'stretch',
    '& > div': {
      // overflow: 'auto',
    },
    gridAutoFlow: 'row', //
    [theme.breakpoints.up('sm')]: {
      gridAutoFlow: 'column', //
    },
  },
  rightContainer: {
    height: '100%',
    display: 'grid',
    gridGap: '16px',
    gridAutoRows: '100%',
    alignContent: 'stretch',
    '& > div': {
      // overflow: 'auto',
    },
    gridAutoFlow: 'row', //
    [theme.breakpoints.up('sm')]: {
      gridAutoFlow: 'column', //
    },
  },
});

class CandidateLayout extends React.PureComponent {
  render() {
    const { classes, children, bigFlag } = this.props;

    return (
      <div className={bigFlag ? classes.rightContainer : classes.container}>
        {children}
      </div>
    );
  }
}

export default withStyles(styles)(CandidateLayout);
