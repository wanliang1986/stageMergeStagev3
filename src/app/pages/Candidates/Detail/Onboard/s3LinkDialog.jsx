import React, { Component } from 'react';
import { withStyles } from '@material-ui/core';
import { connect } from 'react-redux';
import clsx from 'clsx';

import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import PotentialButton from '../../../../components/particial/PotentialButton';
const styles = {};
class S3LinkDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  render() {
    const { classes, previewSrc } = this.props;
    const s3linkSrc =
      previewSrc.s3LinkRejected && previewSrc.approvalStatus === 'REJECTED'
        ? previewSrc.s3LinkRejected
        : previewSrc.s3Link;
    return (
      <div className={classes.root}>
        <DialogTitle disableTypography className={classes.title}>
          <Typography variant="subtitle2" color="inherit">
            {previewSrc.name}
          </Typography>
        </DialogTitle>
        <DialogContent style={{ padding: '12px 24px 50px' }}>
          <iframe
            title="resume"
            style={{
              display: 'block',
              width: '100%',
              height: '600px',
              border: 'none',
              margin: 'auto',
            }}
            allowFullScreen
            src={s3linkSrc}
          />
        </DialogContent>
        <DialogActions
          style={{ paddingTop: 0, display: 'flex', justifyContent: 'end' }}
        >
          <PotentialButton onClick={this.props.onClose}>
            {'cancel'}
          </PotentialButton>
        </DialogActions>
      </div>
    );
  }
}

function mapStoreStateToProps(state, { match }) {
  return {};
}
export default connect(mapStoreStateToProps)(withStyles(styles)(S3LinkDialog));
