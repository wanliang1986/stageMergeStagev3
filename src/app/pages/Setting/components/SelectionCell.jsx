import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import withStyles from '@material-ui/core/styles/withStyles';

import { Cell } from 'fixed-data-table-2';
import Checkbox from '@material-ui/core/Checkbox';

import { style } from '../../../components/Tables/params';

const styles = {
  root: style.actionContainer,
  checkboxContainer: style.checkboxContainer,
  checkbox: style.checkbox,
};

const SelectionCell = (props) => {
  const {
    rowIndex,
    onSelect,
    rowsData,
    checkFlag,
    checkId,
    changeStatus,
    isMandatory,
    cellRowsData = [],
    ...otherProps
  } = props;
  const id = rowsData[rowIndex].id;
  const isSelected = rowsData[rowIndex].selected;
  const isDisabled = cellRowsData[rowIndex]?.mandatory === true;

  return (
    <Cell {...otherProps}>
      <div className={clsx('flex-container align-spaced', styles.root)}>
        <div className={styles.checkboxContainer}>
          <Checkbox
            className={styles.checkbox}
            color="primary"
            checked={isSelected}
            onChange={(e) => {
              onSelect(id, e.target.checked, rowIndex);
            }}
            disabled={isDisabled}
          />
        </div>
      </div>
    </Cell>
  );
};

export default withStyles(styles)(SelectionCell);
