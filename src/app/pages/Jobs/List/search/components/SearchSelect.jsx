import React, { useState, useEffect, useRef } from 'react';
import { connect, useSelector, useDispatch } from 'react-redux';
import Select from 'react-select';
import { useTranslation } from 'react-i18next';

import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Button, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import DatePicker from 'react-datepicker';
import DateRangePicker from 'react-dates/esm/components/DateRangePicker';
import { isNum } from '../../../../../../utils/search';
import {
  jobUserRoles,
  currency as currencyOptions,
  payRateUnitTypes,
  GeneralType,
} from '../../../../../constants/formOptions';
import FormReactSelectContainer from '../../../../../components/particial/FormReactSelectContainer';
import FormInput from '../../../../../components/particial/FormInput';

/**
 *
 * @param  options: {value,label}
 *
 */

const style = {
  position: {
    position: 'fixed',
    display: 'flex',
    justifyContent: 'space-between',
    minHeight: '30px',
    width: '348px',
    zIndex: 100,
    flexShrink: 0,
    marginBottom: 40,
  },
  flex: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
  },
};

const searchStyles = makeStyles({
  root: {
    borderRadius: '10px',
  },
  position: {
    position: 'fixed',
    display: 'flex',
    justifyContent: 'space-between',
    minHeight: '30px',
    width: '348px',
    zIndex: 100,
    flexShrink: 0,
    marginBottom: 40,
  },
  inputRoot: {
    borderRadius: '0 !important',
  },
  inputFocused: {
    border: '0',
  },
  select: {
    width: '320px',
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
  selects: {
    width: '160px',
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
  mb10: {
    marginBottom: '8px',
  },
  error: {
    '& .form-error': {
      marginTop: 0,
    },
    '& .Select-menu-outer': {
      width: '160px !important',
    },
  },
  rate: {
    display: 'flex',
    width: '320px',
    justifyContent: 'space-between',
    '& .selects': {
      width: '145px',
    },
    '& .times': {
      width: '73px',
    },
  },
  money: {
    display: 'flex',
    width: '320px',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: '53px',
    '& .foundation': {
      width: '145px',
      '& input': {
        marginBottom: '0px !important',
      },
      '& .form-error': {
        marginTop: '0px',
      },
    },
  },
  span: {
    height: '30px',
    lineHeight: '30px',
  },
  date: {
    width: '330px !important',
    // '& .DateInput__small': {
    //   width: '155px',
    //   border: '1px solid #d0d0d0',
    // },
    // '& .DateRangePickerInput_arrow': {
    //   display: 'none',
    // },
    // '& .DateRangePickerInput': {
    //   width: '320px',
    //   display: 'flex',
    //   justifyContent: 'space-between',
    // },
    // '& .DateRangePickerInput__withBorder': {
    //   border: '0px',
    // },
    '& .react-datepicker-wrapper': {
      paddingRight: '10px',
    },
  },
  autocomplete: {
    width: '281px',
    '& .MuiInputBase-root': {
      minHeight: '32px',
      padding: 0,
    },
    '& .MuiAutocomplete-inputRoot': {
      padding: 0,
    },
    '& .MuiOutlinedInput-marginDense': {
      padding: '0px !important',
    },
  },
  selectHeight: {
    '& .Select-input': {
      height: '30px',
    },
    '& .Select-value': {
      lineHeight: '30px !important',
    },
    '& .Select-control': {
      height: '30px',
    },
  },
  display: {
    '& .Select-arrow-zone': {
      display: 'none',
    },
  },
});

// 单选
export const SelectInput = ({
  options,
  handleSave,
  data,
  width = 320,
  show,
}) => {
  const classes = searchStyles();

  const { newSearchJobs } = useSelector((state) => state.controller);
  const nowValue = newSearchJobs.toJS().basicSearch;

  const [values, setValues] = useState({});
  const [option, setOption] = useState(options);

  let reduxData = nowValue[data['field']];

  // 回显
  useEffect(() => {
    if (reduxData) {
      if (show) {
        setValues(...reduxData);
      } else {
        setValues({});
      }
    }
  }, [show]);

  // 回传
  useEffect(() => {
    if (values) {
      option.forEach((item) => {
        if (item.value == values) {
          handleSave([item]);
        }
      });
    }
  }, [values]);

  return (
    <div>
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
        style={{ width }}
        placeholder={'select'}
        className={classes.select}
      />
    </div>
  );
};

export const CompanySelect = ({
  options,
  handleSave,
  data,
  width = 320,
  show,
}) => {
  const classes = searchStyles();

  const { newSearchJobs } = useSelector((state) => state.controller);
  const nowValue = newSearchJobs.toJS().basicSearch;

  const [values, setValues] = useState({});
  const [option, setOption] = useState(options);

  let reduxData = nowValue[data['field']];

  // 回显
  useEffect(() => {
    if (reduxData) {
      if (show) {
        setValues(...reduxData);
      } else {
        setValues({});
      }
    }
  }, [show]);

  // 回显
  useEffect(() => {
    let arr = [];
    if (options) {
      setOption(options);
      console.log(options);
    }
  }, [options]);

  // 回传
  useEffect(() => {
    if (values) {
      option.forEach((item) => {
        if (item.value == values) {
          handleSave([item]);
        }
      });
    }
  }, [values]);

  return (
    <div>
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
        style={{ width }}
        placeholder={'select'}
        className={classes.select}
      />
    </div>
  );
};

// 多选选择器
export const SelectBox = ({ handleSave, data, options, show }) => {
  const classes = searchStyles();
  const { newSearchJobs, newSearchOptions } = useSelector(
    (state) => state.controller
  );
  const nowValue = newSearchJobs.toJS().basicSearch;

  const [query, setQuery] = useState();
  const [params, setParams] = useState([]);
  const [option, setOption] = useState([]);

  let reduxData = nowValue[data['field']];
  // 回显
  useEffect(() => {
    if (reduxData) {
      if (show) {
        setParams(reduxData);
      } else {
        setParams([]);
      }
    }
    if (options) {
      setOption(options);
    }
  }, [options, show]);

  // 回传
  useEffect(() => {
    handleSave(params);
  }, [params]);

  const changeIndustry = (e) => {
    setParams(e);
  };

  return (
    <>
      <Autocomplete
        style={{ width: 320 }}
        multiple
        ChipProps={{ size: 'small' }}
        classes={{
          root: classes.root,
          inputRoot: classes.inputRoot,
          inputFocused: classes.inputFocused,
        }}
        className={classes.autocomplete}
        limitTags={1}
        disableCloseOnSelect
        options={option}
        loading={options.length > 0 ? false : true}
        getOptionLabel={(option) => {
          return `${option.label}`;
        }}
        getOptionSelected={(option, value) => option.value === value.value}
        renderOption={(option, state) => {
          return (
            <React.Fragment>
              <Checkbox
                color="primary"
                size="small"
                checked={state.selected}
                style={{ marginLeft: -12 }}
              />
              <Typography variant="body2">{option.label}</Typography>
            </React.Fragment>
          );
        }}
        value={params}
        onChange={(e, newValue) => {
          changeIndustry(newValue);
        }}
        renderInput={(params) => {
          return (
            <TextField
              {...params}
              value={query}
              size="small"
              onChange={(e) => setQuery(e.target.label)}
              InputProps={{
                ...params.InputProps,
              }}
              variant="outlined"
            />
          );
        }}
      />
    </>
  );
};

// time 时间段选择
export const TimePick = ({ handleSave, data, show }) => {
  const { newSearchJobs } = useSelector((state) => state.controller);
  const nowValue = newSearchJobs.toJS().basicSearch;
  const classes = searchStyles();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [time, setTime] = useState({});
  const [focusedInput, setFocusedInput] = useState(null);

  // 回显
  useEffect(() => {
    if (nowValue[data['field']]) {
      if (show) {
        nowValue[data['field']].from &&
          setStartDate(moment(nowValue[data['field']].from));
        nowValue[data['field']].to &&
          setEndDate(moment(nowValue[data['field']].to));
      } else {
        setTime({});
      }
    }
  }, [show]);

  useEffect(() => {
    handleSave(time);
  }, [time]);

  useEffect(() => {
    setTime({
      from: startDate,
      to: endDate,
    });
  }, [startDate, endDate]);

  const handleDateRangeChange = ({ startDate: from, endDate: to }) => {
    setTime({
      from: from,
      to: to,
    });
  };

  const handleFocusChange = (focusedInput) => {
    setFocusedInput(focusedInput);
  };

  return (
    <div className={classes.date} style={style.position}>
      {/* <DateRangePicker
        startDate={time.from} // momentPropTypes.momentObj or null,
        startDateId="your_unique_start_date_id" // PropTypes.string.isRequired,
        endDate={time.to} // momentPropTypes.momentObj or null,
        endDateId="your_unique_end_date_id" // PropTypes.string.isRequired,
        onDatesChange={handleDateRangeChange} // PropTypes.func.isRequired,
        focusedInput={focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
        onFocusChange={handleFocusChange} // PropTypes.func.isRequired,
        small
        isOutsideRange={() => { }}
        displayFormat="MM/DD/YYYY"
      /> */}
      <FormReactSelectContainer>
        <DatePicker
          maxDate={endDate && endDate}
          selected={startDate}
          placeholderText="Start Date"
          onChange={(date) => setStartDate(date)}
          // filterDate={endDate && isWeekday}
          showDisabledMonthNavigation
        />
      </FormReactSelectContainer>
      <FormReactSelectContainer>
        <DatePicker
          selected={endDate}
          placeholderText="End Date"
          minDate={startDate && startDate}
          onChange={(date) => setEndDate(date)}
          showDisabledMonthNavigation
        />
      </FormReactSelectContainer>
    </div>
  );
};

// double select 双选择器 user
export const DoubleSelect = ({
  handleSave,
  options,
  data,
  width = 160,
  msg = [],
  show,
}) => {
  const classes = searchStyles();
  const { newSearchJobs } = useSelector((state) => state.controller);
  const nowValue = newSearchJobs.toJS().basicSearch;

  const [value, setValue] = useState({});
  const [options1, setOptions1] = useState(jobUserRoles);
  const [option, setOption] = useState([]);
  const [errorMessage, setErrorMessage] = useState([]);

  let reduxData = nowValue[data['field']];

  // 回显
  useEffect(() => {
    if (options) {
      let arr = [];
      options.forEach((item) => {
        let obj = {
          label: item.fullName,
          value: item.id,
          option: item,
        };
        if (item.activated) {
          arr.push(obj);
        }
      });
      setOption(arr);
    }
  }, [options]);

  useEffect(() => {
    if (nowValue[data['field']]) {
      if (show) {
        setValue(nowValue[data['field']]);
      } else {
        setValue({});
      }
    }
  }, [show]);

  // 回传

  useEffect(() => {
    if (msg.length != 0) {
      setErrorMessage(msg);
    }
  }, [msg]);

  useEffect(() => {
    handleSave(value);
  }, [value]);

  const handleSave1 = (inpValue) => {
    let data = '';
    options.forEach((item) => {
      if (item.id == inpValue) {
        data = item;
      }
    });
    setValue({ ...value, userId: inpValue, option1: data });
  };

  const handleSave2 = (inpValue) => {
    let data = '';
    options1.forEach((item) => {
      if (item.value == inpValue) {
        data = item;
      }
    });
    setValue({ ...value, role: inpValue, option2: data });
  };

  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          ...style.position,
          width: '330px',
        }}
        className={classes.error}
      >
        <div style={{ width: '165px' }}>
          <FormReactSelectContainer errorMessage={errorMessage[0]}>
            <Select
              name="industrySelect"
              value={value.userId}
              onChange={(industry) => {
                handleSave1(industry);
              }}
              simpleValue
              options={option}
              searchable
              clearable={false}
              autoBlur={true}
              style={{ width }}
              placeholder={'select'}
              className={classes.selects}
            />
          </FormReactSelectContainer>
        </div>

        <div style={{ width: '165px' }}>
          <FormReactSelectContainer errorMessage={errorMessage[1]}>
            <Select
              name="industrySelect"
              value={value.role}
              onChange={(industry) => {
                handleSave2(industry);
              }}
              simpleValue
              options={options1}
              searchable
              clearable={false}
              autoBlur={true}
              style={{ width }}
              placeholder={'select'}
              className={classes.selects}
            />
          </FormReactSelectContainer>
        </div>
      </div>
    </>
  );
};

