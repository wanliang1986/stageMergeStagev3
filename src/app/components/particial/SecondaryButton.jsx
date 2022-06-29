import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { alpha } from '@material-ui/core/styles/colorManipulator';

import Button from '@material-ui/core/Button';

const styles = (theme) => ({
  root: {
    boxShadow: 'none',
    '&:hover': {
      backgroundColor: alpha(
        theme.palette.text.primary,
        theme.palette.action.hoverOpacity
      ),
    },
    '&:active': {
      boxShadow: 'none',
    },
  },
});

class SecondaryButton extends Component {
  render() {
    const { classes, buttonRef, ...otherProps } = this.props;
    return (
      <Button
        {...otherProps}
        color="primary"
        ref={buttonRef}
        classes={{
          root: classes.root,
        }}
      />
    );
  }
}

export default withStyles(styles)(SecondaryButton);
