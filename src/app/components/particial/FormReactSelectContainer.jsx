/**
 * Created by leonardli on 4/16/17.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = (theme) => ({
  icon: {
    display: 'inline-block',
    padding: 0,
    margin: 0,
    transform: 'translate(0.4rem, 0.2rem)',
    '& svg': {
      fill: 'gray',
      fontSize: '1.2em',
    },
  },
});

class FormReactSelectContainer extends Component {
  render() {
    const { classes } = this.props;
    const computedClassName = ['customized-react-select'];
    const { children, className, label, isRequired, errorMessage, icon } =
      this.props;

    if (errorMessage) {
      computedClassName.push('is-invalid-label', 'is-invalid-select');
    }

    if (className) {
      computedClassName.push(className);
    }

    return (
      <div className="foundation">
        <label className={computedClassName.join(' ')}>
          {/*{label ? label : <span style={{ visibility: 'hidden' }}>keep layout</span>}*/}
          {label}
          {isRequired && (
            <span style={{ color: 'red', paddingLeft: '4px' }}>*</span>
          )}
          {icon && <span className={classes.icon}>{icon}</span>}
          {children}
          {errorMessage && errorMessage !== true && (
            <span className="form-error is-visible">{errorMessage}</span>
          )}
        </label>
      </div>
    );
  }
}

FormReactSelectContainer.propTypes = {
  children: PropTypes.element,
  className: PropTypes.string,
  errorMessage: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  isRequired: PropTypes.bool,
  label: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
    PropTypes.element,
  ]),
};

export default withStyles(styles)(FormReactSelectContainer);
