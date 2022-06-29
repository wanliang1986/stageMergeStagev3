import React from 'react';
import { connect } from 'react-redux';
import clsx from 'clsx';
import { throttle } from 'lodash';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { searchLocation } from '../../apn-sdk/client';
import Autocomplete from '@material-ui/lab/Autocomplete';

import { withTranslation } from 'react-i18next';
const styles = {
  root: {
    width: '100%',
    '& label': {
      display: 'inline-block',
      marginBottom: 8,
    },
    // marginTop:1
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
      preCurLocation: null,
      timerId: null,
      cityState: null,
    };
    this.handleInputThrottled = throttle(this._search, 500);
  }

  static getDerivedStateFromProps(props, state) {
    const curLocation = props.curLoaction;
    if (curLocation !== state.preCurLocation) {
      return {
        curLocation,
        preCurLocation: curLocation,
      };
    }
    return null;
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
    // if (!query) {
    this.props.getLocation(query);
    // }
    if (e.target.value.length > 2) {
      this.setState({ curLocation: query }, () => {
        this.handleInputThrottled(query);
      });
    }
  };

  closePopup = () => {
    this.setState({ locations: [] });
  };

  changeFilter = (newValue) => {
    let filters = this.props.filters;
    filters = filters ? filters.toJS() : [];
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
        msg = newValue;
      } else if (newValue && newValue.inputValue) {
        msg = newValue.inputValue;
      } else {
        if (newValue.similarity === 'city') {
          msg =
            newValue.city + ', ' + newValue.province + ', ' + newValue.country;
        } else if (newValue.similarity === 'province') {
          msg = newValue.city + ', ' + newValue.province;
        } else {
          msg = newValue.country;
        }
      }

      this.setState({ curLocation: msg });
      this.props.getLocation(newValue);
    }
  };

  render() {
    const { locations, curLocation } = this.state;
    const { classes, errorMessage } = this.props;

    return (
      <div className={classes.root}>
        <Autocomplete
          freeSolo
          disableClearable
          options={locations}
          // groupBy={option =>
          //   option.similarity.charAt(0).toUpperCase() +
          //   option.similarity.slice(1)
          // }
          style={
            errorMessage && errorMessage.get('primaryAddressesCity')
              ? {
                  width: '100%',
                  border: '1px solid #CC4B37',
                  backgroundColor: '#FAEDEB',
                }
              : { width: '100%' }
          }
          value={curLocation}
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
          renderInput={(params) => {
            // console.log(params.inputProps);
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
                placeholder={this.props.t(
                  'tab:Enter a city/state/country name'
                )}
                onChange={this.fetchLocationList}
              />
            );
          }}
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

export default withTranslation('tab')(
  connect(mapStateToProps)(withStyles(styles)(Location))
);
