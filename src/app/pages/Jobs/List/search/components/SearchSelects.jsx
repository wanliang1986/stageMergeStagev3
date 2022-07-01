import React, { useState, useEffect, useRef } from 'react';
import { connect, useSelector, useDispatch } from 'react-redux';
import Select from 'react-select';
import moment from 'moment';
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
  jobStatus,
  jobType as newJobType,
  jobUserRoles,
  currency as currencyOptions,
  payRateUnitTypes,
  GeneralType,
} from '../../../../../constants/formOptions';
import FormReactSelectContainer from '../../../../../components/particial/FormReactSelectContainer';
import FormInput from '../../../../../components/particial/FormInput';

const jobStatusOptions = jobStatus.filter((status) => !status.disabled);
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
      width: '115px',
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
    },
    '& .is-input': {
      '& .foundation label input[type]': {
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

// 单选
export const SelectInputs = ({
  options,
  handleSave,
  data,
  width = 280,
  show,
}) => {
  const classes = searchStyles();

  const { newSearchJobs } = useSelector((state) => state.controller);
  const nowValue = newSearchJobs.toJS().basicSearch;

  const [values, setValues] = useState({});
  const [option, setOption] = useState(options || []);

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
    setOption(options);
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

export const CompanySelect = ({
  options,
  handleSave,
  data,
  index,
  value,
  error,
}) => {
  const classes = searchStyles();

  const { newSearchOptions } = useSelector((state) => state.controller);
  const { companyOptions } = newSearchOptions.toJS();
  const [option, setOption] = useState(options);
  const [params, setParams] = useState([]);
  const [query, setQuery] = useState();
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
    if (data == 'companyId') {
      setOption(companyOptions);
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
    <div className={!!errorMessage[0] ? classes.autoBox : ''}>
      <Autocomplete
        className={classes.autocomplete}
        classes={{
          root: classes.root,
          inputRoot: classes.inputRoot,
          inputFocused: classes.inputFocused,
        }}
        style={{ width: 282 }}
        multiple
        ChipProps={{ size: 'small' }}
        limitTags={1}
        disableCloseOnSelect
        options={option}
        loading={option.length > 0 ? false : true}
        getOptionLabel={(option) => {
          return `${option.label}`;
        }}
        getOptionDisabled={(option) => !!option.title}
        getOptionSelected={(option, value) => option.value === value.value}
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
              onChange={(e) => setQuery(e.target.value)}
              InputProps={{
                ...params.InputProps,
              }}
              variant="outlined"
            />
          );
        }}
      />
      {errorMessage[0] && (
        <span className="form-error is-visible">{errorMessage}</span>
      )}
    </div>
  );
};

