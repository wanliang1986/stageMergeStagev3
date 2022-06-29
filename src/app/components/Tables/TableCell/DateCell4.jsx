import React from 'react';
import { Cell } from 'fixed-data-table-2';

const amDate = (text) => {
  let index = text.indexOf('T');
  let newText = text.substring(0, index);
  return newText;
};

const DateCell4 = ({ rowIndex, data, col, ...props }) => {
  const text = data.getIn([rowIndex, col]);
  return (
    <Cell {...props}>
      <div
        className="overflow_ellipsis_1"
        style={{
          width: props.width - 26,
        }}
      >
        {text ? amDate(text) : 'N/A'}
      </div>
    </Cell>
  );
};

export default DateCell4;
