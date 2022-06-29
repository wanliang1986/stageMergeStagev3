import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import TextField from '@material-ui/core/TextField';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ClearIcon from '@material-ui/icons/Clear';
const styles = {
  root: {
    position: 'relative',
    width: '100%',
    marginBottom: 8,
    borderRadius: '0px',
    '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
      borderRadius: '0px',
    },
    '& .MuiOutlinedInput-input': {
      padding: '0.4em',
    },
    '& .MuiInputBase-fullWidth': {
      height: '100%',
      paddingRight: '40px',
    },
  },
  shrinkage: {
    display: 'none',
  },
  an: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: '32px',
    cursor: 'pointer',
  },
  anTwo: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: '60px',
    cursor: 'pointer',
  },
  dialog: {
    width: '100%',
    height: 300,
    overflowY: 'auto',
    position: 'absolute',
    left: 0,
    top: '34px',
    backgroundColor: 'white',
    boxShadow: '0 2px 5px 0 rgba(0, 0, 0, 0.28)',
    borderRadius: '8px',
    zIndex: 2000,
  },
  mask: {
    position: 'fixed',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    zIndex: 1000,
  },
  pointer: {
    cursor: 'pointer',
    width: 42,
    display: 'flex',
    justifyContent: 'center',
  },
  gray: {
    color: '#939393',
    fontSize: 15,
    marginTop: 6,
  },
  show: {
    marginLeft: 18,
  },
};

