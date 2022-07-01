import React, { useState, useEffect, useMemo } from 'react';
import lodash from 'lodash';

import {
  getNewSearch,
  deleteFilter,
  getSearchData,
  resetPage,
} from '../../../../actions/newSearchJobs';
import { connect, useSelector, useDispatch } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import {
  SelectInput,
  SelectBox,
  SelectsInput,
  DoubleSelect,
  TimePick,
  CompanySelect,
  RequiredSkill,
  RateSalary,
} from './components/SearchSelect';
import {
  DoubleInputNumber,
  BillInput,
  YearInput,
  CustomerInput,
  InputBox,
  InputNumber,
  SaveFilter,
} from './components/SearchInput';
import JobTree from './components/JobTree';
import NewJobTree from './components/NewJobTree';

import {
  jobStatus,
  jobType as newJobType,
} from '../../../../constants/formOptions';
import {
  filterSearch,
  requestFilter,
  isRequired,
  getAdvincedFilter,
} from '../../../../../utils/search';
import { saveFilter, jobSearch } from '../../../../../apn-sdk/newSearch';
import { showErrorMessage } from '../../../../actions';

const style = {
  box: {
    width: '360px',
    minHeight: '114px',
    borderRadius: '5px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    position: 'relative',
    flexShrink: 0,
    paddingBottom: 0,
  },
  select: {},
  fixed: {
    display: 'flex',
    justifyContent: 'space-between',
    minHeight: '30px',
    width: '348px',
    zIndex: 100,
    flexShrink: 0,
    marginBottom: 40,
  },
  position: {
    position: 'fixed',
    display: 'flex',
    justifyContent: 'space-between',
    minHeight: '30px',
    width: '320px',
    zIndex: 100,
    flexShrink: 0,
    marginBottom: 40,
  },
  button: {
    zIndex: 1,
    bottom: 15,
    flexShrink: 0,
    paddingLeft: 50,
    paddingRight: 50,
    width: 87,
    height: 32,
  },
  tree: {
    width: '348px',
    '& .MuiPaper-root': {
      top: 318,
    },
  },
};
const jobStatusOptions = jobStatus.filter((status) => !status.disabled);
// search 搜索组件
const Search = ({
  params,
  type,
  handleClose,
  classes,
  searchStr,
  requestData,
  searchLevel,
  showStr,
  language,
}) => {
  const { newSearchJobs, newSearchOptions } = useSelector(
    (state) => state.controller
  );
  const searchValue = newSearchJobs.toJS()['basicSearch'];
  const advancedFilter = newSearchJobs.toJS()['advancedFilter'];
  const allOrMy = newSearchJobs.toJS()['allOrMy'];
  const optionsRedux = newSearchOptions.toJS();
  const dispatch = useDispatch();

  const [reduxData, setReduxData] = useState(optionsRedux);
  const [data, setData] = useState({ ...params, value: '' });
  const [value, setValue] = useState('');
  const [text, setText] = useState();
  const [errorMessage, setErrorMessage] = useState();
  const [show, setShow] = useState(true);

  // test
  const [option, setOption] = useState([]);

  // 初次渲染
  // show 为true则搜索单项回显
  useEffect(() => {
    if (type == 'search') {
      setText('Search');
      setShow(true);
    } else if (type == 'update') {
      setShow(false);
      setText('Update Filter');
    } else if (type == 'saveFilter') {
      setText('Save');
    }

    if (data.colName == 'Company') {
      setOption(optionsRedux.companyOptions);
    } else if (
      data.colName == 'Required Languages' ||
      data.colName == 'Preferred Languages'
    ) {
      setOption(optionsRedux.languagesOptions);
    } else if (data.colName == 'Degree Requirement') {
      setOption(optionsRedux.degreeOptions);
    } else if (data.colName == 'Status') {
      setOption(jobStatusOptions);
    } else if (data.colName == 'Job Types') {
      let arr = [];
      if (!allOrMy) {
        arr = newJobType.filter((_item) => _item.value != 'PAY_ROLL');
      } else {
        arr = newJobType;
      }
      setOption(arr);
    } else if (data.colName == 'Assigned User') {
      setOption(optionsRedux.allUserOptions);
    } else if (data.colName == 'Job Function') {
      let arr = [];
      optionsRedux.functionOptions.forEach((item) => {
        if (item.children) {
          let arrs = [];
          item.children.forEach((items, index) => {
            if (items.label.indexOf('-Others') != -1) {
              item.children.splice(index, 1);
            } else {
              arrs.push(items);
            }
            if (items.children) {
              items.children.forEach((val, index) => {
                if (val.label.indexOf('-Others') != -1) {
                  items.children.splice(index, 1);
                } else {
                  // arrs.push(val);
                }
              });
            }
          });
          item.children = arrs;
          arr.push(item);
        } else {
          arr.push(item);
        }
      });
      setOption(optionsRedux.functionOptions);
      if (searchValue['jobFunctions']) {
        setValue(searchValue['jobFunctions']);
      }
    }
  }, [reduxData]);

  const handleChange = (value) => {
    setValue(value);
  };

  const handleChangeTree = (value, valueOption) => {
    setValue({
      value,
      option: valueOption,
    });
  };

  // 保存修改检索条件
  const handleSearch = () => {
    let { isRequire, msg } = isRequired(data, value);
    if (isRequire) {
      setErrorMessage(msg);
      return;
    }
    if (type == 'saveFilter') {
      let obj = {};
      let strName = value.substring(0, 38);
      if (searchLevel == 'BASE') {
        obj = {
          searchContent: JSON.stringify(searchStr),
          searchName: JSON.stringify(strName),
          searchGroup: JSON.stringify(searchValue),
          searchType: 'BASE',
        };
      } else if (searchLevel == 'ADVANCED') {
        obj = {
          searchContent: JSON.stringify(showStr),
          searchName: JSON.stringify(strName),
          searchGroup: JSON.stringify(advancedFilter),
          searchType: 'ADVANCED',
        };
      }
      saveFilter(obj)
        .then((res) => {})
        .catch((err) => {
          dispatch(showErrorMessage(err));
        });
      console.log('----------------保存检索条件接口调用', value, requestData);
    } else {
      data.value = value;
      if (
        data['colName'] == 'Posting Date' &&
        data['value'].from === null &&
        data['value'].to === null
      ) {
        dispatch(getNewSearch({ type: data.field, value: null }));
        dispatch(getSearchData());
        handleClose();
        return;
      }
      if (
        data['colName'] == 'Job Function' &&
        JSON.stringify(data['value']['value']) == '[]'
      ) {
        dispatch(getNewSearch({ type: data.field, value: null }));
        dispatch(getSearchData());
        handleClose();
        return;
      }
      if (
        data['colName'] == 'Status' &&
        JSON.stringify(data['value']) == '[]'
      ) {
        dispatch(getNewSearch({ type: data.field, value: null }));
        dispatch(getSearchData());
        handleClose();
        return;
      }

      if (
        data['colName'] == 'Job Types' &&
        JSON.stringify(data['value']) == '[]'
      ) {
        dispatch(getNewSearch({ type: data.field, value: null }));
        dispatch(getSearchData());
        handleClose();
        return;
      }

      if (
        data['colName'] == 'Location' &&
        JSON.stringify(data['value']) == '[]'
      ) {
        dispatch(getNewSearch({ type: data.field, value: null }));
        dispatch(getSearchData());
        handleClose();
        return;
      }

      if (
        data['colName'] == 'Degree Requirement' &&
        JSON.stringify(data['value']) == '[]'
      ) {
        dispatch(getNewSearch({ type: data.field, value: null }));
        dispatch(getSearchData());
        handleClose();
        return;
      }

      if (
        data['colName'] == 'Required Skills' &&
        JSON.stringify(data['value'][1]) == '[]'
      ) {
        dispatch(getNewSearch({ type: data.field, value: null }));
        dispatch(getSearchData());
        handleClose();
        return;
      }

      dispatch(getNewSearch({ type: data.field, value }));

      // job type , rate/salary conflicts
      if (data.field == 'type') {
        dispatch(deleteFilter({ type: 'Rate/Salary' }));
        handleClose();
        return;
      } else if (data.field == 'Rate/Salary') {
        dispatch(deleteFilter({ type: 'type' }));
        handleClose();
        return;
      }
      setData({ ...data });
      // request
      dispatch(resetPage());
      dispatch(getSearchData());
    }
    handleClose();
  };

  // 检索类型判断
  const checkType = useMemo(() => {
    let type = data.type;
    if (type == 'input') {
      return (
        <InputBox
          show={show}
          data={data}
          value={value}
          key={data}
          handleSave={handleChange}
        />
      );
    } else if (type == 'number') {
      return (
        <InputNumber
          show={show}
          data={data}
          value={value}
          handleSave={handleChange}
        />
      );
    } else if (type == 'select') {
      return (
        <div className={classes.position}>
          <SelectInput
            options={option}
            data={data}
            value={value}
            handleSave={handleChange}
            show={show}
          />
        </div>
      );
    } else if (type == 'company') {
      return (
        <div className={classes.position}>
          <CompanySelect
            options={option}
            data={data}
            value={value}
            handleSave={handleChange}
            show={show}
          />
        </div>
      );
    } else if (type == 'time') {
      return (
        <TimePick
          value={value}
          show={show}
          data={data}
          handleSave={handleChange}
        />
      );
    } else if (type == 'selects' || type == 'selects1' || type == 'selects2') {
      return (
        <SelectBox
          options={option}
          value={value}
          data={data}
          show={show}
          handleSave={handleChange}
        />
      );
    } else if (type == 'doubleSelect') {
      return (
        <DoubleSelect
          options={option}
          value={value}
          data={data}
          msg={errorMessage}
          show={show}
          handleSave={handleChange}
        />
      );
    } else if (type == 'dbNumber') {
      return (
        <DoubleInputNumber
          data={data}
          value={value}
          show={show}
          handleSave={handleChange}
          msg={errorMessage}
        />
      );
    } else if (type == 'rate') {
      return <BillInput value={value} data={data} handleSave={handleChange} />;
    } else if (type == 'year') {
      return (
        <YearInput
          options={option}
          data={data}
          value={value}
          show={show}
          handleSave={handleChange}
        />
      );
    } else if (type == 'skillSelect') {
      return (
        <SelectsInput
          show={show}
          options={option}
          data={data}
          handleSave={handleChange}
          language={language}
        />
      );
    } else if (type == 'skill') {
      return (
        <RequiredSkill
          show={show}
          options={option}
          data={data}
          handleSave={handleChange}
        />
      );
    } else if (type == 'tree') {
      return (
        <div className={classes.position}>
          <NewJobTree
            labelShow={true}
            show={show}
            sendServiceType={(checkedList, valueOption) => {
              handleChangeTree(checkedList, valueOption);
            }}
            selected={value.value}
            value={value}
            jobData={option}
            type={type}
          />
        </div>
      );
    } else if (type == 'inputs') {
      return (
        <CustomerInput
          options={option}
          data={data}
          show={show}
          value={value}
          handleSave={handleChange}
        />
      );
    } else if (type == 'saveFilter') {
      return (
        <SaveFilter
          value={value}
          filterStr={searchStr || showStr}
          handleSave={handleChange}
        />
      );
    } else if (type == 'rateSalary') {
      return (
        <RateSalary
          data={data}
          msg={errorMessage}
          handleSave={handleChange}
          show={show}
        ></RateSalary>
      );
    }
  }, [type, option, errorMessage]);
  return (
    <React.Fragment>
      <div className={classes.box}>
        <div className={classes.fixed}>{checkType}</div>
        <Button
          className={classes.button}
          onClick={handleSearch}
          variant="contained"
          color="primary"
        >
          {text}
        </Button>
      </div>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  let { newSearchJobs } = state.controller;
  let { basicSearch, searchLevel, advancedFilter, allOrMy } =
    newSearchJobs.toJS();
  let { arr, strShow } = filterSearch(basicSearch);
  let { showStr } = getAdvincedFilter(advancedFilter);
  let requestData = requestFilter(arr);
  return {
    clientList: state,
    searchStr: strShow,
    requestData,
    showStr,
    searchLevel,
    allOrMy,
    language: state.controller.language,
  };
};

export default connect(mapStateToProps)(withStyles(style)(Search));
