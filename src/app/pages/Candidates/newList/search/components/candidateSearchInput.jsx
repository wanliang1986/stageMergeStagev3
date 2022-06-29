import React, { useState, useEffect, useRef } from 'react';
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
    margin: '0 10px',
  },
  mb0: {
    marginBottom: 0,
  },
  mb7: {
    marginBottom: 7,
  },
  error: {
    color: '#cc4b37',
    fontSize: '12px',
    fontWeight: 'bold',
    marginTop: '-6px',
  },

  svg: {
    cursor: 'pointer',
    fontSize: 21,
    marginLeft: 8,
    marginTop: 5,
  },

  freshgraduates: {
    marginLeft: '10px',
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
});

// Input框 自定义数量 or
export const Inputdiy = ({ handleSave, data, show, msg }) => {
  const { newCandidateJob } = useSelector((state) => state.controller);
  const nowValue = newCandidateJob.toJS().basicSearch;
  let reduxData = nowValue[data['field']];

  // const [values, setValues] = useState('');
  const [value, setValue] = useState();
  const [arr, setArr] = useState([{}]);
  const [errorMessage, setErrorMessage] = useState(['']);

  useEffect(() => {
    if (msg) {
      setErrorMessage(msg);
    }
  }, [msg]);

  // 回显
  useEffect(() => {
    let list = [];
    if (reduxData) {
      reduxData.forEach((item, index) => {
        let obj = {
          value: item,
          id: new Date().getTime() + index,
        };
        list.push(obj);
      });
      if (show) {
        setArr(list);
      } else {
        setArr([]);
      }
    } else {
    }
  }, [show]);

  // 回传
  useEffect(() => {
    let finallyArr = [];
    console.log(arr);
    arr.forEach((item) => {
      // if (item.value != '') {
      if (item.value == undefined) {
        finallyArr.push('');
      } else {
        finallyArr.push(item.value);
      }
      // }
    });
    console.log(finallyArr);
    handleSave(finallyArr);
  }, [arr, value]);

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
      <div style={{ ...style.flex, ...style.mb7, width: 320 }}></div>
      {console.log(arr)}
      {arr.map((item, index) => {
        return (
          <div>
            <div key={item.id} style={{ ...style.flex, ...style.mb7 }}>
              <Name
                city={item.value || ''}
                getLocation={(values) => handleChangeItem(values, item, index)}
                placeholder={data.placeholder}
                data={data}
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
            {/* <div style={style.error}>
              {errorMessage && (
                <span className="form-error is-visible">{errorMessage[index]}</span>
              )}
            </div> */}
          </div>
        );
      })}
    </div>
  );
};

// name
export const Inputdiys = ({ handleSave, data, show, msg }) => {
  const { newCandidateJob } = useSelector((state) => state.controller);
  const nowValue = newCandidateJob.toJS().basicSearch;
  let reduxData = nowValue[data['field']];

  // const [values, setValues] = useState('');
  const [value, setValue] = useState();
  const [arr, setArr] = useState([{}]);
  const [errorMessage, setErrorMessage] = useState(['']);

  useEffect(() => {
    if (msg) {
      setErrorMessage(msg);
    }
  }, [msg]);

  // 回显
  useEffect(() => {
    let list = [];
    if (reduxData) {
      reduxData.forEach((item, index) => {
        let obj = {
          value: item,
          id: new Date().getTime() + index,
        };
        list.push(obj);
      });
      if (show) {
        setArr(list);
      } else {
        setArr([]);
      }
    } else {
    }
  }, [show]);

  // 回传
  useEffect(() => {
    let finallyArr = [];
    console.log(arr);
    arr.forEach((item) => {
      if (item.value != '') {
        if (item.value == undefined) {
          finallyArr.push('');
        } else {
          finallyArr.push(item.value);
        }
      }
    });
    console.log(finallyArr);
    handleSave(finallyArr);
  }, [arr, value]);

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
      <div style={{ ...style.flex, ...style.mb7, width: 320 }}></div>
      {console.log(arr)}
      {arr.map((item, index) => {
        return (
          <div>
            <div key={item.id} style={{ ...style.flex, ...style.mb7 }}>
              <Name
                city={item.value || ''}
                getLocation={(values) => handleChangeItem(values, item, index)}
                placeholder={data.placeholder}
                data={data}
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
            {/* <div style={style.error}>
              {errorMessage && (
                <span className="form-error is-visible">{errorMessage[index]}</span>
              )}
            </div> */}
          </div>
        );
      })}
    </div>
  );
};

