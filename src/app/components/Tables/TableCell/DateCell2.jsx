import React from 'react';
import { jobDateTimeFormat } from '../../../../utils';
import { Cell } from 'fixed-data-table-2';

class TextCell2 extends React.PureComponent {
  render() {
    const { rowIndex, data, col, ...props } = this.props;
    const id = data.getIn([rowIndex, 'id']);
    if (id) {
      const text = data.getIn([rowIndex, col]);
      return (
        <Cell {...props}>
          <div style={{ width: props.width - 26 }}>
            {text ? jobDateTimeFormat(text) : ''}
          </div>
        </Cell>
      );
    }
    return <Cell {...props}>loading...</Cell>;
  }
}

export default TextCell2;
