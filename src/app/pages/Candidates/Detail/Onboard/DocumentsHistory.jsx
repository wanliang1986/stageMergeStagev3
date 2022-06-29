import React, { Component } from 'react';
import { withStyles } from '@material-ui/core';
import { connect } from 'react-redux';
import clsx from 'clsx';
const styles = {
  root: {},
  title: {
    
    fontSize: '22px',
    color: '#505050',
    fontWeight: '600',
    marginBottom: '16px',
  },
  act: {
    display: 'flex',
    justifyContent: 'space-between',
    
    fontSize: '14px',
    color: '#505050',
    fontWeight: '600',
  },
  list: {
    height: 170,
    overflow: 'auto',
    padding: '8px 0',
  },
  history: {
    display: 'flex',
    justifyContent: 'space-between',
    
    fontSize: '14px',
    color: '#505050',
    marginBottom: 8,
    lineHeight: 1,
  },
  historyBox: {
    width: '100%',
    height: 232,
    borderRadius: '4px',
    backgroundColor: '#fafafa',
    padding: '16px 32px 21px 16px',
  },
  openHistory: {
    
    fontSize: '14px',
    color: '#3398dc',
    cursor: 'pointer',
  },
};
class DocumentsHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  componentDidMount() {}

  render() {
    const { loading } = this.state;
    const { classes, data } = this.props;
    return (
      <div className={classes.root}>
        <div className={classes.title}>Previous Onboarding History</div>
        <div className={classes.historyBox}>
          <div className={classes.act}>
            <div>Package Name</div>
            <div style={{ marginRight: 10 }}>Assigned Documents Detail</div>
          </div>
          <div className={classes.list}>
            {data.map((item) => {
              return (
                <div className={classes.history}>
                  <div style={{ margin: '5px 0px' }}>{item.packageName}</div>
                  <div style={{ margin: '5px 10px 0px 5px' }}>
                    {item.detail}
                  </div>
                </div>
              );
            })}
          </div>
          <div
            className={classes.openHistory}
            onClick={() => {
              this.props.openHistoryDialog();
            }}
          >
            Previous Onboarding Documents History
          </div>
        </div>
      </div>
    );
  }
}

function mapStoreStateToProps(state, { match }) {
  return {};
}
export default connect(mapStoreStateToProps)(
  withStyles(styles)(DocumentsHistory)
);
