import React, { useState, useEffect, useRef } from 'react';
import Select from 'react-select';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import { makeStyles } from '@material-ui/core/styles';
import { connect, useSelector, useDispatch } from 'react-redux';
import FormInput from '../../../../../components/particial/FormInput';
import { Form } from 'rsuite';
import Name from './Name';
import School from './School';
import Major from './Major';
import Location from './Location';
import { isNum, isSymbol } from '../../../../../../utils/search';

const style = {
  double: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
  },
  flex: {
    display: 'flex',
    // alignItems: 'center',
  },
  height: {
    height: '30px',
  },
  inputs: {
    width: '145px',
    height: '30px',
    border: '1px solid #d2d2d2',
    background: 'red',
    backgroundColor: 'yellow',
    '&:hover': {
      background: 'white',
      border: '1px solid red',
    },
    ':focus': {
      background: 'red !important',
      border: '1px solid red',
    },
  },
  span: {
    margin: '0 9px',
    paddingTop: 5,
  },
  mb0: {
    marginBottom: 0,
  },
  mb7: {
    marginBottom: 7,
  },
  svg: {
    cursor: 'pointer',
    fontSize: 21,
    marginLeft: 8,
    marginTop: 5,
  },
  diy: {
    height: '30px',
  },
};

const searchStyles = makeStyles({
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
  saveFilter: {
    '& p': {
      fontSise: 14,
      color: '#505050',
      fontFamily: 'Roboto',
      marginBottom: 5,
    },
  },
  doubles: {
    display: 'flex',
    '& .form-error': {
      marginBottom: 0,
      marginTop: 0,
    },
  },
  diy: {
    width: '281px',
    '& .MuiAutocomplete-inputRoot': {
      height: '32px',
    },
  },
  formInput: {
    '& .form-error': {
      marginTop: 0,
      marginBottom: 0,
    },
  },
  autoBox: {
    '& .form-error': {
      fontSize: '12px',
      fontWeight: 'bold',
      color: '#cc4b37',
    },
    '& .MuiFormControl-fullWidth': {
      borderColor: '#cc4b37 !important',
      backgroundColor: '#faedeb !important',
      border: '1px solid #cc4b37 !important',
    },
    "& .foundation [type='text']": {
      borderColor: '#cc4b37 !important',
      backgroundColor: '#faedeb !important',
      border: '1px solid #cc4b37 !important',
    },
  },
});

// Input框 自定义数量 or
export const Inputdiy = ({ handleSave, index, value, error, data }) => {
  const classes = searchStyles();
  const [errorMessage, setErrorMessage] = useState(['']);
  const [arr, setArr] = useState([{}]);

  useEffect(() => {
    if (error) {
      setErrorMessage(error);
    }
  }, [error]);
  useEffect(() => {
    let list = [];
    if (value) {
      value.forEach((item, index) => {
        let obj = {
          value: item,
          id: new Date().getTime() + index,
        };
        list.push(obj);
      });
      setArr(list);
    }
  }, []);

  // 回传
  useEffect(() => {
    let finallyArr = [];
    if (!arr.length) {
      setArr([{}]);
    } else {
      arr.forEach((item) => {
        if (item.value == undefined) {
          finallyArr.push('');
        } else {
          finallyArr.push(item.value);
        }
      });
    }
    handleSave(finallyArr, index);
  }, [arr]);

  // 移除input
  const handleRemove = (index) => {
    let newArr = arr;
    newArr.splice(index, 1);
    setArr([...newArr]);
  };

  // 添加input
  const handleAdd = () => {
    let obj = {
      value: '',
      id: new Date().getTime(),
    };
    setArr([...arr, obj]);
  };

  // 输入
  const handleChangeItem = (val, item, index) => {
    item.value = val;
    arr[index] = item;
    setArr([...arr]);
  };

  return (
    <div>
      {arr.map((item, index) => {
        return (
          <div>
            <div
              key={item.id}
              className={classes.diy}
              style={{ ...style.flex }}
            >
              <Name
                data={data}
                city={item.value || ''}
                getLocation={(values) => handleChangeItem(values, item, index)}
                // placeholder={data.placeholder}
                errorMessage={errorMessage[index]}
              ></Name>

              {index == 0 ? (
                <AddCircleIcon
                  onClick={handleAdd}
                  style={style.svg}
                  color="disabled"
                />
              ) : (
                <RemoveCircleIcon
                  onClick={() => handleRemove(index)}
                  style={style.svg}
                  color="disabled"
                />
              )}
            </div>
            {/* {errorMessage[0] && (
              <span className="form-error is-visible">{errorMessage}</span>
            )} */}
          </div>
        );
      })}
    </div>
  );
};