// 文本框输入 & 选择器(多选)
export const SelectsInput = ({ handleSave, data, options, show, language }) => {
  const classes = searchStyles();
  const { newSearchJobs } = useSelector((state) => state.controller);
  const nowValue = newSearchJobs.toJS().basicSearch;

  const [value, setValue] = useState('or');
  const [params, setParams] = useState([]);
  const [query, setQuery] = useState();
  const [option1, setOption1] = useState([]);

  let reduxData = nowValue[data['field']];

  // 回显
  useEffect(() => {
    if (reduxData) {
      if (reduxData.length) {
        let arr = [];
        setValue(reduxData[0]);
        reduxData[1].forEach((item) => {
          arr.push(item);
        });
        if (show) {
          setParams(arr);
        } else {
          setParams([]);
        }
      }
    } else {
      setQuery();
    }
  }, [show]);

  useEffect(() => {
    let arr = [];
    if (options) {
      options.forEach((item) => {
        if (item.children) {
          arr.push({ ...item, title: true });
          item.children.forEach((items) => {
            arr.push({ ...items, title: false });
          });
        }
      });
      setOption1(arr);
    }
  }, [options]);

  // 回传
  useEffect(() => {
    handleSave([value, params]);
  }, [value, params]);

  const option = [
    {
      label: 'or',
      value: 'or',
    },
    {
      label: 'and',
      value: 'and',
    },
  ];

  const changeIndustry = (e) => {
    setParams(e);
  };

  return (
    <div style={style.flex}>
      <Select
        name="industrySelect"
        value={value}
        onChange={(industry) => {
          setValue(industry);
        }}
        simpleValue
        options={option}
        searchable
        clearable={false}
        autoBlur={true}
        style={{ width: 320, marginBottom: 8 }}
        className={classes.selectHeight}
      />
      <Autocomplete
        classes={{
          root: classes.root,
          inputRoot: classes.inputRoot,
          inputFocused: classes.inputFocused,
        }}
        className={classes.autocomplete}
        style={{ width: 320 }}
        multiple
        ChipProps={{ size: 'small' }}
        limitTags={1}
        disableCloseOnSelect
        options={option1}
        loading={option1.length > 0 ? false : true}
        getOptionLabel={(option) => {
          return `${language ? option.label : option.labelCn}`;
        }}
        getOptionDisabled={(option) => !!option.title}
        getOptionSelected={(option, value) => option.id === value.id}
        renderOption={(option, state) => {
          return (
            <React.Fragment>
              {!option.title && (
                <Checkbox
                  color="primary"
                  size="small"
                  checked={state.selected}
                  style={{ marginLeft: -12 }}
                />
              )}
              <Typography variant="body2">
                {language ? option.label : option.labelCn}
              </Typography>
            </React.Fragment>
          );
        }}
        value={params}
        onChange={(e, newValue) => {
          changeIndustry(newValue);
        }}
        renderInput={(params) => {
          return (
            <TextField
              {...params}
              value={query}
              size="small"
              onChange={(e) => setQuery(e.target.value)}
              InputProps={{
                ...params.InputProps,
              }}
              variant="outlined"
            />
          );
        }}
      />
    </div>
  );
};

