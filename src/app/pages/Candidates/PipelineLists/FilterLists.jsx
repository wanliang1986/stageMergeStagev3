import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import FormInput from '../../../components/particial/FormInput';
import FormReactSelectContainer from '../../../components/particial/FormReactSelectContainer';
import Select from 'react-select';
import clsx from 'clsx';
import { applicationStatus3 } from '../../../constants/formOptions';
import lodash, { reject } from 'lodash';
import { connect } from 'react-redux';
import Chip from '@material-ui/core/Chip';
import * as ActionTypes from '../../../constants/actionTypes';
import { getActiveTenantUserList } from '../../../selectors/userSelector';

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 850,
    '& span:nth-last-child(1)': {
      border: 'none !important',
    },
  },
  typography: {
    padding: theme.spacing(2),
  },
  filterOption: {
    minWidth: 200,
    padding: 10,
    position: 'fixed',
    zIndex: 100,
    backgroundColor: 'white',
    boxShadow: '1px 1px 1px 1px #cdcdcd',
  },
  line: {
    width: '1px',
    height: '13px',
    display: 'inline-table',
    verticalAlign: 'middle',
    border: 'solid 1px #cecece',
  },
  popover: {
    minWidth: '0px !important',
    minHeight: '0px !important',
  },
  filterChips: {
    width: '100%',
    padding: '10px',
  },
}));

