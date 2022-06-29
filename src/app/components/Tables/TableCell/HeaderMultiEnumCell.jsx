import React from 'react';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core';
import {
  invoiceStatus,
  invoiceType,
  jobPriority,
  templateTypes2,
  typeList,
  industryList,
} from './../../../constants/formOptions';

import { Cell } from 'fixed-data-table-2';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import Input from '@material-ui/core/Input';

import { SortDownIcon, SortIcon, SortUpIcon } from './../../Icons';

import * as Colors from './../../../styles/Colors';

import { style } from './../params';

const SortTypes = {
  ASC: 'ASC',
  DESC: 'DESC',
};
const enums = {
  status: invoiceStatus,
  invoiceType: invoiceType,
  type: templateTypes2,
  priority: jobPriority,
  level: typeList.slice(0, 3),
  industry: industryList,
};

const styles = {
  rootMenuItem: {
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 6,
    '&$selectedMenuItem': {
      backgroundColor: 'transparent',
      '&:hover': {
        backgroundColor: '#edf5ff',
      },
    },
    '&:hover': {
      backgroundColor: '#edf5ff',
    },
  },
  selectedMenuItem: {},
};

class HeaderCell extends React.PureComponent {
  constructor(props) {
    super(props);

    const { column, filters } = props;
    let enumValue,
      value = (filters && filters.get(column.col)) || '';
    if (column.col === 'status') {
      enumValue = value
        ? value.split(',')
        : invoiceStatus.slice(0, 6).map((t) => t.value);
    }
    this.state = {
      value,
      enumValue,
    };
    this.enum = React.createRef();
  }

  static getDerivedStateFromProps(props, state) {
    const { column, filters } = props;
    let enumValue,
      value = (filters && filters.get(column.col)) || '';
    if (value !== state.preValue) {
      if (column.col === 'status') {
        enumValue = value
          ? value.split(',')
          : invoiceStatus.slice(0, 6).map((t) => t.value);
      }
      return {
        value,
        enumValue,
        preValue: value,
      };
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

  handleEnumChange = (e) => {
    console.log(e.target.value);
    const enumValue = e.target.value;
    this.setState({ enumValue, value: enumValue.join(',') }, () => {
      this.props.onFilter(this.enum.current);
    });
  };

  renderValue = (selected) =>
    selected
      .map((s) => invoiceStatus.find((o) => o.value === s).label)
      .join(', ');

  render() {
    const {
      classes,
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
    let { value, enumValue } = this.state;
    // console.log(column, sortDir);

    return (
      <Cell style={style.headerCell} {...props}>
        <div style={style.headerText}>
          <div
            onClick={this._onSortChange}
            className="flex-container align-justify align-middle"
          >
            <span>
              {column.type === 'activityCount' && <div>{t('Sum of')}</div>}
              {t(column.colName)}
              {console.log(column.colName)}
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
              <Select
                multiple
                name={column.col}
                value={enumValue}
                onChange={this.handleEnumChange}
                renderValue={this.renderValue}
                MenuProps={{}}
                autoWidth
                SelectDisplayProps={{
                  style: {
                    // width: props.width - 44,
                    background: 'white !important',
                    // // border: '1px solid lightgray',
                    // height: 20,
                    // fontSize: 15,
                    // padding: '1px 20px 0 2px',
                    // overflow: 'hidden'
                  },
                }}
                input={
                  <Input
                    disableUnderline
                    style={{
                      width: props.width - 20,
                      background: 'white',
                      border: '1px solid lightgray',
                      height: 26,
                      fontSize: 14,
                      lineHeight: 1.15,
                      padding: 4,
                      overflow: 'hidden',
                    }}
                  />
                }
              >
                {enums[column.col].map((option) => (
                  <MenuItem
                    key={option.value}
                    value={option.value}
                    classes={{
                      root: classes.rootMenuItem,
                      selected: classes.selectedMenuItem,
                    }}
                  >
                    <Checkbox
                      color="primary"
                      checked={enumValue.indexOf(option.value) > -1}
                    />
                    <ListItemText primary={option.label} />
                  </MenuItem>
                ))}
              </Select>
              <input
                ref={this.enum}
                type="hidden"
                value={value}
                name={column.col}
              />
            </form>
          ) : (
            <br style={{ display: filterOpen ? '' : 'none' }} />
          )}
        </div>
      </Cell>
    );
  }
}

export default withTranslation('field')(withStyles(styles)(HeaderCell));
