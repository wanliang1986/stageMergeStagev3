import React from 'react';

import { Cell } from 'fixed-data-table-2';
import Tooltip from '@material-ui/core/Tooltip';

class DateCellTooltipList extends React.Component {
  // shouldComponentUpdate(nextProps) {
  //   return this._getValue(nextProps) !== this._getValue(this.props);
  // }

  // _getValue = ({ rowIndex, data, col }) => {
  //   return `${data.getIn([rowIndex, col])}  ${data.getIn([rowIndex, 'id'])}`;
  // };

  render() {
    const { rowIndex, data, col, ...props } = this.props;
    const id = data.getIn([rowIndex, 'id']);
    if (id) {
      const text = data.getIn([rowIndex, col]);
      console.log(data.toJS(), col, text);
      return (
        <Cell {...props}>
          <div
            className="overflow_ellipsis_1"
            data-tip={text}
            style={{ width: props.width - 26 }}
          >
            {text && (
              <Tooltip
                title={
                  <React.Fragment>
                    {text.map((item) => (
                      <p
                        style={{
                          fontSize: 15,
                          marginBottom: '3px',
                          marginTop: '3px',
                        }}
                      >
                        {item[col]}
                      </p>
                    ))}
                  </React.Fragment>
                }
                placement="top"
              >
                <span>{text[0][col]}</span>
              </Tooltip>
            )}
          </div>
          <br />
        </Cell>
      );
    }
    return <Cell {...props}>loading...</Cell>;
  }
}

export default DateCellTooltipList;
