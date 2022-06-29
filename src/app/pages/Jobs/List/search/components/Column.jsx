import React, { useState, useEffect, useRef } from 'react';
import Select from 'react-select';
import Grid from '@material-ui/core/Grid';
import { useTheme, makeStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import NewJobTrees from './NewJobTrees';
import lodash from 'lodash';
import { connect, useSelector, useDispatch } from 'react-redux';
import {
  jobStatus,
  jobType as newJobType,
  ipgPostingStatus,
} from '../../../../../constants/formOptions';
import { upDateStopFlag } from '../../../../../actions/newSearchJobs';

import {
  SelectBox,
  SelectBox1,
  SelectBox2,
  SelectsInput,
  DoubleSelect,
  TimePick,
  companySelect,
  CompanySelect,
  RequiredSkill,
  RateSalary,
  SelectInputs,
} from './SearchSelects';
import {
  DoubleInputNumber,
  CustomerInput,
  InputBox,
  InputNumber,
  SaveFilter,
} from './SearchInputs';
import { columns } from '../../../../../../utils/search';

const jobStatusOptions = jobStatus.filter((status) => !status.disabled);
console.log('jobStatusOptions', jobStatusOptions);
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
  const { newSearchOptions, newSearchJobs } = useSelector(
    (state) => state.controller
  );
  const {
    companyOptions,
    allUserOptions,
    degreeOptions,
    languagesOptions,
    functionOptions,
  } = newSearchOptions.toJS();
  const dispatch = useDispatch();
  const { stopFlag, allOrMy } = newSearchJobs.toJS();
  const classes = styles();
  const [errorMessage, setErrorMessage] = useState();
  const [option, setOption] = useState([]);
  const [arr, setArr] = useState([{ value: '' }, { value: '' }]);
  const [values, setValues] = useState('and');
  const timerRef = useRef({});

  useEffect(() => {
    let arr = [];
    columns.forEach((item) => {
      if (item.colName === 'Job ID') return;
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
    console.log('handleSave1');
    let copyArr = lodash.cloneDeep(arr);
    let copyOption = lodash.cloneDeep(option);
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

            if (items['colName'] == 'Company') {
              item['options'] = companyOptions;
            } else if (
              items['colName'] == 'Required Languages' ||
              items['colName'] == 'Preferred Languages'
            ) {
              item['options'] = languagesOptions;
            } else if (items['colName'] == 'Degree Requirement') {
              item['options'] = degreeOptions;
            } else if (items['colName'] == 'Status') {
              item['options'] = jobStatusOptions;
            } else if (items['colName'] == 'Job Types') {
              item['options'] = newJobType;
            } else if (items['colName'] == 'Assigned User') {
              item['options'] = allUserOptions;
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
              //
            } else if (items['colName'] == 'Job Posting Status') {
              item['options'] = ipgPostingStatus;
            }
          }
        });
      } else {
      }
    });
    // 是否选中Rate/salary
    let checkSalary = copyArr.some((items) => items.colName == 'Rate/Salary');
    // 是否选中Type
    let checkType = copyArr.some((items) => items.colName == 'Job Types');

    // disabled 控制单个选项是否可选
    copyOption.forEach((item) => {
      if (item.colName == 'Job Types') item.disabled = checkSalary;
    });
    copyOption.forEach((item) => {
      if (item.colName == 'Rate/Salary') item.disabled = checkType;
    });
    setOption(copyOption);
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

    if (type == 'input') {
      return (
        <InputBox
          data={data}
          index={index}
          value={item['value']}
          handleSave={handleChange}
          error={item['errorMsg']}
        />
      );
    } else if (type == 'number') {
      return (
        <InputNumber
          data={data}
          index={index}
          value={item['value']}
          handleSave={handleChange}
          error={item['errorMsg']}
        />
      );
    } else if (type == 'select') {
      return (
        <div className={classes.position}>
          <SelectInputs
            options={option}
            index={index}
            data={data}
            value={item['value']}
            handleSave={handleChange}
          />
        </div>
      );
    } else if (type == 'company') {
      return (
        <div className={classes.position}>
          <CompanySelect
            options={item['options'] || []}
            index={index}
            data={data}
            value={item['value']}
            handleSave={handleChange}
            error={item['errorMsg']}
          />
        </div>
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
    } else if (type == 'selects') {
      return (
        <SelectBox
          key={data}
          options={item['options'] || []}
          value={item['value']}
          data={data}
          index={index}
          handleSave={handleChange}
          error={item['errorMsg']}
        />
      );
    } else if (type == 'doubleSelect') {
      return (
        <DoubleSelect
          options={item['options'] || []}
          values={item['value']}
          data={data}
          index={index}
          handleSave={handleChange}
          error={item['errorMsg']}
        />
      );
    } else if (type == 'dbNumber') {
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
    } else if (type == 'tree') {
      return (
        <div className={classes.tree}>
          <NewJobTrees
            labelShow={true}
            sendServiceType={(checkedList, valueOption) => {
              handleChangeTree(checkedList, valueOption, index);
            }}
            selected={item['value']}
            value={item['value']}
            jobData={[]}
            className="jobTree"
            error={item['errorMsg']}
            width="280px"
            type={type}
          />
        </div>
      );
    } else if (type == 'inputs') {
      return (
        <CustomerInput
          options={option}
          data={data}
          index={index}
          value={item['value']}
          handleSave={handleChange}
          error={item['errorMsg']}
        />
      );
    } else if (type == 'rateSalary') {
      return (
        <RateSalary
          data={data}
          index={index}
          msg={errorMessage}
          handleSave={handleChange}
          value={item['value']}
          error={item['errorMsg']}
        ></RateSalary>
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
