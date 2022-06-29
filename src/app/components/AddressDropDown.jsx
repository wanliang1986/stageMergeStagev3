/* eslint-disable no-use-before-define */

import React, { Component } from 'react';
import { connect } from 'react-redux';
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

import { withTranslation } from 'react-i18next';
import * as ActionTypes from '../constants/actionTypes';
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
            ? this.props.t('tab:Primary Address')
            : this.props.t('tab:Additional Address')}
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
      addressList: [],
    };
  }
  handleChange = (event, option) => {
    this.setState({
      value: event.target.value,
    });
    this.props.getAddressId(option.id, event.target.value);
    this.props.dispatch({
      type: ActionTypes.ADDRES_ID,
      id: option.id,
    });
  };
  componentDidMount() {
    this.props
      .dispatch(getCLientContactAddress(this.props.companyId))
      .then((res) => {
        if (res) {
          let strA;
          res.response.forEach((item) => {
            if (item.address === this.props.client.get('address')) {
              strA = item;
            }
          });

          this.setState({
            addressList: res.response,
          });
          // this.props.cityId(res.response[0].cityId);
          this.props.dispatch(
            getCompany(this.props.companyId, this.props.companyType)
          );
          this.props.dispatch({
            type: ActionTypes.ADDRES_ID,
            id: strA?.id,
          });
        }
      });

    if (this.props.client.get('addressId')) {
      console.log(this.props.client.get('address'));
      this.setState({
        value: this.props.client.get('address') || '',
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
      this.props.dispatch({
        type: ActionTypes.ADDRES_ID,
        id: null,
      });
    }
  };
  // autoChange = (e, value) => {
  //   let toValue = value.address;
  //   let oneList = this.state.addressList;
  //   let str;
  //   oneList.forEach((item) => {
  //     if (item.address === toValue) {
  //       str = item;
  //     }
  //   });
  //   this.setState({
  //     value: str.address,
  //   });
  //   this.props.getAddressId(str.id, str.address);

  // };
  render() {
    const { classes, t, addresValueID } = this.props;
    const { value, addressList } = this.state;
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
          // onChange={this.autoChange}
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
                    control={
                      <Radio
                        checked={
                          option.id == this.props.addresValueID && value != ''
                        }
                        color="primary"
                      />
                    }
                    label={<RadioLabel t={t} option={option} />}
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

const mapStateToProps = (state) => {
  const addresValueID = state.controller.newCandidateJob?.get('addredataId')
    ? state.controller.newCandidateJob?.get('addredataId')
    : '';
  return {
    addresValueID,
  };
};
export default withTranslation('tab')(
  connect(mapStateToProps)(withStyles(styles)(AddressDropDown))
);
