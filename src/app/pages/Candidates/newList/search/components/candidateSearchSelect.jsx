import React, { useState, useEffect, useRef } from 'react';
import { connect, useSelector, useDispatch } from 'react-redux';
import Select from 'react-select';

import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Button, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { useTranslation } from 'react-i18next';
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
import { set } from 'immutable';
import moment from 'moment';

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
    marginTop: '60px',
    '& .foundation': {
      width: '145px',
      '& input': {
        marginBottom: '0px !important',
      },
      '& .form-error': {
        marginTop: '0px',
        marginBottom: '0px',
      },
    },
  },

  money1: {
    // position:'absolute',
    marginTop: '60px',
    width: '320px',
    '& .foundation': {
      '& input': {
        marginBottom: '0px !important',
      },
      '& .form-error': {
        marginTop: '0px',
        marginBottom: '0px',
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
      '& .Select-arrow-zone': {
        paddingRight: '14px',
      },
    },
  },
  display: {
    '& .Select-arrow-zone': {
      display: 'none',
    },
  },
});

// 文本框输入 & 选择器(多选)
export const SelectsInput = ({ handleSave, data, options, show, language }) => {
  const classes = searchStyles();
  const { newCandidateJob } = useSelector((state) => state.controller);
  const nowValue = newCandidateJob.toJS().basicSearch;

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

export const CurrentSalary = ({ width = 320, handleSave, show, data, msg }) => {
  const classes = searchStyles();
  const { newCandidateJob } = useSelector((state) => state.controller);
  const nowValue = newCandidateJob.toJS().basicSearch;

  const [disabled, setDisabled] = useState(true);

  const [time, setTime] = useState('HOURLY');
  const [currency, setCurrency] = useState('USD');
  const [isShow, setIsShow] = useState(true);
  const [errorMessage, setErrorMessage] = useState([]);
  const [min, setMin] = useState();
  const [max, setMax] = useState();
  const [number, setNumber] = useState();
  // 具体的金额 range 为false显示
  const [exactAmount, setExactAmount] = useState();
  const [switchValue, setSwitchValue] = useState(false);

  let reduxData = nowValue[data['field']];

  // 回显
  useEffect(() => {
    // reduxData
    if (reduxData) {
      reduxData['currency'] && setCurrency(reduxData['currency']);
      reduxData['time'] && setTime(reduxData['time']);
      reduxData['open'] && setSwitchValue(reduxData['open']);
      if (show) {
        if (reduxData['money']) {
          if (reduxData['money']['min']) {
            setMin(reduxData['money']['min']);
          }
          if (reduxData['money']['max']) {
            setMax(reduxData['money']['max']);
          }
          if (reduxData['money']['number']) {
            setNumber(reduxData['money']['number']);
          }
        }
      }
    }
  }, [show]);

  // 回传
  useEffect(() => {
    handleSave({
      time,
      currency,
      open: switchValue,
      money: {
        max,
        min,
        number,
      },
    });
  }, [time, currency, min, max, number, switchValue]);

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
    if (e.target.value != '') {
      setErrorMessage([]);
    }
  };

  const handleMax = (e) => {
    setMax(isNum(e.target.value, 9));
    if (e.target.value != '') {
      setErrorMessage([]);
    }
  };

  const handleMoeny = (e) => {
    // setMin(isNum(e.target.value, 9));
    // setMax(isNum(e.target.value, 9));
    setNumber(isNum(e.target.value, 9));
    if (e.target.value != '') {
      setErrorMessage([]);
    }
  };

  const handleChange = (e) => {
    setSwitchValue(e.target.checked);
    if (e.target.checked == false) {
      setMax(null);
      setMin(null);
      setErrorMessage([]);
    } else {
      // setMax(null);
      // setMin(null);
      setNumber(null);
      setErrorMessage([]);
    }
  };

  return (
    <div>
      <div style={{ marginLeft: '240px' }}>
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
          label="Range"
          labelPlacement="start"
        />
      </div>
      <div style={{ width: '320px', marginBottom: '12px' }}>
        {/* <FormReactSelectContainer>
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
        </FormReactSelectContainer> */}
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
              // disabled={disabled}
              // className={classes.select}
            />
          </FormReactSelectContainer>
        </div>
      </div>
      {switchValue ? (
        <div className={classes.money}>
          <FormInput
            isRequired={false}
            onChange={(e) => {
              handleMin(e);
            }}
            // value={money.min}
            value={min || ''}
            placeholder={'Min'}
            errorMessage={errorMessage[0]}
          />
          <span className={classes.span}>-</span>
          <FormInput
            isRequired={false}
            placeholder={'Max'}
            onChange={(e) => {
              handleMax(e);
            }}
            value={max || ''}
            // defaultValue={money.max}
            errorMessage={errorMessage[1]}
          />
        </div>
      ) : (
        <div className={classes.money1}>
          <FormInput
            isRequired={false}
            onChange={(e) => {
              handleMoeny(e);
            }}
            // value={money.min}
            value={number || ''}
            placeholder="Money"
            errorMessage={errorMessage[0]}
          />
        </div>
      )}
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

  const { newCandidateJob } = useSelector((state) => state.controller);
  const nowValue = newCandidateJob.toJS().basicSearch;

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

// 文本框输入 & 选择器(多选)
export const RequiredSkill = ({ handleSave, data, options, show }) => {
  const classes = searchStyles();
  const { newCandidateJob } = useSelector((state) => state.controller);
  const nowValue = newCandidateJob.toJS().basicSearch;
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
        placeholder=""
        onChange={(e) => {
          changeSetSkills(e);
        }}
        promptTextCreator={(label) => `${t('field:skillsCreat')} "${label}"`}
        noResultsText={false}
        style={{ width: 320, marginBottom: 8 }}
        className={classes.display}
        onBlur={() => {
          if (removeErrorMsgHandler) removeErrorMsgHandler('skills');
        }}
      />
    </div>
  );
};

// commonPool中Company

export const CommonPoolCompanyList = ({
  handleSave,
  data,
  options,
  show,
  msg,
}) => {
  const classes = searchStyles();
  const { newCandidateJob } = useSelector((state) => state.controller);
  const nowValue = newCandidateJob.toJS().basicSearch;
  const [t] = useTranslation();
  const [value, setValue] = useState('');
  const [skill, setSkill] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [errorMessage, setErrorMessage] = useState([]);
  let reduxData = nowValue[data['field']];
  useEffect(() => {
    if (msg) {
      setErrorMessage(msg);
    }
  }, [msg]);
  // 回显
  useEffect(() => {
    if (reduxData) {
      if (reduxData.length) {
        let arr = [];
        setValue(reduxData[0]);
        setInputValue(reduxData[1]);
        // if (Array.isArray(reduxData[1])) {
        //   reduxData[1].forEach((item) => {
        //     arr.push(item);
        //   });
        // }
        // if (show) {
        //   setSkill(arr);
        // } else {
        //   setSkill([]);
        // }
      }
    } else {
    }
  }, [show]);

  // 回传
  useEffect(() => {
    handleSave([value, inputValue]);
  }, [value, inputValue]);

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
        placeholder="Please select"
      />
      {/* <input
        style={{
          width: 320,
          marginBottom: 8,
          height: 37,
          display: 'inline-block',
          border: '1px solid #d0d0d0',
          color: '#505050',
          outline: 'none',
          textIndent: 10,
        }}
        type="text"
        placeholder="Enter a company name"
        onChange={(e) => {
          setInputValue(e.target.value);
          console.log(e.target.value);
        }}
      /> */}
      <FormInput
        style={{ width: 320, marginBottom: 8 }}
        placeholder="Enter a company name"
        value={inputValue}
        errorMessage={errorMessage[0]}
        onChange={(e) => {
          setInputValue(e.target.value);
        }}
      />
    </div>
  );
};

