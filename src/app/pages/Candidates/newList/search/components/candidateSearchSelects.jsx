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
import DateRangePicker from 'react-dates/esm/components/DateRangePicker';
import DatePicker from 'react-datepicker';
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
    display: 'flex',
    justifyContent: 'space-between',
    minHeight: '30px',
    width: '282px',
    flexShrink: 0,
    flexDirection: 'column',
  },
  timestart: {
    display: 'flex',
    justifyContent: 'space-between',
    minHeight: '30px',
    width: '280px',
    flexShrink: 0,
  },
};

const searchStyles = makeStyles({
  root: {
    borderRadius: '10px',
  },
  flex: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    '& .Select-multi-value-wrapper': {
      height: '30px',
    },
    '& .Select-value': {
      lineHeight: '30px !important',
    },
  },
  position: {
    position: 'fixed',
    display: 'flex',
    justifyContent: 'space-between',
    minHeight: '30px',
    width: '348px',
    zIndex: 1,
    flexShrink: 0,
  },
  inputRoot: {
    borderRadius: '0 !important',
  },
  inputFocused: {
    border: '0',
  },
  select: {
    width: '280px',
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
    width: '130px',
    minHeight: '30px',
    '& .Select-input': {
      height: '30px',
    },
    '& .Select-control': {
      height: '30px',
      marginBottom: '0px',
    },
    '& .Select-value': {
      lineHeight: '30px !important',
    },
    '& .Select-placeholder': {
      height: '30px',
      lineHeight: '30px !important',
    },
    '& .Select-multi-value-wrapper': {
      height: '30px',
      '& .Select-value': {
        marginTop: 0,
        height: '30px',
      },
    },
    '& .create': {
      '& .Select-arrow-zone': {
        display: 'none',
      },
      '& input': {
        paddingTop: '6px',
      },
    },
    '& .is-error': {
      fontSize: '12px',
      fontWeight: 'bold',
      color: '#cc4b37',
    },
    '& .select-error': {
      '& .Select-placeholder': {
        borderColor: '#cc4b37',
        backgroundColor: '#faedeb',
        border: '1px solid #cc4b37',
      },
    },
  },
  mb10: {
    marginBottom: '8px',
  },
  error: {
    '& .form-error': {
      marginTop: '0px',
      marginBottom: '0px',
    },
    '& .Select-menu-outer': {
      width: '135px',
    },
  },
  rate: {
    display: 'flex',
    width: '280px',
    justifyContent: 'space-between',
    '& .selects': {
      width: '125px',
    },
    '& .times': {
      width: '63px',
    },
  },
  money: {
    display: 'flex',
    width: '280px',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    '& .foundation': {
      width: '125px',
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
    // '& >div': {
    '& .foundation': {
      width: '48%',

      // },
    },
    '& .foundation label input[type]': {
      marginBottom: 0,
    },
    // transform: 'translateX(0px)',
    // perspective: '100px',
    // filter: 'grayscale(100)',
    // '& .DateInput__small': {
    //   width: '134px',
    //   border: '1px solid #d0d0d0',
    // },
    // '& .DateRangePickerInput_arrow': {
    //   display: 'none',
    // },
    // '& .DateRangePickerInput': {
    //   width: '281px',
    //   display: 'flex',
    //   justifyContent: 'space-between',
    // },
    // '& .DateRangePickerInput__withBorder': {
    //   border: '0px',
    // },
    // '& .DateRangePicker_picker': {
    //   left: '-200px !important',
    // },
    '& .form-error': {
      fontSize: '12px',
      fontWeight: 'bold',
      color: '#cc4b37',
      marginBottom: 0,
      marginTop: 0,
    },
    '& .is-error': {
      '& .foundation label input[type]': {
        borderColor: '#cc4b37',
        backgroundColor: '#faedeb',
        border: '1px solid #cc4b37',
      },
      '& .DateInput_input': {
        borderColor: '#cc4b37',
        backgroundColor: '#faedeb',
        border: '1px solid #cc4b37',
      },
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
  autoBox: {
    '& .form-error': {
      fontSize: '12px',
      fontWeight: 'bold',
      color: '#cc4b37',
    },
    '& .MuiFormControl-root': {
      borderColor: '#cc4b37 !important',
      backgroundColor: '#faedeb !important',
      border: '1px solid #cc4b37 !important',
    },
  },
});

// 文本框输入 & 选择器(多选)
export const SelectsInput = ({
  handleSave,
  data,
  options,
  index,
  value,
  error,
  language,
}) => {
  const classes = searchStyles();
  const { candidateSelect } = useSelector((state) => state.controller);
  const { languageList } = candidateSelect.toJS();

  const [params, setParams] = useState([]);
  const [query, setQuery] = useState();
  const [option1, setOption1] = useState([]);
  const [errorMessage, setErrorMessage] = useState(['']);

  useEffect(() => {
    if (error) {
      setErrorMessage(error);
    } else {
      setErrorMessage(error);
    }
  }, [error]);

  useEffect(() => {
    setParams([]);
  }, [data]);

  // 回显
  useEffect(() => {
    console.log(value);
    if (value) {
      setParams(...value);
    }
  }, []);

  useEffect(() => {
    if (options) {
      let arr = [];
      options.forEach((item) => {
        if (item.children) {
          arr.push({ ...item, title: true });
          item.children.forEach((items) => {
            arr.push({ ...items, title: false });
          });
        }
      });

      setOption1(arr);
      if (data == 'languages') {
        let arr = [];
        languageList.forEach((item) => {
          if (item.children) {
            arr.push({ ...item, title: true });
            item.children.forEach((items) => {
              arr.push({ ...items, title: false });
            });
          }
        });
        setOption1(arr);
      }
    }
  }, [options]);

  // 回传
  useEffect(() => {
    handleSave([params], index);
  }, [params]);

  const changeIndustry = (e) => {
    setParams(e);
  };

  return (
    <div className={errorMessage[0] ? classes.autoBox : ''}>
      <Autocomplete
        classes={{
          root: classes.root,
          inputRoot: classes.inputRoot,
          inputFocused: classes.inputFocused,
        }}
        className={classes.autocomplete}
        style={{ width: 281 }}
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
      {errorMessage && (
        <span className="form-error is-visible">{errorMessage[0]}</span>
      )}
    </div>
  );
};

export const CurrentSalary = ({
  handleSave,
  data,
  msg,
  index,
  value,
  error,
}) => {
  const classes = searchStyles();
  // const { newCandidateJob } = useSelector((state) => state.controller);
  // const nowValue = newCandidateJob.toJS().basicSearch;

  // const [disabled, setDisabled] = useState(true);

  const [time, setTime] = useState('HOURLY');
  const [currency, setCurrency] = useState('USD');
  // const [isShow, setIsShow] = useState(true);
  const [errorMessage, setErrorMessage] = useState([]);
  const [min, setMin] = useState();
  const [max, setMax] = useState();
  // 具体的金额 range 为false显示
  const [exactAmount, setExactAmount] = useState();
  const [switchValue, setSwitchValue] = useState(true);

  useEffect(() => {
    if (error) {
      setErrorMessage(error);
    } else if (error == false) {
    }
  }, [error]);

  // useEffect(() => {
  //   if (value) {
  //     if (value['money']) {
  //       if (value['money']['min']) {
  //         setMin(value['money']['min']);
  //       }
  //       if (value['money']['max']) {
  //         setMax(value['money']['max']);
  //       }
  //     }
  //   }
  // }, [value]);

  // 回显
  useEffect(() => {
    if (value) {
      if (value['currency']) {
        setCurrency(value['currency']);
      }
      // value['exactAmount'] && setExactAmount(value['exactAmount']);
      // value['open'] && setSwitchValue(value['open'])
      if (value['money']) {
        if (value['money']['min']) {
          setMin(value['money']['min']);
        }
        if (value['money']['max']) {
          setMax(value['money']['max']);
        }
      }

      if (value['time']) {
        setTime(value['time']);
      }
    }
  }, []);

  // 回传
  useEffect(() => {
    console.count('执行了');

    handleSave(
      {
        exactAmount,
        time,
        currency,
        // open: switchValue,
        money: {
          max,
          min,
        },
      },
      index
    );
  }, [exactAmount, time, currency, min, max]);

  useEffect(() => {
    if (msg) {
      setErrorMessage(msg);
    }
  }, [msg]);

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

  const handleMoeny = (e) => {
    setMin(isNum(e.target.value, 9));
    setMax(isNum(e.target.value, 9));
  };

  const handleChange = (e) => {
    setSwitchValue(e.target.checked);
    if (e.target.checked == false) {
      setMax(null);
      setMin(null);
    } else {
      setMax(null);
      setMin(null);
    }
  };

  return (
    <div>
      {/* <div style={{ marginLeft: '200px' }}>
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
      </div> */}
      <div>
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
            errorMessage={errorMessage && errorMessage[0]}
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
            errorMessage={errorMessage && errorMessage[1]}
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
            value={min || ''}
            placeholder="Money"
            errorMessage={errorMessage && errorMessage[0]}
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
  width = 280,

  index,
  value,
  error,
}) => {
  const classes = searchStyles();

  const { candidateSelect } = useSelector((state) => state.controller);
  const { companyOptions } = candidateSelect.toJS();

  const [values, setValues] = useState({});
  const [params, setParams] = useState([]);
  const [option, setOption] = useState(options);
  const [errorMessage, setErrorMessage] = useState(['']);

  useEffect(() => {
    if (error) {
      setErrorMessage(error);
    }
  }, [error]);

  // 回显
  useEffect(() => {
    if (value) {
      setParams(...value);
    }
  }, []);

  // 回显
  useEffect(() => {
    if (options) {
      setOption(options);
    }
    if (data == 'currentCompany') {
      setOption(companyOptions);
    }
  }, [options]);

  // 回传
  useEffect(() => {
    if (params) {
      option.forEach((item) => {
        if (item.value == params) {
          handleSave([item, params], index);
        }
      });
    }
  }, [params]);

  return (
    <div>
      <Select
        name="industrySelect"
        value={params}
        onChange={(industry) => {
          setParams(industry);
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
      {errorMessage[0] && (
        <span className="form-error is-visible">{errorMessage}</span>
      )}
    </div>
  );
};

// 文本框输入 & 选择器(多选)
export const RequiredSkill = ({ handleSave, data, index, value, error }) => {
  const classes = searchStyles();
  const [errorMessage, setErrorMessage] = useState();

  const [t] = useTranslation();
  const [skill, setSkill] = useState([]);

  useEffect(() => {
    setSkill([]);
  }, [data]);

  // 回显
  useEffect(() => {
    if (value) {
      setSkill(value);
    }
  }, []);

  useEffect(() => {
    if (error) {
      setErrorMessage(error);
    } else if (error == false) {
      setErrorMessage('');
    }
  }, [error]);

  // 回传
  useEffect(() => {
    handleSave(skill, index);
  }, [skill]);

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
    <div className={classes.selects}>
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
        style={{ width: 280 }}
        className={!!errorMessage ? 'create select-error' : 'create'}
        onBlur={() => {
          if (removeErrorMsgHandler) removeErrorMsgHandler('skills');
        }}
      />
      {errorMessage && <span className="is-error">{errorMessage}</span>}
    </div>
  );
};

// time 时间段选择
export const TimePick = ({ handleSave, data, index, value, error }) => {
  const classes = searchStyles();
  const [errorMessage, setErrorMessage] = useState(['']);
  const [time, setTime] = useState({});
  const [focusedInput, setFocusedInput] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    if (error) {
      setErrorMessage(error);
    }
  }, [error]);

  useEffect(() => {
    // if (value['from'] && value['to']) {
    //   setTime({
    //     from: moment(new Date(value['from']).getTime()),
    //     to: moment(new Date(value['to']).getTime()),
    //   });
    // } else if (value['from']) {
    //   setTime({
    //     from: moment(new Date(value['from']).getTime()),
    //   });
    // } else if (value['to']) {
    //   setTime({
    //     to: moment(new Date(value['to']).getTime()),
    //   });
    // }
    if (value['from']) {
      setStartDate(moment(value['from']));
    }
    if (value['to']) {
      setEndDate(moment(value['to']));
    }
  }, []);

  useEffect(() => {
    setTime({
      from: startDate,
      to: endDate,
    });
  }, [startDate, endDate]);

  useEffect(() => {
    handleSave(time, index);
  }, [time]);

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
    <div className={classes.date}>
      <div
        style={style.timestart}
        className={!!errorMessage[0] ? 'is-error' : ''}
      >
        {/* <DateRangePicker
          startDate={time.from} // momentPropTypes.momentObj or null,
          startDateId="your_unique_start_date_id" // PropTypes.string.isRequired,
          endDate={time.to} // momentPropTypes.momentObj or null,
          endDateId="your_unique_end_date_id" // PropTypes.string.isRequired,
          onDatesChange={handleDateRangeChange} // PropTypes.func.isRequired,
          focusedInput={focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
          onFocusChange={handleFocusChange} // PropTypes.func.isRequired,
          small
          isOutsideRange={() => {}}
          displayFormat="MM/DD/YYYY"
        /> */}
        <FormReactSelectContainer
          errorMessage={errorMessage[0] && errorMessage}
        >
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
        {/* {errorMessage[0] && (
          <span className="form-error is-visible">{errorMessage}</span>
        )} */}
      </div>
    </div>
  );
};

