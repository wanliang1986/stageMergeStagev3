import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Table, Column, Cell } from 'fixed-data-table-2';
import lodash from 'lodash';
import clsx from 'clsx';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import { makeStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import CheckIcon from '@material-ui/icons/Check';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import CircularProgress from '@material-ui/core/CircularProgress';
import Tooltip from '@material-ui/core/Tooltip';

import { styles } from '../../../components/Tables/params';
import SecondaryButton from '../../../components/particial/SecondaryButton';
import PrimaryButton from '../../../components/particial/PrimaryButton';
import HeaderCell from '../../../components/Tables/TableCell/HeaderCell';
import SelectionCell from './SelectionCell';
import Loading from '../../../components/particial/Loading';

import * as Colors from './../../../styles/Colors';

const style = {
  root: styles.actionContainer,
  checkboxContainer: styles.checkboxContainer,
  checkbox: styles.checkbox,
};

const PackageCell = ({
  type,
  col,
  rowIndex,
  rowsData,
  onCellSelect,
  classes,
  ...otherProps
}) => {
  const text = rowsData[rowIndex].name;
  const actionRequired = rowsData[rowIndex].actionRequired;
  if (col === 'mandatory') {
    const id = rowsData[rowIndex].id;
    const [checked, setChecked] = useState(rowsData[rowIndex].mandatory);

    useEffect(() => {
      setChecked(rowsData[rowIndex].mandatory);
    }, [rowsData]);
    return (
      <Cell {...otherProps}>
        <div className={clsx('flex-container align-spaced', style.root)}>
          <div className={style.checkboxContainer}>
            <Checkbox
              className={style.checkbox}
              color="primary"
              checked={checked}
              onChange={(e) => {
                onCellSelect(id, e.target.checked);
              }}
            />
          </div>
        </div>
      </Cell>
    );
  }
  if (col === 'signatureRequired') {
    return (
      <Cell {...otherProps}>
        <div className={clsx('flex-container align-spaced', style.root)}>
          <div className={style.checkboxContainer}>
            {actionRequired === 'MUST_BE_SIGNED_AND_RETURNED' && (
              <CheckIcon style={{ color: '#00c844' }} />
            )}
          </div>
        </div>
      </Cell>
    );
  }
  if (col === 'readOnly') {
    return (
      <Cell {...otherProps}>
        <div className={clsx('flex-container align-spaced', style.root)}>
          <div className={style.checkboxContainer}>
            {actionRequired === 'READ_ONLY' && (
              <CheckIcon style={{ color: '#00c844' }} />
            )}
          </div>
        </div>
      </Cell>
    );
  }
  return (
    <Cell {...otherProps}>
      <Tooltip title={text} placement="top-start">
        <div className={classes.ellipsis} style={{ width: 300, padding: 8 }}>
          <span>{text}</span>
        </div>
      </Tooltip>
    </Cell>
  );
};

const useStyles = makeStyles({
  dialogs: {
    '& .MuiPaper-root': {
      maxWidth: '1000px !important',
      width: 1000,
    },
    '& .MuiDialogContent-root': {
      overflow: 'hidden',
    },
    '& .MuiFormControl-fullWidth': {
      height: '100%',
    },
    '& .MuiAutocomplete-inputRoot': {
      padding: '0 0 !important',
    },
    '& .MuiAutocomplete-inputFocused': {
      padding: '0 0 !important',
    },
    '& .MuiAutocomplete-input:first-child': {
      minHeight: '32px',
    },
    '& .MuiOutlinedInput-root': {
      padding: '0px !important',
    },
  },
  headerCell: {
    fontSize: 15,
    fontWeight: 500,
    color: Colors.TEXT,
  },
  submit: {
    width: 128,
    height: 31,
    margin: '0 auto',
    display: 'flex',
  },
  ellipsis: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    textAlign: 'left',
  },
});

const columns = [
  {
    colName: 'Document Name',
    colWidth: 250,
    col: 'name',
    flexGrow: 2,
    type: 'nameButton',
  },
  {
    colName: 'Mandatory',
    col: 'mandatory',
    colWidth: 150,
    flexGrow: 1,
  },
  {
    colName: 'Signature Required',
    col: 'signatureRequired',
    colWidth: 150,
    flexGrow: 1,
  },
  {
    colName: 'Read Only',
    col: 'readOnly',
    colWidth: 150,
    flexGrow: 1,
  },
];

