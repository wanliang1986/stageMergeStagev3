import React, { useState, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { withTranslation } from 'react-i18next';
import lodash from 'lodash';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';

import PackageTable from './PackageTable';
import PrimaryButton from '../../../components/particial/PrimaryButton';
import AlertDialog from '../components/AlertDialog';
import CreatePackageDialog from './CreatePackageDialog';
import { showErrorMessage } from '../../../actions';
import Loading from '../../../components/particial/Loading';
import SelectDocumentDialog from '../components/SelectDocumentDialog';

import {
  getPackageTableData,
  deletePackages,
  getSelectDocumentTableData,
  saveSelectDocumentTableData,
} from '../../../actions/onBoardingActions';
import { sortArray } from '../components/utils';

const useStyles = makeStyles({
  pageTop: {
    height: 100,
    width: '100%',
    padding: 24,
  },
  addButton: {
    width: '100%',
    textAlign: 'right',
  },
  dialogs: {
    '& .MuiPaper-root': {
      minWidth: '757px !important',
    },
    '& .MuiDialog-paperWidthSm': {
      width: '757px !important',
    },
  },
});

const PackageList = (props) => {
  const { t } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const [show, setShow] = useState(true);
  const [open, setOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [originalTableData, setOriginalTableData] = useState([]);
  const [deleteDialogFlag, setDeleteDialogFlag] = useState(false);
  const [deletePackageId, setDeletePackageId] = useState(0);

  const [documentFlag, setDocumentFlag] = useState(false);
  const [isShow, setIsShow] = useState(true);
  const [selectDocumentOptions, setSelectDocumentOptions] = useState([]);
  const [packageId, setPackageId] = useState('');
  const [selectDocumentData, setSelectDocumentData] = useState([]);
  const [packageName, setPackageName] = useState('');

  const [sortDir, setSortDir] = useState(null);
  const [sortColumnKey, setSortColumnKey] = useState('');

  const fetchData = () => {
    setShow(true);
    dispatch(getPackageTableData())
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

  useEffect(() => {
    fetchData();
  }, []);

  const onDelete = (index, name) => {
    setDeleteDialogFlag(true);
    setPackageName(name);
    setDeletePackageId(tableData[index].id);
  };

  const deletePackageItem = () => {
    dispatch(deletePackages(deletePackageId))
      .then(() => {
        setDeleteDialogFlag(false);
        fetchData();
      })
      .catch((err) => {
        dispatch(showErrorMessage(err));
      });
  };

  const closeDeleteDialog = () => {
    setDeleteDialogFlag(false);
  };

  // 关闭创建弹窗
  const handleCloseCreateDialog = (info, data) => {
    setOpen(false);

    if (info === 'ok') {
      setDocumentFlag(true);
      setPackageId(data.id);
      fetchSelectDocumentData(data.id);
    }
  };

  // fetch select document tableData
  const fetchSelectDocumentData = (id, packagesName) => {
    setIsShow(true);
    const params = { name: packagesName ? packagesName : null };
    dispatch(getSelectDocumentTableData(id, params))
      .then((response) => {
        setSelectDocumentData(response);
        setIsShow(false);
      })
      .catch((err) => {
        dispatch(showErrorMessage(err));
        setIsShow(false);
      });
  };

  // select document Submit
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

    if (arr.length === 0) {
      setDocumentFlag(false);
      return;
    }

    dispatch(saveSelectDocumentTableData(arr, packageId))
      .then(() => {
        setDocumentFlag(false);
      })
      .catch((err) => {
        dispatch(showErrorMessage(err));
        setDocumentFlag(false);
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

  const selectInputChange = async (value) => {
    const replaceName = value.replace(/[^A-Za-z0-9_\-\u4e00-\u9fa5]+/g, '');
    const params = {
      name: replaceName.substring(0, 201)
        ? replaceName.substring(0, 201)
        : null,
    };
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
  };

  return (
    <div className="flex-child-auto flex-container flex-dir-column">
      <Paper className="flex-child-auto flex-container flex-dir-column">
        <div className={classes.pageTop}>
          <div style={{ float: 'left' }}>
            <Typography variant="h5">Packages</Typography>
            <div style={{ marginTop: 10 }}>
              {tableData.length > 0 ? tableData.length : 0} results
            </div>
          </div>

          <div className={classes.addButton}>
            <PrimaryButton
              onClick={() => setOpen(true)}
              style={{ minWidth: 120, marginTop: 10 }}
            >
              {/* {t('Create New Hire Package')} */}
              Create New Hire Package
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
            <PackageTable
              onDelete={onDelete}
              t={t}
              dataSource={tableData}
              onSortChange={onSortChange}
              sortDir={sortDir}
              sortColumnKey={sortColumnKey}
            />
          </div>
        )}

        <Dialog
          onClose={handleCloseCreateDialog}
          maxWidth="sm"
          open={open}
          className={classes.dialogs}
        >
          <CreatePackageDialog
            t={t}
            onClose={handleCloseCreateDialog}
            fetchData={fetchData}
            onOktext={'Next'}
          />
        </Dialog>
        <AlertDialog
          open={deleteDialogFlag}
          onOK={() => deletePackageItem()}
          onCancel={closeDeleteDialog}
          content={`Are you sure to delete ${packageName}?`}
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
  );
};

export default withTranslation()(connect()(PackageList));
