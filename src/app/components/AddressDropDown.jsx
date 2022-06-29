/* eslint-disable no-use-before-define */

import React, { Component } from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import { withStyles } from '@material-ui/core';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Radio from '@material-ui/core/Radio';
import Typography from '@material-ui/core/Typography';
import { getCLientContactAddress, getCompany } from '../actions/clientActions';
const styles = {
  root: {
    '& .MuiOutlinedInput-root': {
      borderRadius: '0px',
      height: '32px',
    },
    '& .MuiAutocomplete-input': {
      padding: '0.5px 4px !important',
    },
    '& .MuiAutocomplete-clearIndicator': {
      visibility: 'visible !important',
    },
    '& .MuiSvgIcon-fontSizeSmall': {
      fontSize: '0.55em',
    },
  },
};

class RadioLabel extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { option } = this.props;
    return (
      <>
        <Typography variant="h6" gutterBottom>
          {option.companyAddressType === 'PRIMARY'
            ? 'Primary Address'
            : 'Additional Address'}
        </Typography>
        <Typography variant="caption" display="block" gutterBottom>
          {option.address}
        </Typography>
        <Typography variant="caption" display="block" gutterBottom>
          {option.city},{option.province},{option.country}
        </Typography>
      </>
    );
  }
}

class AddressDropDown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.addressValue || '',
      addressList: null,
    };
  }
  handleChange = (event, option) => {
    console.log(event.target.value);
    this.setState({
      value: event.target.value,
    });
    this.props.getAddressId(option.id, event.target.value);
  };
  componentDidMount() {
    this.props
      .dispatch(getCLientContactAddress(this.props.companyId))
      .then((res) => {
        if (res) {
          this.setState({
            addressList: res.response,
          });
          this.props.dispatch(
            getCompany(this.props.companyId, this.props.companyType)
          );
        }
      });
    if (this.props.client.get('companyAddressId')) {
      console.log(this.props.client.get('address'));
      this.setState({
        value: this.props.client.get('address'),
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.addressValue !== this.state.value) {
      this.setState({
        value: nextProps.addressValue,
      });
    }
  }
  handleInputChange = (e, query, reason) => {
    if (reason === 'clear') {
      this.setState({
        value: '',
      });
      this.props.getAddressId(null, '');
    }
  };
  render() {
    const { classes } = this.props;
    const { value, addressList } = this.state;
    console.log(value);
    return (
      <div className={classes.root}>
        <Autocomplete
          id="checkboxes-tags-demo"
          options={addressList ? addressList : []}
          inputValue={value}
          // disableCloseOnSelect
          disableClearable={value && value !== '' ? false : true}
          onInputChange={this.handleInputChange}
          getOptionLabel={(option) => value}
          renderOption={(option, { selected }) => (
            <React.Fragment>
              <FormControl component="fieldset">
                <RadioGroup
                  aria-label="gender"
                  name="gender1"
                  value={value}
                  onChange={(e) => {
                    this.handleChange(e, option);
                  }}
                >
                  <FormControlLabel
                    value={option.address}
                    control={<Radio color="primary" />}
                    label={<RadioLabel option={option} />}
                  />
                </RadioGroup>
              </FormControl>
            </React.Fragment>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              size="small"
              fullWidth
              label=""
              variant="outlined"
              readonly
            />
          )}
        />
      </div>
    );
  }
}
export default withStyles(styles)(AddressDropDown);
