import React, { useState, useEffect, useRef } from 'react';

import Select from 'react-select';
import FormInput from '../../../../../components/particial/FormInput';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import { makeStyles } from '@material-ui/core/styles';
import Location from './Location';

import { isNum, isSymbol } from '../../../../../../utils/search';
import { getNewSearch } from '../../../../../actions/newSearchJobs';
import { connect, useSelector, useDispatch } from 'react-redux';

const style = {
  double: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
  },
  flex: {
    display: 'flex',
    alignItems: 'center',
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
  svg: {
    cursor: 'pointer',
    fontSize: 21,
    marginLeft: 8,
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

// Input框
export const InputBox = ({ handleSave, data, show }) => {
  const { newSearchJobs } = useSelector((state) => state.controller);
  const nowValue = newSearchJobs.toJS().basicSearch;
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

// Input Number框
export const InputNumber = ({ handleSave, data, show }) => {
  const [values, setValues] = useState('');
  const [datas, setDatas] = useState(data);
  const { newSearchJobs } = useSelector((state) => state.controller);
  const nowValue = newSearchJobs.toJS().basicSearch;

  //回显
  useEffect(() => {
    if (nowValue[datas['field']]) {
      if (show) {
        setValues(nowValue[datas['field']]);
      } else {
        setValues('');
      }
    }
  }, [show]);

  useEffect(() => {
    handleSave(values);
  }, [values]);

  const handleChange = (event) => {
    let val = isSymbol(event.target.value);
    // setValues(val.replace(/[^\d]/g, ''));
    setValues(val);
  };
  return (
    <FormInput
      style={{ marginBottom: 0, width: 320, height: 30, marginBottom: 0 }}
      isRequired={false}
      value={values}
      onChange={(e) => {
        handleChange(e);
      }}
    />
  );
};

// 双文本框数字
export const DoubleInputNumber = ({ handleSave, data, show, msg }) => {
  const { newSearchJobs } = useSelector((state) => state.controller);
  const nowValue = newSearchJobs.toJS().basicSearch;
  const classes = searchStyles();

  const [disabled, setDisabled] = useState(false);
  const [switchValue, setSwitchValue] = useState(false);
  const [errorMessage, setErrorMessage] = useState(['']);

  const [gte, setGte] = useState('');
  const [lte, setLte] = useState('');

  let reduxData = nowValue[data['field']];

  // 回显
  useEffect(() => {
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

  // 开关控制
  useEffect(() => {
    if (switchValue) {
      setDisabled(true);
      setGte('');
      setLte(0);
    }
  }, [switchValue, disabled]);

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
    </div>
  );
};

// 文本框 & 选择器(单选)
export const BillInput = ({ handleSave, data, placeholder = '', show }) => {
  const { newSearchJobs } = useSelector((state) => state.controller);
  const nowValue = newSearchJobs.toJS().basicSearch;
  const classes = searchStyles();

  const [value1, setValue1] = useState('');
  const [values, setValues] = useState('hour');
  const option = [
    {
      label: 'hour',
      value: 'hour',
    },
    {
      label: 'day',
      value: 'day',
    },
  ];

  let reduxData = nowValue[data['field']];

  // 回显
  useEffect(() => {
    if (reduxData) {
      if (show) {
        setValue1(reduxData[0]);
        setValues(reduxData[1]);
      } else {
        setValue1('');
        setValues('hour');
      }
    }
  }, [show]);

  useEffect(() => {
    handleSave([value1, values]);
  }, [value1, values]);

  return (
    <>
      <div style={{ ...style.double, height: 20, position: 'fixed' }}>
        <FormInput
          style={{ marginBottom: 0, width: 211, height: 30 }}
          defaultValue={value1}
          isRequired={false}
          onChange={(e) => {
            setValue1(e.target.value);
          }}
          placeholder={placeholder}
        />
        <span style={style.span}>/</span>
        <Select
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
          style={{ width: 85, height: 30 }}
          className={classes.select}
        />
      </div>
    </>
  );
};

// 文本框 薪资(年)
export const YearInput = ({ handleSave, data, show }) => {
  const { newSearchJobs } = useSelector((state) => state.controller);
  const nowValue = newSearchJobs.toJS().basicSearch;
  const [value, setValue] = useState('');

  let reduxData = nowValue[data['field']];

  // 回显
  useEffect(() => {
    if (reduxData) {
      if (show) {
        setValue(reduxData);
      } else {
        setValue('');
      }
    }
  }, [show]);

  useEffect(() => {
    handleSave(value);
  }, [value]);

  return (
    <>
      <div style={{ ...style.double, height: 20 }}>
        <FormInput
          style={{ marginBottom: 0, width: 211, height: 30 }}
          isRequired={false}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          value={value}
        />
        <span style={style.span}>/</span>
        <FormInput
          style={{ marginBottom: 0, width: 85, height: 30 }}
          isRequired={false}
          placeholder={`Year`}
          disabled
        />
      </div>
    </>
  );
};

// 自定义文本框数量 (or)
const DiyInput = ({ handleSave, data, show }) => {
  const { newSearchJobs } = useSelector((state) => state.controller);
  const nowValue = newSearchJobs.toJS().basicSearch;

  const [arr, setArr] = useState([{}]);
  const [value, setValue] = useState();

  let reduxData = nowValue[data['field']];
  console.log(reduxData);

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

  return (
    <div>
      <div style={{ ...style.flex, ...style.mb7, width: 320 }}></div>
      {arr.map((item, index) => {
        return (
          <div key={item.id} style={{ ...style.flex, ...style.mb7 }}>
            <Location
              city={item.value || ''}
              getLocation={(values) => handleChangeItem(values, item, index)}
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

export const CustomerInput = connect(null, { getNewSearch })(DiyInput);

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