const PositionedPopper = (props) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [placement, setPlacement] = React.useState();
  const [clickFilter, setClickFilter] = React.useState(null);
  const [inputValue, setInputValue] = React.useState({});
  const [filters, setFilters] = React.useState(props.filters);
  const [Hr, setHr] = React.useState(null);
  const [Hm, setHm] = React.useState(null);
  const [status, setStatus] = React.useState(null);
  const [Recruiter, setRecruiter] = React.useState(null);
  const classes = useStyles();

  useEffect(() => {
    // let obj = lodash.cloneDeep(props.mainFilters)
    // obj.pageNum =1
    // props.dispatch({
    //   type: ActionTypes.RECEIVE_PIPELINE_MAIN_FILTER,
    //   filters: obj,
    // })
    props.setNewPageNum();
    // props.fetchData();
  }, [filters]);

  const handleClick = (newPlacement) => (event) => {
    setAnchorEl(event.currentTarget);
    setOpen((prev) => placement !== newPlacement.title || !prev);
    setPlacement(newPlacement.title);
    setClickFilter(newPlacement);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpen(false);
    setPlacement(null);
    setInputValue({});
  };

  const getInputValue = (e, key) => {
    let value = e.target.value.replace(/\ +/g, '');
    let _inputValue = lodash.cloneDeep(inputValue);
    if (value !== '') {
      _inputValue[key] = e.target.value;
      setInputValue(_inputValue);
    } else {
      _inputValue[key] = null;
      setInputValue(_inputValue);
    }
  };
  const Search = () => {
    let _filters = lodash.cloneDeep(filters);
    let key = Object.keys(inputValue)[0];
    let _keys = Object.keys(_filters);
    let index = _keys.indexOf(key);
    if (index !== -1) {
      _filters[key] = inputValue[key];
      props.dispatch({
        type: ActionTypes.RECEIVE_FILTERS,
        filters: _filters,
      });
      setFilters(_filters);
    } else {
      let obj = { ...inputValue, ..._filters };
      props.dispatch({
        type: ActionTypes.RECEIVE_FILTERS,
        filters: obj,
      });
      setFilters(obj);
    }
    handleClose();
  };

  const RecruiterSelected = (item, key) => {
    let _inputValue = lodash.cloneDeep(inputValue);
    _inputValue[key] = item.value;
    setRecruiter(item.value);
    setInputValue(_inputValue);
  };

  const HrSelected = (item, key) => {
    let _inputValue = lodash.cloneDeep(inputValue);
    _inputValue[key] = item.value;
    setHr(item.value);
    setInputValue(_inputValue);
  };

  const HmSelected = (item, key) => {
    let _inputValue = lodash.cloneDeep(inputValue);
    _inputValue[key] = item.value;
    setHm(item.value);
    setInputValue(_inputValue);
  };

  const statusSelected = (status, key) => {
    let _inputValue = lodash.cloneDeep(inputValue);
    _inputValue[key] = status;
    setStatus(status);
    setInputValue(_inputValue);
  };

  const handleDelete = (item) => {
    let _filters = lodash.cloneDeep(filters);
    let type = item.type;
    delete _filters[type];
    props.dispatch({
      type: ActionTypes.RECEIVE_FILTERS,
      filters: _filters,
    });
    setFilters(_filters);
    if (type === 'recruiterName') {
      setRecruiter(null);
    } else if (type === 'hrName') {
      setHr(null);
    } else if (type === 'hmName') {
      setHm(null);
    } else if (type === 'status') {
      setStatus(null);
    }
  };

  const clearAllFilters = () => {
    props.dispatch({
      type: ActionTypes.CLEAR_FILTERS,
    });
    setFilters({});
    setHr(null);
    setHm(null);
    setRecruiter(null);
    setStatus(null);
  };

  const getId = (type) => {
    let select = props.selectFilterList.find((item, index) => {
      if (item.type === type) {
        return item;
      }
    });
    if (select) {
      return select.value;
    }
  };

  const getValue = (type) => {
    let id = getId(type);
    let user = props.userList.find((item, index) => {
      if (item.get('id') === id) {
        return item;
      }
    });
    if (user) {
      return user.get('fullName');
    }
  };

  const getStatusValue = (val) => {
    let status = applicationStatus3.find((item, index) => {
      if (item.value === val) {
        return item;
      }
    });
    return status.label;
  };

  const getLabel = (item) => {
    switch (item.type) {
      case 'hrName':
        if (props.selectFilterList) {
          return 'HR Coordinate: ' + item.value;
        }
      case 'hmName':
        if (props.selectFilterList) {
          return 'Hiring Manager: ' + item.value;
        }
      case 'recruiterName':
        if (props.selectFilterList) {
          return 'Recruiter: ' + item.value;
        }
      case 'status':
        let value = getStatusValue(item.value);
        return item.title + ':' + value;
      default:
        return item.title + ':' + item.value;
    }
  };

  const filterTemplate = (item) => {
    const { selectFilterList, hrList, hmList, recruiterList } = props;
    if (item) {
      switch (item.title) {
        case 'Name':
        case 'Job Title':
        case 'Company':
        case 'Location':
        case 'Email':
        case 'Skills':
        case 'Job ID':
          return (
            <div className={classes.filterOption}>
              <Typography variant="subtitle2">{item.title}</Typography>
              <FormInput
                name={item.title}
                defaultValue={filters[item.key]}
                isRequired={false}
                onChange={(e) => {
                  getInputValue(e, item.key);
                }}
              />
              <div style={{ marginTop: '10px' }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    Search();
                  }}
                >
                  Search
                </Button>
              </div>
            </div>
          );
        case 'Status':
          return (
            <div className={classes.filterOption}>
              <Typography variant="subtitle2">{item.title}</Typography>
              <Select
                simpleValue
                labelKey={'label'}
                valueKey={'value'}
                value={
                  selectFilterList[item.key]
                    ? selectFilterList[item.key]
                    : status
                }
                options={applicationStatus3}
                onChange={(status) => {
                  statusSelected(status, item.key);
                }}
                searchable
                clearable={false}
                autoBlur={true}
              />
              <div style={{ marginTop: '10px' }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    Search();
                  }}
                >
                  Search
                </Button>
              </div>
            </div>
          );
        case 'Recruiter':
          return (
            <div className={classes.filterOption}>
              <Typography variant="subtitle2">{item.title}</Typography>
              <Select
                labelKey={'value'}
                valueKey={'label'}
                value={
                  selectFilterList[item.key] ? getValue(item.key) : Recruiter
                }
                onChange={(user) => {
                  RecruiterSelected(user, item.key);
                }}
                options={recruiterList}
                searchable
                clearable={false}
                autoBlur={true}
              />
              <div style={{ marginTop: '10px' }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    Search();
                  }}
                >
                  Search
                </Button>
              </div>
            </div>
          );
        case 'HR Coordinate':
          return (
            <div className={classes.filterOption}>
              <Typography variant="subtitle2">{item.title}</Typography>
              <Select
                labelKey={'value'}
                valueKey={'label'}
                value={selectFilterList[item.key] ? getValue(item.key) : Hr}
                onChange={(user) => {
                  HrSelected(user, item.key);
                }}
                options={hrList}
                searchable
                clearable={false}
                autoBlur={true}
              />
              <div style={{ marginTop: '10px' }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    Search();
                  }}
                >
                  Search
                </Button>
              </div>
            </div>
          );
        case 'Hiring Manager':
          return (
            <div className={classes.filterOption}>
              <Typography variant="subtitle2">{item.title}</Typography>
              <Select
                labelKey={'value'}
                valueKey={'label'}
                value={selectFilterList[item.key] ? getValue(item.key) : Hm}
                onChange={(user) => {
                  HmSelected(user, item.key);
                }}
                options={hmList}
                searchable
                clearable={false}
                autoBlur={true}
              />
              <div style={{ marginTop: '10px' }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    Search();
                  }}
                >
                  Search
                </Button>
              </div>
            </div>
          );
      }
    }
  };

  return (
    <div className={classes.root}>
      <Popover
        classes={{ paper: classes.popover }}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        {filterTemplate(clickFilter)}
      </Popover>
      <Grid container justify="flex-start">
        <Grid item>
          {props.filterList.map((item, index) => {
            return (
              <React.Fragment key={index}>
                <Button
                  onClick={handleClick(item)}
                  endIcon={
                    open && placement === item.title ? (
                      <ArrowDropUpIcon />
                    ) : (
                      <ArrowDropDownIcon />
                    )
                  }
                >
                  {item.title}
                </Button>
                <span className={classes.line}></span>
              </React.Fragment>
            );
          })}
        </Grid>
      </Grid>
      {props.selectFilterList.length > 0 && (
        <div className={classes.filterChips}>
          {props.selectFilterList.map((item, index) => {
            return (
              <Chip
                style={{ marginRight: '5px' }}
                key={index}
                size="small"
                color="default"
                label={getLabel(item)}
                onDelete={() => {
                  handleDelete(item);
                }}
              />
            );
          })}
          <Button
            color="primary"
            onClick={() => {
              clearAllFilters();
            }}
          >
            Clear All
          </Button>
        </div>
      )}
    </div>
  );
};

const getFiltersList = (filters, filterList) => {
  let arr = [];
  for (let i in filters) {
    let o = { type: null, value: null };
    o.type = i;
    o.value = filters[i];
    filterList.forEach((item, index) => {
      if (item.key === i) {
        o.title = item.title;
      }
    });
    if (o.value) {
      arr.push(o);
    }
  }
  return arr;
};

const mapStoreStateToProps = (state, { filterList }) => {
  let selectFilterList = getFiltersList(
    state.controller.myPipelineFilter,
    filterList
  );
  let filters = state.controller.myPipelineFilter;
  let mainFilters = state.controller.pipelineMainFilter;
  return {
    selectFilterList: selectFilterList,
    userList: getActiveTenantUserList(state),
    mainFilters: mainFilters,
    filters: filters,
  };
};

export default connect(mapStoreStateToProps)(PositionedPopper);
