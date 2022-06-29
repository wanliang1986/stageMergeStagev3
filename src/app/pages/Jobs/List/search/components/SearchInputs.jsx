import React, { useState, useEffect, useRef } from 'react';

import Select from 'react-select';
import FormInput from '../../../../../components/particial/FormInput';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import { makeStyles } from '@material-ui/core/styles';
import Location from './Location';

import { isNum, isSymbol } from '../../../../../../utils/search';
import { getNewSearch } from '../../../../../actions/newSearchJobs';
import { connect, useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
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
  },
});

// Input框
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

// Input Number框
export const InputNumber = ({ handleSave, index, value, error }) => {
  const [values, setValues] = useState('');
  const [errorMessage, setErrorMessage] = useState(['']);
  const classes = searchStyles();

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

  useEffect(() => {
    handleSave(values, index);
  }, [values]);

  const handleChange = (event) => {
    let val = event.target.value;
    setValues(val.replace(/[^\d]/g, ''));
  };
  return (
    <FormInput
      style={{ marginBottom: 0, width: 281, height: 32, marginBottom: 0 }}
      isRequired={false}
      value={values}
      errorMessage={errorMessage && errorMessage[0]}
      onChange={(e) => {
        handleChange(e);
      }}
      className={classes.formInput}
    />
  );
};

// 双文本框数字
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
  const [errorMessage, setErrorMessage] = useState(['']);
  const [gte, setGte] = useState('');
  const [lte, setLte] = useState('');

  useEffect(() => {
    if (error) {
      setErrorMessage(error);
    }
  }, [error]);

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
  const [t] = useTranslation();
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
          placeholder={t('tab:Min Year')}
          disabled={disabled}
          errorMessage={errorMessage[0]}
        />
        <span style={style.span}>-</span>
        <FormInput
          style={{ marginBottom: 0, width: 128, height: 32 }}
          value={lte}
          onChange={(e) => {
            handleChangeMax(e);
          }}
          placeholder={t('tab:Max Year')}
          disabled={disabled}
          errorMessage={errorMessage[1]}
        />
      </div>
    </div>
  );
};

// 自定义文本框数量 (or)
const DiyInput = ({ handleSave, index, value, error }) => {
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

export const CustomerInput = connect(null, { getNewSearch })(DiyInput);
