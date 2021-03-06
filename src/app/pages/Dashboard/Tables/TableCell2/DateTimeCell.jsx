import React from 'react';
import { jobDateTimeFormat } from '../../../../../utils';
import { Cell } from 'fixed-data-table-2';

const DateCell = ({ rowIndex, data, col, ...props }) => {
  const id = data.getIn([rowIndex, 'id']);
  if (id) {
    const text = data.getIn([rowIndex, col]);
    return (
      <Cell {...props}>
        <div
          className="overflow_ellipsis_1"
          style={{
            width: props.width - 26,
          }}
        >
          {jobDateTimeFormat(text)}
        </div>
      </Cell>
    );
  }
  return <Cell {...props}>loading...</Cell>;
};

export default DateCell;
