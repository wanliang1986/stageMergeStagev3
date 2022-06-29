/**
 * Created by leonardli on 4/16/17.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Tooltip from '@material-ui/core/Tooltip';
import InfoIcon from '@material-ui/icons/Info';
const styles = {
  indent: {
    position: 'absolute',
    top: '26px',
    left: '8px',
  },
};
class FormInput extends Component {
  render() {
    const {
      className,
      label,
      type,
      isRequired,
      errorMessage,
      indent,
      toolTip,
      ...props
    } = this.props;
    return (
      <div
        className="foundation"
        style={{ position: indent ? 'relative' : '' }}
      >
        <label
          className={`${errorMessage ? 'is-invalid-label ' : ''}${
            className || ''
          }`}
        >
          {label}
          {isRequired && (
            <span style={{ color: 'red', paddingLeft: '4px' }}>*</span>
          )}
          {toolTip && (
            <Tooltip title={toolTip} arrow placement="top">
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
          )}
          <input
            className={`${errorMessage ? 'is-invalid-input ' : ''}`}
            style={{ textIndent: indent ? '1em' : '' }}
            type={type || 'text'}
            {...props}
          />
          {errorMessage && (
            <span className="form-error is-visible">{errorMessage}</span>
          )}
        </label>
        {indent && <span style={styles.indent}>{indent}</span>}
      </div>
    );
  }
}

FormInput.propTypes = {
  className: PropTypes.string,
  errorMessage: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  isRequired: PropTypes.bool,
  label: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  type: PropTypes.string,
};

export default FormInput;
