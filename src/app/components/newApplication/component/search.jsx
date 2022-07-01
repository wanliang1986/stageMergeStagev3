import React, { Component } from 'react';
import { withStyles } from '@material-ui/core';
import { connect } from 'react-redux';
import clsx from 'clsx';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import {
  dialogCommonSearch,
  dialogSelectID,
  changeSearchFlag,
} from '../../../actions/newCandidate';
import { getJob } from '../../../actions/jobActions';
import Typography from '@material-ui/core/Typography';
import SearchIcon from '@material-ui/icons/Search';
import { showErrorMessage } from '../../../actions';
import {
  getApplicationPageSection,
  getRecruitmentProcessId,
} from '../../../../apn-sdk/newApplication';
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
    '& #controllable-states-demo': {
      paddingLeft: '10px !important',
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
      recruitmentProcessId: null,
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
    // 最多100个字符
    if (newValue && newValue.length > 100) {
      newValue = newValue.substr(0, 100);
    }
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
    //   this.props.dispatch({
    //     type: 'NEW_CANDIDATE_SELECT_OPTION',
    //     payload: [],
    //   });
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
      if (!newValue) {
        this.props.dispatch({
          type: 'NEW_CANDIDATE_SELECT_OPTION',
          payload: [],
        });
      }
    }, 1500);

    this.setState({
      timer: time,
    });
    // if (!flagTwo) {

    // }
  };

  selectID = (e, newValue) => {
    this.setState({
      value: newValue,
      flag: true,
    });
    newValue && newValue.id && this.props.dispatch(dialogSelectID(newValue.id));
    newValue && newValue.id && this.props.dispatch(getJob(newValue.id));
    // newValue && newValue.id && this.props.dispatch(changeSearchFlag(true));
    newValue && newValue.type && this.getPositionData(newValue);
    newValue && newValue.type && this.getRecruitmentId(newValue.type);
  };

  // 获取getRecruitmentProcessId
  getRecruitmentId = (id) => {
    getRecruitmentProcessId(id)
      .then(({ response }) => {
        this.props.dispatch({
          type: 'APPLICATION_RECRUITMENTID_GET',
          payload: response.id,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  getPositionData = (newValue) => {
    getApplicationPageSection('SUBMIT_TO_JOB', newValue.type)
      .then((res) => {
        let arr = this.filterArrItem(res.response);
        // 把提交至job页面配置信息存起来
        this.props.dispatch({
          type: 'APPLICATION_POSITION_SECTION',
          payload: arr,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  filterArrItem = (arr) => {
    let newArr = [];
    arr.map((item) => {
      newArr.push(item.nodePageSection);
    });
    return newArr;
  };

  render() {
    const { classes, options } = this.props;
    const { open, inputValue, value, selectOptions, loading } = this.state;
    options &&
      options.map((item) => {
        if (!item.name) {
          item.name = `#${item.id}-${item.title}-${item.companyName}-${
            item.type
          }${'-' + inputValue}`;
        }
      });
    return (
      <div className={clsx('ag-theme-alpine', classes.root)}>
        <Typography variant={'subtitle2'} gutterBottom>
          {'选择职位'}
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
