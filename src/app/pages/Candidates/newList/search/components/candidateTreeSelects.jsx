import React, { useState, useEffect } from 'react';
import { connect, useSelector } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import TextField from '@material-ui/core/TextField';

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
      width: '281px',
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
  dialog: {
    width: 280,
    height: 300,
    overflowY: 'auto',
    position: 'absolute',
    left: 0,
    top: '36px',
    backgroundColor: 'white',
    boxShadow: '0 2px 5px 0 rgba(0, 0, 0, 0.28)',
    borderRadius: '8px',
    zIndex: 1,
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
    // zIndex: -1,
  },
};

const CandidateTree = ({
  classes,
  sendServiceType,
  selected,
  candiDate,
  disabled,
  index,
  error,
  width,
  language,
}) => {
  const [checkedList, setCheckedList] = useState([]);
  const [value, setValue] = useState([]);
  const [arrs, setArrs] = useState([]);
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [errorMessage, setErrorMessage] = useState(['']);
  const { candidateSelect } = useSelector((state) => state.controller);
  const { industryList, industryListZh } = candidateSelect.toJS();
  const [selecteds, setSelecteds] = useState([]);

  useEffect(() => {
    if (error) {
      setErrorMessage([error]);
    }
  }, [error]);

  useEffect(() => {
    setSelecteds(selected);
  }, [selected]);

  useEffect(() => {
    let res = null;
    if (language) {
      res = industryList;
    } else {
      res = industryListZh;
    }
    res.forEach((ite) => {
      if (ite.children) {
        let arrs = [];
        ite.children.forEach((ites, index) => {
          if (ites.label.indexOf('-') != -1) {
            ite.children.splice(index, 1);
          } else {
            arrs.push(ites);
          }
        });
        ite.children = arrs;
      } else {
      }
    });
    setData(res);
  }, []);

  useEffect(() => {
    if (data.length) {
      console.log(selecteds);
      data.forEach((ite) => {
        if (ite.children) {
          let arrs = [];
          ite.children.forEach((ites, index) => {
            if (ites.label) {
              if (ites.label.indexOf('-') != -1) {
                ite.children.splice(index, 1);
              } else {
                arrs.push(ites);
              }
            }
          });
          ite.children = arrs;
        } else {
        }
      });
      setData(data);
    }

    if (selecteds) {
      console.log(selecteds);
      let arr = [],
        resultArr = [];
      industryList.map((item) => {
        if (selecteds.includes(item.id)) {
          language ? arr.push(item.label) : arr.push(item.labelCn);
        }
        if (item.children) {
          let length = item.children.length;
          item.children.map((ele, index) => {
            if (selecteds.includes(ele.id)) {
              language ? arr.push(ele.label) : arr.push(ele.labelCn);
            }
            if (index + 1 == length) {
              // arr.push(item.label)
              resultArr.push(item.id);
            }
          });
        }
      });

      setCheckedList(Array.from(new Set([...selecteds])));
      setValue(arr);
    }
  }, [selecteds, candiDate]);

  const isSelected = (id) => checkedList.indexOf(id) !== -1;

  const changeParentChecked = (item) => {
    arrs.push(item);
    setArrs(arrs);
    const selectedIndex = checkedList.indexOf(item.id);
    let newValue = [];
    let newSelected = [];
    let arr = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(checkedList, item.id);
      newValue = newValue.concat(value, item.label);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(checkedList.slice(1));
      newValue = newValue.concat(value.slice(1));
    } else if (selectedIndex === checkedList.length - 1) {
      newSelected = newSelected.concat(checkedList.slice(0, -1));
      newValue = newValue.concat(value.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        checkedList.slice(0, selectedIndex),
        checkedList.slice(selectedIndex + 1)
      );
      newValue = newValue.concat(
        value.slice(0, selectedIndex),
        value.slice(selectedIndex + 1)
      );
    }

    data.forEach((ite) => {
      if (ite.children) {
        let check = true;
        let arrs = [];
        ite.children.forEach((ites, index) => {
          if (ites.label.indexOf('-') != -1) {
            ite.children.splice(index, 1);
          } else {
            arrs.push(ites);
          }
          if (newSelected) {
            if (newSelected.indexOf(ites.id) == -1) {
              check = false;
            }
          }
        });
        ite.children = arrs;
        if (!check) {
          if (newSelected) {
            let arrs = newSelected.filter((items) => {
              return items != ite.id;
            });
            setSelecteds(arrs);
            newSelected = arrs;
          }
        } else {
          newSelected.push(ite.id);
        }
      } else {
      }
    });

    setCheckedList(newSelected);
    setValue(newValue);
    sendServiceType(newSelected, data, index);
  };
  const shrinkage = (index) => {
    let arr = [...data];
    arr[index].checked = !arr[index].checked;
    setData(arr);
  };
  const checkParent = (item, e) => {
    let arr = [],
      checked = e.target.checked;
    let newValue = [];
    let newSelected = [];
    if (checked) {
      item.children.forEach((items) => {
        if (checkedList.indexOf(items.id) == -1) {
          arr.push(items.id);
        }
      });
      arr.push(item.id);
    } else {
      item.children.forEach((items) => {
        if (checkedList.indexOf(items.id) != -1) {
          checkedList.splice(checkedList.indexOf(items.id), 1);
        }
      });
      checkedList.splice(checkedList.indexOf(item.id), 1);
    }
    newSelected = newSelected.concat(checkedList, arr);
    setCheckedList(newSelected);
    setSelecteds(newSelected);
    setValue(newSelected);
    sendServiceType(newSelected, data, index);
  };

  const showDialog = () => {
    setOpen(true);
  };
  const closeDialog = () => {
    setOpen(false);
  };

  return (
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
        {data.map((item, index) => {
          const disabled = !!item.children;
          const isItemSelected = isSelected(data[index].id);
          return (
            <div key={index}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span>
                  {item.children ? (
                    item.checked ? (
                      <ArrowDropDownIcon
                        onClick={() => {
                          shrinkage(index);
                        }}
                      />
                    ) : (
                      <ArrowRightIcon
                        onClick={() => {
                          shrinkage(index);
                        }}
                      />
                    )
                  ) : (
                    ''
                  )}
                </span>
                {item.children ? (
                  <div className={classes.pointer}>
                    <Checkbox
                      // checked={checkedList.includes(item.id)}
                      checked={isItemSelected}
                      onChange={(e) => {
                        checkParent(item, e);
                      }}
                      color="primary"
                    ></Checkbox>
                  </div>
                ) : (
                  <div style={{ width: '24px' }}></div>
                )}
                {item.children ? null : (
                  <div className={classes.pointer}>
                    <Checkbox
                      checked={isItemSelected}
                      onChange={() => {
                        changeParentChecked(item);
                      }}
                      disabled={disabled}
                      color="primary"
                    />
                  </div>
                )}
                {language ? item.label : item.labelCn}
              </div>
              {item.children &&
                item.children.map((ele, flag) => {
                  const childItemSelected = isSelected(
                    data[index].children[flag].id
                  );
                  return (
                    <div
                      className={item.checked ? classes.an : classes.shrinkage}
                      key={ele.id}
                    >
                      <Checkbox
                        checked={childItemSelected}
                        onChange={() => {
                          changeParentChecked(ele);
                        }}
                        color="primary"
                      />
                      {language ? ele.label : ele.labelCn}
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

export default connect(mapStateToProps)(withStyles(styles)(CandidateTree));
