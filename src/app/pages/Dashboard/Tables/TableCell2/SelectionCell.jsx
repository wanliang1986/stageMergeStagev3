import React from 'react';
import clsx from 'clsx';
import withStyles from '@material-ui/core/styles/withStyles';

import { Cell } from 'fixed-data-table-2';
import Checkbox from '@material-ui/core/Checkbox/index';

import { styles } from '../params';

class SelectionCell extends React.Component {
  constructor(props) {
    super(props);

    const { rowIndex, isSelected, dataList } = props;
    const id = dataList.getIn([rowIndex, 'id']);

    this.state = {
      selected: isSelected(id),
      id,
    };
  }

  UNSAFE_componentWillReceiveProps({ rowIndex, isSelected, dataList }) {
    const id = dataList.getIn([rowIndex, 'id']);

    this.setState({
      selected: isSelected(id),
      id,
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextState.selected !== this.state.selected ||
      nextState.id !== this.state.id
    );
  }

  render() {
    const { rowIndex, isSelected, onSelect, dataList, classes, ...props } =
      this.props;
    const { selected, id } = this.state;
    // console.log(id, selected);

    return (
      <Cell {...props}>
        <div
          className={clsx(
            'flex-container align-spaced',
            classes.actionContainer
          )}
        >
          <div className={classes.checkboxContainer}>
            <Checkbox
              className={classes.checkbox}
              color="primary"
              checked={selected}
              onChange={() => onSelect(id)}
              disabled={!id}
            />
          </div>
        </div>
      </Cell>
    );
  }
}

export default withStyles(styles)(SelectionCell);
