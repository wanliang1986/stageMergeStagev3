import { withStyles } from '@material-ui/core';
import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import moment from 'moment-timezone';
const styles = {
  root: {
    width: '95%',
    margin: '20px auto',
  },
  content: {
    width: '100%',
    marginTop: '10px',
    maxHeight: '150px',
    padding: '10px',
  },
};

class NotesOptions extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { classes, data } = this.props;
    console.log(data);
    return (
      <div className={classes.root}>
        <Paper elevation={3} style={{ width: '100%' }}>
          <Grid container spacing={3}>
            <Grid item xs={9} style={{ padding: '20px', color: '#aab1b8' }}>
              {data.user.firstName + ' ' + data.user.lastName}
            </Grid>
            <Grid
              item
              xs={3}
              style={{ textAlign: 'right', padding: '20px', color: '#aab1b8' }}
            >
              {moment(data.createdDate).format('L')}
            </Grid>
          </Grid>
          <Divider />
          <div className={classes.content}>
            <Typography variant="body1" style={{ color: '#aab1b8' }}>
              Content
            </Typography>
            <Typography
              variant="body2"
              style={{
                width: '100%',
                wordWrap: 'break-word',
                maxHeight: '100px',
                overflowY: 'scroll',
              }}
            >
              {data.memo}
            </Typography>
          </div>
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(NotesOptions);
