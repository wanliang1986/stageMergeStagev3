import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { formatUserName } from '../../../utils';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

// import Divider from '@material-ui/core/Divider';
const useStyles = makeStyles({
  root: {
    paddingTop: 8,
    boxSizing: 'border-box',
    '&:not(:last-child)': {
      borderBottom: '1px solid #eaeaea'
    }
  }
});

function MemberCard({ user }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography variant="body2" color="textSecondary" gutterBottom>
        {formatUserName(user)}
      </Typography>
      <Typography variant="subtitle2" gutterBottom>
        {user.get('email')}
      </Typography>
    </div>
  );
}
const styles = theme => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    fontSize: theme.typography.pxToRem(12),
    boxShadow: theme.shadows[1],
    maxHeight: 200,
    overflow: 'auto',
    wordBreak: 'break-all',
    margin: '4px 0',
    padding: '8px 20px'
  }
});

class TeamMemberTooltip extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { classes, children, users } = this.props;
    if (!users || users.size === 0) {
      return children;
    }
    // console.log(users);
    return (
      <Tooltip
        arrow
        interactive
        classes={classes}
        // open
        title={
          <>
            <Typography>{users.size} Members</Typography>
            {users.map(user => {
              return <MemberCard key={user.get('id')} user={user} />;
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
