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

import MyTree from '../../../../components/Tree/index';
import Loading from '../../../../components/particial/Loading';
import './index.css';
const styles = {
  MuiAutocompleteInputRoot: {
    borderRadius: '0px',
    height: '32px',
  },
  MuiSelectSelectMenu: {
    height: '20px',
  },
};

const BootstrapInput = withStyles((theme) => ({
  input: {
    position: 'relative',
    // backgroundColor: theme.palette.background.paper,
    border: '1px solid #ced4da',
    fontSize: 16,
    padding: '2px 26px 2px 12px',
    height: '26px',
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

class PotentialServiceTypeSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      val: '',
      value: '',
    };
  }

  nodeClick = (data) => {
    console.log(data);
  };
  selectChange = (data) => {
    console.log(data);
  };
  onSelect(val, e) {
    console.log(val);
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

  // getSelectMsg = (list) => {
  //   let msg = [];
  //   list.forEach((item, index) => {
  //     if (!item.children && item.checked === true) {
  //       msg.push(item.typeName);
  //     } else if (item.checked === true && item.children) {
  //       item.children.forEach((child, key) => {
  //         let nmsg = item.typeName + '-' + child.typeName;
  //         msg.push(nmsg);
  //       });
  //     } else if (item.checked !== true && item.children) {
  //       item.children.forEach((child, key) => {
  //         if (child.checked === true) {
  //           let nmsg = item.typeName + '-' + child.typeName;
  //           msg.push(nmsg);
  //         }
  //       });
  //     }
  //   });
  //   return msg;
  // };
  deepQuery = (tree, item) => {
    var retNode = null;
    function deepSearch(tree, item) {
      for (var i = 0; i < tree.length; i++) {
        if (tree[i].children && tree[i].children.length > 0) {
          deepSearch(tree[i].children, item);
        }
        if (item === tree[i].id || item.id === tree[i].id) {
          retNode = tree[i];
        }
      }
    }
    deepSearch(tree, item);
    return retNode;
  };
  hasError = (arr, index) => {
    let _arr = arr.filter((_item, _index) => {
      return _item.salesLeadIndex === index && _item.errorMessage === true;
    });
    if (_arr.length > 0) {
      return true;
    }
    return false;
  };
  render() {
    const {
      classes,
      data,
      selected,
      labelShow,
      t,
      errorMessage,
      serviceTypeError,
      salesLeadIndex,
    } = this.props;
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
      <div style={{ paddingTop: '2px' }}>
        {!labelShow ? (
          <label
            style={
              errorMessage &&
              errorMessage.get('serviceType') &&
              this.hasError(serviceTypeError, salesLeadIndex)
                ? {
                    fontSize: '12px',
                    marginBottom: '4px',
                    display: 'block',
                    fontFamily: 'Roboto',
                    color: '#cc4b37',
                  }
                : {
                    fontSize: '12px',
                    marginBottom: '4px',
                    display: 'block',
                    fontFamily: 'Roboto',
                  }
            }
          >
            {t('field:ServiceType')} <span style={{ color: 'red' }}>*</span>
          </label>
        ) : (
          ''
        )}
        <Select
          labelId="demo-customized-select-label"
          id="demo-customized-select"
          input={<BootstrapInput />}
          style={
            errorMessage &&
            errorMessage.get('serviceType') &&
            this.hasError(serviceTypeError, salesLeadIndex)
              ? {
                  width: this.props.width,
                  border: '1px solid #cc4b37',
                  backgroundColor: '#faedeb',
                }
              : { width: this.props.width }
          }
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
      </div>
    );
  }
}

export default withStyles(styles)(PotentialServiceTypeSelect);
