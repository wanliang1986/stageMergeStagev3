import React, { Component } from 'react';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core';
import Chip from '@material-ui/core/Chip';
import lodash from 'lodash';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const styles = {
  root: {
    marginBottom: '8px',
    '& fieldset': {
      borderRadius: '0px',
    },
    '& div.MuiOutlinedInput-root': {
      paddingTop: '0px',
      paddingBottom: '0px',
      height: '40px',
    },
    '& .MuiFormControl-fullWidth': {
      height: '30px',
    },
    '& input': {
      fontSize: '12px',
      color: '#505050',
    },
  },
  root_1: {
    marginBottom: '8px',
    '& fieldset': {
      borderRadius: '0px',
    },
    '& div.MuiOutlinedInput-root': {
      paddingTop: '0px',
      paddingBottom: '0px',
      height: '40px',
      border: '1px solid #cc4b37',
      backgroundColor: 'rgb(250, 237, 235)',
    },
    '& .MuiFormControl-fullWidth': {
      height: '30px',
    },
    '& input': {
      fontSize: '12px',
      color: '#505050',
    },
  },
};

class UserSearchSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      teamMemberList: [],
      checkedName: [],
    };
  }

  componentWillUpdate(props) {
    if (props.checkedMember !== this.state.teamMemberList) {
      this.setState({
        teamMemberList: props.checkedMember,
        checkedName: props.checkedName,
      });
    }
  }

  componentWillMount(props) {
    this.setState({
      teamMemberList: this.props.checkedMember,
      checkedName: this.props.checkedName,
    });
  }

  handleChange = (value) => {
    let list = lodash.cloneDeep(this.state.teamMemberList);
    let names = [];
    let userIndex = null;
    if (list.length === 0) {
      list.push(value);
    } else {
      if (
        list.some((item, index) => {
          if (item.id === value.id) {
            userIndex = index;
            return true;
          }
        })
      ) {
        list.splice(userIndex, 1);
      } else {
        list.push(value);
      }
    }
    list.forEach((item, index) => {
      names.push(item.fullName);
    });
    this.props.handleCheck(value);
    this.setState({
      teamMemberList: list,
      checkedName: names,
    });
  };
  handleDelete = (item, index) => {
    let list = lodash.cloneDeep(this.state.teamMemberList);
    let names = [];
    list.splice(index, 1).join(',');
    list.forEach((item, index) => {
      names.push(item.fullName);
    });
    this.setState({
      teamMemberList: list,
      checkedName: names,
    });
    let user = this.props.teamMember
      .filter((member, index) => member.get('fullName') === item.fullName)
      .first();
    this.props.handleCheck(user.toJS());
  };
  render() {
    const {
      classes,
      teamMember,
      handleCheck,
      checkedMember,
      label,
      errorMessage,
    } = this.props;
    const { teamMemberList, checkedName } = this.state;
    return (
      <>
        <label
          style={
            errorMessage && errorMessage.get('teamMember')
              ? { fontSize: '12px', color: '#cc4b37' }
              : { fontSize: '12px' }
          }
        >
          {label} <span style={{ color: '#cc4b37' }}>*</span>
        </label>
        <Autocomplete
          multiple
          options={teamMember.toJS()}
          disableCloseOnSelect
          getOptionLabel={(option) => option.fullName}
          renderTags={() => {
            return '';
          }}
          renderOption={(option, { selected }) => {
            return (
              <React.Fragment>
                <Checkbox
                  icon={icon}
                  checkedIcon={checkedIcon}
                  style={{ marginRight: 8 }}
                  color="primary"
                  disabled={option.disabled}
                  onChange={(e) => {
                    this.handleChange(option);
                    handleCheck(option);
                  }}
                  checked={checkedName.indexOf(option.fullName) !== -1}
                />
                {option.fullName}
              </React.Fragment>
            );
          }}
          className={
            errorMessage && errorMessage.get('teamMember')
              ? classes.root_1
              : classes.root
          }
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label=""
              placeholder=""
              fullWidth
            />
          )}
        />
        <div style={{ marginTop: '10px' }}>
          {teamMemberList.length > 0
            ? teamMemberList.map((item, index) => {
                return (
                  <Chip
                    key={index}
                    size="small"
                    style={{ marginRight: '5px', marginBottom: '5px' }}
                    label={item.fullName}
                    onDelete={() => {
                      this.handleDelete(item, index);
                    }}
                    color="primary"
                  />
                );
              })
            : ''}
        </div>
      </>
    );
  }
}

export default withStyles(styles)(UserSearchSelect);
