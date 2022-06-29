import React, { useState, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { Table, Column, Cell } from 'fixed-data-table-2';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import clsx from 'clsx';
import lodash from 'lodash';

import CheckIcon from '@material-ui/icons/Check';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import ActionDelete from '@material-ui/icons/Delete';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import CreateIcon from '@material-ui/icons/Create';
import Tooltip from '@material-ui/core/Tooltip';

import HeaderCell from '../components/HeaderCell';
import PrimaryButton from '../../../components/particial/PrimaryButton';
import { style } from '../../../components/Tables/params';
import Loading from '../../../components/particial/Loading';
import LinkButton from '../../../components/particial/LinkButton';
import CreatePackageDialog from '../Packages/CreatePackageDialog';
import AlertDialog from '../components/AlertDialog';
import SelectDocumentDialog from '../components/SelectDocumentDialog';
import { showErrorMessage } from '../../../actions';

import {
  getPackageDocumentTableData,
  getSelectDocumentTableData,
  saveSelectDocumentTableData,
  deletePackagesDocument,
} from '../../../actions/onBoardingActions';
import { sortArray } from '../components/utils';

// Signature Required枚举
const actionRequiredEnum = {
  0: 'MUST_BE_SIGNED_AND_RETURNED',
  1: 'READ_ONLY',
};

const columns = [
  {
    colName: 'Document Name',
    colWidth: 250,
    col: 'name',
    flexGrow: 2,
    type: 'nameButton',
    sortable: true,
  },
  {
    colName: 'Mandatory',
    col: 'mandatory',
    colWidth: 250,
    sortable: true,
  },
  {
    colName: 'Signature Required',
    col: 'actionRequired',
    colWidth: 250,
    sortable: true,
  },
];

const useStyles = makeStyles({
  backBtn: {
    fontSize: 15,
    width: 150,
    marginBottom: 15,
  },
  pageTop: {
    height: 70,
    width: '100%',
    padding: 18,
  },
  addButton: {
    float: 'right',
  },
  dialogs: {
    '& .MuiPaper-root': {
      minWidth: '757px !important',
    },
    '& .MuiDialog-paperWidthSm': {
      width: '757px !important',
    },
  },
  ellipsis: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    textAlign: 'left',
  },
});

const PackageCell = ({ col, rowIndex, dataSource, classes, ...otherProps }) => {
  const mandatory = dataSource[rowIndex]?.mandatory;
  const actionRequired = dataSource[rowIndex]?.actionRequired;
  const name = dataSource[rowIndex]?.name;
  if (col === 'mandatory') {
    return (
      <Cell {...otherProps}>
        <div className={clsx('flex-container align-spaced', style.root)}>
          <div className={style.checkboxContainer}>
            {mandatory && <CheckIcon style={{ color: '#00c844' }} />}
          </div>
        </div>
      </Cell>
    );
  }
  if (col === 'actionRequired') {
    return (
      <Cell {...otherProps}>
        <div className={clsx('flex-container align-spaced', style.root)}>
          <div className={style.checkboxContainer}>
            {actionRequired === actionRequiredEnum[0] && (
              <CheckIcon style={{ color: '#00c844' }} />
            )}
          </div>
        </div>
      </Cell>
    );
  }
  return (
    <Cell {...otherProps}>
      <Tooltip title={name} placement="top-start">
        <div style={{ padding: 8 }}>
          <LinkButton
            onClick={() => window.open(dataSource[rowIndex]?.s3Link)}
            className={classes.ellipsis}
            style={{ width: 1250 }}
          >
            {name}
          </LinkButton>
        </div>
      </Tooltip>
    </Cell>
  );
};