// require skills
// 文本框输入 & 选择器(多选)
export const RequiredSkill = ({ handleSave, data, options, show }) => {
  const classes = searchStyles();
  const { newSearchJobs } = useSelector((state) => state.controller);
  const nowValue = newSearchJobs.toJS().basicSearch;
  const [t] = useTranslation();

  const [value, setValue] = useState('or');
  const [skill, setSkill] = useState([]);

  let reduxData = nowValue[data['field']];

  // 回显
  useEffect(() => {
    if (reduxData) {
      if (reduxData.length) {
        let arr = [];
        setValue(reduxData[0]);
        if (Array.isArray(reduxData[1])) {
          reduxData[1].forEach((item) => {
            arr.push(item);
          });
        }
        if (show) {
          setSkill(arr);
        } else {
          setSkill([]);
        }
      }
    } else {
    }
  }, [show]);

  // 回传
  useEffect(() => {
    handleSave([value, skill]);
  }, [value, skill]);

  const option = [
    {
      label: 'or',
      value: 'or',
    },
    {
      label: 'and',
      value: 'and',
    },
  ];

  const changeSetSkills = (value) => {
    if (!value) {
      setSkill([]);
      return;
    }
    let arr = [];
    value.split(',').forEach((item) => {
      arr.push({
        skillName: item,
      });
    });
    setSkill(arr);
  };

  const removeErrorMsgHandler = (val) => {
    console.log(val);
  };

  return (
    <div style={style.flex}>
      <Select
        name="industrySelect"
        value={value}
        onChange={(industry) => {
          setValue(industry);
        }}
        simpleValue
        options={option}
        searchable
        clearable={false}
        autoBlur={true}
        style={{ width: 320, marginBottom: 8 }}
      />
      <Select.Creatable
        valueKey="skillName"
        labelKey="skillName"
        value={skill}
        multi
        simpleValue
        placeholder={data.colName}
        onChange={(e) => {
          changeSetSkills(e);
        }}
        promptTextCreator={(label) => `${t('field:skillsCreat')} "${label}"`}
        noResultsText={false}
        style={{ width: 320, marginBottom: 8 }}
        onBlur={() => {
          if (removeErrorMsgHandler) removeErrorMsgHandler('skills');
        }}
        className={classes.display}
      />
    </div>
  );
};

