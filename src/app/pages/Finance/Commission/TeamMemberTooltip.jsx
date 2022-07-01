import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';

import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
// import Divider from '@material-ui/core/Divider';

const useStyles = makeStyles({
  root: {
    paddingTop: 8,
    boxSizing: 'border-box',
    '&:not(:last-child)': {
      borderBottom: '1px solid #eaeaea',
    },
  },
});
function MemberCard({ commission }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography variant="body2" color="textSecondary" gutterBottom>
        {commission.get('userRole')}
      </Typography>
      <Typography variant="subtitle2" gutterBottom>
        {commission.get('userFullName')} ({commission.get('percentage')}%)
      </Typography>
    </div>
  );
}

const styles = (theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    fontSize: theme.typography.pxToRem(12),
    boxShadow: theme.shadows[1],
    maxHeight: 200,
    overflow: 'auto',
    wordBreak: 'break-all',
    margin: '4px 0',
    padding: '8px 20px',
  },
  card: {},
});

class TeamMemberTooltip extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { classes, children, commissions } = this.props;
    if (!commissions || commissions.size === 0) {
      return '';
    }
    return (
      <Tooltip
        interactive
        classes={classes}
        // open
        title={
          <>
            {commissions.map((commission) => {
              return (
                <MemberCard
                  key={commission.get('id')}
                  commission={commission}
                />
              );
            })}
          </>
        }
      >
        <div style={{ cursor: 'pointer' }}>{children}</div>
      </Tooltip>
    );
  }
}

export default withStyles(styles)(TeamMemberTooltip);