// name
export const Inputdiys = ({ handleSave, index, value, error, data }) => {
  const classes = searchStyles();
  const [errorMessage, setErrorMessage] = useState(['']);
  const [arr, setArr] = useState([{}]);

  useEffect(() => {
    if (error) {
      setErrorMessage(error);
    }
  }, [error]);
  useEffect(() => {
    let list = [];
    if (value) {
      value.forEach((item, index) => {
        let obj = {
          value: item,
          id: new Date().getTime() + index,
        };
        list.push(obj);
      });
      setArr(list);
    }
  }, []);

  // 回传
  useEffect(() => {
    let finallyArr = [];
    if (!arr.length) {
      setArr([{}]);
    } else {
      arr.forEach((item) => {
        if (item.value != '') {
          finallyArr.push(item.value);
        }
      });
    }
    handleSave(finallyArr, index);
  }, [arr]);

  // 移除input
  const handleRemove = (index) => {
    let newArr = arr;
    newArr.splice(index, 1);
    setArr([...newArr]);
  };

  // 添加input
  const handleAdd = () => {
    let obj = {
      value: '',
      id: new Date().getTime(),
    };
    setArr([...arr, obj]);
  };

  // 输入
  const handleChangeItem = (val, item, index) => {
    item.value = val;
    arr[index] = item;
    setArr([...arr]);
  };

  return (
    <div>
      {arr.map((item, index) => {
        return (
          <div className={errorMessage[0] != '' ? classes.autoBox : ''}>
            <div
              key={item.id}
              className={classes.diy}
              style={{ ...style.flex }}
            >
              <Name
                data={data}
                city={item.value || ''}
                getLocation={(values) => handleChangeItem(values, item, index)}
                // placeholder={data.placeholder}
                // errorMessage={errorMessage[index]}
              ></Name>

              {index == 0 ? (
                <AddCircleIcon
                  onClick={handleAdd}
                  style={style.svg}
                  color="disabled"
                />
              ) : (
                <RemoveCircleIcon
                  onClick={() => handleRemove(index)}
                  style={style.svg}
                  color="disabled"
                />
              )}
            </div>
            {errorMessage[0] && (
              <span className="form-error is-visible">{errorMessage}</span>
            )}
          </div>
        );
      })}
    </div>
  );
};

// current Location
export const InputCurrent = ({ handleSave, index, value, error }) => {
  const classes = searchStyles();
  const [errorMessage, setErrorMessage] = useState(['']);

  // const [values, setValues] = useState('');

  const [arr, setArr] = useState([{}]);

  useEffect(() => {
    console.log(error);
    if (error) {
      setErrorMessage(error);
    }
  }, [error]);

  useEffect(() => {
    let list = [];
    if (value) {
      value.forEach((item, index) => {
        let obj = {
          value: item,
          id: new Date().getTime() + index,
        };
        list.push(obj);
      });

      setArr(list);
    }
  }, []);

  // 回传
  useEffect(() => {
    let finallyArr = [];
    if (!arr.length) {
      setArr([{}]);
    } else {
      arr.forEach((item) => {
        if (item.value != '') {
          finallyArr.push(item.value);
        }
      });
    }
    handleSave(finallyArr, index);
  }, [arr]);

  // 输入
  const handleChangeItem = (val, item, index) => {
    item.value = val;
    arr[index] = item;
    console.log(val, item, index, arr);
    setArr([...arr]);
  };

  return (
    <div>
      {arr.map((item, index) => {
        return (
          <div className={errorMessage[0] != '' ? classes.autoBox : ''}>
            <div
              key={item.id}
              className={classes.diy}
              style={{ ...style.flex }}
            >
              <Location
                city={item.value || ''}
                getLocation={(values) => handleChangeItem(values, item, index)}
                // placeholder={ }
              ></Location>
            </div>
            {errorMessage[0] && (
              <span className="form-error is-visible">{errorMessage}</span>
            )}
          </div>
        );
      })}
    </div>
  );
};

