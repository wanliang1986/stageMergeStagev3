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
    height: 274,
  },
  documentList: {
    borderRadius: '4px',
    border: 'solid 1px rgba(0, 0, 0, 0.15)',
  },
  list: {
    marginLeft: '14px',
    height: 360,
    width: 520,
    overflow: 'auto',
  },
  title: {
    backgroundColor: '#fafafa',
    
    fontSize: '14px',
    color: '#505050',
    fontWeight: '500',
    lineHeight: 1.57,
    marginBottom: '16px',
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
    marginTop: '8px',
    cursor: 'pointer',
  },
};
class PreviewPackageDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() { }

  render() {
    const { classes, data, packageS3LinkList } = this.props;
    const list = packageS3LinkList.sort((a, b) => a.ordering - b.ordering);
    return (
      <div className={classes.root}>
        <div></div>
        <DialogContent style={{ padding: '24px 24px 20px 24px' }}>
          <div className={classes.documentList}>
            <div className={classes.title}>{'Documents Selected'}</div>
            <div className={classes.list}>
              {data?.map((item, index) => {
                return (
                  <div
                    className={classes.documentName}
                    key={item.name}
                    title={item.name}
                    onClick={() => {
                      this.props.previewPackageS3(list[index]);
                    }}
                  >
                    {item.name}
                  </div>
                );
              })}
            </div>
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
export default connect(mapStoreStateToProps)(
  withStyles(styles)(PreviewPackageDialog)
);
