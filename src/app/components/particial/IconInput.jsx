import React, { Component } from 'react';
import PropTypes from 'prop-types';

class IconInput extends Component {
    render() {
        const { Icon, className, label, type, isRequired, errorMessage, ...otherProps } = this.props;

        return (
            <div className="foundation" style={{ position: 'relative' }}>
                <label className={`${errorMessage ? 'is-invalid-label ' : ''}${className || ''}`}>
                    {label}
                    {isRequired && (
                        <span style={{ color: 'red', paddingLeft: '4px' }}>*</span>
                    )}
                    <input
                        className={`${errorMessage ? 'is-invalid-input ' : ''}`}
                        type={type || 'text'}
                        {...otherProps}
                    />
                    {errorMessage && (
                        <span className="form-error is-visible">{errorMessage}</span>
                    )}
                </label>
                <Icon
                    style={{
                        position: 'absolute',
                        left: 5,
                        top: 5,
                        color: '#cacaca'
                    }} />
            </div>
        );
    }
}

IconInput.propTypes = {
    className: PropTypes.string,
    errorMessage: PropTypes.string,
    isRequired: PropTypes.bool,
    label: PropTypes.string,
    type: PropTypes.string,
};

export default IconInput;
