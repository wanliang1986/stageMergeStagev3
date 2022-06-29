import React, { useEffect } from 'react';
import { makeStyles, useTheme, withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import InputBase from '@material-ui/core/InputBase';
import Chip from '@material-ui/core/Chip';
import { prospectCheckname } from '../../../../../apn-sdk';
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

export default function MultipleSelect(props) {
  const {
    teamMember,
    handleCheck,
    checkedMember,
    label,
    accountManagerError,
    errorMessage,
    salesLeadIndex,
  } = props;
  const theme = useTheme();
  const [teamMemberList, setTeamMemberList] = React.useState([]);

  useEffect(() => {
    if (checkedMember && checkedMember.length > 0) {
      let checked = [];
      checkedMember.forEach((item, index) => {
        if (item.fullName) {
          checked.push(item.fullName);
        } else {
          let fullName = item.firstName + ' ' + item.lastName;
          checked.push(fullName);
        }
      });
      setTeamMemberList(checked);
    }
  }, [checkedMember]);

  const handleChange = (event) => {
    setTeamMemberList(event.target.value);
  };
  const handleDelete = (item, index) => {
    let list = lodash.cloneDeep(teamMemberList);
    list.splice(index, 1).join(',');
    setTeamMemberList(list);
    let user = teamMember
      .filter((member, index) => member.get('fullName') === item)
      .first();
    handleCheck(user);
  };
  const hasError = (arr, index) => {
    let _arr = arr.filter((_item, _index) => {
      return _item.salesLeadIndex === index && _item.errorMessage === true;
    });
    if (_arr.length > 0) {
      return true;
    }
    return false;
  };
  return (
    <div style={{ padding: '3px' }}>
      <div>
        <label
          style={
            errorMessage &&
            errorMessage.get('accountManager') &&
            hasError(accountManagerError, salesLeadIndex)
              ? {
                  fontSize: '12px',
                  marginBottom: '3px',
                  fontFamily: 'Roboto',
                  color: '#cc4b37',
                }
              : { fontSize: '12px', marginBottom: '3px' }
          }
        >
          {label} <span style={{ color: 'red' }}>*</span>
        </label>
      </div>
      <Select
        labelId="demo-mutiple-checkbox-label"
        id="demo-mutiple-checkbox"
        multiple
        value={teamMemberList}
        fullWidth
        // onChange={handleChange}
        input={<BootstrapInput />}
        renderValue={(selected) => {
          selected.join(', ');
        }}
        MenuProps={MenuProps}
        style={
          errorMessage &&
          errorMessage.get('accountManager') &&
          hasError(accountManagerError, salesLeadIndex)
            ? {
                border: '1px solid #cc4b37',
                backgroundColor: 'rgb(250, 237, 235)',
              }
            : {}
        }
      >
        {teamMember.map((item, index) => (
          <MenuItem key={item.get('fullName')} value={item.get('fullName')}>
            <Checkbox
              color="primary"
              checked={teamMemberList.indexOf(item.get('fullName')) > -1}
              disabled={item.get('disabled')}
              onChange={(e) => {
                handleCheck(item);
              }}
            />
            <ListItemText primary={item.get('fullName')} />
          </MenuItem>
        ))}
      </Select>
      {errorMessage &&
      errorMessage.get('accountManager') &&
      hasError(accountManagerError, salesLeadIndex) ? (
        <span
          style={{
            color: '#cc4b37',
            fontSize: '0.75em',
            fontWeight: 'bold',
          }}
        >
          {errorMessage.get('accountManager')}
        </span>
      ) : null}
      <div style={{ marginTop: '10px' }}>
        {teamMemberList.map((item, index) => {
          return (
            <Chip
              key={item}
              size="small"
              style={{ marginRight: '5px' }}
              label={item}
              onDelete={() => {
                handleDelete(item, index);
              }}
              color="primary"
            />
          );
        })}
      </div>
    </div>
  );
}
