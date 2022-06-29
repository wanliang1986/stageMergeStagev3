import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import TextField from '@material-ui/core/TextField';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import { useTranslation } from 'react-i18next';
const styles = {
  root: {
    position: 'relative',
    width: '100%',
    marginBottom: 8,
    '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
      borderRadius: '0px',
    },
    '& .MuiOutlinedInput-input': {
      padding: '0.4em',
    },
    '& .MuiInputBase-fullWidth': {
      height: '100%',
    },
  },
  shrinkage: {
    display: 'none',
  },
  an: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: '30px',
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
  const {
    classes,
    sendServiceType,
    selected,
    jobData,
    disabled,
    show,
    language,
  } = props;
  const [checkedList, setCheckedList] = useState([]);
  const [value, setValue] = useState([]);
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
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
  }, [selected, jobData, show, language]);

  const isSelected = (id) => checkedList.indexOf(id) !== -1;

  //Job Function 中的change事件
  const changeParentChecked = (item, index) => {
    let handList = [...checkedList];
    let newValue = [];
    const selectedIndex = handList && handList.indexOf(item.id);

    if (selectedIndex === -1 && handList.length === 0) {
      handList.push(item.id);
      newValue.push(item.label);
    }
    if (selectedIndex === -1 && handList.length > 0) {
      handList = [];
      newValue = [];
      handList.push(item.id);
      newValue.push(item.label);
    }
    if (selectedIndex === 0) {
      handList = [];
      newValue = [];
    }
    console.log(handList, newValue);
    setCheckedList(handList);
    setValue(newValue);
    sendServiceType(handList);
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
  const showDialog = () => {
    setOpen(true);
  };
  const closeDialog = () => {
    setOpen(false);
  };

  const shrinkSonage = (index, flag) => {
    let arr = [...data];
    arr[index].children[flag].checked = !arr[index].children[flag].checked;
    setData(arr);
  };
  const [t] = useTranslation();
  return (
    <div className={classes.root}>
      <TextField
        value={value && value.join(', ')}
        variant="outlined"
        placeholder={t('tab:select')}
        fullWidth
        style={{ width: '100%', height: 34 }}
        InputProps={{
          readOnly: true,
        }}
        disabled={disabled}
        onClick={disabled ? null : showDialog}
      ></TextField>
      <div style={{ position: 'absolute', right: '4px', top: '5px' }}>
        {open ? (
          <ArrowDropUpIcon style={{ color: 'gray' }} />
        ) : (
          <ArrowDropDownIcon
            style={{ color: 'gray' }}
            onClick={disabled ? null : showDialog}
          />
        )}
      </div>
      <div
        className={open ? classes.mask : classes.shrinkage}
        onClick={closeDialog}
      ></div>
      <div className={open ? classes.dialog : classes.shrinkage}>
        {jobData &&
          jobData.map((item, index) => {
            return (
              <div key={item.id}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {item.children ? (
                    <div
                      onClick={() => {
                        shrinkage(index);
                      }}
                      className={classes.pointer}
                    >
                      {item.checked ? (
                        <ArrowDropDownIcon />
                      ) : (
                        <ArrowRightIcon />
                      )}
                    </div>
                  ) : null}
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
                      <div key={ele.id}>
                        <div
                          className={
                            item.checked ? classes.an : classes.shrinkage
                          }
                          key={ele.id}
                        >
                          {ele.children ? (
                            <div
                              onClick={() => {
                                shrinkSonage(index, flag);
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
                            <Checkbox
                              checked={childItemSelected}
                              onChange={() => {
                                changeParentChecked(ele, flag);
                              }}
                              color="primary"
                            />
                          )}
                          <div className={classes.block}>
                            {language ? ele.label : ele.labelCn}
                          </div>
                        </div>
                        {ele.children &&
                          ele.children.map((eleTwo, flagTwo) => {
                            const sonItemSelected = isSelected(
                              jobData[index].children[flag].children[flagTwo].id
                            );
                            return (
                              <div
                                className={
                                  ele.checked
                                    ? classes.anTwo
                                    : classes.shrinkage
                                }
                                key={eleTwo.id}
                              >
                                <Checkbox
                                  checked={sonItemSelected}
                                  onChange={() => {
                                    changeParentChecked(eleTwo, flagTwo);
                                  }}
                                  color="primary"
                                />
                                {language ? eleTwo.label : eleTwo.labelCn}
                              </div>
                            );
                          })}
                      </div>
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
    filters: state.controller.searchAudience.get('filters').get('locations'),
    language: state.controller.language,
  };
};

export default connect(mapStateToProps)(withStyles(styles)(JobTree));
