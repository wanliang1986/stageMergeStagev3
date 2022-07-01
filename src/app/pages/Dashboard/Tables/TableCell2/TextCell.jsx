import React from 'react';
import { List } from 'immutable';
import { withStyles } from '@material-ui/core/styles/index';
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

  _getValue = ({ rowIndex, data, width }) => {
    return data.getIn([rowIndex, 'id']) + ' ' + width;
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
              [classes.unCapital]: col === 'email' || col === 'note',
            })}
            data-tip={!disableTooltip ? text : null}
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
