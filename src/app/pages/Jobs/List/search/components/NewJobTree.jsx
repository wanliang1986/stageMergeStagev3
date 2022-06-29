import React, { useState, useEffect } from 'react';
import { connect, useSelector } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import TextField from '@material-ui/core/TextField';
import { wrap } from 'lodash';
import { set } from 'immutable';
import SelectTree from '../../../../Candidates/newList/search/components/selectTree';

const styles = {
  root: {
    position: 'relative',
    '& .MuiOutlinedInput-input': {
      padding: '0 0 !important',
      paddingLeft: '8px !important',
      paddingRight: '40px !important',
    },
    '& .MuiInputBase-fullWidth': {
      height: '100%',
    },
    '& .MuiOutlinedInput-root': {
      borderRadius: 0,
      width: '320px',
    },
    '& .is-error': {
      '& .MuiOutlinedInput-root': {
        borderColor: '#cc4b37',
        backgroundColor: '#faedeb',
        border: '1px solid #cc4b37',
      },
    },
    '& .error': {
      fontSize: '12px',
      fontWeight: 'bold',
      color: '#cc4b37',
    },
  },
  shrinkage: {
    display: 'none',
  },
  an: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: '45px',
    cursor: 'pointer',
  },

  an1: {
    display: 'flex',
  },
  dialog: {
    width: 320,
    height: 220,
    overflowY: 'auto',
    position: 'absolute',
    left: 0,
    top: '36px',
    backgroundColor: 'white',
    boxShadow: '0 2px 5px 0 rgba(0, 0, 0, 0.28)',
    borderRadius: '8px',
    zIndex: 2,
  },
  mask: {
    position: 'fixed',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
  },
  pointer: {
    cursor: 'pointer',
    width: 42,
    display: 'flex',
    justifyContent: 'center',
  },

  icondown: {
    position: 'absolute',
    top: 6,
    right: 6,
    zIndex: -1,
  },
};

