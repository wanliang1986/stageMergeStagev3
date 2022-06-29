/**
 * Created by leonardli on 4/16/17.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';

class FormTextArea extends Component {
  render() {
    const {
      className = '',
      label,
      isFullHeight,
      isRequired,
      errorMessage,
      textAreaRef,
      isIcon,
      ...otherProps
    } = this.props;

    return (
      <div className={`foundation ${isFullHeight ? 'full-height' : ''}`}>
        <label
          className={`${errorMessage ? 'is-invalid-label ' : ''}${className}`}
        >
          {label}
          {isRequired && (
            <span style={{ color: 'red', paddingLeft: '4px' }}>*</span>
          )}
          {isIcon && (
            <>
              <Tooltip title={this.props.tooltip} arrow placement="top">
                {this.props.icon ? (
                  this.props.icon
                ) : (
                  <InfoIcon
                    style={{
                      fontSize: '15px',
                      color: '#bdbdbd',
                      verticalAlign: 'middle',
                      marginLeft: '5px',
                    }}
                  />
                )}
              </Tooltip>
            </>
          )}
          <textarea
            ref={textAreaRef}
            className={`${errorMessage ? 'is-invalid-input ' : ''}`}
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

FormTextArea.propTypes = {
  className: PropTypes.string,
  errorMessage: PropTypes.string,
  isFullHeight: PropTypes.bool,
  isRequired: PropTypes.bool,
  label: PropTypes.string,
};

export default FormTextArea;