// years 部分 双文本框数字
export const DoubleInputNumber = ({
  handleSave,
  data,
  msg,
  index,
  value,
  error,
}) => {
  const classes = searchStyles();

  const [disabled, setDisabled] = useState(false);
  const [switchValue, setSwitchValue] = useState(false);
  const [errorMessage, setErrorMessage] = useState(['']);

  const [gte, setGte] = useState('');
  const [lte, setLte] = useState('');

  useEffect(() => {
    if (error) {
      setErrorMessage(error);
    }
  }, [error]);

  // 回显
  useEffect(() => {
    if (value) {
      if (value['gte']) {
        setGte(value['gte']);
      }
      if (value['lte']) {
        setLte(value['lte']);
      }
    }
  }, []);

  // 回传
  useEffect(() => {
    handleSave(
      {
        gte,
        lte,
      },
      index
    );
  }, [gte, lte]);

  useEffect(() => {
    if (msg) {
      setErrorMessage(msg);
    }
  }, [msg]);

  // 数字验证
  const handleChangeMin = (event) => {
    setGte(isNum(event.target.value, 2));
  };
  const handleChangeMax = (event) => {
    setLte(isNum(event.target.value, 2));
  };

  // 开关
  const handleChange = (e) => {
    setSwitchValue(e.target.checked);
    if (switchValue == true) {
      setDisabled(false);
    } else {
      setDisabled(true);
      setGte(0);
      setLte('');
    }
  };

  return (
    <div>
      <div className={classes.doubles}>
        <FormInput
          style={{ marginBottom: 0, width: 128, height: 32 }}
          isRequired={false}
          onChange={(e) => {
            handleChangeMin(e);
          }}
          value={gte}
          placeholder={`Min Year`}
          disabled={disabled}
          errorMessage={errorMessage[0]}
        />
        <span style={style.span}>-</span>
        <FormInput
          style={{ marginBottom: 0, width: 128, height: 32 }}
          onChange={(e) => {
            handleChangeMax(e);
          }}
          placeholder={`Max Year`}
          value={lte}
          disabled={disabled}
          errorMessage={errorMessage[1]}
        />
      </div>
    </div>
  );
};

// commonPool高级搜索中的company组件
export const CompanyInput = ({
  handleSave,
  data,
  show,
  index,
  value,
  error,
}) => {
  const classes = searchStyles();
  const [values, setValues] = useState('');
  const [errorMessage, setErrorMessage] = useState(['']);
  const [companyValue, setValueCompanyValue] = useState('');
  useEffect(() => {
    if (value) {
      setValues(value.values);
      setValueCompanyValue(value.companyValue);
    }
  }, []);
  useEffect(() => {
    if (error) {
      setErrorMessage(error);
    }
  }, [error]);

  // 回传
  useEffect(() => {
    handleSave({ values, companyValue }, index);
  }, [values, companyValue]);
  const option = [
    {
      label: 'All',
      value: 'All',
    },
    {
      label: 'Current',
      value: 'Current',
    },
  ];
  return (
    <div>
      <Select
        style={{ marginBottom: 0, width: 281, height: 32, marginBottom: 10 }}
        isRequired={false}
        onChange={(industry) => {
          setValueCompanyValue(industry.value);
        }}
        options={option}
        value={companyValue}
        placeholder="Please select"
        errorMessage={errorMessage && errorMessage[0]}
        className={classes.formInput}
      />
      <FormInput
        style={{ marginBottom: 0, width: 281, height: 32, marginBottom: 0 }}
        isRequired={false}
        onChange={(e) => {
          setValues(isSymbol(e.target.value));
        }}
        value={values}
        placeholder={data.placeholder}
        errorMessage={errorMessage && errorMessage[0]}
        className={classes.formInput}
      />
    </div>
  );
};

