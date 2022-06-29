import React, { Component } from 'react';
import { connect } from 'react-redux';
import { deleteFilter, resetFilter } from '../../../../actions/newSearchJobs';
import Immutable, { fromJS, toJS } from 'immutable';

import { makeStyles, withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import Popover from '@material-ui/core/Popover';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import ClearIcon from '@material-ui/icons/Clear';
import Tooltip from '@material-ui/core/Tooltip';

import Search from './search';
import AdvancedDialog from './components/AdvancedDialog';
import SavedDialog from './components/SavedDialog';
import ShowADvanced from './components/ShowAdvanced';

import {
  columns,
  filterSearch,
  requestFilter,
  getAdvincedFilter,
} from '../../../../../utils/search';

const styles = {
  root: {
    borderRadius: '10px',
  },
  left_box: {
    width: '90%',
    '& .list_box': {
      display: 'flex !important',
      alignItems: 'center !important',
      width: '100%',
      flexWrap: 'wrap',
      minHeight: '25px',
      '& span:nth-last-child(1)': {
        borderRight: 'none !important',
      },
    },
    '& .search_filter': {
      padding: '5px 10px',
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'wrap',
      width: '95%',
      lineHeight: '20px',
      '& .every': {
        marginBottom: '8px',
        marginRight: 10,
        maxWidth: '230px',
        '& .MuiChip-deleteIconSmall': {
          color: '#6E6E6E',
        },
      },
      '& .button': {
        display: 'inline-block',
        marginBottom: '5px',
        marginRight: 20,
        color: '#3398dc',
        fontSize: 14,
        cursor: 'pointer',
      },
    },
  },
  search_list: {
    padding: ' 0 10px',
    borderRight: '2px solid #cecece',
    minWidth: '40px',
    maxWidth: '200px',
    height: '20px',
    marginBottom: '7px',
    marginTop: '7px',
    cursor: 'pointer',
    // -o - userSelect: 'none',
    // -khtml - userSelect: 'none',
    // -webkit - userSelect: 'none',
    // -ms - userSelect: 'none',
    userSelect: 'none',
  },
  flex: {
    display: 'flex !important',
    alignItems: 'center !important',
  },
  box_btn: {
    width: '121px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  is_click: {
    color: '#3398dc !important',
  },
  height: {
    padding: '7px 10px',
  },
  card: {
    padding: '7px 10px',
    background: '#FAFAFB',
  },
  search: {
    padding: '10px',
  },
};

class SearchBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isClick: null,
      anchorEl: null,
      open: false,
      params: null,
      type: null,
      searchFilter: props.searchFilter,
      str: props.str,
      filterStr: [],
      arrs: [],

      advanOpen: false,
      savedOpen: false,
    };
  }

  componentWillMount() {
    let { searchStr, searchStrAdvanced, advancedFilter, types } = this.props;
    let arr = [];
    if (types == 'BASE') {
      this.setState({
        arrs: [],
      });
      arr = searchStr.split(',').map((item) => {
        return item.replace(/\./g, '.');
      });
      if (arr.length >= 1) {
        arr.pop();
      }
    } else if (types == 'ADVANCED' && JSON.stringify(advancedFilter) != '{}') {
      let { showStr } = getAdvincedFilter(advancedFilter);
      this.setState({
        arrs: showStr,
      });
    }

    this.setState({
      filterStr: arr,
    });
  }

  // props改变
  componentWillReceiveProps(nextProps) {
    let { searchStr, searchStrAdvanced, advancedFilter, types } = nextProps;
    let arr = [];
    if (types == 'BASE') {
      this.setState({
        arrs: [],
      });
      arr = searchStr.split(',').map((item) => {
        return item.replace(/\./g, '.');
      });
      if (arr.length >= 1) {
        arr.pop();
      }
    } else if (types == 'ADVANCED' && JSON.stringify(advancedFilter) != '{}') {
      let { showStr } = getAdvincedFilter(advancedFilter);
      this.setState({
        arrs: showStr,
      });
    }

    this.setState({
      filterStr: arr,
    });
  }

  // 点击检索项
  handleClick = (item, e, type) => {
    this.setState({
      isClick: item.colName,
      anchorEl: e.currentTarget,
      open: true,
      params: item,
      type,
    });
  };

  // 点击已添加条件
  handleClickFilter = (data, e, type) => {
    let items = columns.filter((item) => {
      return data.indexOf(item.colName) > -1;
    })[0];
    this.setState({
      anchorEl: e.currentTarget,
      open: true,
      params: items,
      type,
    });
  };

  // 关闭
  handleClose = () => {
    this.setState({
      open: false,
      isClick: null,
    });
  };

  // 删除检索条件
  handleDelete = (data, e) => {
    let items = columns.filter((item) => {
      return data.indexOf(item.colName) > -1;
    })[0];
    this.props.dispatch(deleteFilter({ type: items.field }));
  };

  // 清除检索条件
  handleClearAll = () => {
    this.props.dispatch(resetFilter());
  };

  // 清除高级检索条件
  handleClearAllAdvanced = () => {
    this.props.dispatch(resetFilter());
  };
  // 保存检索条件弹框
  handleSaveFilter = (e) => {
    this.setState({
      anchorEl: e.currentTarget,
      open: true,
      params: { type: 'saveFilter' },
      type: 'saveFilter',
    });
  };

  handleAdvanced = () => {
    this.setState({
      advanOpen: true,
    });
  };
  closeAdvanced = () => {
    this.setState({
      advanOpen: false,
    });
  };

  handleSaved = () => {
    this.setState({
      savedOpen: true,
    });
  };

  closeSaved = () => {
    this.setState({
      savedOpen: false,
    });
  };

  render() {
    const {
      isClick,
      open,
      anchorEl,
      params,
      type,
      filterStr,
      advanOpen,
      savedOpen,
      arrs,
    } = this.state;
    const {
      classes,
      jobIds,
      myFavJobIds,
      jobList,
      total,
      query,
      searching,
      t,
      canDownload,
      isAdmin,
      types,
      ...props
    } = this.props;
    return (
      <div style={{ ...styles.search }}>
        <Card variant="outlined" className={classes.card}>
          <div className={classes.flex}>
            <div className={classes.left_box}>
              <div className="list_box">
                {columns.map((item) => (
                  <span
                    key={item.colName}
                    onClick={(e) => this.handleClick(item, e, 'search')}
                    className={`${classes.search_list} ${classes.flex} ${
                      isClick == item.colName ? classes.is_click : ''
                    }`}
                  >
                    {item.colName.toLocaleString()}
                    {isClick == item.colName ? (
                      <ArrowDropUpIcon />
                    ) : (
                      <ArrowDropDownIcon />
                    )}
                  </span>
                ))}
              </div>
              <div className="search_filter">
                {types == 'ADVANCED' &&
                  arrs.map((item, index) => {
                    return (
                      <>
                        <ShowADvanced data={item}></ShowADvanced>
                        {arrs.length > 1 && arrs.length - 1 != index ? (
                          <span>or</span>
                        ) : (
                          <></>
                        )}
                      </>
                    );
                  })}

                {arrs.length != 0 && types == 'ADVANCED' && (
                  <>
                    <span
                      className="button"
                      onClick={() => {
                        this.handleClearAllAdvanced();
                      }}
                    >
                      Clear All
                    </span>
                    <span className="button" onClick={this.handleSaveFilter}>
                      Save Filters
                    </span>
                  </>
                )}

                {types == 'BASE' &&
                  filterStr.map((item, index) => (
                    <Tooltip
                      title={item}
                      key={item + index}
                      placement="top-end"
                    >
                      <Chip
                        color="default"
                        size="small"
                        label={item}
                        onDelete={(e) => this.handleDelete(item, e)}
                        // 是否弹出回显气泡
                        // onClick={(e) => this.handleClickFilter(item, e, 'update')}
                        deleteIcon={<ClearIcon color="disabled" />}
                        className="every"
                      />
                    </Tooltip>
                  ))}

                {filterStr.length > 0 && (
                  <>
                    <span
                      className="button"
                      onClick={() => {
                        this.handleClearAll();
                      }}
                    >
                      Clear All
                    </span>
                    <span className="button" onClick={this.handleSaveFilter}>
                      Save Filters
                    </span>
                  </>
                )}
              </div>
            </div>
            <Popover
              open={open}
              anchorEl={anchorEl}
              onClose={this.handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
            >
              <Search
                handleClose={this.handleClose}
                params={params}
                type={type}
              />
            </Popover>
            <div className={classes.box_btn}>
              <Button
                style={{ width: '100%', height: 28, marginBottom: 5 }}
                variant="outlined"
                color="primary"
                onClick={this.handleAdvanced}
              >
                Advanced Filters
              </Button>
              <Button
                style={{ width: '100%', height: 28 }}
                variant="outlined"
                color="primary"
                onClick={this.handleSaved}
              >
                Saved Filters
              </Button>
            </div>
          </div>
        </Card>
        {advanOpen && (
          <AdvancedDialog close={this.closeAdvanced} show={advanOpen} />
        )}
        <SavedDialog close={this.closeSaved} show={savedOpen} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  let { newSearchJobs } = state.controller;
  let searchFilter = newSearchJobs.toJS();
  let { arr, strShow, strBox } = filterSearch(searchFilter.basicSearch);
  let request = requestFilter(arr);

  return {
    searchFilter: arr,
    searchStr: strShow,
    advancedFilter: searchFilter.advancedFilter,
    request,
    types: searchFilter.searchLevel,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(SearchBox));