// 多选择器
export const SelectMore = ({
  handleSave,
  data,
  options,
  index,
  value,
  error,
}) => {
  const classes = searchStyles();
  const { newCandidateJob, candidateSelect } = useSelector(
    (state) => state.controller
  );

  const [query, setQuery] = useState();
  const [params, setParams] = useState([]);
  const [option, setOption] = useState([]);
  const [errorMessage, setErrorMessage] = useState(['']);

  const { degreeList } = candidateSelect.toJS();

  useEffect(() => {
    if (error) {
      setErrorMessage([error]);
    }
  }, [error]);

  useEffect(() => {
    setParams([]);
  }, [data]);

  // 回显
  useEffect(() => {
    console.log(data);
    if (options) {
      setOption(options);
    }
    if (data == 'degrees') {
      setOption(degreeList);
    }
  }, [options]);

  useEffect(() => {
    if (value) {
      setParams(value);
    }
  }, []);

  // 回传
  useEffect(() => {
    handleSave(params, index);
  }, [params]);

  const changeIndustry = (e) => {
    setParams(e);
  };

  return (
    <div className={errorMessage[0] != '' ? classes.autoBox : ''}>
      <Autocomplete
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
      {errorMessage && (
        <span className="form-error is-visible">{errorMessage}</span>
      )}
    </div>
  );
};