const JobTree = (props) => {
  const { classes, sendServiceType, selected, jobData, disabled, language } =
    props;
  const [checkedList, setCheckedList] = useState([]);
  const [value, setValue] = useState([]);
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [selectEdList, setSelectEdList] = useState([]);
  useEffect(() => {
    if (jobData) {
      setData(jobData);
    }
    if (selected) {
      setCheckedList(selected);
      let arr = [];
      jobData.map((item) => {
        if (selected.includes(item.id)) {
          language ? arr.push(item.label) : arr.push(item.labelCn);
        }
        if (item.children) {
          item.children.map((ele) => {
            if (selected.includes(ele.id)) {
              language ? arr.push(ele.label) : arr.push(ele.labelCn);
            }
            if (ele.children) {
              ele.children.map((eleTwo) => {
                if (selected.includes(eleTwo.id)) {
                  language ? arr.push(eleTwo.label) : arr.push(eleTwo.labelCn);
                }
              });
            }
          });
        }
      });
      setValue(arr);
    }
  }, [selected, jobData, language]);

  const isSelected = (id) => checkedList.indexOf(id) !== -1;

  //Job Function 中的change事件
  const changeParentChecked = (item, index, level) => {
    let handList = [...checkedList];
    const selectedIndex = handList.indexOf(item.id);
    let parentID = null;
    let arr = []; //存放当前点击的children集合
    let flage = false;
    if (selectedIndex === -1) {
      parentID = item.parentId;
      if (item.label.includes('Others')) {
        flage = true;
      }
    }
    let parentArr = [];
    data &&
      data.forEach((a) => {
        if (level) {
          a.children &&
            a.children.forEach((b) => {
              if (b.id === parentID) {
                arr = b.children;
                parentArr = a.children;
              }
            });
        } else {
          if (a.id === parentID) {
            arr = a.children;
          }
        }
      });
    // 先去掉同层others与其他之间的互斥关系
    if (flage) {
      arr.forEach((b) => {
        const handIndex = handList.indexOf(b.id);
        if (handIndex === -1) {
          if (b.label.includes('Others')) {
            handList.concat(b.id);
          }
        }
        if (handIndex === 0) {
          handList.splice(handIndex, 1);
        }
        if (handIndex > 0) {
          handList.splice(handIndex, 1);
        }
      });
    } else {
      arr.forEach((c) => {
        const niceIndex = handList.indexOf(c.id);
        if (c.label.includes('Others')) {
          if (niceIndex === 0) {
            handList.splice(niceIndex, 1);
          }
          if (niceIndex > 0) {
            handList.splice(niceIndex, 1);
          }
        }
      });
    }
    // 二层选了others，那么二层里面如果有三层，三层里面选的所有数据应该去掉
    // 同理，三层选了数据，二层如果有选others的需要取消掉,没有则算了
    if (level) {
      parentArr.forEach((a) => {
        const parentIndex = handList.indexOf(a.id);
        if (a.label.includes('Others')) {
          if (parentIndex === 0) {
            handList.splice(parentIndex, 1);
          }
          if (parentIndex > 0) {
            handList.splice(parentIndex, 1);
          }
        }
      });
    } else {
      arr.forEach((b) => {
        b.children &&
          b.children.forEach((c) => {
            const childIndex = handList.indexOf(c.id);
            if (flage && childIndex >= 0) {
              handList.splice(childIndex, 1);
            }
          });
      });
    }

    let newValue = [];
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(handList, item.id);
      newValue = newValue.concat(value, item.label);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(handList.slice(1));
      newValue = newValue.concat(value.slice(1));
    } else if (selectedIndex === handList.length - 1) {
      newSelected = newSelected.concat(handList.slice(0, -1));
      newValue = newValue.concat(value.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        handList.slice(0, selectedIndex),
        handList.slice(selectedIndex + 1)
      );
      newValue = newValue.concat(
        value.slice(0, selectedIndex),
        value.slice(selectedIndex + 1)
      );
    }

    setCheckedList(newSelected); //存放的选中的ID
    setValue(newValue); //选中的name名字
    sendServiceType(newSelected);
  };
  // 点击带有children的数据
  const shrinkage = (index) => {
    let arr = [...data];
    arr[index].checked = !arr[index].checked;
    arr[index].children &&
      arr[index].children.map((item) => {
        item.checked = false;
      });
    setData(arr);
  };
  const shrinkageTwo = (index, flag) => {
    let arr = [...data];
    arr[index].children[flag].checked = !arr[index].children[flag].checked;
    setData(arr);
  };
  const showDialog = () => {
    setOpen(true);
  };
  const closeDialog = () => {
    setOpen(false);
  };

  const clearAllValue = (e) => {
    e.stopPropagation();
    setCheckedList([]);
    sendServiceType([]);
    setValue([]);
  };

  return (
    <div className={classes.root}>
      <TextField
        value={value && value.join(', ')}
        variant="outlined"
        placeholder="Select"
        fullWidth
        style={{ width: '100%', height: 34 }}
        InputProps={{
          readOnly: true,
        }}
        disabled={disabled}
        onClick={disabled ? null : showDialog}
      ></TextField>

      <div
        style={{
          position: 'absolute',
          right: '4px',
          top: '5px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {open ? (
          <>
            {value.length > 0 ? (
              <ClearIcon
                style={{ color: 'gray', zIndex: '1001', fontSize: 14 }}
                onClick={disabled ? null : clearAllValue}
              />
            ) : null}
            <ArrowDropUpIcon style={{ color: 'gray' }} />
          </>
        ) : (
          <>
            {value.length > 0 ? (
              <ClearIcon
                style={{ color: 'gray', fontSize: 14 }}
                fontSize="small"
                onClick={disabled ? null : clearAllValue}
              />
            ) : null}
            <ArrowDropDownIcon
              style={{ color: 'gray' }}
              onClick={disabled ? null : showDialog}
            />
          </>
        )}
      </div>

      <div
        className={open ? classes.mask : classes.shrinkage}
        onClick={closeDialog}
      ></div>
      <div className={open ? classes.dialog : classes.shrinkage}>
        {jobData.map((item, index) => {
          const disabled = !!item.children;
          const isItemSelected = isSelected(jobData[index].id);
          return (
            <div key={index}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {item.children ? (
                  <div
                    onClick={() => {
                      shrinkage(index);
                    }}
                    className={classes.pointer}
                  >
                    {item.checked ? <ArrowDropDownIcon /> : <ArrowRightIcon />}
                  </div>
                ) : (
                  <div className={classes.pointer}>
                    <Checkbox
                      checked={isItemSelected}
                      onChange={() => {
                        changeParentChecked(item, index);
                      }}
                      disabled={disabled}
                      color="primary"
                    />
                  </div>
                )}
                <div className={classes.block}>
                  {language ? item.label : item.labelCn}
                </div>
              </div>
              {item.children &&
                item.children.map((ele, flag) => {
                  const childItemSelected = isSelected(
                    jobData[index].children[flag].id
                  );
                  return (
                    <>
                      <div
                        className={
                          item.checked ? classes.an : classes.shrinkage
                        }
                        key={ele.id}
                      >
                        {ele.children ? (
                          <div
                            onClick={() => {
                              shrinkageTwo(index, flag);
                            }}
                            className={classes.pointer}
                          >
                            {ele.checked ? (
                              <ArrowDropDownIcon />
                            ) : (
                              <ArrowRightIcon />
                            )}
                          </div>
                        ) : (
                          <div className={classes.pointer}>
                            <Checkbox
                              checked={childItemSelected}
                              onChange={() => {
                                changeParentChecked(ele, flag);
                              }}
                              color="primary"
                            />
                          </div>
                        )}
                        {language ? ele.label : ele.labelCn}
                      </div>
                      {ele.children &&
                        ele.children.map((eleTwo, flagTwo) => {
                          const childItemTwoSelected = isSelected(
                            jobData[index].children[flag].children[flagTwo].id
                          );
                          return (
                            <div
                              className={
                                ele.checked ? classes.anTwo : classes.shrinkage
                              }
                              key={eleTwo.id}
                            >
                              <Checkbox
                                checked={childItemTwoSelected}
                                onChange={() => {
                                  changeParentChecked(eleTwo, flagTwo, true);
                                }}
                                color="primary"
                              />
                              {language ? eleTwo.label : eleTwo.labelCn}
                            </div>
                          );
                        })}
                    </>
                  );
                })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    language: state.controller.language,
    // filters: state.controller.searchAudience.get('filters').get('locations'),
  };
};

export default connect(mapStateToProps)(withStyles(styles)(JobTree));