// 多选选择器
export const SelectBox = ({
  handleSave,
  data,
  options,
  index,
  value,
  error,
}) => {
  const classes = searchStyles();
  const { newSearchJobs, newSearchOptions } = useSelector(
    (state) => state.controller
  );

  const [query, setQuery] = useState();
  const [params, setParams] = useState([]);
  const [option, setOption] = useState([]);
  const [errorMessage, setErrorMessage] = useState(['']);

  const { degreeOptions } = newSearchOptions.toJS();
  const { allOrMy } = newSearchJobs.toJS();

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
    if (data == 'minimumDegreeLevel') {
      setOption(degreeOptions);
    }
    if (data == 'type') {
      let arr = [];
      if (!allOrMy) {
        arr = newJobType.filter((_item) => _item.value != 'PAY_ROLL');
      } else {
        arr = newJobType;
      }
      setOption(arr);
    }
    if (data == 'status') {
      setOption(jobStatusOptions);
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
        className={classes.autocomplete}
        classes={{
          root: classes.root,
          inputRoot: classes.inputRoot,
          inputFocused: classes.inputFocused,
        }}
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

// 多选选择器
export const SelectBox1 = ({ handleSave, data, options, index, value }) => {
  const classes = searchStyles();
  const [query, setQuery] = useState();
  const [params, setParams] = useState([]);
  const [option, setOption] = useState([]);

  // 回显
  useEffect(() => {
    if (options) {
      setOption(options);
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
    <>
      <Autocomplete
        multiple
        ChipProps={{ size: 'small' }}
        className={classes.autocomplete}
        classes={{
          root: classes.root,
          inputRoot: classes.inputRoot,
          inputFocused: classes.inputFocused,
        }}
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

// 多选选择器
export const SelectBox2 = ({ handleSave, data, options, index, value }) => {
  const classes = searchStyles();
  const [query, setQuery] = useState();
  const [params, setParams] = useState([]);
  const [option, setOption] = useState([]);

  // 回显
  useEffect(() => {
    if (options) {
      setOption(options);
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
    <>
      <Autocomplete
        multiple
        ChipProps={{ size: 'small' }}
        className={classes.autocomplete}
        classes={{
          root: classes.root,
          inputRoot: classes.inputRoot,
          inputFocused: classes.inputFocused,
        }}
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
    if (value['from']) {
      setStartDate(moment(value['from']));
      // if (value['from'] && value['to']) {
      //   setTime({
      //     from: moment((value['from'])),
      //     to: moment((value['to'])),
      //   });
      // } else if (value['from']) {
      //   setTime({
      //     from: moment((value['from'])),
      //   });
      // } else if (value['to']) {
      //   setTime({
      //     to: moment((value['to'])),
      //   });
      // }
      // setStartDate(moment(value['from']));
      // setEndDate(moment(value['to']));
    }
    if (value['to']) {
      setEndDate(moment(value['to']));
    }
  }, []);

  useEffect(() => {
    console.log(time);
    handleSave(time, index);
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
          isOutsideRange={() => { }}
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
      </div>
      {/* {errorMessage[0] && (
        <span className="form-error is-visible">{errorMessage}</span>
      )} */}
    </div>
  );
};

// double select 双选择器 user
export const DoubleSelect = ({
  handleSave,
  options,
  data,
  width = 135,
  msg = [],
  index,
  values,
  error,
}) => {
  const classes = searchStyles();
  const { newSearchOptions } = useSelector((state) => state.controller);
  const { allUserOptions } = newSearchOptions.toJS();

  const [value, setValue] = useState({});
  const [options1, setOptions1] = useState(jobUserRoles);
  const [option, setOption] = useState([]);
  const [errorMessage, setErrorMessage] = useState(['', '']);

  useEffect(() => {
    if (error) {
      setErrorMessage(error);
    }
  }, [error]);

  useEffect(() => {
    if (values['msg']) {
      setErrorMessage(values['msg']);
    }
  }, [values]);

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
        arr.push(obj);
      });
      setOption(arr);
    }

    if (data == 'assignedUsers') {
      let arr = [];
      allUserOptions.forEach((item) => {
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
    if (values) {
      if (values['role'] && values['userId']) {
        setValue({
          role: values['role'],
          userId: values['userId'],
          option1: values['option1'],
          option2: values['option2'],
        });
      } else if (values['role']) {
        setValue({
          role: values['role'],
          option2: values['option2'],
        });
      } else if (values['userId']) {
        setValue({
          userId: values['userId'],
          option1: values['option1'],
        });
      }
    }
  }, []);

  // 回传

  useEffect(() => {
    if (msg.length != 0) {
      setErrorMessage(msg);
    }
  }, [msg]);

  useEffect(() => {
    handleSave(value, index);
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
          width: '270px',
          minHeight: '30px',
        }}
        className={classes.error}
      >
        <FormReactSelectContainer
          errorMessage={errorMessage && errorMessage[0]}
        >
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

        <FormReactSelectContainer
          errorMessage={errorMessage && errorMessage[1]}
        >
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
    </>
  );
};

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
  const { newSearchOptions } = useSelector((state) => state.controller);
  const { languagesOptions } = newSearchOptions.toJS();

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
    }

    if (data == 'preferredLanguages' || data == 'requiredLanguages') {
      let arr = [];
      languagesOptions.forEach((item) => {
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
    handleSave([params], index);
  }, [params]);

  const changeIndustry = (e) => {
    setParams(e);
  };

  return (
    <div className={errorMessage[0] ? classes.autoBox : ''}>
      <Autocomplete
        className={classes.autocomplete}
        classes={{
          root: classes.root,
          inputRoot: classes.inputRoot,
          inputFocused: classes.inputFocused,
        }}
        style={{ width: 282 }}
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

// require skills
// 文本框输入 & 选择器(多选)
export const RequiredSkill = ({ handleSave, data, index, value, error }) => {
  const classes = searchStyles();
  const [errorMessage, setErrorMessage] = useState();
  const [t] = useTranslation();

  const [skill, setSkill] = useState([]);

  useEffect(() => {
    setSkill([]);
  }, [data]);

  // // 回显
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
        placeholder="skill name"
        onChange={(e) => {
          changeSetSkills(e);
        }}
        promptTextCreator={(label) => `${t('field:skillsCreat')} "${label}"`}
        noResultsText={false}
        style={{ width: 282 }}
        className={!!errorMessage ? 'create select-error' : 'create'}
        onBlur={() => {
          if (removeErrorMsgHandler) removeErrorMsgHandler('skills');
        }}
      />
      {errorMessage && <span className="is-error">{errorMessage}</span>}
    </div>
  );
};

export const RateSalary = ({ handleSave, data, msg, index, value, error }) => {
  const classes = searchStyles();
  const [disabled, setDisabled] = useState(true);
  const [type, setType] = useState('Salary');
  const [time, setTime] = useState('HOURLY');
  const [currency, setCurrency] = useState('USD');
  const [min, setMin] = useState();
  const [max, setMax] = useState();
  const [isShow, setIsShow] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (error) {
      setErrorMessage(error);
    } else if (error == false) {
    }
  }, [error]);

  useEffect(() => {
    if (value) {
      if (value['money']) {
        if (value['money']['min']) {
          setMin(value['money']['min']);
        }
        if (value['money']['max']) {
          setMax(value['money']['max']);
        }
      }
    }
  }, [value]);

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
  }, [type]);

  // 回传
  useEffect(() => {
    handleSave(
      {
        type,
        time,
        currency,
        money: {
          min,
          max,
        },
      },
      index
    );
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
        <div style={{ width: '280px', marginBottom: '12px' }}>
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
              style={{ width: 280 }}
              placeholder={'select'}
              className={classes.select}
            />
          </FormReactSelectContainer>
        </div>
        <div className={classes.positions}>
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
            value={min}
            placeholder="Min"
            errorMessage={errorMessage && errorMessage[0]}
          />
          <span className={classes.span}>-</span>
          <FormInput
            isRequired={false}
            placeholder="Max"
            onChange={(e) => {
              handleMax(e);
            }}
            value={max}
            errorMessage={errorMessage && errorMessage[1]}
          />
        </div>
      </div>
    </>
  );
};
