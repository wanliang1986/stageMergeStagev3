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
import { withTranslation } from 'react-i18next';
// import { getCLientContactAddress, getCompany } from '../actions/clientActions';
const styles = {
  root: {
    '& .MuiOutlinedInput-root': {
      borderRadius: '0px',
      height: '32px',
    },
    '& .MuiFormControl-root': {
      border: '1px solid #cc4b37 !important',
      backgroundColor: '#f9ecea !important',
    },
    '& .MuiAutocomplete-input': {
      padding: '0.5px 4px !important',
    },
    '& .MuiAutocomplete-clearIndicator': {
      visibility: 'visible !important',
    },
  },

  root_1: {
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
      addressList: null,
      selected: null,
    };
  }
  handleChange = (event, option) => {
    this.setState({
      value: event.target.value,
      selected: option.id,
    });
    this.props.getAddressId(option.id, event.target.value);
  };
  componentDidMount() {
    this.props.onRef(this);
  } // 调用父组件传入的函数，把自身赋给父组件
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
  hasSameStr = (str1, str2) => {
    for (let i = 0; i <= str1.length - 1; i++) {
      if (str2.indexOf(str1.substr(i, 1)) != -1) {
        return true;
      }
    }
  };
  render() {
    const { classes, addressList, errorMessage } = this.props;
    const { value, selected } = this.state;
    return (
      <div>
        <Autocomplete
          id="checkboxes-tags-demo"
          options={addressList ? addressList : []}
          className={
            errorMessage.get('address') ? classes.root : classes.root_1
          }
          // disableCloseOnSelect
          // value={value}
          inputValue={value}
          disableClearable={value && value !== '' ? false : true}
          onInputChange={this.handleInputChange}
          getOptionLabel={(option) => value}
          renderOption={(option, { selected }) => (
            <React.Fragment>
              <FormControl>
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
                    label={<RadioLabel option={option} t={this.props.t} />}
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
              placeholder={'Please select'}
            />
          )}
        />
      </div>
    );
  }
}

export default withTranslation('tab')(withStyles(styles)(AddressDropDown));