// type inputs
export const InputBox = ({ handleSave, data, show, index, value, error }) => {
  const classes = searchStyles();
  const [values, setValues] = useState('');
  const [errorMessage, setErrorMessage] = useState(['']);

  useEffect(() => {
    if (value) {
      setValues(value);
    }
  }, [value]);
  useEffect(() => {
    if (error) {
      setErrorMessage(error);
    }
  }, [error]);

  // 回传
  useEffect(() => {
    handleSave(values, index);
  }, [values]);

  return (
    <FormInput
      style={{ marginBottom: 0, width: 281, height: 32, marginBottom: 0 }}
      isRequired={false}
      onChange={(e) => {
        setValues(isSymbol(e.target.value));
      }}
      value={values}
      placeholder={data.placeholder}
      errorMessage={errorMessage && errorMessage[0]}
      className={classes.formInput}
    />
  );
};

// school
export const InputSchool = ({ handleSave, index, value, error }) => {
  const classes = searchStyles();
  const [errorMessage, setErrorMessage] = useState(['']);

  const [arr, setArr] = useState([{}]);

  useEffect(() => {
    if (error) {
      setErrorMessage(error);
    }
  }, [error]);
  // 回显

  useEffect(() => {
    let list = [];
    if (value) {
      value.forEach((item, index) => {
        let obj = {
          value: item,
          id: new Date().getTime() + index,
        };
        list.push(obj);
      });

      setArr(list);
    }
  }, []);

  // 回传
  useEffect(() => {
    let finallyArr = [];
    if (!arr.length) {
      setArr([{}]);
    } else {
      arr.forEach((item) => {
        if (item.value != '') {
          finallyArr.push(item.value);
        }
      });
    }
    handleSave(finallyArr, index);
  }, [arr]);

  // 移除input
  const handleRemove = (index) => {
    let newArr = arr;
    newArr.splice(index, 1);
    setArr([...newArr]);
  };

  // 添加input
  const handleAdd = () => {
    let obj = {
      value: '',
      id: new Date().getTime(),
    };
    setArr([...arr, obj]);
  };

  // 输入
  const handleChangeItem = (val, item, index) => {
    item.value = val;
    arr[index] = item;
    setArr([...arr]);
  };

  return (
    <div>
      {arr.map((item, index) => {
        return (
          <div className={errorMessage[0] != '' ? classes.autoBox : ''}>
            <div
              key={item.id}
              style={{ ...style.flex, ...style.mb7 }}
              className={classes.diy}
            >
              <School
                city={item.value || ''}
                getLocation={(values) => handleChangeItem(values, item, index)}
                // placeholder={data.placeholder}
              ></School>

              {index == 0 ? (
                <AddCircleIcon
                  onClick={handleAdd}
                  style={style.svg}
                  color="disabled"
                />
              ) : (
                <RemoveCircleIcon
                  onClick={() => handleRemove(index)}
                  style={style.svg}
                  color="disabled"
                />
              )}
            </div>
            {errorMessage[0] && (
              <span className="form-error is-visible">{errorMessage}</span>
            )}
          </div>
        );
      })}
    </div>
  );
};