export const SelectMore2 = ({
  handleSave,
  data,
  options,
  index,
  value,
  error,
}) => {
  const classes = searchStyles();
  const { newCandidateJob, candidateSelect } = useSelector(
    (state) => state.controller
  );

  const [query, setQuery] = useState();
  const [params, setParams] = useState([]);
  const [option, setOption] = useState([]);
  const [errorMessage, setErrorMessage] = useState(['']);

  const { allUserOptions } = candidateSelect.toJS();

  useEffect(() => {
    if (error) {
      setErrorMessage([error]);
    }
  }, [error]);

  useEffect(() => {
    setParams([]);
  }, [data]);

  // 回显
  useEffect(() => {
    if (options) {
      setOption(options);
    }
    console.log(data);
    if (
      data == 'createBy' ||
      data == 'recruiter' ||
      data == 'dm' ||
      data == 'am' ||
      data == 'owner'
    ) {
      setOption(allUserOptions);
    }
  }, [options]);

  useEffect(() => {
    if (value) {
      setParams(value);
    }
  }, []);

  // 回传
  useEffect(() => {
    handleSave(params, index);
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
    <div className={errorMessage[0] != '' ? classes.autoBox : ''}>
      <Autocomplete
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
      {errorMessage && (
        <span className="form-error is-visible">{errorMessage}</span>
      )}
    </div>
  );
};

export const SelectMore3 = ({
  handleSave,
  data,
  options,
  index,
  value,
  error,
}) => {
  const classes = searchStyles();
  const { newCandidateJob, candidateSelect } = useSelector(
    (state) => state.controller
  );

  const [query, setQuery] = useState();
  const [params, setParams] = useState([]);
  const [option, setOption] = useState([]);
  const [errorMessage, setErrorMessage] = useState(['']);

  const { allUserOptions } = candidateSelect.toJS();

  useEffect(() => {
    if (error) {
      setErrorMessage([error]);
    }
  }, [error]);

  useEffect(() => {
    setParams([]);
  }, [data]);

  // 回显
  useEffect(() => {
    if (options) {
      let res = options.filter((item) => {
        return item.activated == true;
      });
      setOption(res);
    }
    if (
      data == 'recruiter' ||
      data == 'dm' ||
      data == 'am' ||
      data == 'owner'
    ) {
      let res = allUserOptions.filter((item) => {
        return item.activated == true;
      });
      setOption(res);
    }
  }, [options]);

  useEffect(() => {
    if (value) {
      setParams(value);
    }
  }, []);

  // 回传
  useEffect(() => {
    handleSave(params, index);
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
    <div className={errorMessage[0] != '' ? classes.autoBox : ''}>
      <Autocomplete
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
      {errorMessage && (
        <span className="form-error is-visible">{errorMessage}</span>
      )}
    </div>
  );
};
