import React, { Component } from 'react';
import { withStyles } from '@material-ui/core';
import { connect } from 'react-redux';
import clsx from 'clsx';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import { showErrorMessage } from '../../../../actions';
import Loading from '../../../../components/particial/Loading';
import {
  dialogCommonSearch,
  dialogSelectID,
  changeSearchFlag,
} from '../../../../actions/newCandidate';
import Typography from '@material-ui/core/Typography';
import SearchIcon from '@material-ui/icons/Search';
const styles = {
  root: {
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
    marginBottom: 30,
    '& .MuiFormControl-fullWidth': {
      height: '100%',
    },
    '& .MuiAutocomplete-inputRoot': {
      padding: '0 0 !important',
    },
    '& .MuiAutocomplete-inputFocused': {
      padding: '0 0 !important',
    },
    '& .MuiAutocomplete-input:first-child': {
      minHeight: '32px',
    },
    '& .MuiOutlinedInput-root': {
      padding: '0px !important',
    },
  },
};

class SearchBox extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      selectOptions: this.props.options,
      timer: null,
      inputValue: '',
      value: '',
      loading: false,
      flag: false,
    };
  }

  componentDidMount() {}

  handleColse = (flag) => {
    this.setState({
      open: flag,
    });
  };

  commonSearch = (event, newValue) => {
    const { flag } = this.state;
    const { talentId } = this.props;
    let flagTwo = flag;
    this.setState({
      inputValue: newValue,
    });
    // if (!newValue) {
    //   this.setState(
    //     {
    //       flag: false,
    //     },
    //     () => {
    //       flagTwo = this.state.flag;
    //     }
    //   );
    //   return;
    // }
    this.setState({
      loading: true,
    });
    clearTimeout(this.state.timer);
    let time = setTimeout(async () => {
      await this.props.dispatch(dialogCommonSearch(newValue, talentId));
      this.setState({
        loading: false,
      });
    }, 1500);

    this.setState({
      timer: time,
    });
    // if (!flagTwo) {

    // }
  };

  selectID = (e, newValue) => {
    console.log(e, newValue);
    this.setState({
      value: newValue,
      flag: true,
    });
    newValue && newValue.id && this.props.dispatch(dialogSelectID(newValue.id));
    newValue && newValue.id && this.props.dispatch(changeSearchFlag(true));
  };

  render() {
    const { classes, options } = this.props;
    const { open, inputValue, value, selectOptions, loading } = this.state;
    options &&
      options.map((item) => {
        if (!item.name) {
          item.name = `#${item.id}-${inputValue}-${item.title}-${item.companyName}-${item.AMName}`;
        }
      });
    return (
      <div className={clsx('ag-theme-alpine', classes.root)}>
        <Typography variant={'subtitle2'} gutterBottom>
          {'Select a job to apply'}
        </Typography>
        <Autocomplete
          style={{ width: '100%', height: 32 }}
          value={value}
          onChange={(e, newValue) => {
            this.selectID(e, newValue);
          }}
          inputValue={inputValue}
          onInputChange={(event, newInputValue) => {
            this.commonSearch(event, newInputValue);
          }}
          id="controllable-states-demo"
          getOptionSelected={(option, value) => true}
          getOptionLabel={(option) => {
            return option.name || '';
          }}
          options={options}
          renderInput={(params) => (
            <TextField
              {...params}
              label=""
              variant="outlined"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <React.Fragment>
                    {loading ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : (
                      <SearchIcon />
                    )}
                  </React.Fragment>
                ),
              }}
            />
          )}
        />
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    options: state.controller.newCandidateJob.toJS().dialogSelectOption,
  };
};

export default connect(mapStateToProps)(withStyles(styles)(SearchBox));
