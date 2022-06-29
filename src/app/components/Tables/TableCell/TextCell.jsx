import React from 'react';
import { List } from 'immutable';
import { withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { Cell } from 'fixed-data-table-2';

const styles = {
  ellipsis: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  unCapital: {
    textTransform: 'none',
  },
};

class TextCell extends React.Component {
  shouldComponentUpdate(nextProps) {
    return this._getValue(nextProps) !== this._getValue(this.props);
  }

  _getValue = ({ rowIndex, data, col, width }) => {
    return `${data.getIn([rowIndex, col])}  ${data.getIn([
      rowIndex,
      'id',
    ])} ${width}`;
  };

  render() {
    const { rowIndex, data, col, classes, disableTooltip, ...props } =
      this.props;
    const id = data.getIn([rowIndex, 'id']);
    if (id) {
      let text = data.getIn([rowIndex, col]);
      if (List.isList(text)) {
        text = text.join(', ');
      }
      return (
        <Cell {...props}>
          <div
            className={clsx(classes.ellipsis, {
              [classes.unCapital]:
                col === 'email' || col === 'note' || col === 'fileName',
            })}
            data-tip={!disableTooltip ? text : null}
            style={{ width: props.width - 26 }}
          >
            {text}
          </div>
        </Cell>
      );
    }
    return <Cell {...props}>loading...</Cell>;
  }
}

export default withStyles(styles)(TextCell);