const NewJobTree = ({
  classes,
  sendServiceType,
  selected,
  jobData,
  disabled,
  index,
  error,
  width,
  type,
  language,
}) => {
  const [checkedList, setCheckedList] = useState([]);
  const [value, setValue] = useState([]);
  const [arrs, setArrs] = useState([]);
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [errorMessage, setErrorMessage] = useState(['']);
  const { newSearchOptions } = useSelector((state) => state.controller);
  const { functionOptions, functionOptionsZh } = newSearchOptions.toJS();
  const [selecteds, setSelecteds] = useState([]);
  console.log('213124', functionOptionsZh);

  useEffect(() => {
    if (error) {
      setErrorMessage([error]);
    }
  }, [error]);

  useEffect(() => {
    setSelecteds(selected);
  }, [selected]);

  // 第一次运行
  useEffect(() => {
    let List = null;
    if (type === 'tree') {
      if (language) {
        List = functionOptions;
      } else {
        List = functionOptionsZh;
      }
    }
    filterOthers(List);
    // List.forEach((ite) => {
    //   if (ite.children) {
    //     let arrs = [];
    //     ite.children.forEach((ites, index) => {
    //       if (ites.label.indexOf('-Others') != -1) {
    //         ite.children.splice(index, 1);
    //       } else {
    //         arrs.push(ites);
    //       }
    //       if (ites.children) {
    //         ites.children.forEach((val, index) => {
    //           if (val.label.indexOf('-Others') != -1) {
    //             ites.children.splice(index, 1);
    //           } else {
    //             // arrs.push(val);
    //           }
    //         });
    //       }
    //     });
    //     ite.children = arrs;
    //   } else {
    //   }
    // });
    setData(List);
  }, []);

  useEffect(() => {
    let List2 = null;
    if (type === 'tree') {
      if (language) {
        List2 = functionOptions;
      } else {
        List2 = functionOptionsZh;
      }
    }
    if (data.length) {
      filterOthers(data);
      // data.forEach((ite) => {
      //   if (ite.children) {
      //     let arrs = [];
      //     ite.children.forEach((ites, index) => {
      //       if (ites.label.indexOf('-Others') != -1) {
      //         ite.children.splice(index, 1);
      //       } else {
      //         arrs.push(ites);
      //       }
      //       if (ites.children) {
      //         ites.children.forEach((val, index) => {
      //           if (val.label.indexOf('-Others') != -1) {
      //             ites.children.splice(index, 1);
      //           } else {
      //             // arrs.push(val);
      //           }
      //         });
      //       }
      //     });
      //     ite.children = arrs;
      //   } else {
      //   }
      // });
      setData(data);
    }
    // selecteds是选中状态的id数组
    if (selecteds) {
      let arr = [],
        resultArr = [];
      getLabel(List2, arr, selecteds);
      // List2.map((item) => {
      //   if (selecteds.includes(item.id)) {
      //     arr.push(item.label);
      //   }
      //   if (item.children) {
      //     let length = item.children.length;
      //     item.children.map((ele, index) => {
      //       if (selecteds.includes(ele.id)) {
      //         arr.push(ele.label);
      //       }
      //       if (index + 1 == length) {
      //         // arr.push(item.label)
      //         resultArr.push(item.id);
      //       }
      //       if (ele.children) {
      //         let length2 = ele.children.length;
      //         ele.children.map((val, index) => {
      //           if (selecteds.includes(val.id)) {
      //             arr.push(val.label);
      //           }
      //           if (index + 1 == length2) {
      //             // arr.push(item.label)
      //             resultArr.push(ele.id);
      //           }
      //         });
      //       }
      //     });
      //   }
      // });
      // 去重
      setCheckedList(Array.from(new Set([...selecteds])));

      setValue(arr);
    }
  }, [selecteds, jobData]);

  // setCheckedList(newSelected);
  // setSelecteds(newSelected);
  // setValue(newSelected);
  // sendServiceType(newSelected, data, index);
  const filterOthers = (data) => {
    data.map((val, index) => {
      val.label.indexOf('-Others') != -1 ? data.splice(index, 1) : '';
      if (val.children?.length) {
        filterOthers(val.children);
      }
    });
  };

  const getLabel = (oldArr, newArr, selecteds) => {
    oldArr.forEach((val) => {
      selecteds.includes(val.id)
        ? newArr.push(language ? val.label : val.labelCn)
        : '';
      if (val.children?.length) {
        getLabel(val.children, newArr, selecteds);
      }
    });
  };

  const showDialog = () => {
    setOpen(true);
  };
  const closeDialog = () => {
    setOpen(false);
  };

  // 回调获取实时选中id
  const getValue = (val) => {
    setCheckedList(val);
    setSelecteds(val);
    setValue(val);
    sendServiceType(val, data, index);
  };

  return (
    //   输入框
    <div className={classes.root}>
      <TextField
        value={value && value.join(',')}
        variant="outlined"
        // select
        fullWidth
        style={{ width: !width ? '320px' : width, height: 32 }}
        InputProps={{
          readOnly: true,
        }}
        disabled={disabled}
        onClick={disabled ? null : showDialog}
        className={errorMessage[0] != '' ? 'is-error' : ''}
      ></TextField>

      {errorMessage[0] && <span className="error">{errorMessage[0]}</span>}

      <div
        className={open ? classes.mask : classes.shrinkage}
        onClick={closeDialog}
      ></div>
      <div className={classes.icondown}>
        {open ? (
          <ArrowDropUpIcon style={{ color: '#999' }} />
        ) : (
          <ArrowDropDownIcon style={{ color: '#999' }} />
        )}
      </div>

      <div className={open ? classes.dialog : classes.shrinkage}>
        <SelectTree
          callback={getValue}
          dataList={data}
          checkedList={checkedList}
          language={language}
        />
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    language: state.controller.language,
  };
};

export default connect(mapStateToProps)(withStyles(styles)(NewJobTree));
