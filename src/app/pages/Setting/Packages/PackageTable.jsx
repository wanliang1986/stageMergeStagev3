import React, { useState } from 'react';
import { Table, Column, Cell } from 'fixed-data-table-2';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import { Link } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import ActionDelete from '@material-ui/icons/Delete';
import Tooltip from '@material-ui/core/Tooltip';

import HeaderCell from '../components/HeaderCell';
import LinkButton from '../../../components/particial/LinkButton';

const useStyles = makeStyles({
  ellipsis: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    textAlign: 'left',
  },
});

const columns = [
  {
    colName: 'Package Name',
    colWidth: 774,
    col: 'name',
    flexGrow: 4,
    sortable: true,
  },
  {
    colName: 'Description',
    col: 'description',
    colWidth: 250,
    flexGrow: 1,
  },
  {
    colName: 'Last Updated On',
    col: 'lastModifiedDate',
    colWidth: 250,
    flexGrow: 1,
    sortable: true,
  },
  {
    colName: 'Last Updated By',
    col: 'lastModifiedBy',
    colWidth: 250,
    flexGrow: 1,
    sortable: true,
  },
];

const PackageCell = (props) => {
  const { item, rowIndex, dataSource, classes } = props;
  const lastModifiedBy = dataSource[rowIndex].lastModifiedBy;
  const lastModifiedDate = dataSource[rowIndex].lastModifiedDate;
  if (item.col === 'name') {
    const name = dataSource[rowIndex].name;
    return (
      <Link
        to={{
          pathname: '/setting/package/packageDetail',
          state: { dataSource: dataSource[rowIndex] },
        }}
        style={{ textDecoration: 'none' }}
      >
        <Cell>
          <Tooltip title={name} placement="top-start">
            <div style={{ padding: 8 }}>
              <LinkButton className={classes.ellipsis} style={{ width: 880 }}>
                {name}
              </LinkButton>
            </div>
          </Tooltip>
        </Cell>
      </Link>
    );
  }
  if (item.col === 'lastModifiedDate') {
    return (
      <Cell>
        <div style={{ padding: 8 }} className="overflow_ellipsis_1">
          <span>{moment(lastModifiedDate).format('L HH:mm')}</span>
        </div>
      </Cell>
    );
  }
  if (item.col === 'lastModifiedBy') {
    return (
      <Cell>
        <div style={{ padding: 8 }} title={lastModifiedBy}>
          <span>{lastModifiedBy}</span>
        </div>
      </Cell>
    );
  }
  const text = dataSource[rowIndex].description;
  return (
    <Cell>
      {text && (
        <Tooltip title={text} arrow placement="top">
          <div style={{ padding: 8, width: 250 }} className={classes.ellipsis}>
            {text}
          </div>
        </Tooltip>
      )}
    </Cell>
  );
};

const PackageTable = (props) => {
  const { dataSource, onDelete, onSortChange, sortDir, sortColumnKey } = props;
  const classes = useStyles();

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
              width={50}
              cell={({ rowIndex, ...props }) => {
                return (
                  <Cell>
                    <div style={{ padding: '5px 8px 8px 8px' }}>
                      <ActionDelete
                        style={{ color: '#3598dc', cursor: 'pointer' }}
                        onClick={() =>
                          onDelete(rowIndex, dataSource[rowIndex].name)
                        }
                      />
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
                      item={item}
                      rowIndex={index}
                      dataSource={dataSource}
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
  );
};

export default PackageTable;