// major
export const InputMajor = ({ handleSave, index, value, error }) => {
  const classes = searchStyles();
  const [errorMessage, setErrorMessage] = useState(['']);

  const [arr, setArr] = useState([{}]);

  useEffect(() => {
    if (error) {
      setErrorMessage(error);
    }
  }, [error]);

  // 回显
  useEffect(() => {
    let list = [];
    if (value) {
      value.forEach((item, index) => {
        let obj = {
          value: item,
          id: new Date().getTime() + index,
        };
        list.push(obj);
      });
      setArr(list);
    }
  }, []);

  // 回传
  useEffect(() => {
    let finallyArr = [];
    if (!arr.length) {
      setArr([{}]);
    } else {
      arr.forEach((item) => {
        if (item.value != '') {
          finallyArr.push(item.value);
        }
      });
    }
    handleSave(finallyArr, index);
  }, [arr]);

  // 移除input
  const handleRemove = (index) => {
    let newArr = arr;
    newArr.splice(index, 1);
    setArr([...newArr]);
  };

  // 添加input
  const handleAdd = () => {
    let obj = {
      value: '',
      id: new Date().getTime(),
    };
    setArr([...arr, obj]);
    console.log(arr);
    console.log(data);
  };

  // 输入
  const handleChangeItem = (val, item, index) => {
    console.log(val);
    item.value = val;
    console.log(item);
    console.log(index);
    arr[index] = item;
    console.log(arr);
    setArr([...arr]);
  };

  return (
    <div>
      {arr.map((item, index) => {
        return (
          <div className={errorMessage[0] != '' ? classes.autoBox : ''}>
            <div
              key={item.id}
              style={{ ...style.flex }}
              className={classes.diy}
            >
              <Major
                city={item.value || ''}
                getLocation={(values) => handleChangeItem(values, item, index)}
                // placeholder={data.placeholder}
              ></Major>

              {index == 0 ? (
                <AddCircleIcon
                  onClick={handleAdd}
                  style={style.svg}
                  color="disabled"
                />
              ) : (
                <RemoveCircleIcon
                  onClick={() => handleRemove(index)}
                  style={style.svg}
                  color="disabled"
                />
              )}
            </div>
            {errorMessage[0] && (
              <span className="form-error is-visible">{errorMessage}</span>
            )}
          </div>
        );
      })}
    </div>
  );
};

export const InputLocations = ({ handleSave, index, value, error }) => {
  const classes = searchStyles();
  const [errorMessage, setErrorMessage] = useState(['']);

  const [arr, setArr] = useState([{}]);

  useEffect(() => {
    if (error) {
      setErrorMessage(error);
    }
  }, [error]);

  useEffect(() => {
    let list = [];
    if (value) {
      value.forEach((item, index) => {
        let obj = {
          value: item,
          id: new Date().getTime() + index,
        };
        list.push(obj);
      });

      setArr(list);
    }
  }, []);

  // 回传
  useEffect(() => {
    let finallyArr = [];
    if (!arr.length) {
      setArr([{}]);
    } else {
      arr.forEach((item) => {
        if (item.value != '') {
          finallyArr.push(item.value);
        }
      });
    }
    handleSave(finallyArr, index);
  }, [arr]);

  // 移除input
  const handleRemove = (index) => {
    let newArr = arr;
    newArr.splice(index, 1);
    setArr([...newArr]);
  };

  // 添加input
  const handleAdd = () => {
    let obj = {
      value: '',
      id: new Date().getTime(),
    };
    setArr([...arr, obj]);
  };

  // 输入
  const handleChangeItem = (val, item, index) => {
    item.value = val;
    arr[index] = item;
    setArr([...arr]);
  };

  return (
    <div>
      {arr.map((item, index) => {
        return (
          <div className={errorMessage[0] != '' ? classes.autoBox : ''}>
            <div
              key={item.id}
              style={{ ...style.flex }}
              className={classes.diy}
            >
              <Location
                city={item.value || ''}
                getLocation={(values) => handleChangeItem(values, item, index)}
                // placeholder={data.placeholder}
              ></Location>

              {index == 0 ? (
                <AddCircleIcon
                  onClick={handleAdd}
                  style={style.svg}
                  color="disabled"
                />
              ) : (
                <RemoveCircleIcon
                  onClick={() => handleRemove(index)}
                  style={style.svg}
                  color="disabled"
                />
              )}
            </div>
            {errorMessage[0] && (
              <span className="form-error is-visible">{errorMessage}</span>
            )}
          </div>
        );
      })}
    </div>
  );
};

// 检索条件保存
export const SaveFilter = ({ handleSave, filterStr, show }) => {
  const classes = searchStyles();
  const [value, setValue] = useState('');

  useEffect(() => {
    if (filterStr instanceof Array) {
      setValue(filterStr[0][1]);
    } else {
      setValue(filterStr);
    }
  }, []);

  useEffect(() => {
    handleSave(value);
  }, [value]);

  const handleChange = (e) => {
    setValue(e.target.value.substring(0, 39));
  };

  return (
    <div className={classes.saveFilter}>
      <p>Filter Name</p>
      <FormInput
        onChange={(e) => {
          handleChange(e);
        }}
        value={value}
        style={{ width: 320, height: 30 }}
      />
    </div>
  );
};
