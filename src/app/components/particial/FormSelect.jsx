/**
 * Created by leonardli on 4/16/17.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

class FormSelect extends Component {
  render() {
    const {
      className,
      label,
      isRequired,
      errorMessage,
      children,
      ...otherProps
    } = this.props;

    return (
      <div className="foundation">
        <label
          className={`${errorMessage ? 'is-invalid-label ' : ''}${
            className || ''
          }`}
        >
          {label}
          {isRequired && (
            <span style={{ color: 'red', paddingLeft: '4px' }}>*</span>
          )}
          <select
            className={`${errorMessage ? 'is-invalid-input ' : ''}`}
            {...otherProps}
          >
            {children}
          </select>
          {errorMessage && (
            <span className="form-error is-visible">{errorMessage}</span>
          )}
        </label>
      </div>
    );
  }
}

FormSelect.propTypes = {
  children: PropTypes.array,
  className: PropTypes.string,
  errorMessage: PropTypes.string,
  isRequired: PropTypes.bool,
  label: PropTypes.string,
};

export default FormSelect;
