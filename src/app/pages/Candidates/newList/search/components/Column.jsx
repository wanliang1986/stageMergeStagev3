import React, { useState, useEffect, useRef } from 'react';
import Select from 'react-select';
import Grid from '@material-ui/core/Grid';
import { useTheme, makeStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
// import JobTree from './JobTree';
import lodash from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import { jobType as newJobType } from '../../../../../constants/formOptions';
import { upDateStopFlag } from '../../../../../actions/newCandidate';
import { connect } from 'react-redux';
import {
  SelectsInput,
  CurrentSalary,
  RequiredSkill,
  TimePick,
  SelectMore,
  SelectMore2,
  SelectMore3,
} from './candidateSearchSelects';
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
} from './candidateSearchInputs';
import { columns } from '../../../../../../utils/newCandidate';
import CandidateTree from './candidateTreeSelects';
import CandidateWorkAuth from './candidateWorkAuths';
import CandidateJobFunction from './candidateJobFunctions';

const styles = makeStyles({
  action: {
    border: '1px solid',
  },
  dialogs: {
    '& .MuiPaper-root': {
      maxWidth: '790px !important',
      width: 790,
      borderRadius: 10,
      minHeight: 459,
    },
    '& .action': {
      borderTop: '1px solid #D3D3D3',
    },
    '& .btn': {
      width: 107,
      height: 33,
    },
    '& .title': {
      paddingBottom: 5,
    },
    '& .cp': {
      cursor: 'pointer',
    },
    '& .list': {
      marginBottom: '12px',
      minHeight: '167px',
      '& .MuiGrid-item': {
        // border: '1px solid'
      },
      '& .list_title': {
        height: 39,
        background: '#FAFAFB',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 24px',
        marginBottom: '20px',
        '& span': {
          fontSize: '14px',
          color: '#505050',
        },
        '& .divs': {
          width: '200px',
          display: 'flex',
          justifyContent: 'space-between',

          '& span': {
            fontSize: '14px',
            color: '#3398dc',
            marginLeft: '5px',
          },
        },
      },
      '& .list_content': {
        display: 'flex',
        margin: '5px 0px',
        '& .columns': {
          width: '100%',
          '& .adds': {
            fontSize: '14px',
            color: '#3398dc',
          },
        },
        '& .add': {
          width: '10%',
          display: 'flex',
          alignItems: 'center',
          '& .head_select': {
            '& .Select-control': {
              border: '0px',
            },
          },
          '& .Select-control': {
            border: '0px',
          },
          '& .Select': {
            width: '100%',
          },
        },
        '& .items': {
          '& .MuiGrid-item': {
            paddingRight: '5px',
          },
        },
        '& .delete': {
          display: 'flex',
          height: '100%',
          alignItems: 'flex-start',
          paddingTop: '10px',
          paddingLeft: '10px',
        },
      },
      '& .list_box': {
        paddingLeft: '5px',
        '& .MuiGrid-container': {
          margin: '3px 0px',
        },
      },
    },
    '& .searchInput': {
      height: 32,
      width: 269,
      background: '#fff',
      marginBottom: '12px',
    },
    '& .colors': {
      color: '#3398dc',
    },
  },
  select: {
    height: '30px',
    '& .Select-input': {
      height: '30px',
    },
    '& .Select-control': {
      height: '30px',
    },
    '& .Select-value': {
      lineHeight: '30px !important',
    },
    '& .Select-placeholder': {
      height: '30px',
      lineHeight: '30px !important',
    },
  },
  tree: {
    width: '282px',
    '& .jobTree': {
      width: '288px !important',
      marginTop: '0px !important',
      '& .MuiOutlinedInput-root': {
        borderRadius: 0,
      },
    },
  },
  checkType: {
    // transform: 'translateX(0px)',
    // perspective: '100px',
    // filter: 'grayscale(100)',
  },
  divs: {
    width: '140px !important',
    display: 'flex',
    justifyContent: 'space-between',
  },
  errors: {
    fontSize: '12px',
    fontWeight: 'bold',
    color: '#cc4b37',
  },
});

const filter = [
  {
    value: 'and',
    label: 'And',
  },
  {
    value: 'or',
    label: 'Or',
  },
  {
    value: 'na',
    label: '-',
  },
];
let filter1 = [
  {
    value: 'and',
    label: 'And',
  },
  {
    value: 'or',
    label: 'Or',
  },
];

// 单选
export const SelectInput = ({
  options,
  disabled,
  select_class,
  value,
  index,
  onSave,
}) => {
  const classes = styles();
  const [values, setValues] = useState('and');
  const [option, setOption] = useState(options);

  useEffect(() => {
    if (value) {
      setValues(value);
    }
  }, []);

  // 回传
  useEffect(() => {
    if (onSave) {
      onSave(values);
    }
  }, [values]);

  return (
    <Select
      // className={select_class || ''}
      name="industrySelect"
      value={values}
      onChange={(industry) => {
        setValues(industry);
      }}
      simpleValue
      options={option}
      searchable
      clearable={false}
      autoBlur={true}
      placeholder={''}
      className={classes.select}
      disabled={disabled}
      // style={{ width: '280px' }}
    />
  );
};

