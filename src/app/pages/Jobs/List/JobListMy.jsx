import React from 'react';
import memoizeOne from 'memoize-one';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Immutable from 'immutable';

import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
// import FilterIcon from '@material-ui/icons/FilterList';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';

import JobCreateButton from '../Create/CreateButton';
import SearchBox from './search/SearchBox';
import MyJobTable from './jobListTable/myJobTable';

import {
  getGeneral,
  getFavorite,
  resetPage,
} from '../../../actions/newSearchJobs';

import {
  getMyOrAll,
  getCurrentPageModel,
} from '../../../actions/newSearchJobs';

let status = {};

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

class JobListMy extends React.PureComponent {
  constructor(props) {
    super(props);
    this.fTimer = setTimeout(() => {
      this.setState({ show: true });
    }, 850);

    this.state = {
      showFilter: false,
      searchValue: '',
      timer: null,
      result: 0,
      switchs: false,
      isFavorite: false,
      preShowSearchBox: '',
      preIsFavorite: '',
      general: null,
      preGeneral: null,
    };
  }

  componentDidMount() {
    this.props.dispatch(getMyOrAll(true));
  }

  componentWillUnmount() {
    this.props.dispatch(getCurrentPageModel('jobMy'));
  }

  // UNSAFE_componentWillReceiveProps(nextProps) {
  //   const { switchs, showFilter} = this.state
  //   if (nextProps.isFavorite != this.state.switchs) {
  //     this.setState({
  //       switchs: nextProps.isFavorite
  //     })
  //   }
  //   if (nextProps.showSearchBox != showFilter) {
  //     this.setState({
  //       showFilter: nextProps.showSearchBox
  //     })
  //   }
  // }
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

  onKeyDown = (e) => {
    if (e.keyCode === 13) {
      if (/^\s+$/gi.test(e.target.value) === false) {
        this.props.dispatch(resetPage());
        this.props.dispatch(getGeneral(e.target.value));
      }
    }
  };

  handleShow = () => {
    let show = this.state.showFilter;
    this.setState({
      showFilter: !show,
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
    const { classes, t, canDownload, isAdmin, dispatch, count, ...props } =
      this.props;
    const { showFilter, result, switchs, general } = this.state;
    return (
      <div className="flex-child-auto flex-container flex-dir-column">
        <div style={{ height: 56, ...styles.flex }}>
          <div
            className="flex-container align-middle item-padding"
            style={{ height: 56, ...styles.flex }}
          >
            <JobCreateButton t={t} {...props} />
            <Typography variant="subtitle1" className={'item-padding'}>
              {count ? count : result} {t('common:results')}
            </Typography>
            <FormControlLabel
              value="start"
              control={
                <Switch
                  checked={switchs}
                  onChange={this.handleSwitch}
                  color="primary"
                  size="small"
                />
              }
              label={t('tab:Only Favorite Jobs')}
              labelPlacement="start"
              onChange={this.handleSwitch}
            />
          </div>
          <div style={{ ...styles.flex, ...styles.fend }}>
            <OutlinedInput
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
              placeholder={t('tab:Search Jobs')}
              startAdornment={
                <InputAdornment color="disabled" position="start">
                  <SearchIcon style={{ fontSize: 18 }} />
                </InputAdornment>
              }
            />
            <span onClick={this.handleShow} style={{ ...styles.show }}>
              {showFilter
                ? this.props?.t('tab:Hide Filters')
                : this.props?.t('tab:Show Filters')}
            </span>
          </div>
          <Divider />
        </div>
        {showFilter ? <SearchBox option={this.props.options} /> : <></>}
        <div className="flex-child-auto">
          <MyJobTable />
        </div>
      </div>
    );
  }
}

JobListMy.propTypes = {
  t: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  const authorities = state.controller.currentUser.get('authorities');
  const options = state.controller.newSearchOptions.toJS();
  const { count, isFavorite, basicSearch, advancedFilter, general } =
    state.controller.newSearchJobs.toJS();
  const showSearchBox =
    Object.values(basicSearch).some((_item) => !!_item) ||
    Object.values(advancedFilter).length !== 0;
  console.log(count);
  const canDownload =
    !!authorities &&
    (authorities.includes(Immutable.Map({ name: 'ROLE_TENANT_ADMIN' })) ||
      authorities.includes(Immutable.Map({ name: 'PRIVILEGE_REPORT' })));
  const isAdmin =
    !!authorities &&
    authorities.includes(Immutable.Map({ name: 'ROLE_TENANT_ADMIN' }));

  return {
    canDownload,
    isAdmin,
    options,
    count,
    isFavorite,
    showSearchBox,
    general,
  };
};

export default connect(mapStateToProps)(withStyles(styles)(JobListMy));
