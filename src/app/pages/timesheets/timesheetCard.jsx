import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
const styles = {
  container: {
    height: '100%',
    backgroundColor: '#f4f4f4',
    margin: '-15px',
  },
  content: {
    height: 254,
    width: 689,
    borderRadius: '5px',
    backgroundColor: '#fff',
    margin: '24px 6px',
    padding: '44px 56px',
    boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.3)',
  },
  title: {
    fontFamily: 'Roboto-Regular',
    fontSize: 18,
    color: '#505050',
    marginBottom: '24px',
  },
  list: {
    fontFamily: 'Roboto-Regular',
    fontSize: 14,
    color: '#505050',
    '& >a': {
      display: 'block',
      marginBottom: 16,
      cursor: 'pointer',
      color: '#505050',
    },
  },
};

class timesheetCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillUnmount() {}

  goLink = (link) => {
    this.props.history.push(link);
  };

  render() {
    const { classes, data } = this.props;
    return (
      <div className={classes.container}>
        <div className={classes.content}>
          <div className={classes.title}>Manage Timesheets/Expenses</div>
          <div className={classes.list}>
            <a>Upload Timesheets</a>
            <a
              onClick={() => {
                this.goLink('/timesheets/Search/0000');
              }}
            >
              Search Timesheets/Expenses
            </a>
            <a>Set Up Missing Timesheets Alerts</a>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {};
};
export default withRouter(
  connect(mapStateToProps)(withStyles(styles)(timesheetCard))
);