const Column = ({
  onSave,
  onDelete,
  data,
  index,
  last,
  onCopy,
  keys,
  language,
}) => {
  const { candidateSelect, newCandidateJob } = useSelector(
    (state) => state.controller
  );
  const {
    jobFounctionList,
    languageList,
    degreeList,
    workAuthList,
    industryList,
    companyOptions,
    allUserOptions,
  } = candidateSelect.toJS();
  const dispatch = useDispatch();
  const { stopFlag } = newCandidateJob.toJS();
  const classes = styles();
  const [value, setValue] = useState();
  const [errorMessage, setErrorMessage] = useState();
  const [option, setOption] = useState([]);
  const [options, setOptions] = useState([]);
  const [arr, setArr] = useState([{ value: '' }, { value: '' }]);
  const [values, setValues] = useState('and');
  const timerRef = useRef({});

  useEffect(() => {
    let arr = [];
    let newColumns = lodash.cloneDeep(columns);
    let res = newColumns.filter((item) => {
      return (
        item.col !== 'name' && item.col !== 'email' && item.col !== 'phone'
      );
    });
    res.forEach((item) => {
      let obj = {
        type: item.type,
        value: item.field,
        label: item.colName,
        value1: '',
        value2: '',
        colName: item.colName,
        field: item.field,
        andOr: item.andOr,
        changeAndOr: item.changeAndOr,
      };
      arr.push(obj);
    });
    setOption(arr);
    setArr(data);
  }, [data]);

  useEffect(() => {
    onSave(arr, index, values);
  }, [arr, values]);

  const handleAdd = () => {
    let time = new Date().getTime();
    setArr([...arr, { key: time }]);
  };

  const handleDelete = (e, index) => {
    let arrs = lodash.cloneDeep(arr);
    arrs.splice(index, 1);
    setArr(arrs);
  };

  const handleHead = (val) => {
    setValues(val);
  };

  const handleSave1 = (index, item, value) => {
    let copyArr = lodash.cloneDeep(arr);
    copyArr[index] = {
      ...item,
      value1: value,
      value: '',
    };
    copyArr.forEach((item) => {
      item['errorMsg'] = '';
      item['errorTitle'] = '';
      if (item['value1']) {
        columns.forEach((items) => {
          if (item['value1'] == items['field']) {
            item['type'] = items['type'];
            item['changeAndOr'] = items['changeAndOr'];
            item['colName'] = items['colName'];
            console.log(items['andOr']);
            if (items['andOr'] == 'na') {
              item['andOr'] = 'na';
            }
            if (items['andOr'] == 'both' && !item['andOr']) {
              item['andOr'] = 'and';
            } else if (items['andOr'] == 'both' && item['andOr']) {
              item['andOr'] = item['andOr'];
            } else {
              item['andOr'] = items['andOr'];
            }

            if (items['colName'] == 'Current Company') {
              item['options'] = companyOptions;
            } else if (items['colName'] == 'Languages') {
              item['options'] = languageList;
            } else if (items['colName'] == 'Degrees') {
              item['options'] = degreeList;
            } else if (items['colName'] == 'Industries') {
              item['options'] = industryList;
            } else if (items['colName'] == 'Job Types') {
              item['options'] = newJobType;
            } else if (items['colName'] == 'Job Function') {
              // let arr = [];
              // functionOptions.forEach((ite) => {
              //   if (ite.children) {
              //     let arrs = [];
              //     ite.children.forEach((ites, index) => {
              //       if (ites.label.indexOf('-') != -1) {
              //         ite.children.splice(index, 1);
              //       } else {
              //         arrs.push(ites);
              //       }
              //     });
              //     ite.children = arrs;
              //     arr.push(ite);
              //   } else {
              //     arr.push(ite);
              //   }
              // });
              // item['options'] = functionOptions;
            }
          }
        });
      } else {
      }
    });
    setArr(copyArr);
  };

  const handleSave2 = (index, item, value) => {
    let arrs = lodash.cloneDeep(arr);
    item['andOr'] = value;
    arrs[index] = item;
    setArr(arrs);
  };

  const handleChange = (value, index) => {
    const obj = JSON.stringify(value);
    let arrs = lodash.cloneDeep(arr);
    arrs[index]['value'] = value;
    if (!stopFlag) {
      if (haveValue(value)) {
        arrs[index]['errorMsg'] = [''];
      }
    } else {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => {
        dispatch(upDateStopFlag(false));
      }, 10);
    }
    setArr(arrs);
  };

  // clear error message
  const haveValue = (value) => {
    const obj = JSON.stringify(value);
    if (typeof value == 'object' && !(value instanceof Array)) {
      if (!!value['userId'] && !!value['role']) {
        return true;
      } else if (!!value['gte'] && !!value['lte']) {
        return true;
      } else if (!!value['from'] || !!value['to']) {
        return true;
      } else if (
        (!!value['money'] && value['money']['min']) ||
        (!!value['money'] && value['money']['max'])
      ) {
        return true;
      } else {
        return false;
      }
    } else if (typeof value == 'object' && value instanceof Array) {
      if (value.length && value[0] instanceof Array && value[0].length)
        return true;
    }
    if (
      value != '' &&
      obj != '{}' &&
      obj != '[]' &&
      obj.indexOf('null') == -1
    ) {
      return true;
    }
    return false;
  };

  const handleChangeTree = (value, valueOption, index) => {
    let arrs = lodash.cloneDeep(arr);
    if (value.length) {
      arrs[index]['errorMsg'] = [''];
    }
    arrs[index]['value'] = value;
    arrs[index]['values'] = valueOption;
    setArr(arrs);
  };

  // 检索类型判断
  const checkType = (data, index, item) => {
    if (!data) return;

    let type = null,
      colName = null;
    columns.forEach((item) => {
      if (item.field == data) {
        type = item['type'];
      }
    });

    if (type == 'name') {
      return (
        <Inputdiys
          key={data}
          data={data}
          index={index}
          value={item['value']}
          handleSave={handleChange}
          error={item['errorMsg']}
        />
      );
    } else if (type == 'input') {
      return (
        <Inputdiy
          key={data}
          data={data}
          index={index}
          value={item['value']}
          handleSave={handleChange}
          error={item['errorMsg']}
        />
      );
    } else if (type == 'treeSelect') {
      return (
        <div className={classes.tree}>
          <CandidateTree
            key={data}
            labelShow={true}
            sendServiceType={(checkedList, valueOption) => {
              handleChangeTree(checkedList, valueOption, index);
            }}
            selected={item['value']}
            value={item['value']}
            candiDate={[]}
            className="jobTree"
            error={item['errorMsg']}
            width="280px"
          />
        </div>
      );
    } else if (type == 'jobFunctionTree') {
      return (
        <div className={classes.tree}>
          <CandidateWorkAuth
            key={data}
            labelShow={true}
            sendServiceType={(checkedList, valueOption) => {
              handleChangeTree(checkedList, valueOption, index);
            }}
            selected={item['value']}
            value={item['value']}
            candiDate={[]}
            className="jobTree"
            error={item['errorMsg']}
            width="280px"
            type={type}
          />
        </div>
      );
    } else if (type == 'inputCurrent') {
      return (
        <InputCurrent
          key={data}
          data={data}
          index={index}
          value={item['value']}
          handleSave={handleChange}
          error={item['errorMsg']}
        />
      );
    } else if (type == 'skillSelect') {
      return (
        <SelectsInput
          options={item['options'] || []}
          index={index}
          data={data}
          handleSave={handleChange}
          value={item['value']}
          error={item['errorMsg']}
          language={language}
        />
      );
    } else if (type == 'salary') {
      return (
        <CurrentSalary
          key={data}
          data={data}
          index={index}
          msg={errorMessage}
          handleSave={handleChange}
          value={item['value']}
          error={item['errorMsg']}
        />
      );
    } else if (type == 'workAuth') {
      return (
        <div className={classes.tree}>
          <CandidateWorkAuth
            key={data}
            labelShow={true}
            sendServiceType={(checkedList, valueOption) => {
              handleChangeTree(checkedList, valueOption, index);
            }}
            selected={item['value']}
            value={item['value']}
            candiDate={[]}
            className="jobTree"
            error={item['errorMsg']}
            width="280px"
            type={type}
          />
        </div>
      );
    } else if (type == 'experience') {
      return (
        <DoubleInputNumber
          data={data}
          value={item['value']}
          index={index}
          handleSave={handleChange}
          msg={errorMessage}
          error={item['errorMsg']}
        />
      );
    } else if (type == 'inputs') {
      return (
        <InputBox
          key={data}
          data={data}
          index={index}
          value={item['value']}
          handleSave={handleChange}
          error={item['errorMsg']}
        />
      );
    } else if (type == 'company') {
      return (
        <InputBox
          key={data}
          data={data}
          index={index}
          value={item['value']}
          handleSave={handleChange}
          error={item['errorMsg']}
        />
      );
    } else if (type == 'skill') {
      return (
        <RequiredSkill
          options={option}
          index={index}
          data={data}
          handleSave={handleChange}
          value={item['value']}
          error={item['errorMsg']}
        />
      );
    } else if (type == 'schoolInput') {
      return (
        <InputSchool
          data={data}
          index={index}
          value={item['value']}
          handleSave={handleChange}
          error={item['errorMsg']}
        />
      );
    } else if (type == 'majorInput') {
      return (
        <InputMajor
          data={data}
          index={index}
          value={item['value']}
          handleSave={handleChange}
          error={item['errorMsg']}
        />
      );
    } else if (type == 'time') {
      return (
        <TimePick
          value={item['value']}
          index={index}
          data={data}
          handleSave={handleChange}
          error={item['errorMsg']}
        />
      );
    } else if (type == 'selects1') {
      return (
        <SelectMore
          key={data}
          options={item['options'] || []}
          value={item['value']}
          data={data}
          index={index}
          handleSave={handleChange}
          error={item['errorMsg']}
        />
      );
    } else if (type == 'selects') {
      return (
        <SelectMore2
          key={data}
          options={item['options'] || []}
          value={item['value']}
          data={data}
          index={index}
          handleSave={handleChange}
          error={item['errorMsg']}
        />
      );
    } else if (type == 'selects2') {
      return (
        <SelectMore3
          key={data}
          options={item['options'] || []}
          value={item['value']}
          data={data}
          index={index}
          handleSave={handleChange}
          error={item['errorMsg']}
        />
      );
    } else if (type == 'Location') {
      return (
        <InputLocations
          key={data}
          options={option}
          data={data}
          index={index}
          value={item['value']}
          handleSave={handleChange}
          error={item['errorMsg']}
        />
      );
    }
  };

  const handleDeletes = () => {
    onDelete(index);
  };

  const handleCopy = () => {
    onCopy(index);
  };

  return (
    <div style={{ marginBottom: 10, border: '1px solid #F3F3F3' }}>
      <div className="list_title">
        <span>Column Condition</span>
        <div className={classes.divs}>
          <span className="cp" onClick={handleCopy}>
            Duplicate
          </span>
          {last ? (
            <span className="cp" onClick={handleDeletes}>
              Delete
            </span>
          ) : (
            <></>
          )}
        </div>
      </div>
      <div className="list_content">
        <div className="add"></div>
        <div className="columns">
          <Grid container>
            <Grid container item className="items" xs={11}>
              <Grid item xs={4}>
                Column Name
              </Grid>
              <Grid item xs={2}>
                Filter
              </Grid>
              <Grid item xs={6}>
                Value
              </Grid>
            </Grid>
            <Grid item xs></Grid>
          </Grid>
        </div>
      </div>
      <div className="list_content list_box">
        <div className="add">
          <SelectInput
            select_class="head_select"
            options={filter1}
            disabled={false}
            onSave={handleHead}
            value={keys}
          />
        </div>
        <div className="columns">
          {arr.map((item, index) => (
            <Grid container key={item['key'] || index}>
              <Grid container className="items" item xs={11}>
                <Grid item xs={4}>
                  <Select
                    // className={select_class || ''}
                    options={option}
                    name="industrySelect"
                    value={item.value1}
                    onChange={(industry) => {
                      handleSave1(index, item, industry);
                    }}
                    simpleValue
                    searchable
                    clearable={false}
                    autoBlur={true}
                    placeholder={'Select'}
                    className={classes.select}
                    // disabled={disabled}
                  />
                  {item['errorTitle'] && (
                    <p className={classes.errors}>{item['errorTitle']}</p>
                  )}
                </Grid>
                <Grid item xs={2}>
                  <Select
                    // className={select_class || ''}
                    options={item['andOr'] === 'na' ? filter : filter1}
                    name="industrySelect"
                    value={item.andOr}
                    onChange={(industry) => {
                      handleSave2(index, item, industry);
                    }}
                    simpleValue
                    // options={option}
                    searchable
                    clearable={false}
                    autoBlur={true}
                    placeholder={'Select'}
                    className={classes.select}
                    disabled={!item.changeAndOr}
                  />
                </Grid>
                <Grid item xs={6}>
                  {!item['value1'] && (
                    <div style={{ width: '280px' }}>
                      <SelectInput />
                    </div>
                  )}
                  <div className={classes.checkType}>
                    {checkType(item['value1'], index, item)}
                  </div>
                </Grid>
              </Grid>
              <Grid item xs>
                <div className="delete">
                  {arr.length == 1 ? (
                    <></>
                  ) : (
                    <DeleteIcon
                      color="action"
                      className="cp"
                      style={{ fontSize: 21 }}
                      onClick={(e) => handleDelete(e, index)}
                    ></DeleteIcon>
                  )}
                </div>
              </Grid>
            </Grid>
          ))}
          <span className="adds cp" onClick={handleAdd}>
            Add Column
          </span>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    language: state.controller.language,
  };
};

export default connect(mapStateToProps)(Column);
