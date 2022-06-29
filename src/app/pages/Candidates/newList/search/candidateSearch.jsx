import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  getNewSearch,
  //   deleteFilter,
  getSearchData,
  resetPage,
} from '../../../../actions/newCandidate';
import { connect, useSelector, useDispatch } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';

import {
  SelectsInput,
  CurrentSalary,
  CompanySelect,
  RequiredSkill,
  TimePick,
  SelectMore,
  SelectMore2,
  SelectMore3,
} from './components/candidateSearchSelect';
import {
  Inputdiys,
  Inputdiy,
  InputCurrent,
  DoubleInputNumber,
  InputBox,
  InputSchool,
  InputMajor,
  InputLocations,
  SaveFilter,
} from './components/candidateSearchInput';
// import JobTree from './components/JobTree';
import CandidateTree from './components/candidateTreeSelect';
import CandidateJobFunction from './components/candidateJobFunction';
import CandidateWorkAuth from './components/candidateWorkAuth';

import {
  candidateFilterSearch,
  requestFilter,
  isRequired2,
  candidateGetAdvincedFilter,
  getAdvincedFilter,
} from '../../../../../utils/search';
import { saveFilterCandidate } from '../../../../../apn-sdk/newCandidate';

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

// search 搜索组件
const CandidateSearch = ({
  params,
  type,
  handleClose,
  // 上面的是父组件传送的
  classes,
  searchStr,
  requestData,
  searchLevel,
  showStr,
  jobId,
  language,
}) => {
  const { newCandidateJob, candidateSelect } = useSelector(
    (state) => state.controller
  );
  const searchValue = newCandidateJob.toJS()['basicSearch'];
  const advancedFilter = newCandidateJob.toJS()['advancedFilter'];
  const optionsRedux = candidateSelect.toJS();

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
  // show为true则搜索单项回显
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

    // 给option设置下拉数据
    if (data.colName == 'Industries') {
      let arr = [];
      optionsRedux.industryList.forEach((item) => {
        if (item.children) {
          let arrs = [];
          item.children.forEach((items, index) => {
            if (items.label.indexOf('-Others') != -1) {
              item.children.splice(index, 1);
            } else {
              arrs.push(items);
            }
          });
          item.children = arrs;
          arr.push(item);
        } else {
          arr.push(item);
        }
      });
      setOption(optionsRedux.industryList);
      if (searchValue['industries']) {
        setValue(searchValue['industries']);
      }
    } else if (data.colName == 'Job Function') {
      let arr = [];
      optionsRedux.jobFounctionList.forEach((item) => {
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
      setOption(optionsRedux.jobFounctionList);
      if (searchValue['jobFunctions']) {
        setValue(searchValue['jobFunctions']);
      }
    } else if (data.colName == 'Work Authorization') {
      let arr = [];
      optionsRedux.workAuthList.forEach((item) => {
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
      setOption(optionsRedux.workAuthList);

      if (searchValue['workAuthorization']) {
        setValue(searchValue['workAuthorization']);
      }
    } else if (data.colName == 'Languages') {
      setOption(optionsRedux.languageList);
    } else if (data.colName == 'Current Company') {
      setOption(optionsRedux.companyOptions);
    } else if (data.colName == 'Degrees') {
      setOption(optionsRedux.degreeList);
    } else if (
      data.colName == 'Create by' ||
      data.colName == 'DM' ||
      data.colName == 'AM' ||
      data.colName == 'Recruiter' ||
      data.colName == 'Owner'
    ) {
      // let res = []
      // optionsRedux.allUserOptions.map((item) => {
      //   res.push(Object.assign({}, item, { checked: false }))
      // })
      // console.log(res)
      setOption(optionsRedux.allUserOptions);
    }
  }, [reduxData]);

  const handleChange = (value) => {
    console.log(value);
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
    let { isRequire, msg } = isRequired2(data, value);
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
      saveFilterCandidate(obj)
        .then((res) => {})
        .catch((err) => {
          dispatch(showErrorMessage(err));
        });
      console.log('----------------保存检索条件接口调用', value, requestData);
    } else {
      // if (jobId) {}
      data.value = value;
      // value为空直接search
      if (data.value == '') {
        dispatch(getNewSearch({ type: data.field, value: null }));
        dispatch(getSearchData(jobId));
        handleClose();
        return;
      }
      if (
        data['colName'] == 'Date of Creation' &&
        data['value'].from === null &&
        data['value'].to === null
      ) {
        dispatch(getNewSearch({ type: data.field, value: null }));
        dispatch(getSearchData(jobId));
        handleClose();
        return;
      }

      if (
        data['colName'] == 'Job Function' &&
        JSON.stringify(data['value']['value']) == '[]'
      ) {
        dispatch(getNewSearch({ type: data.field, value: null }));
        dispatch(getSearchData(jobId));
        handleClose();
        return;
      }

      if (
        data['colName'] == 'Industries' &&
        JSON.stringify(data['value']['value']) == '[]'
      ) {
        dispatch(getNewSearch({ type: data.field, value: null }));
        dispatch(getSearchData(jobId));
        handleClose();
        return;
      }

      if (
        data['colName'] == 'Work Authorization' &&
        JSON.stringify(data['value']['value']) == '[]'
      ) {
        dispatch(getNewSearch({ type: data.field, value: null }));
        dispatch(getSearchData(jobId));
        handleClose();
        return;
      }
      dispatch(getNewSearch({ type: data.field, value }));
      // 这里把搜集到的条件调用同步函数 保存在reducers里面
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
      dispatch(getSearchData(jobId));
    }
    handleClose();
  };

  // 检索类型判断
  const checkType = useMemo(() => {
    let type = data.type;
    console.log(type);
    if (type == 'name' || type == 'input') {
      return (
        <Inputdiys
          msg={errorMessage}
          key={data}
          show={show}
          data={data}
          value={value}
          handleSave={handleChange}
        />
      );
    }
    //  else if
    //   (type == 'input') {
    //   return (
    //     <Inputdiy
    //       msg={errorMessage}
    //       key={data}
    //       show={show}
    //       data={data}
    //       value={value}
    //       handleSave={handleChange}
    //     />
    //   );
    // }
    else if (type == 'treeSelect') {
      return (
        <div className={classes.position}>
          <CandidateTree
            labelShow={true}
            show={show}
            sendServiceType={(checkedList, valueOption) => {
              handleChangeTree(checkedList, valueOption);
            }}
            selected={value.value}
            value={value}
            candiDate={option}
            datetype={data.colName}
          />
        </div>
      );
    } else if (type == 'jobFunctionTree') {
      return (
        <div className={classes.position}>
          <CandidateWorkAuth
            labelShow={true}
            show={show}
            sendServiceType={(checkedList, valueOption) => {
              handleChangeTree(checkedList, valueOption);
            }}
            selected={value.value}
            value={value}
            candiDate={option}
            type={type}
          />
        </div>
      );
    } else if (type == 'inputCurrent') {
      return (
        <InputCurrent
          show={show}
          data={data}
          value={value}
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
    } else if (type == 'salary') {
      return (
        <CurrentSalary
          data={data}
          msg={errorMessage}
          handleSave={handleChange}
          show={show}
        />
      );
    } else if (type == 'workAuth') {
      return (
        <div className={classes.position}>
          <CandidateWorkAuth
            labelShow={true}
            show={show}
            sendServiceType={(checkedList, valueOption) => {
              handleChangeTree(checkedList, valueOption);
            }}
            selected={value.value}
            value={value}
            candiDate={option}
            type={type}
          />
        </div>
      );
    } else if (type == 'experience') {
      return (
        <DoubleInputNumber
          data={data}
          value={value}
          show={show}
          handleSave={handleChange}
          msg={errorMessage}
        />
      );
    } else if (type == 'inputs') {
      return (
        <InputBox
          show={show}
          data={data}
          value={value}
          handleSave={handleChange}
        />
      );
    } else if (type == 'company') {
      return (
        <div className={classes.position}>
          <InputBox
            show={show}
            data={data}
            value={value}
            handleSave={handleChange}
          />
        </div>
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
    } else if (type == 'schoolInput') {
      return (
        <InputSchool
          show={show}
          data={data}
          value={value}
          handleSave={handleChange}
        />
      );
    } else if (type == 'majorInput') {
      return (
        <InputMajor
          show={show}
          data={data}
          value={value}
          handleSave={handleChange}
        />
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
    } else if (type == 'selects1') {
      return (
        <SelectMore
          options={option}
          value={value}
          data={data}
          show={show}
          handleSave={handleChange}
        />
      );
    } else if (type == 'selects') {
      return (
        <SelectMore2
          options={option}
          value={value}
          data={data}
          show={show}
          handleSave={handleChange}
        />
      );
    } else if (type == 'selects2') {
      return (
        <SelectMore3
          options={option}
          value={value}
          data={data}
          show={show}
          handleSave={handleChange}
        />
      );
    } else if (type == 'Location') {
      return (
        <InputLocations
          show={show}
          data={data}
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
    }
  }, [type, option, errorMessage]);
  return (
    <React.Fragment>
      <div className={classes.box}>
        {/* 判断后的类型 在这里渲染 */}
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
  let { newCandidateJob } = state.controller;
  let { basicSearch, searchLevel, advancedFilter } = newCandidateJob.toJS();

  let { arr, strShow } = candidateFilterSearch(basicSearch);

  let { showStr } = candidateGetAdvincedFilter(advancedFilter);
  let requestData = requestFilter(arr);

  return {
    clientList: state,
    searchStr: strShow,
    requestData,
    showStr,
    searchLevel,
    language: state.controller.language,
  };
};

export default connect(mapStateToProps)(withStyles(style)(CandidateSearch));
