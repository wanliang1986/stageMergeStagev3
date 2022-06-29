import React, { useState } from 'react';
import { withTranslation } from 'react-i18next';
import { Cell } from 'fixed-data-table-2';
import { style } from '../../../components/Tables/params';
import { SortDownIcon, SortIcon, SortUpIcon } from '../../../components/Icons';
import * as Colors from './../../../styles/Colors';

const SortTypes = {
  ASC: 'ASC',
  DESC: 'DESC',
};

const HeaderCell = (props) => {
  const { column, onSortChange, sortDir, sortColumnKey, ...otherProps } = props;
  const [oldColumnKey, setOldColumnKey] = useState(''); // 上一次的点击columnkey

  const _onSortChange = () => {
    if (onSortChange && column.sortable) {
      let sortDirs;
      const currentSortDir = sortDir;
      const currentColumnKey = column.col;
      setOldColumnKey(column.col);
      if (currentSortDir) {
        if (currentSortDir === SortTypes.DESC) {
          sortDirs = SortTypes.ASC;
        } else {
          sortDirs = null;
        }
      } else {
        sortDirs = SortTypes.DESC;
      }

      // 如果上一次和当前点击的列不是同一列，则重新按DESC排序
      if (oldColumnKey !== currentColumnKey) {
        sortDirs = SortTypes.DESC;
      }

      onSortChange(currentColumnKey, sortDirs);
    }
  };

  return (
    <Cell style={style.headerCell} {...otherProps}>
      <div style={style.headerText}>
        <div
          onClick={() => _onSortChange()}
          className="flex-container align-justify align-middle"
        >
          <span>{column.colName}</span>
          {onSortChange &&
            column.sortable &&
            (sortColumnKey === column.col ? (
              sortDir === SortTypes.DESC ? (
                <SortDownIcon fontSize="inherit" color="primary" />
              ) : (
                <SortUpIcon fontSize="inherit" color="primary" />
              )
            ) : (
              <SortIcon fontSize="inherit" htmlColor={Colors.ALUMINUM} />
            ))}
        </div>
      </div>
    </Cell>
  );
};

export default HeaderCell;
