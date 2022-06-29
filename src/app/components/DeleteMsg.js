import { Button, withStyles } from '@material-ui/core';
import React, { Component } from 'react';
const styles = {
  root: {
    width: '782px',
    height: '53px',
    padding: '18px 13px 19px 18px',
    backgroundColor: '#333333',
    margin: 'auto',
    color: 'white',
  },
};

class DeleteMsg extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { classes, deleteSelect, closedDeleteMsg } = this.props;
    console.log(deleteSelect);
    return (
      <div className={classes.root}>
        <div className="row">
          <div className="small-10 columns">
            Program team “{deleteSelect}” has been deleted.
          </div>
          <div className="small-2 columns">
            <Button
              style={{ color: '#85bae1', padding: '0px' }}
              onClick={closedDeleteMsg}
            >
              CLOSE
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(DeleteMsg);