const columns2 = [
  {
    colName: 'Document Name',
    colWidth: 250,
    col: 'name',
    flexGrow: 2,
    type: 'nameButton',
  },
  {
    colName: 'Signature Required',
    col: 'signatureRequired',
    colWidth: 150,
    flexGrow: 1,
  },
  {
    colName: 'Read Only',
    col: 'readOnly',
    colWidth: 150,
    flexGrow: 1,
  },
];

const initialSelectList = (arr) => {
  const list = arr.filter((item) => item.selected === true);
  const isCheckedIds = list.map((item) => item.id);
  return isCheckedIds;
};

const SelectDocumentDialog = (props) => {
  const {
    onClose, //关闭弹窗
    t,
    open, // 弹窗显示flag状态
    onSubmit, // 弹窗提交
    dataSource, //外部传入的数据源
    isShow, // loading flag状态
    isMandatory = true, // 是否存在Mandatory字段
    selectInputChange, // 选择框value改变模糊搜索请求接口
    selectDocumentOptions, // 选择框模糊搜索数据源
    otherDataSource, // 其他数据源
  } = props;
  const classes = useStyles();
  const [processing, setProcessing] = useState(false); //保存loading
  const [selectList, setSelectList] = useState([]); // 已选择checkbox数组
  const [documentId, setDocumentId] = useState('');
  const [documentNameOptions, setDocumentNameOptions] = useState([]); // 选择框options
  const [rowsData, setRowsData] = useState(dataSource);
  const [cellRowsData, setCellRowsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setSelectList(initialSelectList(dataSource));
  }, [dataSource]);

  useEffect(() => {
    if (!otherDataSource) return;
    const list = lodash.cloneDeep(rowsData);
    list.forEach((item) => {
      otherDataSource.forEach((items) => {
        if (item.name === items.name && items.mandatory) {
          item.mandatory = true;
        }
      });
    });
    const arr = list.concat(otherDataSource);
    setCellRowsData(list);
  }, [otherDataSource, rowsData]);

  useEffect(() => {
    setRowsData(dataSource);
  }, [dataSource]);

  useEffect(() => {
    setDocumentNameOptions(selectDocumentOptions);
    setIsLoading(false);
  }, [selectDocumentOptions]);

  const changeDocumentId = (value) => {
    if (selectList.includes(value)) return; // 已存在则选择无效
    const isCheckedIds = lodash.cloneDeep(selectList);
    isCheckedIds.push(value);
    setSelectList(isCheckedIds);

    const documentIds = rowsData.map((item) => item.id);
    const cloneData = lodash.cloneDeep(rowsData);
    const index = documentIds.indexOf(value);
    const item = lodash.cloneDeep(cloneData[index]);
    item.selected = true;
    item.isSelectCheck = true;
    cloneData.splice(index, 1);
    cloneData.unshift(item);
    setRowsData(cloneData);
  };

  // loading状态
  useEffect(() => {
    if (!open) {
      setProcessing(false);
    } else {
      setRowsData([]); // 关闭弹窗重置table数据
    }
  }, [open]);

  //checkbox选择
  const onSelect = (id, flag, index) => {
    const documentIds = rowsData.map((item) => item.id);
    if (!documentIds.includes(id)) return;

    const isCheckedIds = lodash.cloneDeep(selectList);
    if (flag) {
      isCheckedIds.push(id);
      setSelectList(isCheckedIds);

      const cloneData = lodash.cloneDeep(rowsData);
      const index = documentIds.indexOf(id);
      cloneData.forEach((item, indexs) => {
        if (index === indexs) {
          item.selected = true;
        }
      });
      setRowsData(cloneData);
    } else {
      const index = isCheckedIds.indexOf(id);
      isCheckedIds.splice(index, 1);
      setSelectList(isCheckedIds);

      const cloneData = lodash.cloneDeep(rowsData);
      const index1 = documentIds.indexOf(id);

      const item = lodash.cloneDeep(cloneData[index1]);

      if (item.isSelectCheck) {
        cloneData.splice(index1, 1);
        item.selected = false;
        item.mandatory = false;
        delete item.isSelectCheck;
        cloneData.push(item);
        setRowsData(cloneData);
      } else {
        cloneData.forEach((item, indexs) => {
          if (index1 === indexs) {
            item.selected = false;
            item.mandatory = false;
          }
        });
        setRowsData(cloneData);
      }
    }
  };

  const onCellSelect = (id, flag) => {
    const documentIds = rowsData.map((item) => item.id);
    if (!documentIds.includes(id)) return;

    const isCheckedIds = lodash.cloneDeep(selectList);

    const cloneData = lodash.cloneDeep(rowsData);
    const index = documentIds.indexOf(id);
    const item = lodash.cloneDeep(cloneData[index]);
    if (flag) {
      if (item.selected) {
        cloneData.forEach((item, indexs) => {
          if (index === indexs) {
            item.mandatory = true;
          }
        });
        setRowsData(cloneData);
      } else {
        cloneData.forEach((items, indexs) => {
          if (indexs === index) {
            items.mandatory = true;
            items.selected = true;
          }
        });
        setRowsData(cloneData);

        isCheckedIds.push(id);
        setSelectList(isCheckedIds);
      }
    } else {
      const indexs = isCheckedIds.indexOf(id);
      isCheckedIds.splice(indexs, 1);
      setSelectList(isCheckedIds);

      if (item.isSelectCheck) {
        cloneData.splice(index, 1);
        item.mandatory = false;
        delete item.isSelectCheck;
        cloneData.push(item);
        setRowsData(cloneData);
      } else {
        cloneData.forEach((item, indexs) => {
          if (index === indexs) {
            item.mandatory = false;
          }
        });
        setRowsData(cloneData);
      }
    }
  };

  return (
    <Dialog
      onClose={onClose}
      aria-labelledby="delete-team-title"
      className={classes.dialogs}
      open={open}
    >
      <DialogTitle>{t('Select Document')}</DialogTitle>
      <DialogContent>
        <Autocomplete
          style={{ width: '100%', height: 32, marginBottom: 30 }}
          value={documentId}
          onChange={(e, newValue) => {
            if (!newValue) return;
            changeDocumentId(newValue.value);
          }}
          onInputChange={(event, newInputValue) => {
            setIsLoading(true);
            setDocumentNameOptions([]);
            if (!newInputValue) {
              setIsLoading(false);
              return;
            }
            selectInputChange(newInputValue);
          }}
          getOptionSelected={(option, value) => true}
          getOptionLabel={(option) => {
            return option.label || '';
          }}
          options={documentNameOptions}
          renderInput={(params) => (
            <TextField
              {...params}
              label=""
              variant="outlined"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <React.Fragment>
                    {isLoading ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : (
                      <SearchIcon />
                    )}
                  </React.Fragment>
                ),
              }}
            />
          )}
        />
        {isShow ? (
          <Loading />
        ) : (
          <div
            className="flex-child-auto"
            style={{ overflow: 'hidden', position: 'relative' }}
          >
            <React.Fragment>
              <Table
                rowHeight={47}
                rowsCount={rowsData.length}
                width={950}
                height={300}
                headerHeight={40}
              >
                <Column
                  header={<Cell className={classes.headerCell} />}
                  cell={({ rowIndex, ...props }) => {
                    return (
                      <SelectionCell
                        onSelect={onSelect}
                        rowsData={rowsData}
                        isMandatory={isMandatory}
                        cellRowsData={cellRowsData}
                        rowIndex={rowIndex}
                      />
                    );
                  }}
                  fixed
                  width={53}
                />

                {(isMandatory ? columns : columns2).map((item, index) => {
                  return (
                    <Column
                      key={index}
                      columnKey={item.col}
                      header={<HeaderCell column={item} />}
                      cell={
                        <PackageCell
                          type={item.type}
                          col={item.col}
                          rowIndex={index}
                          style={styles.displayCell}
                          rowsData={rowsData}
                          onCellSelect={onCellSelect}
                          classes={classes}
                        />
                      }
                      width={item.colWidth}
                      flexGrow={item.flexGrow}
                      fixed={item.fixed}
                    />
                  );
                })}
              </Table>
            </React.Fragment>
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <div className={classes.submit}>
          <SecondaryButton
            onClick={() => {
              setSelectList([]);
              onClose();
            }}
            size="small"
            variant="outlined"
            style={{ marginRight: 10 }}
          >
            {t('action:cancel')}
          </SecondaryButton>
          <PrimaryButton
            component="label"
            onClick={() => {
              onSubmit(rowsData);
              setProcessing(true);
            }}
            processing={processing}
            size="small"
          >
            {t('save')}
          </PrimaryButton>
        </div>
      </DialogActions>
    </Dialog>
  );
};
export default connect()(SelectDocumentDialog);