// time 时间段选择
export const TimePick = ({ handleSave, data, show }) => {
  const { newCandidateJob } = useSelector((state) => state.controller);
  const nowValue = newCandidateJob.toJS().basicSearch;
  const classes = searchStyles();
  const [time, setTime] = useState({});
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // const isWeekday = (date) => {
  //   let day = date.format('X')
  //   let endDateX = endDate.format('X')
  //   return endDateX >= day
  // };

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

// 多选择器
export const SelectMore = ({ handleSave, data, options, show }) => {
  const classes = searchStyles();
  const { newCandidateJob, newSearchOptions } = useSelector(
    (state) => state.controller
  );
  const nowValue = newCandidateJob.toJS().basicSearch;

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

export const SelectMore2 = ({ handleSave, data, options, show }) => {
  const classes = searchStyles();
  const { newCandidateJob, newSearchOptions } = useSelector(
    (state) => state.controller
  );
  const nowValue = newCandidateJob.toJS().basicSearch;

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

  const isChinese = (str) => {
    if (/^[\u3220-\uFA29]+$/.test(str)) {
      return true;
    } else {
      return false;
    }
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
          return `${
            isChinese(option.firstName)
              ? option.lastName + ' ' + option.firstName
              : option.firstName + ' ' + option.lastName
          } `;
        }}
        getOptionSelected={(option, value) => option.id === value.id}
        renderOption={(option, state) => {
          return (
            <React.Fragment>
              <Checkbox
                color="primary"
                size="small"
                checked={state.selected}
                style={{ marginLeft: -12 }}
              />
              <Typography variant="body2">
                {isChinese(option.firstName)
                  ? option.lastName + ' ' + option.firstName
                  : option.firstName + ' ' + option.lastName}
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

export const SelectMore3 = ({ handleSave, data, options, show }) => {
  const classes = searchStyles();
  const { newCandidateJob, newSearchOptions } = useSelector(
    (state) => state.controller
  );
  const nowValue = newCandidateJob.toJS().basicSearch;

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
      let res = options.filter((item) => {
        return item.activated == true;
      });
      setOption(res);
    }
  }, [options, show]);

  // 回传
  useEffect(() => {
    handleSave(params);
  }, [params]);

  const changeIndustry = (e) => {
    setParams(e);
  };

  const isChinese = (str) => {
    if (/^[\u3220-\uFA29]+$/.test(str)) {
      return true;
    } else {
      return false;
    }
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
          return `${
            isChinese(option.firstName)
              ? option.lastName + ' ' + option.firstName
              : option.firstName + ' ' + option.lastName
          }`;
        }}
        getOptionSelected={(option, value) => option.id === value.id}
        renderOption={(option, state) => {
          return (
            <React.Fragment>
              <Checkbox
                color="primary"
                size="small"
                checked={state.selected}
                style={{ marginLeft: -12 }}
              />
              <Typography variant="body2">
                {isChinese(option.firstName)
                  ? option.lastName + ' ' + option.firstName
                  : option.firstName + ' ' + option.lastName}
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
