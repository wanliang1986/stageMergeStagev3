import React from 'react';
import { connect } from 'react-redux';
import clsx from 'clsx';
import { throttle } from 'lodash';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { Button } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Typography from '@material-ui/core/Typography';

import { getUserOpiton } from '../../../../apn-sdk/user';

const styles = {
  root: {
    width: '100%',
    '& label': {
      display: 'inline-block',
    },
    '& .MuiAutocomplete-inputRoot': {
      paddingBottom: 0,
    },
  },
  input: {
    padding: '5px',
  },
  inputRoot: {},

  inputWrapper: {
    borderRadius: 0,
    paddingLeft: 8,
    border: `1px solid #cacaca`,
    transition: `box-shadow 0.5s, border-color 0.25s ease-in-out`,
    '& .MuiAutocomplete-input': {
      height: '18px',
    },

    '&.Mui-focused': {
      borderColor: `#8a8a8a`,
      boxShadow: `0 0 5px #cacaca`,
      transition: `box-shadow 0.5s, border-color 0.25s ease-in-out`,
    },
  },
  textfield: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    '& > div': {
      width: '100%',
    },
  },
  label: {
    fontSize: '0.75em',
  },
  label_err: {
    color: '#cc4b37',
    fontSize: '0.75em',
  },
};

class userOption extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newValues: null,
      userOption: [],
      user: '',
      params: [],
    };
    this.handleInputThrottled = throttle(this.UserSearch, 500);
  }

  // 回显
  componentWillMount() {
    if (this.props.value) {
      let res = [];
      this.props.value.forEach((x) => {
        if (x.user) {
          res.push(x.user);
        }
      });
      this.setState({
        params: res,
      });
    }
  }

  changeUser = (value) => {
    let res = [];
    value.forEach((x) => {
      res.push({
        userId: x.id,
        user: x,
      });
    });
    this.props.handleUser(res);
    // params是option的每个item完整信息
    this.setState({
      params: value,
    });
  };

  UserSearch = (query) => {
    getUserOpiton(query).then(({ response }) => {
      // let data = response
      // data.map((x) => {
      //     x.show = `${x.firstName} ${x.lastName}`
      //     return x
      // })
      this.setState({ userOption: response });
    });
  };

  //输入框输入
  fetchUserList = (e) => {
    const query = e.target.value;
    this.setState({ user: query.username }, () => {
      this.handleInputThrottled(query);
    });
  };

  render() {
    const { userOption, user, params } = this.state;
    const {
      classes,
      open,
      errorMessage,
      removeErrorMsgHandler,
      placeholder,
      label,
      isRequired,
    } = this.props;
    return (
      <div className={classes.root}>
        <span className={errorMessage ? classes.label_err : classes.label}>
          {label}
        </span>
        {isRequired && (
          <span
            style={{
              color: 'red',
              paddingLeft: '4px',
              fontSize: '0.75em',
            }}
          >
            *
          </span>
        )}
        <Autocomplete
          multiple
          limitTags={1}
          disableCloseOnSelect
          options={userOption}
          ChipProps={{ size: 'small' }}
          style={{ width: '100%' }}
          onChange={(e, newValue) => {
            this.changeUser(newValue);
          }}
          value={params}
          getOptionLabel={(option) => {
            return `${option.firstName + ' ' + option.lastName}`;
          }}
          // onClose={this.closePopup}
          getOptionSelected={(option, value) => option.id === value.id}
          renderOption={(option, state) => {
            return (
              <React.Fragment>
                <Checkbox
                  color="primary"
                  size="small"
                  checked={state.selected}
                  style={{ marginLeft: -12 }}
                />
                <Typography variant="body2">
                  {option.firstName + ' ' + option.lastName}
                </Typography>
              </React.Fragment>
            );
          }}
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
                inputProps={{ ...params.inputProps, autoComplete: 'nope' }}
                value={user}
                placeholder=""
                onChange={this.fetchUserList}
                onBlur={this.props.onBlur}
              />
            );
          }}
        />
        <span
          className="form-error"
          style={{
            color: '#cc4b37',
            fontSize: '0.75rem',
            // marginTop: '-0.5rem',
            marginBottom: '1rem',
            fontWeight: 'bold',
            display: 'block',
            marginTop: 5,
            // fontFamily: 'Roboto',
          }}
        >
          {errorMessage && errorMessage}
        </span>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

export default connect(mapStateToProps)(withStyles(styles)(userOption));
