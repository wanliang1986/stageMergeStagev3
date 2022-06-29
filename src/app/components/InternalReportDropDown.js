import React, { useEffect, useState } from 'react';
import { makeStyles, useTheme, withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import InputBase from '@material-ui/core/InputBase';
import Chip from '@material-ui/core/Chip';
import lodash from 'lodash';

const styles = {
  MuiAutocompleteInputRoot: {
    borderRadius: '0px',
    height: '32px',
  },
  MuiSelectSelectMenu: {
    height: '20px',
  },
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
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

const label = 'Job Type';

export default function MultipleSelect(props) {
  //   const { teamMember, handleCheck, checkedMember, label } = props;
  const theme = useTheme();
  const [selectedList, setSelectedList] = useState([
    'All',
    'CONTRACT',
    'FULL_TIME',
  ]);
  const [selected, setSelected] = useState([
    'All',
    'General Staffing(Contract)',
    'General Recruiting(FTE)',
  ]);

  useEffect(() => {}, []);

  const handleChange = (event) => {
    // console.log(event)
    // console.log(event.target.value)
    // let newSelectedList = lodash.cloneDeep(selectedList)
    // let _index = newSelectedList.indexOf(event.target.value[0])
    // console.log(_index)
    // if(_index===-1){
    //     newSelectedList.push(event.target.value[0])
    // }else{
    //     newSelectedList.splice(_index,1)
    // }
    // console.log(newSelectedList)
    // setSelectedList(event.target.value)
  };
  const handleDelete = (item, index) => {};

  const getSelectList = (val, label) => {
    let newSelectList = lodash.cloneDeep(selectedList);
    let newSelected = lodash.cloneDeep(selected);
    let _index = newSelectList.indexOf(val);
    if (_index === -1) {
      newSelectList.push(val);
      newSelected.push(label);
      let arrList = props.options.map((item, index) => {
        return item.value;
      });
      let valueList = props.options.map((item, index) => {
        return item.label;
      });
      if (val === 'All') {
        newSelectList = MergeArray(newSelectList, arrList);
        newSelected = MergeArray(newSelected, valueList);
      } else {
        let status = includes(newSelectList, arrList);
        if (status) {
          newSelectList.push('All');
          newSelected.push('All');
        }
      }
    } else {
      newSelectList.splice(_index, 1);
      newSelected.splice(_index, 1);
      if (val !== 'All') {
        let index = newSelectList.indexOf('All');
        if (index > -1) {
          newSelectList.splice(index, 1);
          newSelected.splice(index, 1);
        }
      } else {
        newSelectList = [];
        newSelected = [];
      }
    }
    console.log(newSelected);
    setSelectedList(newSelectList);
    setSelected(newSelected);
    props.selected(newSelectList);
  };

  const includes = (arr1, arr2) => {
    return arr2.every((val) => arr1.includes(val));
  };

  const MergeArray = (arr1, arr2) => {
    var _arr = new Array();
    for (var i = 0; i < arr1.length; i++) {
      _arr.push(arr1[i]);
    }
    for (var i = 0; i < arr2.length; i++) {
      var flag = true;
      for (var j = 0; j < arr1.length; j++) {
        if (arr2[i] == arr1[j]) {
          flag = false;
          break;
        }
      }
      if (flag) {
        _arr.push(arr2[i]);
      }
    }
    return _arr;
  };
  return (
    <div style={{ padding: '3px' }}>
      <div>
        <label style={{ fontSize: '12px', marginBottom: '3px' }}>
          {props.label}
        </label>
      </div>
      <Select
        labelId="demo-mutiple-checkbox-label"
        id="demo-mutiple-checkbox"
        multiple
        value={selected}
        fullWidth
        onChange={handleChange}
        input={<BootstrapInput />}
        renderValue={(selected) => {
          if (selected.indexOf('All') !== -1) {
            return 'All';
          } else {
            return selected.join(', ');
          }
        }}
        MenuProps={MenuProps}
      >
        <MenuItem value={'All'}>
          <Checkbox
            color="primary"
            checked={selectedList.indexOf('All') > -1}
            onChange={(e) => {
              getSelectList('All', 'All');
            }}
          />
          <ListItemText primary={'All'} />
        </MenuItem>
        {props.options.map((item, index) => (
          <MenuItem key={item.label} value={item.label}>
            <Checkbox
              color="primary"
              checked={selectedList.indexOf(item.value) > -1}
              onChange={(e) => {
                getSelectList(item.value, item.label);
              }}
            />
            <ListItemText primary={item.label} />
          </MenuItem>
        ))}
      </Select>
    </div>
  );
}
