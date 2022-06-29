import React from 'react';
import memoizeOne from 'memoize-one';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import {
  getMyOrAll,
  getGeneral,
  resetPage,
  getFavorite,
  getCurrentPageModel,
  resetSearch,
} from '../../../actions/newSearchJobs';

import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputAdornment from '@material-ui/core/InputAdornment';

import SearchIcon from '@material-ui/icons/Search';

import JobCreateButton from '../Create/CreateButton';
import SearchBox from './search/SearchBox';
import AllJobTable from './jobListTable/allJobTable';

const styles = {
  container: {
    overflow: 'hidden',
    position: 'relative',
  },
  mask: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    backgroundColor: 'rgba(240,240,240,.5)',
  },
  flex: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
  },
  btn: {
    justifyContent: 'space-between',
  },
  fend: {
    justifyContent: 'flex-end',
  },
  show: {
    color: '#3398dc',
    marginLeft: 10,
    display: 'inline-block',
    width: '94px',
    textAlign: 'center',
    cursor: 'pointer',
  },
  search: {
    width: '100%',
    padding: '0 10px',
    boxSizing: 'border-box',
    minHeight: '100px',
  },
};

class JobListAll extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      showFilter: false,
      timer: null,
      result: 0,
      switchs: '',
      isFavorite: false,
      preShowSearchBox: '',
      preIsFavorite: '',
      general: null,
      preGeneral: null,
    };
  }

  componentDidMount() {
    const { pageModel } = this.props;
    this.props.dispatch(getMyOrAll(false));
    if (pageModel !== 'jobAll') {
      this.props.dispatch(resetSearch());
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (props.isFavorite !== state.preIsFavorite) {
      return {
        switchs: props.isFavorite,
        preIsFavorite: props.isFavorite,
      };
    }

    if (props.showSearchBox !== state.preShowSearchBox) {
      return {
        showFilter: props.showSearchBox,
        preShowSearchBox: props.showSearchBox,
      };
    }
    if (props.general !== state.preGeneral) {
      return {
        general: props.general,
        preGeneral: props.general,
      };
    }
    return null;
  }

  componentWillUnmount() {
    this.props.dispatch(getCurrentPageModel('jobAll'));
  }

  // handleChange = (e) => {
  //   clearTimeout(this.state.timer);
  //   let time = setTimeout(() => {
  //     this.props.dispatch(resetPage());
  //     this.props.dispatch(getGeneral(e.target.value));
  //   }, 1500);
  //   this.setState({
  //     timer: time,
  //   });
  // };

  onKeyDown = (e) => {
    if (e.keyCode === 13) {
      if (/^\s+$/gi.test(e.target.value) === false) {
        this.props.dispatch(resetPage());
        this.props.dispatch(getGeneral(e.target.value));
      }
    }
  };

  handleShow = () => {
    this.setState({
      showFilter: !this.state.showFilter,
    });
  };

  handleSwitch = (e) => {
    console.log(e.target.checked);
    this.setState({
      switchs: e.target.checked,
    });
    this.props.dispatch(getFavorite(e.target.checked));
  };

  render() {
    console.time('all jobs');
    const { classes, t, clientList, dispatch, count, ...props } = this.props;
    const { showFilter, result, switchs, general } = this.state;

    return (
      <div className="flex-child-auto flex-container flex-dir-column">
        <div style={{ flexShrink: 0 }} className="flex-container align-middle">
          <div
            className="flex-container align-middle item-padding"
            style={{ height: 56 }}
          >
            <JobCreateButton t={t} {...props} />
            <Typography variant="subtitle1" className={'item-padding'}>
              {count ? count : result} {t('common:results')}
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={switchs}
                  onChange={this.handleSwitch}
                  color="primary"
                  size="small"
                />
              }
              label="Only Favorite Jobs"
              labelPlacement="start"
            />
          </div>
          <div className="flex-child-auto flex-container align-middle align-right">
            <OutlinedInput
              // onChange={this.handleChange}
              onKeyDown={this.onKeyDown}
              style={{ height: 30, width: 219, background: '#edf5ff' }}
              size="small"
              variant="outlined"
              value={general}
              onChange={(e) => {
                this.setState({
                  general: e.target.value,
                });
              }}
              placeholder="Search Jobs"
              startAdornment={
                <InputAdornment color="disabled" position="start">
                  <SearchIcon style={{ fontSize: 18 }} />
                </InputAdornment>
              }
            />
            <span onClick={this.handleShow} style={{ ...styles.show }}>
              {showFilter ? 'Hide Filters' : 'Show Filters'}
            </span>
          </div>
        </div>
        {showFilter ? <SearchBox option={this.props.options} /> : <></>}
        <div className="flex-child-auto">
          <AllJobTable />
        </div>
      </div>
    );
  }
}

JobListAll.propTypes = {
  t: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  const options = state.controller.newSearchOptions.toJS();
  const { count, isFavorite, basicSearch, advancedFilter, general, pageModel } =
    state.controller.newSearchJobs.toJS();
  const showSearchBox =
    Object.values(basicSearch).some((_item) => !!_item) ||
    Object.values(advancedFilter).length !== 0;

  // console.log(showSearchBox);
  return {
    options,
    count,
    isFavorite,
    showSearchBox,
    general,
    pageModel,
  };
};

export default connect(mapStateToProps)(withStyles(styles)(JobListAll));