const PackagesDetail = (props) => {
  const { t, location } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const packageId = location.state?.dataSource?.id;
  const packageName = location.state?.dataSource?.name;
  const [nameDialogFlag, setNameDialogFlag] = useState(false);
  const [deleteDialogFlag, setDeleteDialogFlag] = useState(false);
  const [documentFlag, setDocumentFlag] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [originalTableData, setOriginalTableData] = useState([]);
  const [selectDocumentData, setSelectDocumentData] = useState([]);
  const [selectDocumentOptions, setSelectDocumentOptions] = useState([]);
  const [show, setShow] = useState(true);
  const [isShow, setIsShow] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const [editAfterData, setEditAfterData] = useState({});
  const [deleteIndex, setDeleteIndex] = useState(0);
  const [deleteName, setDeleteName] = useState('');

  const [sortDir, setSortDir] = useState(null);
  const [sortColumnKey, setSortColumnKey] = useState('');
  const [timer, setTimer] = useState(null);

  const fetchData = () => {
    setShow(true);
    dispatch(getPackageDocumentTableData(packageId))
      .then((response) => {
        setTableData(response);
        setOriginalTableData(response);
        setSortDir(null);
        setSortColumnKey('');
        setShow(false);
      })
      .catch((err) => {
        dispatch(showErrorMessage(err));
        setShow(false);
      });
  };

  const fetchSelectDocumentData = (packagesName) => {
    setIsShow(true);
    const params = { name: packagesName ? packagesName : null };
    dispatch(getSelectDocumentTableData(packageId, params))
      .then((response) => {
        setSelectDocumentData(response);
        setIsShow(false);
      })
      .catch((err) => {
        dispatch(showErrorMessage(err));
        setIsShow(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (documentFlag) {
      fetchSelectDocumentData();
    }
  }, [documentFlag]);

  const onDelete = (index, name) => {
    setDeleteDialogFlag(true);
    setDeleteName(name);
    setDeleteIndex(index);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogFlag(false);
  };

  const onSubmit = (data) => {
    const arr = [];
    data.forEach((item) => {
      if (item.selected === false) return;
      let dataObj = {};
      dataObj.documentId = item.id;
      dataObj.mandatory =
        item.mandatory === undefined || item.mandatory === null
          ? false
          : item.mandatory;
      arr.push(dataObj);
    });

    dispatch(saveSelectDocumentTableData(arr, packageId))
      .then(() => {
        fetchData();
        setDocumentFlag(false);
      })
      .catch((err) => {
        dispatch(showErrorMessage(err));
        setDocumentFlag(false);
      });
  };

  const onDeletePackageDocuement = () => {
    dispatch(
      deletePackagesDocument(
        tableData[deleteIndex].packageId,
        tableData[deleteIndex].documentId
      )
    )
      .then(() => {
        setDeleteDialogFlag(false);
        fetchData();
      })
      .catch((err) => {
        dispatch(showErrorMessage(err));
        setDeleteDialogFlag(false);
      });
  };

  // 排序
  const onSortChange = (columnKey, sortDirs) => {
    if (sortDirs === 'ASC') {
      const cloneTableData = lodash.cloneDeep(originalTableData);
      setTableData(cloneTableData);
      setSortColumnKey('');
      setSortDir(null);
    } else if (sortDirs === 'DESC') {
      const cloneTableData = lodash.cloneDeep(originalTableData);
      const arr = sortArray(cloneTableData, columnKey).reverse();
      setTableData(arr);
      setSortColumnKey(columnKey);
      setSortDir('ASC');
    } else {
      const cloneTableData = lodash.cloneDeep(originalTableData);
      const arr = sortArray(cloneTableData, columnKey);
      setTableData(arr);
      setSortColumnKey(columnKey);
      setSortDir('DESC');
    }
  };

  const selectInputChange = (value) => {
    clearTimeout(timer);
    const replaceName = value.replace(/[^A-Za-z0-9_\-\u4e00-\u9fa5]+/g, '');
    const params = {
      name: replaceName.substring(0, 201)
        ? replaceName.substring(0, 201)
        : null,
    };
    const time = setTimeout(async () => {
      await dispatch(getSelectDocumentTableData(packageId, params))
        .then((response) => {
          const options = [];
          response.map((item) => {
            options.push({ value: item.id, label: item.name });
          });
          setSelectDocumentOptions(options);
        })
        .catch((err) => {
          dispatch(showErrorMessage(err));
        });
    }, 1500);
    setTimer(time);
  };

  return (
    <>
      {/* <Button className={classes.backBtn} variant="outlined">
        <Link
          to={`/setting`}
          style={{ textDecoration: 'none', color: 'rgba(0, 0, 0, 0.87)' }}
        >
          Back to Packages
        </Link>
      </Button> */}
      <div className="flex-child-auto flex-container flex-dir-column">
        <Paper className="flex-child-auto flex-container flex-dir-column">
          <div className={classes.pageTop}>
            <div style={{ float: 'left' }}>
              <div style={{ display: 'flex' }}>
                <Typography variant="h5">
                  On-Boarding Package:{' '}
                  {editAfterData.name ? editAfterData.name : packageName}
                </Typography>
                <div style={{ cursor: 'pointer' }}>
                  <CreateIcon
                    style={{ marginTop: 5, marginLeft: 10, color: '#a0a0a0' }}
                    onClick={() => {
                      setNameDialogFlag(true);
                      setIsEdit(true);
                    }}
                  />
                </div>
              </div>
            </div>

            <div className={classes.addButton}>
              <PrimaryButton
                onClick={() => setDocumentFlag(true)}
                style={{ minWidth: 120 }}
              >
                {/* {t('Select Documents')} */}
                Select Documents
              </PrimaryButton>
            </div>
          </div>

          {show ? (
            <Loading />
          ) : (
            <div
              className="flex-child-auto"
              style={{ overflow: 'hidden', position: 'relative' }}
            >
              <AutoSizer>
                {({ width, height }) => (
                  <React.Fragment>
                    <Table
                      rowHeight={47}
                      rowsCount={tableData.length}
                      width={width}
                      height={height}
                      headerHeight={40}
                    >
                      <Column
                        width={50}
                        cell={({ rowIndex, ...props }) => {
                          return (
                            <Cell>
                              <div>
                                <IconButton
                                  style={{ padding: 5 }}
                                  onClick={() =>
                                    onDelete(rowIndex, tableData[rowIndex].name)
                                  }
                                >
                                  <ActionDelete style={{ color: '#3598dc' }} />
                                </IconButton>
                              </div>
                            </Cell>
                          );
                        }}
                      />

                      {columns.map((item, index) => {
                        return (
                          <Column
                            key={index}
                            columnKey={item.col}
                            header={
                              <HeaderCell
                                column={item}
                                onSortChange={onSortChange}
                                sortDir={sortDir}
                                sortColumnKey={sortColumnKey}
                              />
                            }
                            cell={
                              <PackageCell
                                type={item.type}
                                col={item.col}
                                style={style.displayCell}
                                dataSource={tableData}
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
                )}
              </AutoSizer>
            </div>
          )}

          <Dialog
            onClose={() => {
              setNameDialogFlag(false);
              setIsEdit(false);
            }}
            maxWidth="sm"
            open={nameDialogFlag}
            className={classes.dialogs}
          >
            <CreatePackageDialog
              {...props}
              t={t}
              onClose={(editName, editDescription) => {
                setNameDialogFlag(false);
                setIsEdit(false);
                if (editName && typeof editName === 'string') {
                  setEditAfterData({
                    name: editName,
                    description: editDescription,
                  });
                }
              }}
              editData={location.state?.dataSource}
              editAfterData={editAfterData}
              isEdit={isEdit}
            />
          </Dialog>

          <AlertDialog
            open={deleteDialogFlag}
            onOK={() => onDeletePackageDocuement()}
            onCancel={closeDeleteDialog}
            content={`Are you sure to delete ${deleteName}?`}
            okLabel={t('action:delete')}
            cancelLabel={t('action:cancel')}
          />
          <SelectDocumentDialog
            onClose={() => {
              setDocumentFlag(false);
              setIsShow(true);
            }}
            open={documentFlag}
            t={t}
            dataSource={selectDocumentData}
            onSubmit={onSubmit}
            isShow={isShow}
            selectInputChange={selectInputChange}
            selectDocumentOptions={selectDocumentOptions}
          />
        </Paper>
      </div>
    </>
  );
};

export default withTranslation()(PackagesDetail);
