import React from 'react';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';

import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';

const styles = {
  root: {
    width: '100%',
    marginBottom: '11.25px',
    '& label': {
      display: 'inline-block',
      marginBottom: 8,
    },
    '&$disabled': {
      backgroundColor: '#F2F2F2',
      '& input': {
        color: '#8E8E8E',
      },
    },
  },
  inputWrapper: {
    fontSize: 15,
    color: '#505050',
    borderRadius: 0,
    paddingLeft: 6,
    paddingRight: 4,
    height: '32px',
    border: `1px solid #cacaca`,
    transition: `box-shadow 0.5s, border-color 0.25s ease-in-out`,
    '& >input': {
      // width: '100%',
      background: 'none transparent',
      border: '0 none',
      boxShadow: 'none',
      cursor: 'default',
      display: 'inline-block',
      fontSize: 'inherit',
      margin: 0,
      outline: 'none',
      lineHeight: '17px',
      /* For IE 8 compatibility */
      padding: '9.5px 0 13.5px',
      /* For IE 8 compatibility */
      WebkitAppearance: 'none',
    },
    '&.Mui-focused': {
      borderColor: `#8a8a8a`,
      boxShadow: `0 0 5px #cacaca`,
      transition: `box-shadow 0.5s, border-color 0.25s ease-in-out`,
    },
  },
  disabled: {},
  paper: {
    border: '1px solid #8a8a8a',
    borderRadius: 0,
    margin: -1,
    boxShadow: 'unset',
    '[x-placement*="bottom"] &': {
      borderTopColor: '#e5e5e5',
    },
    '[x-placement*="top"] &': {
      borderBottomColor: '#e5e5e5',
    },
  },
  listbox: {
    padding: 0,
  },
  option: {
    padding: '2px 0',
    '&[aria-selected="true"]': {
      backgroundColor: '#f5faff',
    },
    '&[data-focus="true"]': {
      backgroundColor: '#f2f9fc',
    },
  },
};

class WithCheckBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
      options: props.options || [],
    };
  }

  handleChange = (e, newValue) => {
    console.log('handleChange', newValue);
    if (newValue && newValue.length > 0) {
      this.setState({ value: newValue }, () => {
        this.props.onChange(newValue);
      });
    }
  };

  render() {
    const { options, value } = this.state;
    const { classes, disabled, placeholder } = this.props;

    return (
      <div
        className={clsx(classes.root, { [classes.disabled]: disabled })}
        title={
          (value && value.length) > 0
            ? value.map((v) => v.label).join(', ')
            : ''
        }
      >
        <Autocomplete
          classes={{
            paper: classes.paper,
            listbox: classes.listbox,
            option: classes.option,
          }}
          ListboxProps={{ disablePadding: true, dense: true }}
          multiple
          disableCloseOnSelect
          openOnFocus
          disabled={disabled}
          disableClearable
          options={options}
          value={value}
          onChange={this.handleChange}
          renderOption={(option, { selected }) => (
            <>
              <Checkbox
                color="primary"
                size="small"
                checked={selected}
                // style={{ marginLeft: -12 }}
              />
              {option.label}
            </>
          )}
          renderTags={(value) => {
            return (
              <Typography noWrap>
                {(value && value.length) > 0
                  ? value.map((v) => v.label).join(', ')
                  : 'All'}
              </Typography>
            );
          }}
          getOptionLabel={(option) => option.label}
          getOptionSelected={(option, value) => option.value === value.value}
          renderInput={(params) => {
            return (
              <TextField
                {...params}
                InputProps={{
                  ...params.InputProps,
                  className: clsx(
                    params.InputProps.className,
                    classes.inputWrapper
                  ),
                  disableUnderline: true,
                }}
                inputProps={{
                  ...params.inputProps,
                  autoComplete: 'nope',
                  type: null,
                  style: {
                    position: 'absolute',
                    zIndex: -1,
                  },
                }}
                placeholder={placeholder || 'Select'}
              />
            );
          }}
        />
      </div>
    );
  }
}

export default withStyles(styles)(WithCheckBox);
