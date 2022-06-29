import React from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import * as ActionTypes from '../constants/actionTypes';
import { withStyles } from '@material-ui/core/styles';

import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Autocomplete from '@material-ui/lab/Autocomplete';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Checkbox from '@material-ui/core/Checkbox';
import clsx from 'clsx';
// import { getFilterData } from '../../store/actions/searchAudience';
import { CandidateGetGeneral } from '../actions/commonPoolAction';
const styles = {
  root: {
    width: 250,
    maxWidth: 400,
    '& label': {
      display: 'inline-block',
      marginBottom: 8,
    },
    '& .MuiAutocomplete-hasPopupIcon.MuiAutocomplete-hasClearIcon .MuiAutocomplete-inputRoot':
      {
        paddingRight: 24,
      },
  },
  inputWrapper: {
    paddingLeft: 8,
    border: `1px solid #cacaca`,
    transition: `box-shadow 0.5s, border-color 0.25s ease-in-out`,
    '&.Mui-focused': {
      borderColor: `#8a8a8a`,
      boxShadow: `0 0 5px #cacaca`,
      transition: `box-shadow 0.5s, border-color 0.25s ease-in-out`,
    },
  },
  title: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  anOr: {
    width: 82,
    height: 22,
    // borderRadius: 3,
    '& span': {
      width: 40,
      height: 20,
      textAlign: 'center',
      display: 'inline-block',
      fontSize: 13,
    },
  },
  left: {
    border: 'solid 1px #939393',
    borderRight: 'none',
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3,
    color: ' #939393',
    opacity: '0.4',
  },
  right: {
    border: 'solid 1px #3398dc',
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
    color: '#3398dc',
    backgroundColor: 'rgba(51, 152, 220, 0.1)',
    opacity: '0.6',
  },
};

// const defaultOptions = [
//   { value: 'Unlocked Candidates', label: 'Unlocked Candidates' },
//   { value: 'Unlocked Candidates', label: 'Unlocked Candidates' },
// ];

class Degrees extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      prevFilters: [],
      l: [],
      s: [],
      selectPlaceholderValue: 'Unselect',
    };
  }

  componentDidMount() {
    const { commonPoolSelectList, defultOptions } = this.props;
    let newCommonPoolArr = [];
    if (commonPoolSelectList) {
      let arr = commonPoolSelectList.split(',');
      arr &&
        arr.map((item) => {
          defultOptions.map((ele) => {
            if (item === ele.value) {
              newCommonPoolArr.push(ele);
            }
          });
        });
      // newCommonPoolArr = defultOptions.filter((item) =>
      //   commonPoolSelectList.includes(item.value)
      // );
      this.setState({
        prevFilters: newCommonPoolArr,
      });
    }
  }

  onchangeHandler = (value) => {
    if (value.length > 1) {
      value.splice(0, 1);
    }
    const { dispatch, defultStatus } = this.props;
    this.setState({ prevFilters: value }, () => {
      console.log('1111111111============', this.state.prevFilters);
    });

    let newValue = value.map((ele) => ele.value);

    dispatch({
      type: ActionTypes.COMMON_POOL_SELECT_VALUE,
      payload: newValue.toString(),
    });
    dispatch({
      type: ActionTypes.COMMON_POOL_SELECT_DEFULT_STATUS,
      payload: defultStatus,
    });
    dispatch(
      CandidateGetGeneral(
        '',
        '',
        'select',
        this.props.defultStatus,
        newValue.toString()
      )
    );
  };

  render() {
    const { prevFilters, selectPlaceholderValue } = this.state;
    const { classes, open, defultOptions, defultStatus } = this.props;
    return (
      <div className={classes.root}>
        <div className={classes.title}>
          <label></label>
        </div>
        <Autocomplete
          multiple
          limitTags={1}
          ChipProps={{ size: 'small' }}
          value={prevFilters}
          onChange={(e, value) => {
            this.onchangeHandler(value);
          }}
          options={defultOptions}
          // disableCloseOnSelect
          getOptionLabel={(option) => option.label}
          renderOption={(option, { selected }) => (
            <React.Fragment>
              {/* <Checkbox
                color="primary"
                size="small"
                style={{ marginRight: 8 }}
                checked={selected}
              /> */}
              {option.label}
            </React.Fragment>
          )}
          renderInput={(params) => (
            <TextField
              placeholder={prevFilters.length ? '' : selectPlaceholderValue}
              {...params}
              InputProps={{
                ...params.InputProps,
                className: clsx(
                  params.InputProps.className,
                  classes.inputWrapper
                ),
                type: 'search',
                disableUnderline: true,
              }}
            />
          )}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  let { commonPoolSelectList } = state.controller.newCandidateJob.toJS();
  return {
    filters: state.controller.searchAudience.get('filters').get('degrees'),
    commonPoolSelectList,
  };
};

export default connect(mapStateToProps)(withStyles(styles)(Degrees));