// current Location
export const InputCurrent = ({ handleSave, data, show }) => {
  const { newCandidateJob } = useSelector((state) => state.controller);
  const nowValue = newCandidateJob.toJS().basicSearch;
  let reduxData = nowValue[data['field']];

  // const [values, setValues] = useState('');
  const [value, setValue] = useState();
  const [arr, setArr] = useState([{}]);

  // 回显
  useEffect(() => {
    let list = [];
    if (reduxData) {
      reduxData.forEach((item, index) => {
        let obj = {
          value: item,
          id: new Date().getTime() + index,
        };
        list.push(obj);
      });
      if (show) {
        setArr(list);
      } else {
        setArr([]);
      }
    } else {
    }
  }, [show]);

  // 回传
  useEffect(() => {
    let finallyArr = [];

    arr.forEach((item) => {
      if (item.value != '') {
        finallyArr.push(item.value);
      }
    });
    console.log(finallyArr);
    handleSave(finallyArr);
  }, [arr, value]);

  // 输入
  const handleChangeItem = (val, item, index) => {
    item.value = val;
    arr[index] = item;
    console.log(val, item, index, arr);
    setArr([...arr]);
  };

  return (
    <div>
      <div style={{ ...style.flex, ...style.mb7, width: 320 }}></div>
      {arr.map((item, index) => {
        return (
          <div key={item.id} style={{ ...style.flex, ...style.mb7 }}>
            <Location
              city={item.value || ''}
              getLocation={(values) => handleChangeItem(values, item, index)}
              placeholder={data.placeholder}
            ></Location>
            {/* 
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
            )} */}
          </div>
        );
      })}
    </div>
  );
};

