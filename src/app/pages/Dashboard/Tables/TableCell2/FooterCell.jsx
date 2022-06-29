import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';

import { Cell } from 'fixed-data-table-2';

const styles = {
  ellipsis: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
};
class FooterCell extends React.PureComponent {
  render() {
    const { classes, data, columnKey, t, ...props } = this.props;
    console.log('FooterCell', props);
    if (!data) {
      return <Cell {...props} />;
    }

    if (columnKey === 'company') {
      return (
        <Cell {...props}>
          {data &&
            (data.get('title') === 'Total'
              ? t(`tab:${data.get('title')}`)
              : data.get('title'))}
        </Cell>
      );
    }
    const text = data.get(columnKey);
    return (
      <Cell {...props}>
        <div
          className={classes.ellipsis}
          data-tip={text !== 'Total' ? text : null}
        >
          {text === 'Total' ? t(`tab:Total`) : text}
        </div>
      </Cell>
    );
  }
}

export default withStyles(styles)(FooterCell);
