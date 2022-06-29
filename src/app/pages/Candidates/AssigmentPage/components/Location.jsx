import React from 'react';
import clsx from 'clsx';
import { throttle } from 'lodash';
import { withStyles } from '@material-ui/core/styles';
import { searchLocation3 as searchLocation } from '../../../../../apn-sdk/location';

import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { withTranslation } from 'react-i18next';
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
};

class Location extends React.Component {
  constructor(props) {
    // console.log('Location.constructor')
    super(props);
    const value = _mapOldAddress(props.value);
    this.state = {
      locationOptions: value ? [value] : [],
      inputValue: '',
      value,
      loading: false,
    };
    this.handleInputThrottled = throttle(this._search, 500);
  }

  componentWillUnmount() {
    this.loading = false;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      // this.setState({
      //   value:nextProps.value
      // })
      let value = _mapOldAddress(nextProps.value);
      this.setState({
        value,
      });
    }
  }

  _search = (query) => {
    this.loading = true;
    let countryCode = 'US';
    searchLocation(query, countryCode).then(({ response }) => {
      if (this.loading) {
        let locationOptions = [];
        if (this.state.value) {
          locationOptions = [this.state.value];
        }
        let data = response.sort(function (a, b) {
          if (a.similarity === b.similarity) return 0;
          if (a.similarity === 'city') {
            return -1;
          } else {
            return 1;
          }
        });
        data.length = data.length > 15 ? 15 : data.length;
        data.forEach((ele) => {
          const country = ele.country;
          const province = ele.province
            ? ele.province + ', ' + country
            : ele.country;
          const city = ele.city ? ele.city + ', ' + province : province;

          if (ele.similarity === 'city') {
            ele.show = city;
          } else if (ele.similarity === 'province') {
            ele.show = province;
          } else {
            ele.show = country;
          }
          return ele;
        });

        this.setState({ locationOptions: [...locationOptions, ...data] });
      }
      this.loading = false;
    });
  };
  handleInputChange = (e, query, reason) => {
    this.setState(
      {
        inputValue: query,
      },
      () => {
        if (query.length > 2 && reason === 'input') {
          this.handleInputThrottled(query);
          this.props.handleChange({
            location: query,
            city: '',
            province: '',
            country: '',
          });
        } else if (query.length === 0 && reason === 'input') {
          this.props.handleChange({
            location: null,
            city: '',
            province: '',
            country: '',
          });
        }
      }
    );
  };

  handleChange = (e, newValue) => {
    if (newValue) {
      this.setState({ value: newValue }, () => {
        this.props.handleChange({
          city: newValue.city,
          province: newValue.province,
          country: newValue.country,
          location: '',
          countryCode: newValue.countryCode,
          provinceCode: newValue.provinceCode,
        });
      });
    }
  };

  render() {
    const { locationOptions, value } = this.state;
    const { classes, disabled, placeholder, errorMessage } = this.props;

    return (
      <div className={clsx(classes.root, { [classes.disabled]: disabled })}>
        <Autocomplete
          disabled={disabled}
          freeSolo
          filterOptions={(options) => options}
          disableClearable
          options={locationOptions}
          value={value || null}
          onChange={this.handleChange}
          onInputChange={this.handleInputChange}
          getOptionLabel={(option) => {
            return option.show || '';
          }}
          style={
            errorMessage && errorMessage.get('location')
              ? { border: '1px solid #cc4b37' }
              : {}
          }
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
                }}
                placeholder={
                  placeholder ||
                  this.props.t('tab:Enter a city/state/country name')
                }
              />
            );
          }}
        />
      </div>
    );
  }
}

Location.defaultProps = {
  handleChange: () => {},
};

export default withTranslation('tab')(withStyles(styles)(Location));

export const _mapOldAddress = (address) => {
  // console.log(address);
  if (address) {
    const newAddress = {
      city: address.city,
      cityId: address.cityId,
      province: address.province,
      // country: address.country && address.country.split('--')[0].trim(),
      country: address.country,
      location: address.location,
      show: address.location,
    };
    if (!newAddress.show) {
      if (newAddress.city && newAddress.province && newAddress.country) {
        newAddress.show = `${newAddress.city}, ${newAddress.province}, ${newAddress.country}`;
      } else if (
        !newAddress.city &&
        newAddress.province &&
        newAddress.country
      ) {
        newAddress.show = `${newAddress.province}, ${newAddress.country}`;
      } else if (
        !newAddress.city &&
        !newAddress.province &&
        newAddress.country
      ) {
        newAddress.show = newAddress.country;
      } else if (
        newAddress.city &&
        !newAddress.province &&
        newAddress.country
      ) {
        newAddress.show = `${newAddress.city}, ${newAddress.country}`;
      } else if (
        newAddress.city &&
        !newAddress.province &&
        !newAddress.country
      ) {
        newAddress.show = `${newAddress.city}`;
      }
    }
    return newAddress.show ? newAddress : null;
  } else {
    return null;
  }
};
