import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  table: {
    height: 40,
    margin: '10px 0 0px',
    backgroundColor: '#669df6',
    color: '#ffffff',

    '& th': {
      lineHeight: 2.8,
      display: 'inline-block',
      borderRight: 'solid 1px #ffffff',
    },
    '& th:nth-child(3)': {
      borderRight: 'none',
    },
  },
};
class PipelineColumsGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // just thead
  render() {
    let { columns, classes } = this.props;

    return (
      <table className={classes.table} id="myTable">
        <tr>
          {columns.map((column, index) => (
            <th
              className={classes.th}
              key={index}
              style={{ width: column.width }}
            >
              {column.name}
            </th>
          ))}
        </tr>
      </table>
    );
  }
}
export default withStyles(styles)(PipelineColumsGroup);
