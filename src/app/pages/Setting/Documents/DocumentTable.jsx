import React, { useState, useEffect } from 'react';
import { Table, Column, Cell } from 'fixed-data-table-2';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import clsx from 'clsx';
import moment from 'moment-timezone';

import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import ActionDelete from '@material-ui/icons/Delete';
import GetAppIcon from '@material-ui/icons/GetApp';
import VisibilityIcon from '@material-ui/icons/Visibility';
import CheckIcon from '@material-ui/icons/Check';
import Tooltip from '@material-ui/core/Tooltip';

// import HeaderCell from '../../../components/Tables/TableCell/HeaderCell';
import HeaderCell from '../components/HeaderCell';
import LinkButton from '../../../components/particial/LinkButton';
import { styles } from '../../../components/Tables/params';
import { getIndexList, makeCancelable, sortList } from '../../../../utils';

// Signature Required枚举
const actionRequiredEnum = {
  0: 'MUST_BE_SIGNED_AND_RETURNED',
  1: 'READ_ONLY',
};

const style = {
  root: styles.actionContainer,
  checkboxContainer: styles.checkboxContainer,
  checkbox: styles.checkbox,
};

const useStyles = makeStyles({
  IconButton: {
    width: '100%',
    margin: '0 auto',
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
    colWidth: 652,
    col: 'name',
    flexGrow: 2,
    type: 'active',
    sortable: true,
  },
  {
    colName: 'Signature Required',
    colWidth: 250,
    col: 'actionRequired',
    sortable: true,
  },
  {
    colName: 'Last Updated On',
    colWidth: 250,
    col: 'lastModifiedDate',
    sortable: true,
  },
  {
    colName: 'Last Updated By',
    colWidth: 250,
    col: 'lastModifiedBy',
    sortable: true,
  },
];

const DocumentCell = (props) => {
  const { item, classes, onEdit, dataSource, rowIndex, ...otherProps } = props;
  const text = dataSource[rowIndex]?.name;
  const actionRequired = dataSource[rowIndex]?.actionRequired;
  const lastModifiedDate = dataSource[rowIndex]?.lastModifiedDate;
  const lastModifiedBy = dataSource[rowIndex]?.lastModifiedBy;
  if (item.colName === 'Signature Required') {
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
  if (item.colName === 'Last Updated On') {
    return (
      <Cell {...otherProps}>
        <div style={{ padding: 8 }}>
          <span>{moment(lastModifiedDate).format('L HH:mm')}</span>
        </div>
      </Cell>
    );
  }
  if (item.colName === 'Last Updated By') {
    return (
      <Cell {...otherProps}>
        <div
          className={classes.ellipsis}
          style={{ padding: 8 }}
          title={lastModifiedBy}
        >
          <span>{lastModifiedBy}</span>
        </div>
      </Cell>
    );
  }
  return (
    <Cell {...otherProps}>
      <Tooltip title={text} placement="top-start">
        <div>
          <LinkButton
            onClick={() => onEdit(rowIndex)}
            className={classes.ellipsis}
            style={{ width: 900 }}
          >
            {text}
          </LinkButton>
        </div>
      </Tooltip>
    </Cell>
  );
};

const DocumentTable = (props) => {
  const {
    onDelete,
    t,
    onEdit,
    dataSource,
    onSortChange,
    sortDir,
    sortColumnKey,
  } = props;
  const classes = useStyles();

  const downloadDocument = async (url, name) => {
    const response = await fetch(url);
    const blob = await response.blob();
    const objectUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = objectUrl;
    a.download = `${name}.pdf`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => document.body.removeChild(a), 1000);
  };

  return (
    <AutoSizer>
      {({ width, height }) => (
        <React.Fragment>
          <Table
            rowHeight={47}
            rowsCount={dataSource.length}
            width={width}
            height={height}
            headerHeight={40}
          >
            {/* Action */}
            <Column
              width={130}
              cell={({ rowIndex, ...props }) => {
                return (
                  <Cell>
                    <div className={classes.IconButton}>
                      <IconButton
                        style={{ padding: 4 }}
                        onClick={() =>
                          onDelete(rowIndex, dataSource[rowIndex].name)
                        }
                      >
                        <ActionDelete
                          style={{ marginRight: 4, color: '#3598dc' }}
                        />
                      </IconButton>
                      <IconButton
                        onClick={() =>
                          downloadDocument(
                            dataSource[rowIndex].s3Link,
                            dataSource[rowIndex].name
                          )
                        }
                        style={{ padding: 4 }}
                      >
                        <GetAppIcon
                          style={{ marginRight: 4, color: '#3598dc' }}
                        />
                      </IconButton>
                      <IconButton
                        style={{ padding: 4 }}
                        onClick={() => {
                          // setOpen(true);
                          // setS3Url(dataSource[rowIndex].s3Link);
                          window.open(dataSource[rowIndex].s3Link);
                        }}
                      >
                        <VisibilityIcon style={{ color: '#3598dc' }} />
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
                    <DocumentCell
                      item={item}
                      classes={classes}
                      onEdit={onEdit}
                      dataSource={dataSource}
                    />
                  }
                  width={item.colWidth}
                  flexGrow={item.flexGrow}
                  fixed={item.fixed}
                />
              );
            })}
          </Table>
          {/* <Dialog onClose={() => setOpen(false)} open={open}>
            <iframe src={s3Url} style={{ width: 500, height: 500 }}></iframe>
          </Dialog> */}
        </React.Fragment>
      )}
    </AutoSizer>
  );
};

export default DocumentTable;
