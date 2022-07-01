/**
 * Created by leonardli on 4/16/17.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

class FormTextArea extends Component {
  render() {
    const {
      className = '',
      label,
      isFullHeight,
      isRequired,
      errorMessage,
      textAreaRef,
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
