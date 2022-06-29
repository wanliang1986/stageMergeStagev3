import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Tooltip from '@material-ui/core/Tooltip';
import * as Colors from '../../../styles/Colors';
import Typography from '@material-ui/core/Typography';
import { SortDownIcon, SortIcon, SortUpIcon } from '../../../components/Icons';
const style = {
  tableHeaderCell: {
    position: 'relative',
    display: 'flex',
    textTransform: 'Capitalize',
  },
};

const SortTypes = {
  ASC: 'asc',
  DESC: 'desc',
};

class sortCell extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }
  _onSortChange = (e, columnKey) => {
    const { params, displayName, classes } = this.props;
    e.preventDefault();
    let sortDir;
    const currentSortDir = this.props.params;
    if (!currentSortDir) return;
    if (currentSortDir.sort === null || currentSortDir.sort == undefined) {
      sortDir = SortTypes.DESC;
    } else if (currentSortDir.sort === SortTypes.DESC) {
      sortDir = SortTypes.ASC;
    } else {
      sortDir = null;
    }
    this.props.onChangeSort(columnKey, sortDir);
  };

  render() {
    const { params, displayName, classes } = this.props;
    console.log('params', params);
    return (
      <div className={classes.tableHeaderCell}>
        <Typography variant="subtitle2" noWrap>
          {displayName}
        </Typography>
        <div
          style={{ marginLeft: 20, cursor: 'pointer' }}
          onClick={(e) => {
            this._onSortChange(e, params.colId);
          }}
          className="flex-container align-justify align-middle"
        >
          {params.sortFlag &&
            (params.sort ? (
              params.sort === SortTypes.DESC ? (
                <SortDownIcon fontSize="inherit" color="primary" />
              ) : (
                <SortUpIcon fontSize="inherit" color="primary" />
              )
            ) : (
              <SortIcon fontSize="inherit" htmlColor={Colors.ALUMINUM} />
            ))}
        </div>
      </div>
    );
  }
}

export default withStyles(style)(sortCell);
