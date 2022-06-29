import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

const styles = (theme) => ({
  label: {
    position: 'relative',

    '&::after': {
      content: '"$"',
      position: 'absolute',
      top: '1.6em',
      left: '4px',
      fontSize: '1.25em',
    },
  },
});

class MoneyInput extends Component {
  render() {
    const {
      classes,
      className,
      label,
      type,
      isRequired,
      errorMessage,
      inputProps,
      ...otherProps
    } = this.props;

    return (
      <div className="foundation">
        <label
          className={`${classes.label} ${
            errorMessage ? 'is-invalid-label ' : ''
          }${className || ''}`}
        >
          {label}
          {isRequired && (
            <span style={{ color: 'red', paddingLeft: '4px' }}>*</span>
          )}
          <input
            style={{ paddingLeft: '14px' }}
            className={`${errorMessage ? 'is-invalid-input ' : ''}`}
            type={type || 'text'}
            {...inputProps}
            {...otherProps}
          />
          {errorMessage && (
            <span className="form-error is-visible">{errorMessage}</span>
          )}
        </label>
      </div>
    );
  }
}

MoneyInput.propTypes = {
  className: PropTypes.string,
  errorMessage: PropTypes.string,
  isRequired: PropTypes.bool,
  label: PropTypes.string,
  type: PropTypes.string,
};

export default withStyles(styles)(MoneyInput);
