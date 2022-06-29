import React, { useState, useEffect } from 'react';
import { withTranslation } from 'react-i18next';
import { connect, useDispatch } from 'react-redux';
import lodash from 'lodash';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import { makeStyles } from '@material-ui/core/styles';

import DocumentTable from './DocumentTable';
import Loading from '../../../components/particial/Loading';
import PrimaryButton from '../../../components/particial/PrimaryButton';
// import { sortList, getIndexList } from '../../../../utils';
import CreateDocumentDialog from './CreateDocumentDialog';
import { showErrorMessage } from '../../../actions';
import AlertDialog from '../components/AlertDialog';

import {
  getDocumentTableData,
  deleteDocuments,
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

const DocumentList = (props) => {
  const { t } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const [show, setShow] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [deleteDialogFlag, setDeleteDialogFlag] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [originalTableData, setOriginalTableData] = useState([]);
  const [deleteDocumentId, setDeleteDocumentId] = useState('');
  const [rowsIndex, setRowsIndex] = useState(0);
  const [documentName, setDocumentName] = useState('');

  const [sortDir, setSortDir] = useState(null);
  const [sortColumnKey, setSortColumnKey] = useState('');

  const fetchData = () => {
    setShow(true);
    dispatch(getDocumentTableData())
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

  // 删除
  const onDelete = (index, name) => {
    setDeleteDialogFlag(true);
    setDocumentName(name);
    setDeleteDocumentId(tableData[index].id);
  };

  const deleteDocumentItem = () => {
    dispatch(deleteDocuments(deleteDocumentId))
      .then(() => {
        setDeleteDialogFlag(false);
        fetchData();
      })
      .catch((err) => {
        dispatch(showErrorMessage(err));
        setDeleteDialogFlag(false);
      });
  };

  // 关闭创建弹窗
  const handleCloseCreateDialog = () => {
    setCreateOpen(false);
    setIsEdit(false);
  };

  const onEdit = (rowIndex) => {
    setCreateOpen(true);
    setIsEdit(true);
    setRowsIndex(rowIndex);
  };

  return (
    <div className="flex-child-auto flex-container flex-dir-column">
      <Paper className="flex-child-auto flex-container flex-dir-column">
        <div className={classes.pageTop}>
          <div style={{ float: 'left' }}>
            <Typography variant="h5">Documents</Typography>
            <div style={{ marginTop: 10 }}>
              {tableData.length > 0 ? tableData.length : 0} results
            </div>
          </div>

          <div className={classes.addButton}>
            <PrimaryButton
              onClick={() => setCreateOpen(true)}
              style={{ minWidth: 120, marginTop: 10 }}
            >
              Add Document
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
            <DocumentTable
              onSortChange={onSortChange}
              onDelete={onDelete}
              onEdit={onEdit}
              dataSource={tableData}
              sortDir={sortDir}
              sortColumnKey={sortColumnKey}
            />
            <Dialog
              onClose={handleCloseCreateDialog}
              maxWidth="sm"
              open={createOpen}
              className={classes.dialogs}
            >
              <CreateDocumentDialog
                {...props}
                t={t}
                isEdit={isEdit}
                dataSource={tableData}
                rowsIndex={rowsIndex}
                onClose={handleCloseCreateDialog}
                fetchData={fetchData}
              />
            </Dialog>
            <AlertDialog
              open={deleteDialogFlag}
              onOK={() => {
                deleteDocumentItem();
              }}
              onCancel={() => setDeleteDialogFlag(false)}
              content={`Are you sure delete ${documentName}?`}
              okLabel={t('action:delete')}
              cancelLabel={t('action:cancel')}
            />
          </div>
        )}
      </Paper>
    </div>
  );
};

export default withTranslation()(connect()(DocumentList));
