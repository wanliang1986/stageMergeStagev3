import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  saveAdvancedFilter,
  upDateStopFlag,
} from '../../../../../actions/newSearchJobs';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme, makeStyles } from '@material-ui/core/styles';
import Column from './Column';
import lodash, { set } from 'lodash';
import { columns, isRequiredAdvanced } from '../../../../../../utils/search';

const styles = makeStyles({
  action: {
    border: '1px solid',
  },
  dialogs: {
    '& .MuiPaper-root': {
      maxWidth: '800px !important',
      width: 800,
      borderRadius: 10,
      minHeight: 459,
    },
    '& .action': {
      borderTop: '1px solid #D3D3D3',
      justifyContent: 'space-between',
    },
    '& .btn': {
      width: 107,
      height: 33,
    },
    '& .title': {
      paddingBottom: 5,
    },
    '& .cp': {
      cursor: 'pointer',
    },
    '& .list': {
      marginBottom: '12px',
      minHeight: '285px',
      '& .MuiGrid-item': {
        // border: '1px solid'
      },
      '& .list_title': {
        height: 39,
        background: '#FAFAFB',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 24px',
        '& span': {
          fontSize: '14px',
          color: '#505050',
        },
        '& div': {
          width: '100px',
          '& span': {
            fontSize: '14px',
            color: '#3398dc',
            marginLeft: '5px',
          },
        },
      },
      '& .list_content': {
        display: 'flex',
        margin: '5px 0px',
        '& .columns': {
          width: '100%',
          // zIndex: 100,
          '& .adds': {
            fontSize: '14px',
            color: '#3398dc',
          },
        },
        '& .add': {
          width: '10%',
          display: 'flex',
          alignItems: 'center',
          '& .head_select': {
            '& .Select-control': {
              border: '0px',
            },
          },
          '& .Select-control': {
            border: '0px',
          },
          '& .Select': {
            width: '100%',
          },
        },
        '& .items': {
          '& .MuiGrid-item': {
            paddingRight: '5px',
          },
        },
        '& .delete': {
          display: 'flex',
          height: '100%',
          alignItems: 'flex-start',
          paddingTop: '10px',
        },
      },
      '& .list_box': {
        paddingLeft: '5px',
        '& .MuiGrid-container': {
          margin: '3px 0px',
        },
      },
    },
    '& .searchInput': {
      height: 32,
      width: 269,
      background: '#fff',
      marginBottom: '12px',
    },
    '& .colors': {
      color: '#3398dc',
    },
  },
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
  line: {
    height: '1px',
    borderTop: '1px solid #ddd',
    textAlign: 'center',
    margin: '20px 0',
    '& span': {
      position: 'relative',
      top: '-11px',
      background: '#fff',
      padding: '0 20px',
      fontSize: 14,
      color: '#505050',
    },
  },
});

export default function AdvancedDialog({ show, close }) {
  const classes = styles();
  const { newSearchJobs } = useSelector((state) => state.controller);
  const advancedFilter = newSearchJobs.toJS()['advancedFilter'];
  const [arr, setArr] = useState([{ value: '' }, { value: '' }]);
  const [arrs, setArrs] = useState([{ and: [{}, {}] }]);
  const [open, setOpen] = React.useState(show);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [value, setValue] = useState([{ and: [{}, {}] }]);
  const dispatch = useDispatch();

  const handleClose = () => {
    setOpen(false);
    close();
  };

  useEffect(() => {
    if (advancedFilter.length) {
      setArrs(advancedFilter);
      setValue(advancedFilter);
    }
  }, []);

  useEffect(() => {
    setOpen(show);
  }, [show]);

  const handleADDColumn = () => {
    let arr = lodash.cloneDeep(value);
    let key = Math.random();
    arr.push({
      and: [{ key }, { key: key + 1 }],
    });
    setValue(arr);
    setArrs(arr);
  };

  const handleDelete = (index) => {
    if (arrs.length == 1) return;
    setArrs(lodash.cloneDeep(value));
    let res = lodash.cloneDeep(value);
    res.splice(index, 1);
    setArrs(res);
    setValue(res);
  };

  const handleSave = (values, index, andOr) => {
    let arr = lodash.cloneDeep(value);
    delete arr[index]['and'];
    delete arr[index]['or'];
    arr[index] = {
      [andOr]: values,
    };
    setValue(arr);
  };

  const handleSearch = () => {
    let { data, isOk } = isRequiredAdvanced(lodash.cloneDeep(value));
    if (isOk) {
      setArrs(data);
      dispatch(saveAdvancedFilter(data));
      close();
    } else {
      dispatch(upDateStopFlag(true));
      setArrs(data);
    }
  };

  const handleCopy = (index) => {
    let arr = lodash.cloneDeep(value);
    arr.splice(index, 0, value[index]);
    setValue(arr);
    setArrs(arr);
  };

  const handleClearAll = () => {
    let numKey = [];
    for (let index = 0; index < 4; index++) {
      numKey.push(Math.random());
    }
    setArrs([
      {
        and: [
          {
            key: numKey[0],
          },
          {
            key: numKey[1],
          },
        ],
      },
    ]);
    setValue([
      {
        and: [
          {
            key: numKey[2],
          },
          {
            key: numKey[3],
          },
        ],
      },
    ]);
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={handleClose}
      aria-labelledby="responsive-dialog-title"
      className={classes.dialogs}
    >
      <DialogTitle className="title" id="responsive-dialog-title">
        {'Advanced Search'}
      </DialogTitle>
      <DialogContent>
        <div className="list">
          {arrs.map((item, index) => {
            return (
              <div key={item['key'] || JSON.stringify(item) + index + 1}>
                <Column
                  data={item[Object.keys(item)[0]]}
                  last={arrs.length !== 1}
                  index={index}
                  keys={Object.keys(item)[0]}
                  arr
                  onSave={handleSave}
                  onDelete={handleDelete}
                  onCopy={handleCopy}
                />
                {index !== arrs.length - 1 && arrs.length > 1 ? (
                  <div className={classes.line}>
                    <span>Or</span>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            );
          })}
        </div>
        <p className="colors">
          <span onClick={handleADDColumn} className="cp">
            Add Column Condition
          </span>
        </p>
      </DialogContent>
      <DialogActions className="action">
        <div>
          <Button
            className="btn"
            autoFocus
            onClick={handleClose}
            color="primary"
          >
            Close
          </Button>
          <Button
            className="btn"
            autoFocus
            onClick={handleSearch}
            variant="contained"
            color="primary"
          >
            Search
          </Button>
        </div>
        <Button
          className="btn right"
          autoFocus
          onClick={handleClearAll}
          variant="outlined"
          color="primary"
        >
          Clear Filters
        </Button>
      </DialogActions>
    </Dialog>
  );
}