// years 部分 双文本框数字
export const DoubleInputNumber = ({ handleSave, data, show, msg }) => {
  const { newCandidateJob } = useSelector((state) => state.controller);
  const nowValue = newCandidateJob.toJS().basicSearch;
  const classes = searchStyles();

  const [disabled, setDisabled] = useState(false);
  const [switchValue, setSwitchValue] = useState(false);
  const [errorMessage, setErrorMessage] = useState(['']);

  const [gte, setGte] = useState('');
  const [lte, setLte] = useState('');

  let reduxData = nowValue[data['field']];

  // 回显
  useEffect(() => {
    console.log(reduxData);
    if (!reduxData) {
      setSwitchValue(false);
    } else {
      if (!reduxData['open']) {
        if (show) {
          if (reduxData['gte']) {
            setGte(reduxData['gte']);
          }
          if (reduxData['lte']) {
            setLte(reduxData['lte']);
          }
        }
      }

      setSwitchValue(reduxData['open']);
    }
  }, [show]);

  // 回传
  useEffect(() => {
    if (!switchValue) {
      handleSave({
        gte,
        lte,
        open: switchValue,
      });
    } else {
      handleSave({
        gte: '',
        lte: 0,
        open: switchValue,
      });
    }
  }, [gte, lte]);

  useEffect(() => {
    if (msg) {
      setErrorMessage(msg);
    }
  }, [msg]);

  // // 开关控制
  // useEffect(() => {
  //   if (switchValue) {
  //     setDisabled(true);
  //     setGte('');
  //     setLte(0);
  //   }
  // }, [switchValue, disabled]);

  // 数字验证
  const handleChangeMin = (e) => {
    setGte(isNum(e.target.value, 2));
    if (e.target.value != '') {
      setErrorMessage([]);
    }
  };
  const handleChangeMax = (e) => {
    setLte(isNum(e.target.value, 2));
    if (e.target.value != '') {
      setErrorMessage([]);
    }
  };

  // 开关
  const handleChange = (e) => {
    setSwitchValue(e.target.checked);
    if (switchValue == true) {
      setDisabled(false);
    } else {
      setDisabled(true);
      setGte('');
      setLte(0);
    }
  };

  return (
    <div>
      {/* <div style={{ marginLeft: '165px' }}>
        <FormControlLabel
          style={{ marginLeft: 0 }}
          control={
            <Switch
              checked={switchValue}
              onChange={handleChange}
              color="primary"
              size="small"
            />
          }
          label="Fresh Graduates"
          labelPlacement="start"
        />
      </div> */}
      <div className={classes.doubles} style={{ marginTop: '10px' }}>
        <FormInput
          style={{ marginBottom: 0, width: 145, height: 30 }}
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
          style={{ marginBottom: 0, width: 145, height: 30 }}
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

// type inputs
export const InputBox = ({ handleSave, data, show }) => {
  const { newCandidateJob } = useSelector((state) => state.controller);
  const nowValue = newCandidateJob.toJS().basicSearch;
  const [values, setValues] = useState('');

  // 回显
  useEffect(() => {
    if (nowValue[data['field']]) {
      if (show) {
        setValues(nowValue[data['field']]);
      } else {
        setValues('');
      }
    }
  }, [show]);

  // 回传
  useEffect(() => {
    handleSave(values);
  }, [values]);

  return (
    <FormInput
      style={{ marginBottom: 0, width: 320, height: 30, marginBottom: 0 }}
      isRequired={false}
      onChange={(e) => {
        setValues(isSymbol(e.target.value));
      }}
      value={values}
      placeholder={data.placeholder}
    />
  );
};

// school
export const InputSchool = ({ handleSave, data, show }) => {
  const { newCandidateJob } = useSelector((state) => state.controller);
  const nowValue = newCandidateJob.toJS().basicSearch;
  let reduxData = nowValue[data['field']];
  console.log(reduxData);
  // const [values, setValues] = useState('');
  const [value, setValue] = useState();
  const [arr, setArr] = useState([{}]);

  // 回显
  useEffect(() => {
    let list = [];
    if (reduxData) {
      reduxData.forEach((item, index) => {
        let obj = {
          value: item,
          id: new Date().getTime() + index,
        };
        list.push(obj);
      });
      if (show) {
        setArr(list);
      } else {
        setArr([]);
      }
    } else {
    }
  }, [show]);

  // 回传
  useEffect(() => {
    console.log(arr);
    let finallyArr = [];

    arr.forEach((item) => {
      if (item.value != '') {
        finallyArr.push(item.value);
      }
    });
    console.log(finallyArr);
    handleSave(finallyArr);
  }, [arr, value]);

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
      <div style={{ ...style.flex, ...style.mb7, width: 320 }}></div>
      {console.log(arr)}
      {arr.map((item, index) => {
        return (
          <div key={item.id} style={{ ...style.flex, ...style.mb7 }}>
            <School
              city={item.value || ''}
              getLocation={(values) => handleChangeItem(values, item, index)}
              placeholder={data.placeholder}
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
        );
      })}
    </div>
  );
};

// major
export const InputMajor = ({ handleSave, data, show }) => {
  const { newCandidateJob } = useSelector((state) => state.controller);
  const nowValue = newCandidateJob.toJS().basicSearch;
  let reduxData = nowValue[data['field']];
  console.log(reduxData);
  // const [values, setValues] = useState('');
  const [value, setValue] = useState();
  const [arr, setArr] = useState([{}]);

  // 回显
  useEffect(() => {
    let list = [];
    if (reduxData) {
      reduxData.forEach((item, index) => {
        let obj = {
          value: item,
          id: new Date().getTime() + index,
        };
        list.push(obj);
      });
      if (show) {
        setArr(list);
      } else {
        setArr([]);
      }
    } else {
    }
  }, [show]);

  // 回传
  useEffect(() => {
    console.log(arr);
    let finallyArr = [];

    arr.forEach((item) => {
      if (item.value != '') {
        finallyArr.push(item.value);
      }
    });
    handleSave(finallyArr);
  }, [arr, value]);

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
      <div style={{ ...style.flex, ...style.mb7, width: 320 }}></div>
      {console.log(arr)}
      {arr.map((item, index) => {
        return (
          <div key={item.id} style={{ ...style.flex, ...style.mb7 }}>
            <Major
              city={item.value || ''}
              getLocation={(values) => handleChangeItem(values, item, index)}
              placeholder={data.placeholder}
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
        );
      })}
    </div>
  );
};

export const InputLocations = ({ handleSave, data, show }) => {
  const { newCandidateJob } = useSelector((state) => state.controller);
  const nowValue = newCandidateJob.toJS().basicSearch;
  let reduxData = nowValue[data['field']];
  // const [values, setValues] = useState('');
  const [value, setValue] = useState();
  const [arr, setArr] = useState([{}]);

  // 回显
  useEffect(() => {
    let list = [];
    if (reduxData) {
      reduxData.forEach((item, index) => {
        let obj = {
          value: item,
          id: new Date().getTime() + index,
        };
        list.push(obj);
      });
      if (show) {
        setArr(list);
      } else {
        setArr([]);
      }
    } else {
    }
  }, [show]);

  // 回传
  useEffect(() => {
    let finallyArr = [];

    arr.forEach((item) => {
      if (item.value != '') {
        finallyArr.push(item.value);
      }
    });
    handleSave(finallyArr);
  }, [arr, value]);

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
      <div style={{ ...style.flex, ...style.mb7, width: 320 }}></div>
      {arr.map((item, index) => {
        return (
          <div key={item.id} style={{ ...style.flex, ...style.mb7 }}>
            <Location
              city={item.value || ''}
              getLocation={(values) => handleChangeItem(values, item, index)}
              placeholder={data.placeholder}
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
    console.log('filterStr', filterStr);
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
