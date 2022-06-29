/**
 * Created by leonardli on 4/16/17.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = (theme) => ({
  wrapper: {
    position: 'relative',
    // display:'inline-block'
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
});

class PrimaryButton extends React.Component {
  render() {
    const {
      classes,
      processing = false,
      children,
      disabled,
      buttonRef,
      ...otherProps
    } = this.props;
    return (
      <div className={classes.wrapper}>
        <Button
          disabled={disabled || processing}
          {...otherProps}
          variant="contained"
          color="primary"
          ref={buttonRef}
          disableElevation
        >
          {children}
          {processing && (
            <CircularProgress size={24} className={classes.buttonProgress} />
          )}
        </Button>
      </div>
    );
  }
}

PrimaryButton.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PrimaryButton);
