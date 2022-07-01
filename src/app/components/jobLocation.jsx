import React from 'react';
import { connect } from 'react-redux';
import clsx from 'clsx';
import { throttle } from 'lodash';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { Button } from '@material-ui/core';
import { searchLocation } from '../../apn-sdk/client';
import Autocomplete, {
  createFilterOptions,
} from '@material-ui/lab/Autocomplete';
const styles = {
  root: {
    width: '100%',
    '& label': {
      display: 'inline-block',
    },
  },
  input: {
    padding: '5px',
  },
  inputWrapper: {
    borderRadius: 0,
    paddingLeft: 8,
    border: `1px solid #cacaca`,
    transition: `box-shadow 0.5s, border-color 0.25s ease-in-out`,
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
};

class Location extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      locations: [],
      curLocation: '',
      id: '0',
      timerId: null,
      blurFlag: false,
    };
    this.handleInputThrottled = throttle(this._search, 1500);
  }

  componentWillMount() {
    if (this.props.city) {
      this.changeFilter(this.props.city, '传入');
    }
  }

  _search = (query) => {
    searchLocation(query).then(({ response }) => {
      let data = response.reverse().sort(function (a, b) {
        if (a.similarity == 'city') {
          return -1;
        } else {
          return 1;
        }
      });
      data.map((ele) => {
        if (ele.similarity === 'city') {
          ele.show = `${ele.city}, ${ele.province}, ${ele.country}`;
        } else if (ele.similarity === 'province') {
          ele.show = `${ele.province}, ${ele.country}`;
        } else {
          ele.show = ele.country;
        }
        return ele;
      });

      this.setState({ locations: data });
    });
  };
  fetchLocationList = (e) => {
    const query = e.target.value;
    this.setState({ curLocation: query, blurFlag: false }, () => {
      this.handleInputThrottled(query);
    });
  };

  closePopup = () => {
    this.setState({ locations: [] });
  };

  changeFilter = (newValue, flagTwo) => {
    let filters = this.props.filters;
    filters = filters ? filters.toJS() : [];
    console.log(newValue);
    let data;
    let msg;
    if (newValue) {
      let flag = false;
      filters.length > 0 &&
        filters.map((item) => {
          if (typeof newValue === 'string' && item.location == newValue) {
            flag = true;
          } else if (newValue.show == item.key) {
            flag = true;
          }
        });
      if (flag) {
        return;
      }

      if (typeof newValue === 'string') {
        data = { location: newValue, key: newValue };
        msg = newValue;
      } else if (newValue && newValue.inputValue) {
        data = { location: newValue.inputValue, key: newValue.inputValue };
        msg = newValue.inputValue;
      } else {
        if (newValue.similarity === 'city') {
          data = {
            city: newValue.city,
            province: newValue.province,
            country: newValue.country,
            key: newValue.show,
          };
          if (newValue.province) {
            msg =
              newValue.city +
              ', ' +
              newValue.province +
              ', ' +
              newValue.country;
          } else {
            msg = newValue.city + ', ' + newValue.country;
          }
        } else if (newValue.similarity === 'province') {
          data = {
            province: newValue.province,
            country: newValue.country,
            key: newValue.show,
          };
          msg = newValue.province + ', ' + newValue.country;
        } else {
          data = {
            country: newValue.country,
            key: newValue.show,
          };
          msg = newValue.country;
        }
      }

      const locations = [...filters, data];

      this.setState({
        curLocation: msg,
        id: this.state.id + 1,
        blurFlag: true,
      });
      if (!flagTwo) {
        this.props.getLocation(newValue);
      }

      // this.props.dispatch(getFilterData({ locations: locations }));
    }
  };
  getCurLocation = (data) => {};

  changeBlur = () => {
    console.log(this.state.blurFlag);
    if (!this.state.blurFlag) {
      this.props.getLocation(this.state.curLocation);
    }
  };

  render() {
    const { locations, curLocation, city } = this.state;
    const { classes, open, errorMessage, removeErrorMsgHandler, disabled } =
      this.props;

    return (
      <div className={classes.root}>
        <Autocomplete
          freeSolo
          value={this.state.id}
          disableClearable
          options={locations}
          disabled={disabled}
          // groupBy={option =>
          //   option.similarity.charAt(0).toUpperCase() +
          //   option.similarity.slice(1)
          // }
          style={{ width: '100%', marginBottom: '2px' }}
          inputValue={curLocation}
          onChange={(e, newValue) => {
            this.changeFilter(newValue);
          }}
          getOptionLabel={(option) => {
            if (typeof option === 'string') {
              return option;
            }
            if (option.inputValue) {
              return option.inputValue;
            }
            return option.show;
          }}
          onClose={this.closePopup}
          renderInput={(params) => (
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
              placeholder="Enter a city/state/country name"
              onChange={this.fetchLocationList}
              onBlur={this.changeBlur}
            />
          )}
        />
        <span
          style={{
            color: '#cc4b37',
            fontSize: '12px',
            fontWeight: 'bold',
            fontFamily: 'Roboto',
          }}
        >
          {errorMessage && errorMessage.get('primaryAddressesCity')
            ? errorMessage.get('primaryAddressesCity')
            : null}
        </span>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    filters: state.controller.searchAudience.get('filters').get('locations'),
  };
};

export default connect(mapStateToProps)(withStyles(styles)(Location));
