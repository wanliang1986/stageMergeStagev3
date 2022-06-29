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
import clsx from 'clsx';
// import MyTree from './tree';
import Select from '@material-ui/core/Select';
import InputBase from '@material-ui/core/InputBase';

import DropdownTreeSelect from 'react-dropdown-tree-select';
import MyTree from '../../../../components/Tree/index';
import Loading from '../../../../components/particial/Loading';
import './index.css';
const styles = {
  //   MuiAutocompleteInputRoot: {
  //     borderRadius: '0px',
  //     height: '32px',
  //   },
  //   MuiSelectSelectMenu: {
  //     height: '20px',
  //   },
  selectRoot: {
    '&.MuiSelect-icon': {
      display: 'none',
    },
  },
};

const BootstrapInput = withStyles((theme) => ({
  root: {
    'label + &': {
      marginTop: theme.spacing(3),
    },
  },
  input: {
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #545454',
    fontSize: 16,
    padding: '2px 26px 2px 12px',
    height: '20px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:focus': {
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
    },
  },
}))(InputBase);

class ServiceTypesSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      val: '',
      value: '',
    };
  }

  onChecked = (val, list, e) => {
    console.log(list);
    let dataList = [];
    for (let key in list) {
      dataList.push(list[key]);
    }
    let checkedList = dataList.filter((item, index) => {
      return item.checkStatus.checked === true;
    });
    this.props.sendServiceType(checkedList);
    let msg = val.join(',');
    this.setState({
      value: msg,
    });
  };

  deepQuery = (tree, id) => {
    var retNode = null;
    function deepSearch(tree, id) {
      for (var i = 0; i < tree.length; i++) {
        if (tree[i].children && tree[i].children.length > 0) {
          deepSearch(tree[i].children, id);
        }
        if (id === tree[i].id) {
          retNode = tree[i];
        }
      }
    }
    deepSearch(tree, id);
    return retNode;
  };
  render() {
    const { classes, data, selected, labelShow } = this.props;
    const { value, config } = this.state;
    const selectedVal = [];
    const selectedLabel = [];
    let selectMsg = null;
    if (selected && data) {
      selected.forEach((item, index) => {
        let val = this.deepQuery(data, item);
        selectedVal.push(val);
      });
      selectedVal.forEach((item, index) => {
        selectedLabel.push(item.label);
      });
    }
    selectMsg = selectedLabel.join(',');
    return (
      <>
        {!labelShow ? (
          <div style={{ fontSize: '12px', height: '23px' }}>
            Service Type <span style={{ color: 'red' }}>*</span>
          </div>
        ) : (
          ''
        )}
        <Select
          labelId="demo-customized-select-label"
          id="demo-customized-select"
          className={classes.selectRoot}
          input={<BootstrapInput />}
          style={{ width: '400px' }}
          value={value ? value : selectMsg}
          renderValue={() => {
            return value ? value : selectMsg;
          }}
        >
          {data ? (
            <MyTree
              data={data ? data : []}
              onChecked={this.onChecked}
              selectedVal={selectedVal}
            />
          ) : (
            <Loading />
          )}
        </Select>
        <span style={{ color: 'red', fontSize: '0.75em', fontWeight: 'blod' }}>
          {selectedVal.length === 0 ? this.state.serviceTypeError : null}
        </span>
      </>
    );
  }
}

export default withStyles(styles)(ServiceTypesSelect);
