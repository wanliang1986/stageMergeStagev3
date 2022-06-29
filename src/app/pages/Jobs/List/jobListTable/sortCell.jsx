import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Tooltip from '@material-ui/core/Tooltip';
import * as Colors from '../../../../styles/Colors';
import Typography from '@material-ui/core/Typography';
import {
  SortDownIcon,
  SortIcon,
  SortUpIcon,
} from '../../../../components/Icons';
import InfoIcon from '@material-ui/icons/Info';
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
    // 这里因为后端返回的key是jobPostingStatus 但是排序是时候需要传递published 故前端需要重新映射下sort字段
    // 前端重新映射字段 jobPostingStatus =》published
    this.props.onChangeSort(
      columnKey === 'jobPostingStatus' ? 'published' : columnKey,
      sortDir
    );
  };

  render() {
    const { params, displayName, classes } = this.props;

    console.log(params);
    console.log(SortTypes);
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
          onMouseEnter={() => {
            if (document.querySelector('.ag-tooltip')) {
              document.querySelector('.ag-tooltip').style.opacity = 0;
            }
          }}
          onMouseLeave={() => {
            if (document.querySelector('.ag-tooltip')) {
              document.querySelector('.ag-tooltip').style.opacity = 1;
            }
          }}
          className="flex-container align-justify align-middle"
        >
          {displayName === 'Job Posting Status' && (
            <Tooltip
              title={
                <span style={{ whiteSpace: 'pre-line' }}>
                  Posting Status on IPG Website
                </span>
              }
              arrow
            >
              <div style={{ marginRight: 10 }}>
                <InfoIcon color="disabled" fontSize="small" />
              </div>
            </Tooltip>
          )}
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