export const RateSalary = ({ width = 320, handleSave, show, data, msg }) => {
  const classes = searchStyles();
  const { newSearchJobs } = useSelector((state) => state.controller);
  const nowValue = newSearchJobs.toJS().basicSearch;

  const [disabled, setDisabled] = useState(true);
  const [type, setType] = useState('Salary');
  const [time, setTime] = useState('HOURLY');
  const [currency, setCurrency] = useState('USD');
  const [isShow, setIsShow] = useState(true);
  const [errorMessage, setErrorMessage] = useState([]);
  const [min, setMin] = useState();
  const [max, setMax] = useState();

  let reduxData = nowValue[data['field']];

  // 回显
  useEffect(() => {
    // reduxData
    if (reduxData) {
      reduxData['currency'] && setCurrency(reduxData['currency']);
      reduxData['time'] && setTime(reduxData['time']);
      reduxData['type'] && setType(reduxData['type']);
      if (show) {
        if (reduxData['money']) {
          if (reduxData['money']['min']) {
            setMin(reduxData['money']['min']);
          }
          if (reduxData['money']['max']) {
            setMax(reduxData['money']['max']);
          }
        }
      }
    }
    console.log(reduxData);
  }, [show]);

  // 为salary判断
  useEffect(() => {
    if (type != 'Salary') {
      setIsShow(false);
      setDisabled(false);
    } else {
      setIsShow(true);
      setDisabled(true);
      setTime('YEARLY');
    }
    console.log(disabled);
  }, [type]);

  // 回传
  useEffect(() => {
    handleSave({
      type,
      time,
      currency,
      money: {
        max,
        min,
      },
    });
  }, [type, time, currency, min, max]);

  useEffect(() => {
    if (msg) {
      setErrorMessage(msg);
    }
  }, [msg]);

  const handleType = (val) => {
    setType(val);
  };

  const handleCurrency = (val) => {
    setCurrency(val);
  };
  const handleTime = (val) => {
    setTime(val);
  };

  const handleMin = (e) => {
    setMin(isNum(e.target.value, 9));
  };

  const handleMax = (e) => {
    setMax(isNum(e.target.value, 9));
  };

  return (
    <>
      <div>
        <div style={{ width: '320px', marginBottom: '12px' }}>
          <FormReactSelectContainer>
            <Select
              name="industrySelect"
              value={type}
              onChange={(industry) => {
                handleType(industry);
              }}
              simpleValue
              options={GeneralType}
              searchable
              clearable={false}
              autoBlur={true}
              style={{ width: 320 }}
              placeholder={'select'}
              className={classes.select}
            />
          </FormReactSelectContainer>
        </div>
        <div className={classes.position}>
          <div className={classes.rate}>
            <FormReactSelectContainer>
              <Select
                labelKey={'label2'}
                name="industrySelect"
                value={currency}
                onChange={(industry) => {
                  handleCurrency(industry);
                }}
                simpleValue
                options={currencyOptions}
                searchable
                clearable={false}
                autoBlur={true}
                placeholder={'select'}
                className="selects"
                // className={classes.select}
              />
            </FormReactSelectContainer>
            {isShow ? (
              <FormReactSelectContainer FormReactSelectContainer>
                <Select
                  name="industrySelect"
                  value={time}
                  onChange={(industry) => {
                    handleTime(industry);
                  }}
                  simpleValue
                  options={payRateUnitTypes}
                  searchable
                  clearable={false}
                  autoBlur={true}
                  className="selects"
                  disabled={disabled}
                  // className={classes.select}
                />
              </FormReactSelectContainer>
            ) : (
              <>
                <FormReactSelectContainer FormReactSelectContainer>
                  <Select
                    name="industrySelect"
                    value={time}
                    onChange={(industry) => {
                      handleTime(industry);
                    }}
                    simpleValue
                    options={payRateUnitTypes}
                    searchable
                    clearable={false}
                    autoBlur={true}
                    className="times"
                    disabled={disabled}
                    // className={classes.select}
                  />
                </FormReactSelectContainer>
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    height: '30px',
                  }}
                >
                  or equivalent
                </span>
              </>
            )}
          </div>
        </div>
        <div className={classes.money}>
          <FormInput
            isRequired={false}
            onChange={(e) => {
              handleMin(e);
            }}
            // value={money.min}
            value={min || ''}
            placeholder="Min"
            errorMessage={errorMessage[0]}
          />
          <span className={classes.span}>-</span>
          <FormInput
            isRequired={false}
            placeholder="Max"
            onChange={(e) => {
              handleMax(e);
            }}
            value={max || ''}
            // defaultValue={money.max}
            errorMessage={errorMessage[1]}
          />
        </div>
      </div>
    </>
  );
};
