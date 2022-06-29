import React, { Component } from 'react';
import { withStyles } from '@material-ui/core';
import { connect } from 'react-redux';
import clsx from 'clsx';
import Tooltip from '@material-ui/core/Tooltip';
const styles = {
  root: {
    border: 'solid 1px rgba(0, 0, 0, 0.15)',
    flex: 1,
    height: 274,
    minWidth: 320,
    overflow: 'auto',
  },
  title: {
    backgroundColor: '#fafafa',
    
    fontSize: '14px',
    color: '#505050',
    fontWeight: '500',
    lineHeight: 1.57,
    marginBottom: '8px',
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
  documentList: {
    display: 'flex',
  },
  list: {
    marginLeft: '14px',
  },
};
class AddDocuments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  componentDidMount() {}
  openS3Link = (item) => {
    this.props.openS3LinkDialog(item);
  };
  render() {
    const { loading } = this.state;
    const { classes, parList, historyFlag, checked } = this.props;

    return (
      <div className={classes.root}>
        <div className={classes.title}>{`${
          !historyFlag ? 'Selected' : ''
        } Additional Onboarding Document`}</div>
        <div className={classes.list}>
          {parList.map((item) => {
            return (
              <Tooltip title={item.name} placement="top-start">
                <div
                  className={classes.documentName}
                  key={item.name}
                  onClick={() => {
                    this.openS3Link(item);
                  }}
                >
                  {item.name}
                </div>
              </Tooltip>
            );
          })}
        </div>
      </div>
    );
  }
}

function mapStoreStateToProps(state, { match }) {
  return {};
}
export default connect(mapStoreStateToProps)(withStyles(styles)(AddDocuments));
