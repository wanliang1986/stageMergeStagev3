import React, { Component } from 'react';
import { withStyles } from '@material-ui/core';
import { connect } from 'react-redux';
import clsx from 'clsx';

import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import PotentialButton from '../../../../components/particial/PotentialButton';
const styles = {
  root: {
    border: 'solid 1px rgba(0, 0, 0, 0.15)',
    flex: 1,
    // height: 200,
    overflow: 'hidden',
  },
  documentList: {
    borderRadius: '4px',
    border: 'solid 1px rgba(0, 0, 0, 0.15)',
    marginBottom: 13,
  },
  list: {
    marginLeft: '14px',
    width: 480,
    overflow: 'auto',
  },
  title: {
    backgroundColor: '#fafafa',
    
    fontSize: '14px',
    color: '#505050',
    fontWeight: '500',
    lineHeight: 1.57,
    width: '100%',
    height: 44,
    padding: '11px 14px',
  },
  documentName: {
    
    fontSize: '14px',
    color: '#3598dc',
    lineHeight: 1.57,
    width: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    marginTop: '5px',
    marginBottom: '5px',
    cursor: 'pointer',
  },
  box: {
    height: 635,
    overflow: 'auto',
  },
  '@media screen and (max-width: 1280px)': {
    box: {
      height: 360,
    },
  },
  '@media screen and (max-height: 800px)': {
    box: {
      height: 360,
    },
  },
};
class HistoryDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  historyDetails = (list) => {
    const { classes, data } = this.props;
    return list.map((item) => {
      return (
        <div
          className={classes.documentName}
          key={item.name}
          onClick={() => {
            this.props.openHistoryS3(item);
          }}
        >
          {item.name}
        </div>
      );
    });
  };
  render() {
    const { loading } = this.state;
    const { classes, data } = this.props;
    return (
      <div className={classes.root}>
        <DialogTitle>{'Previous Onboarding Documents History'}</DialogTitle>
        <DialogContent style={{ padding: '24px 24px 20px 24px' }}>
          <div className={classes.box}>
            {data.map((item) => {
              return (
                <div className={classes.documentList}>
                  <div className={classes.title}>{item.detail}</div>
                  <div className={classes.list}>
                    <div className={classes.documentName}>
                      {this.historyDetails(item.documents)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </DialogContent>
        <DialogActions
          style={{
            paddingTop: 0,
            display: 'flex',
            justifyContent: 'center',
            padding: '0 10px 10px 10px',
          }}
        >
          <PotentialButton onClick={this.props.onClose}>
            {'Close'}
          </PotentialButton>
        </DialogActions>
      </div>
    );
  }
}

function mapStoreStateToProps(state, { match }) {
  return {};
}
export default connect(mapStoreStateToProps)(withStyles(styles)(HistoryDialog));
