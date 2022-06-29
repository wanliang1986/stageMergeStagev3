import React from 'react';
import { withTranslation } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import {
  jobStatus,
  jobType,
  jobPriority,
  templateTypes2,
  typeList,
} from '../../../constants/formOptions';

import { Cell } from 'fixed-data-table-2';
import Tooltip from '@material-ui/core/Tooltip';
import { SortDownIcon, SortIcon, SortUpIcon } from '../../Icons';
import InfoIcon from '@material-ui/icons/Info';

import * as Colors from './../../../styles/Colors';

import { style } from '../params';

const SortTypes = {
  ASC: 'ASC',
  DESC: 'DESC',
};
const enums = {
  status: jobStatus.filter((status) => !status.disabled),
  type: templateTypes2,
  jobType: jobType,
  priority: jobPriority,
  level: typeList.slice(0, 3),
};

const LightTooltip = withStyles((theme) => ({
  tooltip: {
    fontSize: 13,
    maxWidth: 240,
    backgroundColor: '#353b40',
    padding: `8px 4px 7px 9px`,
  },
}))(Tooltip);

class HeaderCell extends React.PureComponent {
  constructor(props) {
    super(props);

    const { column, filters } = props;
    let value = (filters && filters.get(column.col)) || '';
    this.state = {
      value,
    };
  }

  static getDerivedStateFromProps(props, state) {
    const { column, filters } = props;
    let value = (filters && filters.get(column.col)) || '';
    if (value !== state.preValue) {
      return { value, preValue: value };
    }
    return null;
  }

  _onSortChange = (e) => {
    e.preventDefault();

    if (this.props.onSortChange && this.props.column.sortable) {
      let sortDir;
      let columnKey;
      const currentSortDir = this.props.sortDir;
      const currentColumnKey = this.props.column.col;
      if (currentSortDir) {
        if (currentSortDir === SortTypes.DESC) {
          sortDir = SortTypes.ASC;
          columnKey = currentColumnKey;
        } else {
          sortDir = null;
          columnKey = null;
        }
      } else {
        sortDir = SortTypes.DESC;
        columnKey = currentColumnKey;
      }

      this.props.onSortChange(columnKey, sortDir);
    }
  };

  render() {
    const {
      column,
      filterOpen,
      onFilter,
      sortDir,
      onSortChange,
      t,
      i18n,
      tReady,
      filters,
      ...props
    } = this.props;
    let { value } = this.state;
    return (
      <Cell style={style.headerCell} {...props}>
        <div>
          <div
            onClick={this._onSortChange}
            className="flex-container align-justify align-middle"
          >
            <span
              style={{
                whiteSpace: 'nowrap',
                display: 'inline-flex',
                fontSize: 14,
              }}
            >
              {column.type === 'activityCount' && <div>Sum of</div>}
              {t(column.colName)}
              &nbsp;
              {column.detail && (
                <LightTooltip title={column.detail} arrow leaveDelay={200}>
                  <InfoIcon color={'action'} fontSize={'small'} />
                </LightTooltip>
              )}
            </span>

            {onSortChange &&
              column.sortable &&
              (sortDir ? (
                sortDir === SortTypes.DESC ? (
                  <SortDownIcon fontSize="inherit" color="primary" />
                ) : (
                  <SortUpIcon fontSize="inherit" color="primary" />
                )
              ) : (
                <SortIcon fontSize="inherit" htmlColor={Colors.ALUMINUM} />
              ))}
          </div>
          {!column.disableSearch ? (
            <form
              style={{ display: filterOpen ? '' : 'none' }}
              onSubmit={(e) => {
                e.preventDefault();
                e.target[column.col].blur();
              }}
            >
              {column.type !== 'enum' && (
                <input
                  style={{ width: '100%' }}
                  name={column.col}
                  type={column.colType === 'date' ? 'number' : 'text'}
                  value={value}
                  onChange={(e) => this.setState({ value: e.target.value })}
                  onBlur={(e) => onFilter(e.target)}
                />
              )}
              {column.type === 'enum' && (
                <select
                  name={column.col}
                  onBlur={(e) => onFilter(e.target)}
                  value={value}
                  // onChange={(e) => this.setState({value: e.target.value})}
                  onChange={(e) => onFilter(e.target)}
                >
                  <option value="">All</option>
                  {enums[column.col].map((option, index) => (
                    <option key={index} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}
            </form>
          ) : (
            <br style={{ display: filterOpen ? '' : 'none' }} />
          )}
        </div>
      </Cell>
    );
  }
}

export default withTranslation('field')(HeaderCell);
