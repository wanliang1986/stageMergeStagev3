import React from 'react';
import { withStyles } from '@material-ui/core/styles';

import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';

const styles = theme => ({
  formControl: {
    flexDirection: 'row',
    alignItems: 'baseline',
    '& > $textFieldContainer': {
      margin: 0,
      marginBottom: '0.75em'
    }
  },
  label: {
    color: theme.palette.primary.main,
    marginRight: 10,
    fontSize: 13,
    minWidth: 60,
    fontWeight: 500
  },
  textFieldContainer: {},
  textField: {
    fontSize: 14,
    border: '1px solid #cacaca',
    paddingLeft: 8,
    transition: 'box-shadow 0.5s, border-color 0.25s ease-in-out',
    '&:focus': {
      borderColor: '#8a8a8a',
      boxShadow: '0 0 5px #cacaca',
      background: 'transparent'
    }
  }
});

class EmailField extends React.PureComponent {
  render() {
    const {
      classes,
      value,
      name,
      handleChange,
      label,
      placeholder,
      select,
      children
    } = this.props;
    return (
      <FormControl className={classes.formControl}>
        <label className={classes.label} htmlFor={name}>
          {label}:
        </label>
        {select ? (
          <Select
            id={name}
            name={name}
            value={value}
            onChange={e => handleChange(name, e.target.value)}
            placeholder={placeholder}
            classes={{ select: classes.textField }}
            className={classes.textFieldContainer}
            fullWidth
            disableUnderline
          >
            {children}
          </Select>
        ) : (
          <Input
            id={name}
            name={name}
            value={value}
            onChange={e => handleChange(name, e.target.value)}
            classes={{ input: classes.textField }}
            className={classes.textFieldContainer}
            fullWidth
            disableUnderline
          />
        )}
      </FormControl>
    );
  }
}

export default withStyles(styles)(EmailField);
